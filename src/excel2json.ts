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
        let self = this
        return new Promise((resolve, rejects) => {
            try {
                let workbook = XLSX.read(data, {type: "array"})
                let json: Hash = {}
                let unFormats: Hash = {}
                for (const key in sheetsMap) {
                    let worksheet = workbook.Sheets[sheetsMap[key].name]
                    if (!workbook.Sheets.hasOwnProperty(sheetsMap[key].name)) {
                        throw Error('缺少配置' + key + ', ' + sheetsMap[key].name)
                    }
                    json[key] = self.trace(sheetsMap[key].map, worksheet)
                    unFormats[key] = self.trace(sheetsMap[key].map, worksheet, false)
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

    trace(map: Array<string>, worksheet: WorkSheet, format: boolean = true) {
        let data = utils.sheet_to_json(worksheet, {defval: ''})
        let count = 0;
        let result: Array<any> = []
        data.forEach((element: any) => {
            if (count <= 0) {
                count++
                return false;
            }
            let item: Array<any> = []
            for (let elementKey in element) {
                if (elementKey.startsWith('__EMPTY')) {
                    continue
                }
                item.push(element[elementKey])
            }
            let datum: Hash = {}
            let _keys: Array<string> = []
            for (let j = 0; j <= map.length; j++) {
                if (!map[j]) {
                    continue
                }
                let _type = map[j].split('#')
                let _item = _type[0]
                let v_type = _type[1]
                _keys = _item.split('.')
                if (_keys.length >= 2) {
                    if (!datum.hasOwnProperty(_keys[0])) {
                        datum[_keys[0]] = {}
                    }
                    datum[_keys[0]][_keys[1]] = this.filter(_type[0], item[j], v_type, format)
                } else {
                    datum[_item] = this.filter(_type[0], item[j], v_type, format)
                }
            }
            console.log(datum)
            result.push(datum)
        })

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
            let item = value.split(',')
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
            console.log(value);
            value = value + (new Date()).getTimezoneOffset() / 60 / 24
            let sm = (value - 1) * 24 * 3600000 + 1
            let date = new Date(sm)
            date.setUTCFullYear(date.getFullYear() - 70)
            let s = parseInt('' + date.getTime() / 1000);
            console.log(s)
            if (s % 10 === 9) {
                s += 1
            }
            return s;
        } else if (filed === 'gender') {
            if (value === '男') {
                return 1;
            } else if (value === '女') {
                return 2;
            } else {
                return 0;
            }
        } else if (filed === 'type') {
            if (value === '成品') {
                return 1;
            } else if (value === '碎片') {
                return 2;
            }
        } else if (filed === 'link') {
            return this.parseLink(value)
        } else if (filed === 'effectStep') {
            return this.parseEffectStep(value);
        }
        return value
    }

    /**
     * 进度
     * @param value
     */
    private parseEffectStep(value: string): Array<Hash>
    {
        let data = value.split('#')
        let result:Array<Hash> = []
        data.forEach((element) => {
            let item = element.split('@')
            result.push({
                effectId: parseInt(item[0]),
                step: parseFloat(item[1]),
            })
        });
        return result;
    }

    private parseLink(value: string) {
        if (value.length <= 0) {
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

    private forceType(valueType: string, format: boolean) {
        if (!format) {
            return null
        }
        return valueType == 'n' ? 0 : ''
    }
}
