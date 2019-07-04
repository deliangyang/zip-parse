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
    x: number
    y: number
}

interface Flash {
    normal: number
    small: number
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
    coordinateUp: Coordinate,
    coordinateDown: Coordinate,
    effectId: number,
    flash: Flash
    flashLayer: number
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
    effectLayer: Array<number> = [1, 2]

    constructor(zip: JSZip) {
        super(zip);
    }

    validate(material: Material): Array<Message> {
        this.index++

        this.checkEmpty('权重', material.weight)
        this.checkEmpty('物品ID', material.id)
        this.checkEmpty('获取方式(简体中文)', material.obtain.cn, 20)
        this.checkEmpty('获取方式(台湾繁体)', material.obtain.tw, 20)
        this.checkEmpty('获取方式(香港繁体)', material.obtain.hk, 20)

        this.checkEmpty('性别', material.gender)
        this.checkEmpty('类别ID', material.categoryId)
        this.checkEmpty('层级ID', material.layerId)
        this.checkEmpty('等级', material.level)
        this.checkEmpty('缩略图', material.image.thumb)
        // this.checkEmpty('预览图', material.image.original)
        this.checkEmpty('物品类型', material.type)

        this.checkEmpty('物品名称(简体中文)', material.name.cn, 20)
        this.checkEmpty('物品名称(台湾繁体)', material.name.tw, 20)
        this.checkEmpty('物品名称(香港繁体)', material.name.hk, 20)

        this.notRepeat('物品ID', material.id, MaterialValidator.itemIdSet)
        this.notRepeat('物品名称(简体中文)', material.name.cn, MaterialValidator.nameSet)
        this.notRepeat('物品名称(台湾繁体)', material.name.tw, MaterialValidator.nameTwSet)
        this.notRepeat('物品名称(香港繁体)', material.name.hk, MaterialValidator.nameHkSet)

        this.validateFile('缩略图', material.image.thumb)
        // this.validateFile('预览图', material.image.original)
        if (material.slice.up) {
            this.validateFile('上层切片', material.slice.up)
            if (material.coordinateUp.x === null) {
                this.errMessage('上层切片坐标x不能为空')
            }
            if (material.coordinateUp.y === null) {
                this.errMessage('上层切片坐标y不能为空')
            }
        }

        if (material.slice.down) {
            this.validateFile('下层切片', material.slice.down)
            if (material.coordinateDown.x === null) {
                this.errMessage('下层切片坐标x不能为空')
            }
            if (material.coordinateDown.y === null) {
                this.errMessage('下层切片坐标y不能为空')
            }
        }

        if (!material.slice.up && !material.slice.down) {
            this.errMessage('上层切片和下层切片名称至少有一个存在')
        }

        if (material.link && material.link.length > 255) {
            this.errMessage(`链接编码之后长度不得超过255 ${material.link}`);
        }

        if (material.link && /^error#/.test(material.link)) {
            this.errMessage(`不支持该链接#` + material.link.substr('error#'.length));
        }

        if (material.onlineTime && !/^\d{10}$/.test('' + material.onlineTime)) {
            console.log(material.onlineTime)
            this.errMessage(`时间格式不正确 ${material.onlineTime}`)
        }

        if (!_.includes(LayerValidator.idSet, material.layerId)) {
            this.errMessage('层级ID 必须在层级配置表存在')
        }

        if (!_.includes(CategoryValidator.idSet, material.categoryId)) {
            this.errMessage('类别ID 必须在类别配置表存在')
        }

        if (material.flashLayer && !_.includes(this.effectLayer, material.flashLayer)) {
            this.errMessage('动效预览层级 只能为' + this.effectLayer.join('、'))
        }

        if (!_.includes(this.gender, material.gender)) {
            this.errMessage('性别 只能为' + ['男', '女'].join('、'))
        }

        if (!_.includes(this.type, material.type)) {
            this.errMessage('物品类型 只能为' + ['成品', '碎片'].join('、'))
        }

        if (material.flash.normal && !_.includes(Validator.effectFiles, 'effect/' + material.flash.normal + '/')) {
            this.errMessage('物品动效 文件不存在 ' + material.flash.normal)
        }

        if (material.flash.small && !_.includes(Validator.effectFiles, 'effect/' + material.flash.small + '/')) {
            this.errMessage('物品动效预览 文件不存在 ' + material.flash.small)
        }

        if (material.type === 1) {
            if (!_.includes(this.level, material.level)) {
                this.errMessage('等级 只能为' + this.level.join('、'))
            }
            MaterialValidator.productSet.push(material.id)
        } else {
            if (!_.includes(this.itemLevel, material.level)) {
                this.errMessage('碎片等级 只能为' + this.itemLevel.join('、'))
            }

            if (!material || material.number < 2 || material.number > 100) {
                this.errMessage('碎片数量 不在区间')
            }

            if (_.includes(MaterialValidator.refItemIdSet, material.refItemId)) {
                this.errMessage('碎片关联物品ID 不能重复')
            } else {
                MaterialValidator.refItemIdSet.push(material.refItemId)
            }

            if (!_.includes(MaterialValidator.itemIdSet, material.refItemId)) {
                this.errMessage('关联物品ID 必须存在且是成品')
            }
        }

        return this.container
    }
}