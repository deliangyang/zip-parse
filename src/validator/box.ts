import {Datum,Validator} from "../validator";
import {BoxConfigValidator} from "./box-config";
import {MaterialValidator} from "./material";
import {Message} from "../message";

export interface Box extends Datum {
    itemId: number
    boxId: number
    drawFactors: number
}

export class BoxValidator extends Validator {

    static itemIdSet: Array<number> = []

    validate(box: Box): Array<Message> {
        this.index++
        this.checkEmpty('礼盒ID', box.boxId)
        this.checkExist('礼盒ID', box.boxId, BoxConfigValidator.boxIdSet)
        this.checkEmpty('物品ID', box.itemId)
        this.notRepeat('物品ID', box.itemId, BoxValidator.itemIdSet)
        this.checkExist('物品ID', box.itemId, MaterialValidator.itemIdSet)
        // this.checkEmpty('抽取因子' + box.boxId + '#' + box.itemId, box.drawFactors)
        return this.container
    }
}