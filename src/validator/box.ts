import {Datum, ErrorInfo, GlobalConfig, Validator} from "../validator";
import * as _ from 'lodash'
import {BoxConfig, BoxConfigValidator} from "./box-config";
import {MaterialValidator} from "./material";

export interface Box extends Datum {
    itemId: number
    // drawFactors: number
    boxId: number
}

export class BoxValidator extends Validator {

    static index: number = 0
    static itemIdSet: Array<number> = []

    validate(box: Box, errorInfo: ErrorInfo): void {
        let index = BoxValidator.index++

        if (box.boxId <= 0) {
            errorInfo.message.push({
                index: index,
                message: "礼盒ID不能为空"
            })
        }

        if (!_.includes(BoxConfigValidator.boxIdSet, box.boxId)) {
            errorInfo.message.push({
                index: index,
                message: "礼盒ID需在礼盒配置表中存在:" +  box.boxId
            })
        }

        if (box.itemId <= 0) {
            errorInfo.message.push({
                index: index,
                message: "物品ID不能为空"
            })
        }

        if (_.includes(BoxValidator.itemIdSet, box.itemId)) {
            errorInfo.message.push({
                index: index,
                message: "物品ID不能重复"
            })
        } else {
            BoxValidator.itemIdSet.push(box.itemId)
        }

        if (!_.includes(MaterialValidator.itemIdSet, box.itemId)) {
            errorInfo.message.push({
                index: index,
                message: "物品ID需在物品配置表中存在:" + box.itemId
            })
        }

        // if (box.drawFactors <= 0) {
        //     errorInfo.message.push({
        //         index: index,
        //         message: "抽取因子不能为空"
        //     })
        // }
    }
}