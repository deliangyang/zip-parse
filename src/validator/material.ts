import {Datum, ErrorInfo, Validator} from "../validator";
import * as _ from 'lodash'
import {LayerValidator} from "./layer";
import {CategoryValidator} from "./category";


export interface Material extends Datum {
    obtain: number
    pieceNumber: number
    gender: number
    level: string
    goodsId: number
    relateId: number | string
    link: string
    weight: number
    type: string
    picLarge: string
    nameTw: string
    nameHk: string
    layerId: number
    picDown: string
    obtainTw: string
    obtainHk: string
    name: string
    picSmall: string
    time: string | number
    categoryId: number
    picUp: string
    picSmallSize: number
    picLargeSize: number
    picUpSize: number
    picDownSize: number
}

export class MaterialValidator extends Validator {
    static index: number = 0
    static goodsIdSet: Array<number> = []
    static nameSet: Array<number> = []
    static nameTwSet: Array<number> = []
    static nameHkSet: Array<number> = []
    static relateIdSet: Array<number|string> = []
    static productSet: Array<number> = []
    level: Array<string> = ['A', 'B', 'C', 'S', 'SS']
    itemLevel: Array<string> = ['S', 'SS']
    gender: Array<number> = [1, 2]
    type: Array<string> = ['成品', '碎片']

    validate(material: Material, errorInfo: ErrorInfo): void {
        let index = ++MaterialValidator.index

        this.checkEmpty("物品ID", material.goodsId, errorInfo, index)
        this.checkEmpty("获取方式(简体中文)", material.obtain, errorInfo, index, 20)
        this.checkEmpty("获取方式(台湾繁体)", material.obtainTw, errorInfo, index, 20)
        this.checkEmpty("获取方式(香港繁体)", material.obtainHk, errorInfo, index, 20)

        this.checkEmpty("性别", material.gender, errorInfo, index)
        this.checkEmpty("类别ID", material.categoryId, errorInfo, index)
        this.checkEmpty("层级ID", material.layerId, errorInfo, index)
        this.checkEmpty("等级", material.level, errorInfo, index)
        this.checkEmpty("缩略图", material.picSmall, errorInfo, index)
        this.checkEmpty("预览图", material.picLarge, errorInfo, index)
        this.checkEmpty("上层切片", material.picUp, errorInfo, index)
        this.checkEmpty("物品类型", material.type, errorInfo, index)

        this.checkEmpty("物品名称(简体中文)", material.name, errorInfo, index, 20)
        this.checkEmpty("物品名称(台湾繁体)", material.nameTw, errorInfo, index, 20)
        this.checkEmpty("物品名称(香港繁体)", material.nameHk, errorInfo, index, 20)

        this.notRepeat("物品ID", material.goodsId, MaterialValidator.goodsIdSet, errorInfo, index)
        this.notRepeat("物品名称(简体中文)", material.name, MaterialValidator.nameSet, errorInfo, index)
        this.notRepeat("物品名称(台湾繁体)", material.nameTw, MaterialValidator.nameTwSet, errorInfo, index)
        this.notRepeat("物品名称(香港繁体)", material.nameHk, MaterialValidator.nameHkSet, errorInfo, index)

        this.validateFile("缩略图", material.picSmall, index, material.picSmallSize, errorInfo)
        this.validateFile("预览图", material.picLarge, index, material.picLargeSize, errorInfo)
        this.validateFile("上层切片", material.picUp, index, material.picUpSize, errorInfo)

        if (material.picDown) {
            this.validateFile("下层切片", material.picDown, index, material.picDownSize, errorInfo)
        }

        if (material.time && (!/^\d{10}$/.test('' + material.time)
            || !/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}\s\d{2}:\d{2}(\d{2})?$/)) {
            errorInfo.message.push({
                index: index,
                message: '时间格式不正确（时间戳或字符串）'
            })
        }

        if (!_.includes(LayerValidator.layerIdSet, material.layerId)) {
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

        if (material.type === '成品') {
            if (!_.includes(this.level, material.level)) {
                errorInfo.message.push({
                    index: index,
                    message: '等级只能为' + this.level.join('、')
                })
            }

            MaterialValidator.productSet.push(material.goodsId)
        } else {
            if (!_.includes(this.itemLevel, material.level)) {
                errorInfo.message.push({
                    index: index,
                    message: '碎片等级只能为' + this.itemLevel.join('、')
                })
            }

            if (!material || material.pieceNumber < 2 || material.pieceNumber > 100) {
                errorInfo.message.push({
                    index: index,
                    message: '数量区间检测（2个至100个合格）'
                })
            }

            if (_.includes(MaterialValidator.relateIdSet, material.relateId)) {
                errorInfo.message.push({
                    index: index,
                    message: '碎片关联物品ID不能重复'
                })
            } else {
                MaterialValidator.relateIdSet.push(material.relateId)
            }

            if (!_.includes(MaterialValidator.goodsIdSet, material.relateId)) {
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

    private validateFile(name: string, filename: string, index: number, size: number, errorInfo: ErrorInfo) {
        if (filename.length <= 0) {
            errorInfo.message.push({
                index: index,
                message: name + "不能为空"
            })
        }

        if (!_.includes(Validator.files, filename)) {
            errorInfo.message.push({
                index: index,
                message: name + "文件必须存在:" + filename
            })
        }

        if (size > Validator.fileSize) {
            errorInfo.message.push({
                index: index,
                message: name + "文件格式及大小"
            })
        }
    }
}