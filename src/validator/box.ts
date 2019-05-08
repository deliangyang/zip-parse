import {Datum, ErrorInfo, GlobalConfig, Validator} from "../validator";
import * as _ from 'lodash'
import {BoxConfig, BoxConfigValidator} from "./box-config";
import {MaterialValidator} from "./material";

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

        if (!_.includes(BoxConfigValidator.boxIdSet, box.boxID)) {
            errorInfo.message.push({
                index: index,
                message: "礼盒ID需在礼盒配置表中存在:" +  box.boxID
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

        if (!_.includes(MaterialValidator.goodsIdSet, box.goodsId)) {
            errorInfo.message.push({
                index: index,
                message: "物品ID需在物品配置表中存在:" + box.goodsId
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