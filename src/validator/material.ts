import {Datum, ErrorInfo, I18N, Validator} from "../validator";
import * as _ from 'lodash'
import {LayerValidator} from "./layer";
import {CategoryValidator} from "./category";
import * as JSZip from "jszip";

interface Image {
    thumb: string
    original: string
}

interface Slice {
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
    image: Image,
    slice: Slice
    obtain: I18N
    link: string
    onlineTime: number
    type: number,
    number: number
    refItemId: number
}

export class MaterialValidator extends Validator {
    static index: number = 0
    static itemIdSet: Array<number> = []
    static nameSet: Array<number> = []
    static nameTwSet: Array<number> = []
    static nameHkSet: Array<number> = []
    static refItemIdSet: Array<number|string> = []
    static productSet: Array<number> = []
    level: Array<string> = ['A', 'B', 'C', 'S', 'SS']
    itemLevel: Array<string> = ['S', 'SS']
    gender: Array<number> = [1, 2]
    type: Array<number> = [1, 2]

    constructor(zip: JSZip) {
        super(zip);
    }

    validate(material: Material, errorInfo: ErrorInfo): void {
        let index = ++MaterialValidator.index

        this.checkEmpty("物品ID", material.id, errorInfo, index)
        this.checkEmpty("获取方式(简体中文)", material.obtain.cn, errorInfo, index, 20)
        this.checkEmpty("获取方式(台湾繁体)", material.obtain.tw, errorInfo, index, 20)
        this.checkEmpty("获取方式(香港繁体)", material.obtain.hk, errorInfo, index, 20)

        this.checkEmpty("性别", material.gender, errorInfo, index)
        this.checkEmpty("类别ID", material.categoryId, errorInfo, index)
        this.checkEmpty("层级ID", material.layerId, errorInfo, index)
        this.checkEmpty("等级", material.level, errorInfo, index)
        this.checkEmpty("缩略图", material.image.thumb, errorInfo, index)
        this.checkEmpty("预览图", material.image.original, errorInfo, index)
        this.checkEmpty("上层切片", material.slice.up, errorInfo, index)
        this.checkEmpty("物品类型", material.type, errorInfo, index)

        this.checkEmpty("物品名称(简体中文)", material.name.cn, errorInfo, index, 20)
        this.checkEmpty("物品名称(台湾繁体)", material.name.tw, errorInfo, index, 20)
        this.checkEmpty("物品名称(香港繁体)", material.name.hk, errorInfo, index, 20)

        this.notRepeat("物品ID", material.id, MaterialValidator.itemIdSet, errorInfo, index)
        this.notRepeat("物品名称(简体中文)", material.name.cn, MaterialValidator.nameSet, errorInfo, index)
        this.notRepeat("物品名称(台湾繁体)", material.name.tw, MaterialValidator.nameTwSet, errorInfo, index)
        this.notRepeat("物品名称(香港繁体)", material.name.hk, MaterialValidator.nameHkSet, errorInfo, index)

        this.validateFile("缩略图", material.image.thumb, index, errorInfo)
        this.validateFile("预览图", material.image.original, index, errorInfo)
        this.validateFile("上层切片", material.slice.up, index, errorInfo)

        if (material.slice.down) {
            this.validateFile("下层切片", material.slice.down, index, errorInfo)
        }

        if (material.onlineTime && (!/^\d{10}$/.test('' + material.onlineTime)
            || !/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}\s\d{2}:\d{2}(\d{2})?$/)) {
            errorInfo.message.push({
                index: index,
                message: '时间格式不正确（时间戳或字符串）'
            })
        }

        if (!_.includes(LayerValidator.idSet, material.layerId)) {
            errorInfo.message.push({
                index: index,
                message: '层级ID必须在层级配置表存在'
            })
        }

        if (!_.includes(CategoryValidator.idSet, material.categoryId)) {
            errorInfo.message.push({
                index: index,
                message: '类别ID必须在类别配置表存在'
            })
        }


        if (!_.includes(this.gender, material.gender)) {
            errorInfo.message.push({
                index: index,
                message: '性别只能为' + this.gender.join('、')
            })
        }

        if (!_.includes(this.type, material.type)) {
            errorInfo.message.push({
                index: index,
                message: '物品类型只能为' + this.type.join('、')
            })
        }

        if (material.type === 1) {
            if (!_.includes(this.level, material.level)) {
                errorInfo.message.push({
                    index: index,
                    message: '等级只能为' + this.level.join('、')
                })
            }

            MaterialValidator.productSet.push(material.id)
        } else {
            if (!_.includes(this.itemLevel, material.level)) {
                errorInfo.message.push({
                    index: index,
                    message: '碎片等级只能为' + this.itemLevel.join('、')
                })
            }

            if (!material || material.number < 2 || material.number > 100) {
                errorInfo.message.push({
                    index: index,
                    message: '数量区间检测（2个至100个合格）'
                })
            }

            if (_.includes(MaterialValidator.refItemIdSet, material.refItemId)) {
                errorInfo.message.push({
                    index: index,
                    message: '碎片关联物品ID不能重复'
                })
            } else {
                MaterialValidator.refItemIdSet.push(material.refItemId)
            }

            if (!_.includes(MaterialValidator.itemIdSet, material.refItemId)) {
                errorInfo.message.push({
                    index: index,
                    message: '关联物品ID必须存在且是成品'
                })
            }
        }
    }

    private notRepeat(name: string, data: any, set: Array<any>, errorInfo: ErrorInfo, index: number) {
        if (_.includes(set, data)) {
            errorInfo.message.push({
                index: index,
                message: name + "不能重复"
            })
        } else {
            set.push(data)
        }
    }

}