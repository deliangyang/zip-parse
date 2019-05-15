import * as Excel from 'exceljs'
import {Worksheet} from "exceljs";
import {rejects} from "assert";


interface Item {
    name: string
    map: Array<string>
}

interface SheetMap {
    [key: string]: Item
}

let sheetsMap: SheetMap = null
sheetsMap = {
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

    parse(filename: string) {
        let workbook = new Excel.Workbook()

        let self = this
        return new Promise((resolve, rejects) => {
            workbook.xlsx.readFile(filename)
                .then(function(worksheets) {
                    let json: Hash = {}
                    for (const key in sheetsMap) {
                        let worksheet = worksheets.getWorksheet(sheetsMap[key].name)
                        json[key] = self.trace(sheetsMap[key].map, worksheet)
                    }
                    resolve(json)
                }).catch(e => {
                    rejects(e)
            });
        })

    }

    trace(map: Array<string>, worksheet: Worksheet) {
        let row = worksheet.rowCount
        let result: Array<Item> = []
        for (let i = 3; i <= row; i++) {
            let item: any = {}
            let flag = true;
            let tmp: any = null
            for (let j = 1; j <= map.length; j++) {
                let keys = map[j - 1].split('.');
                tmp = worksheet.getRow(i).getCell(j).value

                if (map[j - 1] == 'level' && tmp && typeof tmp == 'object') {
                    tmp = tmp.richText[0].text
                }

                if (keys.length > 1) {
                    if (!item[keys[0]]) {
                        item[keys[0]] = {}
                    }
                    item[keys[0]][keys[1]] = this.filter(map[j - 1], tmp)
                } else {
                    item[map[j - 1]] = this.filter(map[j - 1], tmp)
                }

                if (!worksheet.getRow(i).getCell(1).value) {
                    flag = false
                    break
                }
            }
            if (flag) {
                result.push(item)
            }
        }
        return result
    }

    filter(filed: string, value: any) {
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
        return value;
    }
}