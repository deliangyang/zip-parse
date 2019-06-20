import * as XLSX from 'xlsx';
import {WorkSheet} from "xlsx";
import {sheetsMap} from "./sheet-map";

const { utils } = XLSX;

export interface Hash {
    [key: string]: any
}

export class ExcelToJson {

    parse(data: any) {
        let self = this
        return new Promise((resolve, rejects) => {
            try {
                let workbook = XLSX.read(data, {type:"array"})
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
        if (('' + value).length <= 0) {
            return this.forceType(valueType, format)
        }
        if (filed === 'onlineTime') {
            if (!value) {
                return 0
            }
            value = value + (new Date()).getTimezoneOffset() / 60 / 24
            let date = new Date((value - 1) * 24 * 3600000 + 1)
            date.setUTCFullYear(date.getFullYear() - 70)
            return parseInt('' + date.getTime() / 1000);
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
        }
        return value
    }

    private forceType(valueType: string, format:boolean) {
        if (!format) {
            return null
        }
        return valueType == 'n' ? 0 :''
    }
}