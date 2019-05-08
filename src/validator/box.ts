import {Datum, ErrorInfo, GlobalConfig, Validator} from "../validator";
import * as _ from 'lodash'

export interface Box extends Datum {
    goodsId: number
    drawFactors: number
    boxID: number
}

export class BoxValidator extends Validator {

    static index: number = 0
    static goodsIdSet: Array<number> = []

    validate(box: Box, errorInfo: ErrorInfo): void {
        let index = BoxValidator.index++

        if (box.boxID <= 0) {
            errorInfo.message.push({
                index: index,
                message: "礼盒ID不能为空"
            })
        }

        if (!_.includes(GlobalConfig.boxConfig, box.boxID)) {
            errorInfo.message.push({
                index: index,
                message: "礼盒ID需在礼盒配置表中存在"
            })
        }

        if (box.goodsId <= 0) {
            errorInfo.message.push({
                index: index,
                message: "物品ID不能为空"
            })
        }

        if (_.includes(BoxValidator.goodsIdSet, box.goodsId)) {
            errorInfo.message.push({
                index: index,
                message: "物品ID不能重复"
            })
        } else {
            BoxValidator.goodsIdSet.push(box.goodsId)
        }

        if (!_.includes(GlobalConfig.itemsConfig, box.goodsId)) {
            errorInfo.message.push({
                index: index,
                message: "物品ID需在物品配置表中存在"
            })
        }

        if (box.drawFactors <= 0) {
            errorInfo.message.push({
                index: index,
                message: "抽取因子不能为空"
            })
        }
    }
}