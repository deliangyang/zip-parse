import {Datum,Validator} from "../validator";
import * as _ from 'lodash'
import {BoxConfigValidator} from "./box-config";
import {MaterialValidator} from "./material";
import {Message} from "../message";

export interface Box extends Datum {
    itemId: number
    drawFactors: number
    boxId: number
}

export class BoxValidator extends Validator {

    static itemIdSet: Array<number> = []

    validate(box: Box): Array<Message> {
        if (box.boxId <= 0) {
            this.errMessage('礼盒ID不能为空')
        }

        if (!_.includes(BoxConfigValidator.boxIdSet, box.boxId)) {
            this.errMessage('礼盒ID需在礼盒配置表中存在:' + box.boxId)
        }

        if (box.itemId <= 0) {
            this.errMessage('物品ID不能为空')
        }

        if (_.includes(BoxValidator.itemIdSet, box.itemId)) {
            this.errMessage('物品ID不能重复')
        } else {
            BoxValidator.itemIdSet.push(box.itemId)
        }

        if (!_.includes(MaterialValidator.itemIdSet, box.itemId)) {
            this.errMessage('物品ID需在物品配置表中存在:' + box.itemId)
        }

        if (box.drawFactors <= 0) {
            this.errMessage('抽取因子不能为空')
        }
        return this.container
    }
}