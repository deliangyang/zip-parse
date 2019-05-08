import {Datum, ErrorInfo, Validator} from "../validator";
import * as _ from "lodash";

export interface BoxConfig extends Datum {
    priceMul: number
    boxnameTw: string
    boxnameHk: string
    price: number
    weight: number
    picMale: string
    freeCd: number | string
    time: number
    picFemale: string
    boxname: string
    boxId: number
    picMaleSize: number
    picFemaleSize: number
}

export class BoxConfigValidator extends Validator {

    static index: number = 0

    static boxIdSet: Array<number> = []
    static boxNameSet: Array<number> = []
    static boxNameTwSet: Array<number> = []
    static boxNameHkSet: Array<number> = []

    validate(boxConfig: BoxConfig, errorInfo: ErrorInfo): void {
        let index = ++BoxConfigValidator.index
        this.checkEmpty("权重", boxConfig.weight, errorInfo, index)
        this.checkEmpty("礼盒ID", boxConfig.boxId, errorInfo, index)
        this.checkEmpty("礼盒名称(简体中文)", boxConfig.boxname, errorInfo, index, 20)
        this.checkEmpty("礼盒名称(台湾繁体)", boxConfig.boxnameTw, errorInfo, index, 20)
        this.checkEmpty("礼盒名称(香港繁体)", boxConfig.boxnameHk, errorInfo, index, 20)
        this.checkEmpty("抽1次(金币)", boxConfig.price, errorInfo, index, null, 1)
        this.checkEmpty("抽10次(金币)", boxConfig.priceMul, errorInfo, index, null, 1)
        this.checkEmpty("封面图-女", boxConfig.picFemale, errorInfo, index)
        this.checkEmpty("封面图-男", boxConfig.picMale, errorInfo, index)
        //this.checkEmpty("礼盒名称图片", boxConfig., errorInfo, index)

        if (boxConfig.freeCd && boxConfig.freeCd <= 0) {
            errorInfo.message.push({
                index: index,
                message: '免费抽取CD(天)需大于0'
            })
        }

        if (boxConfig.time && !/^\d{11}$/.test('' + boxConfig.time)) {
            errorInfo.message.push({
                index: index,
                message: '上线时间时间格式不正确'
            })
        }
        this.validateFile("封面图-女", boxConfig.picFemale, BoxConfigValidator.index, boxConfig.picFemaleSize, errorInfo)
        this.validateFile("封面图-男", boxConfig.picMale, BoxConfigValidator.index, boxConfig.picMaleSize, errorInfo)

        this.notRepeat("礼盒ID", boxConfig.boxId, BoxConfigValidator.boxIdSet, errorInfo, index)
        this.notRepeat("礼盒名称(简体中文)", boxConfig.boxname, BoxConfigValidator.boxNameSet, errorInfo, index)
        this.notRepeat("礼盒名称(台湾繁体)", boxConfig.boxnameTw, BoxConfigValidator.boxNameTwSet, errorInfo, index)
        this.notRepeat("礼盒名称(香港繁体)", boxConfig.boxnameHk, BoxConfigValidator.boxNameHkSet, errorInfo, index)

        if (boxConfig.price * 10 < boxConfig.priceMul) {
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