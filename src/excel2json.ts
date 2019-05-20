import * as XLSX from 'xlsx';
import {WorkSheet} from "xlsx";

const { utils } = XLSX;

interface Item {
    name: string
    map: Array<string>
}

interface SheetMap {
    [key: string]: Item
}

let sheetsMap: SheetMap = {
    items: {
        name: "【仅开发用】服物品配置",
        map: [
            'weight',
            'id',
            'name.cn',
            'name.tw',
            'name.hk',
            'gender',
            'categoryId',
            'layerId',
            'level',
            'image.thumb',
            'image.original',
            'slice.up',
            'slice.down',
            'obtain.cn',
            'obtain.tw',
            'obtain.hk',
            'link',
            'onlineTime',
            'type',
            'number',
            'refItemId',
        ],
    },
    categories: {
        name: "类别配置",
        map: [
            'id',
            'name.tw',
            'name.hk',
            'name.cn',
            'gender',
            'slice.normal',
            'slice.grey',
        ]
    },
    boxes: {
        name: "【仅开发用】礼盒配置",
        map: [
            'weight',
            'id',
            'name.cn',
            'name.tw',
            'name.hk',
            'price.oneTimes',
            'price.tenTimes',
            'cover.female',
            'cover.male',
            'cover.normal',
            'freeCd',
            'onlineTime',
        ]
    },
    boxItems: {
        name: "【仅开发用】礼盒详情配置",
        map: [
            'boxId',
            'itemId',
        ]
    },
    layers: {
        name: "层级配置",
        map: [
            'id',
            'categoryId',
            'layer.up',
            'layer.down',
        ]
    },
}

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
                for (const key in sheetsMap) {
                    let worksheet = workbook.Sheets[sheetsMap[key].name]
                    json[key] = self.trace(sheetsMap[key].map, worksheet)
                }
                resolve(json)
            } catch (e) {
                rejects(e)
            }
        })
    }

    trace(map: Array<string>, worksheet: WorkSheet) {
        let data = utils.sheet_to_json(worksheet)
        let count = 0;
        let result: Array<any> = []
        data.forEach((element: any) => {
            if (count <= 0) {
                count++
                return false;
            }
            let item: Array<any> = []
            for (let elementKey in element) {
                item.push(element[elementKey])
            }
            let datum: Hash = {}
            let _keys: Array<string> = []
            for (let j = 0; j <= map.length; j++) {
                if (!map[j]) {
                    continue
                }
                _keys = map[j].split('.')
                if (_keys.length >= 2) {
                    if (!datum.hasOwnProperty(_keys[0])) {
                        datum[_keys[0]] = {}
                    }
                    datum[_keys[0]][_keys[1]] = this.filter(map[j], item[j])
                } else {
                    datum[map[j]] = this.filter(map[j], item[j])
                }
            }
            result.push(datum)
        })

        return result
    }

    private filter(filed: string, value: any) {
        if (filed === 'onlineTime') {
            let date = new Date(value)
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
        return value || null;
    }
}