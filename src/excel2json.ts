import * as XLSX from 'xlsx';
import {WorkSheet} from 'xlsx';
import {sheetsMap} from "./sheet-map";
import {Link, Target} from "./link";
import {Base64} from "js-base64";
import toBase64 = Base64.toBase64;

const {utils} = XLSX;

export interface Hash {
    [key: string]: any
}

export class ExcelToJson {

    parse(data: any) {
        let self = this;
        return new Promise((resolve, rejects) => {
            try {
                let workbook = XLSX.read(data, {type: "array"});
                let json: Hash = {};
                let unFormats: Hash = {};
                for (const key in sheetsMap) {
                    let worksheet = workbook.Sheets[sheetsMap[key].name];
                    if (!workbook.Sheets.hasOwnProperty(sheetsMap[key].name)) {
                        throw Error('缺少配置' + key + ', ' + sheetsMap[key].name)
                    }
                    json[key] = self.trace(sheetsMap[key].map, worksheet, true, key);
                    unFormats[key] = self.trace(sheetsMap[key].map, worksheet, false, key)
                }
                resolve({
                    data: json,
                    unFormats: unFormats,
                })
            } catch (e) {
                rejects(e)
            }
        })
    }

    trace(map: Array<string>, worksheet: WorkSheet, format: boolean = true, key: string = '') {
        let data = utils.sheet_to_json(worksheet, {defval: ''})
        let count = 0;
        let result: Array<any> = []
        data.forEach((element: any) => {
            if (count <= 0) {
                count++
                return false;
            } else if (element.hasOwnProperty('weight') && element.hasOwnProperty('effectId')) {
                if (!element['weight'] && !element['effectId']) {
                    return false;
                }
            }
            let item: Array<any> = []
            for (let elementKey in element) {
                if (elementKey.startsWith('__EMPTY')) {
                    continue
                }
                item.push(element[elementKey])
            }
            let datum: Hash = {};
            let _keys: Array<string> = [];
            for (let j = 0; j <= map.length; j++) {
                if (!map[j]) {
                    continue
                }
                let _type = map[j].split('#');
                let _item = _type[0];
                let v_type = _type[1];
                _keys = _item.split('.');
                if (_keys.length >= 2) {
                    if (!datum.hasOwnProperty(_keys[0])) {
                        datum[_keys[0]] = {}
                    }
                    datum[_keys[0]][_keys[1]] = this.filter(_type[0], item[j], v_type, format)
                } else {
                    datum[_item] = this.filter(_type[0], item[j], v_type, format)
                }
            }
            result.push(datum)
        });

        return result
    }

    private filter(filed: string, value: any, valueType: string, format: boolean = true) {
        if (filed == 'chance') {
            return Math.round(value)
        }
        if (filed === 'rejectId') {
            if (!value) {
                return []
            }
            let rejectIds = ('' + value).split('#');
            return rejectIds.map(function (a) {
                return parseInt(a);
            });
        } else if (filed === 'reviewPic') {
            if (!value) {
                return {
                    up: '',
                    down: '',
                }
            }
            let item = value.split(',');
            return {
                up: item[0],
                down: item[1],
            }
        }

        if (('' + value).length <= 0) {
            return this.forceType(valueType, format)
        }
        if (filed === 'onlineTime') {
            if (!value) {
                return 0
            }
            let offsetTime = (new Date()).getTimezoneOffset() * 60;
            return parseInt((value - 25569) * 86400 + offsetTime + '')
        } else if (filed === 'gender') {
            if (value !== '男' || value !== '女') {
                return 0;
            }
            return value === '男' ? 1 : 2;
        } else if (filed === 'type') {
            return value === '成品' ? 1 : 2;
        } else if (filed === 'link') {
            return this.parseLink(value)
        } else if (filed === 'effectStep') {
            return this.parseEffectStep(value);
        } else if (filed === 'timesPrice' || filed === 'vipTimesPrice') {
            return this.parseTimesPrice(value)
        }
        return value
    }

    /**
     * 10@540#100@5400
     * @param value
     */
    private parseTimesPrice(value: string)
    {
        let data = value.split('#');
        let result:Array<Hash> = [];
        data.forEach((element) => {
            let item = element.split('@');
            result.push({
                times: parseInt(item[0]),
                price: parseFloat(item[1]),
            })
        });
        return result;
    }

    /**
     * 进度 1@0.8#3@1
     * @param value
     */
    private parseEffectStep(value: string): Array<Hash>
    {
        let data = value.split('#');
        let result:Array<Hash> = [];
        data.forEach((element) => {
            let item = element.split('@');
            result.push({
                effectId: parseInt(item[0]),
                step: parseFloat(item[1]) * 100,
            })
        });
        return result;
    }

    /**
     * webview#https://party.haochang.tv/share/notices?noticeId=2756080
     * @param value
     */
    private parseLink(value: string) {
        if (!value || value.length <= 0) {
            return '';
        }
        let data: Link
        if (/^(webview|explorer)#https?:\/\//.test(value)) {
            let item = value.split('#')
            let target = item[0] as Target
            data = {
                url: item[1],
                target: target,
                data: {}
            }
        } else if (/user\/rechargeGold/.test(value)) {
            data = {
                url: value,
                target: "app",
                data: {}
            }
        } else if (/user\/boxes#boxId:\d+/.test(value)) {
            let items = value.split('#')
            let boxId = items[1].split(':')
            data = {
                url: items[0],
                target: "app",
                data: {
                    boxId: boxId[1],
                }
            }
        } else {
            return 'error#' + value;
        }
        let str = JSON.stringify(data);
        return toBase64(str);
    }

    /**
     * 强制类型
     * @param valueType
     * @param format
     */
    private forceType(valueType: string, format: boolean) {
        if (!format) {
            return null
        }
        return valueType == 'n' ? 0 : ''
    }
}
