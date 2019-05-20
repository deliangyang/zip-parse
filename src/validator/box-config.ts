import {Datum, ErrorInfo, I18N, Validator} from "../validator";
import * as _ from "lodash";
import * as JSZip from "jszip";

interface Price {
    oneTimes: number,
    tenTimes: number
}

interface Cover {
    female: string,
    male: string,
    normal: string,
}

export interface BoxConfig extends Datum {
    weight: number
    id: number
    name: I18N
    price: Price
    cover: Cover
    freeCd: number | string
    onlineTime: number | string
}

export class BoxConfigValidator extends Validator {

    static index: number = 0

    static boxIdSet: Array<number> = []
    static boxNameSet: Array<number> = []
    static boxNameTwSet: Array<number> = []
    static boxNameHkSet: Array<number> = []
    zip: JSZip

    constructor(zip: JSZip) {
        super();
        this.zip = zip
    }


    validate(boxConfig: BoxConfig, errorInfo: ErrorInfo): void {
        let index = ++BoxConfigValidator.index
        this.checkEmpty("权重", boxConfig.weight, errorInfo, index)
        this.checkEmpty("礼盒ID", boxConfig.id, errorInfo, index)
        this.checkEmpty("礼盒名称(简体中文)", boxConfig.name.cn, errorInfo, index, 20)
        this.checkEmpty("礼盒名称(台湾繁体)", boxConfig.name.tw, errorInfo, index, 20)
        this.checkEmpty("礼盒名称(香港繁体)", boxConfig.name.hk, errorInfo, index, 20)
        this.checkEmpty("抽1次(金币)", boxConfig.price.oneTimes, errorInfo, index, null, 1)
        this.checkEmpty("抽10次(金币)", boxConfig.price.tenTimes, errorInfo, index, null, 1)
        this.checkEmpty("封面图-女", boxConfig.cover.female, errorInfo, index)
        this.checkEmpty("封面图-男", boxConfig.cover.male, errorInfo, index)
        this.checkEmpty("封面图-正常", boxConfig.cover.normal, errorInfo, index)
        //this.checkEmpty("礼盒名称图片", boxConfig., errorInfo, index)

        if (boxConfig.freeCd && boxConfig.freeCd <= 0) {
            errorInfo.message.push({
                index: index,
                message: '免费抽取CD(天)需大于0'
            })
        }

        if (boxConfig.onlineTime && (!/^\d{10}$/.test('' + boxConfig.onlineTime)
            || !/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}\s\d{2}:\d{2}(\d{2})?$/)) {
            errorInfo.message.push({
                index: index,
                message: '上线时间时间格式不正确(时间戳或字符串)'
            })
        }
        this.validateFile("封面图-女", boxConfig.cover.female, BoxConfigValidator.index, errorInfo)
        this.validateFile("封面图-男", boxConfig.cover.male, BoxConfigValidator.index, errorInfo)

        this.notRepeat("礼盒ID", boxConfig.id, BoxConfigValidator.boxIdSet, errorInfo, index)
        this.notRepeat("礼盒名称(简体中文)", boxConfig.name.cn, BoxConfigValidator.boxNameSet, errorInfo, index)
        this.notRepeat("礼盒名称(台湾繁体)", boxConfig.name.tw, BoxConfigValidator.boxNameTwSet, errorInfo, index)
        this.notRepeat("礼盒名称(香港繁体)", boxConfig.name.hk, BoxConfigValidator.boxNameHkSet, errorInfo, index)

        if (boxConfig.price.oneTimes * 10 < boxConfig.price.tenTimes) {
            errorInfo.message.push({
                index: index,
                message: "抽10次需≤抽一次*10"
            })
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