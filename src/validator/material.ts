import {Datum, I18N, Validator} from "../validator";
import * as _ from 'lodash'
import {LayerValidator} from "./layer";
import {CategoryValidator} from "./category";
import * as JSZip from "jszip";
import {Message} from "../message";

interface Image {
    thumb: string
    original: string
}

interface Slice {
    up: string
    down: string
}

interface Coordinate {
    up: string
    down: string
}

export interface Material extends Datum {
    weight: number
    id: number
    name: I18N
    gender: number
    categoryId: number
    layerId: number
    level: string
    image: Image
    slice: Slice
    obtain: I18N
    link: string
    onlineTime: number
    type: number
    number: number
    refItemId: number
    coordinate: Coordinate
}

export class MaterialValidator extends Validator {
    static itemIdSet: Array<number> = []
    static nameSet: Array<string> = []
    static nameTwSet: Array<string> = []
    static nameHkSet: Array<string> = []
    static refItemIdSet: Array<number|string> = []
    static productSet: Array<number> = []
    level: Array<string> = ['A', 'B', 'C', 'S', 'SS']
    itemLevel: Array<string> = ['S', 'SS']
    gender: Array<number> = [1, 2]
    type: Array<number> = [1, 2]

    constructor(zip: JSZip) {
        super(zip);
    }

    validate(material: Material): Array<Message> {

        this.checkEmpty('物品ID', material.id)
        this.checkEmpty('获取方式(简体中文)', material.obtain.cn, 20)
        this.checkEmpty('获取方式(台湾繁体)', material.obtain.tw, 20)
        this.checkEmpty('获取方式(香港繁体)', material.obtain.hk, 20)

        this.checkEmpty('性别', material.gender)
        this.checkEmpty('类别ID', material.categoryId)
        this.checkEmpty('层级ID', material.layerId)
        this.checkEmpty('等级', material.level)
        this.checkEmpty('缩略图', material.image.thumb)
        this.checkEmpty('预览图', material.image.original)
        this.checkEmpty('上层切片', material.slice.up)
        this.checkEmpty('物品类型', material.type)
        this.checkEmpty('上层切片坐标', material.coordinate.down)

        this.checkEmpty('物品名称(简体中文)', material.name.cn, 20)
        this.checkEmpty('物品名称(台湾繁体)', material.name.tw, 20)
        this.checkEmpty('物品名称(香港繁体)', material.name.hk, 20)

        this.notRepeat('物品ID', material.id, MaterialValidator.itemIdSet)
        this.notRepeat('物品名称(简体中文)', material.name.cn, MaterialValidator.nameSet)
        this.notRepeat('物品名称(台湾繁体)', material.name.tw, MaterialValidator.nameTwSet)
        this.notRepeat('物品名称(香港繁体)', material.name.hk, MaterialValidator.nameHkSet)

        this.validateFile('缩略图', material.image.thumb)
        this.validateFile('预览图', material.image.original)
        this.validateFile('上层切片', material.slice.up)

        if (material.slice.down) {
            this.validateFile("下层切片", material.slice.down)
        }

        if (material.onlineTime && (!/^\d{10}$/.test('' + material.onlineTime)
            || !/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}\s\d{2}:\d{2}(\d{2})?$/)) {
            this.errMessage('时间格式不正确（时间戳或字符串）')
        }

        if (!_.includes(LayerValidator.idSet, material.layerId)) {
            this.errMessage('层级ID必须在层级配置表存在')
        }

        if (!_.includes(CategoryValidator.idSet, material.categoryId)) {
            this.errMessage('类别ID必须在类别配置表存在')
        }


        if (!_.includes(this.gender, material.gender)) {
            this.errMessage('性别只能为' + this.gender.join('、'))
        }

        if (!_.includes(this.type, material.type)) {
            this.errMessage('物品类型只能为' + this.type.join('、'))
        }

        if (material.type === 1) {
            if (!_.includes(this.level, material.level)) {
                this.errMessage('等级只能为' + this.level.join('、'))
            }
            MaterialValidator.productSet.push(material.id)
        } else {
            if (!_.includes(this.itemLevel, material.level)) {
                this.errMessage('碎片等级只能为' + this.itemLevel.join('、'))
            }

            if (!material || material.number < 2 || material.number > 100) {
                this.errMessage('数量区间检测（2个至100个合格）')
            }

            if (_.includes(MaterialValidator.refItemIdSet, material.refItemId)) {
                this.errMessage('碎片关联物品ID不能重复')
            } else {
                MaterialValidator.refItemIdSet.push(material.refItemId)
            }

            if (!_.includes(MaterialValidator.itemIdSet, material.refItemId)) {
                this.errMessage('关联物品ID必须存在且是成品')
            }
        }

        return this.container
    }
}