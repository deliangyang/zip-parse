import {Datum, I18N, Validator} from "../validator";
import {Message} from "../message";
import {EffectValidator} from "./effect";
import * as _ from 'lodash'
import {MaterialValidator} from "./material";

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
    lotteryGoods: string
    priceStep: string
}

export class BoxConfigValidator extends Validator {

    static boxIdSet: Array<number> = []
    static boxNameSet: Array<string> = []
    static boxNameTwSet: Array<string> = []
    static boxNameHkSet: Array<string> = []

    validate(boxConfig: BoxConfig): Array<Message> {
        this.index++

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
            this.errMessage('免费抽取CD(天) 需大于0')
        }

        if (boxConfig.effectId) {
            this.checkExist('上麦动效ID', boxConfig.effectId, EffectValidator.effectIdSet)
        }

        if (boxConfig.onlineTime
            && !/^\d{10}$/.test('' + boxConfig.onlineTime)) {
            this.errMessage('上线时间时间格式不正确')
        }
        this.validateFile("封面图-女", boxConfig.cover.female)
        this.validateFile("封面图-男", boxConfig.cover.male)

        this.notRepeat("礼盒ID", boxConfig.id, BoxConfigValidator.boxIdSet)
        this.notRepeat("礼盒名称(简体中文)", boxConfig.name.cn, BoxConfigValidator.boxNameSet)
        this.notRepeat("礼盒名称(台湾繁体)", boxConfig.name.tw, BoxConfigValidator.boxNameTwSet)
        this.notRepeat("礼盒名称(香港繁体)", boxConfig.name.hk, BoxConfigValidator.boxNameHkSet)

        if (boxConfig.price.oneTimes * 10 < boxConfig.price.tenTimes) {
            this.errMessage('抽10次 需≤抽一次*10')
        }

        if (boxConfig.lotteryGoods && boxConfig.lotteryGoods.length > 0) {
            let times = [1, 10];
            let items = boxConfig.lotteryGoods.split('#')
            items.forEach( (item) => {
                let datum = item.split('@')
                if (datum.length !== 3) {
                    this.errMessage('连抽必中，数据格式不正确, ' + boxConfig.lotteryGoods)
                    return
                }
                if (!_.includes(times, parseInt(datum[0]))) {
                    this.errMessage('连抽必中，x取值只能取抽取次数, ' + boxConfig.lotteryGoods)
                }

                if (!_.includes(MaterialValidator.level, datum[2])) {
                    this.errMessage('连抽必中，物品等级不正确, ' + boxConfig.lotteryGoods)
                }

                let y = parseInt(datum[1])
                let x = parseInt(datum[0])
                if (y < 1 || y > x) {
                    this.errMessage('连抽必中，需满足1≤y≤x, ' + boxConfig.lotteryGoods)
                }
            })
        }

        if (!boxConfig.priceStep || boxConfig.priceStep.length < 0) {
            this.errMessage('抽一次阶梯价格，不能为空')
        } else if (boxConfig.priceStep) {
            let prices = boxConfig.priceStep.split('#');
            if (prices.length <= 0) {
                this.errMessage('抽一次阶梯价格, 格式不正确')
            }
            let newNums:number[] = prices.map((num) => {
                return parseInt(num)
            })
            console.log(newNums)
            let maxPrice = Math.max(...newNums)
            console.log('max price:' + maxPrice)
            if (!maxPrice || maxPrice > boxConfig.price.oneTimes) {
                this.errMessage('抽一次阶梯价格, 最大一位数不能超过抽一次金币')
            }
        }

        return this.container
    }

}