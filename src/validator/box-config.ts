import {Datum, I18N, Validator} from "../validator";
import * as JSZip from "jszip";
import {Message} from "../message";
import {EffectValidator} from "./effect";

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
    onlineTime: number | string,
    effectId: number
}

export class BoxConfigValidator extends Validator {

    static boxIdSet: Array<number> = []
    static boxNameSet: Array<string> = []
    static boxNameTwSet: Array<string> = []
    static boxNameHkSet: Array<string> = []

    validate(boxConfig: BoxConfig): Array<Message> {
        this.checkEmpty('权重', boxConfig.weight)
        this.checkEmpty('礼盒ID', boxConfig.id)
        this.checkEmpty('礼盒名称(简体中文)', boxConfig.name.cn, 20)
        this.checkEmpty('礼盒名称(台湾繁体)', boxConfig.name.tw, 20)
        this.checkEmpty('礼盒名称(香港繁体)', boxConfig.name.hk, 20)
        this.checkEmpty('抽1次(金币)', boxConfig.price.oneTimes, null, 1)
        this.checkEmpty('抽10次(金币)', boxConfig.price.tenTimes, null, 1)
        this.checkEmpty('封面图-女', boxConfig.cover.female)
        this.checkEmpty('封面图-男', boxConfig.cover.male)
        this.checkEmpty('封面图-正常', boxConfig.cover.normal)

        if (boxConfig.freeCd && boxConfig.freeCd <= 0) {
            this.errMessage('免费抽取CD(天)需大于0')
        }

        this.checkExist('上麦动效ID', boxConfig.effectId, EffectValidator.effectIdSet)

        if (boxConfig.onlineTime && (!/^\d{10}$/.test('' + boxConfig.onlineTime)
            || !/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}\s\d{2}:\d{2}(\d{2})?$/)) {
            this.errMessage('上线时间时间格式不正确')
        }
        this.validateFile("封面图-女", boxConfig.cover.female)
        this.validateFile("封面图-男", boxConfig.cover.male)

        this.notRepeat("礼盒ID", boxConfig.id, BoxConfigValidator.boxIdSet)
        this.notRepeat("礼盒名称(简体中文)", boxConfig.name.cn, BoxConfigValidator.boxNameSet)
        this.notRepeat("礼盒名称(台湾繁体)", boxConfig.name.tw, BoxConfigValidator.boxNameTwSet)
        this.notRepeat("礼盒名称(香港繁体)", boxConfig.name.hk, BoxConfigValidator.boxNameHkSet)

        if (boxConfig.price.oneTimes * 10 < boxConfig.price.tenTimes) {
            this.errMessage('抽10次需≤抽一次*10')
        }
        return this.container
    }

}