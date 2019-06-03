import * as _ from "lodash"
import {Validator} from "../validator"
import {Message} from "../message";

interface LayerDetail {
    up: number | null
    down: number | number
}

export interface Layer {
    id: number
    categoryId: string
    layer: LayerDetail
}

export class LayerValidator extends Validator {

    static layerDownSet: Array<number> = []
    static layerUpSet: Array<number> = []
    static idSet: Array<number> = []

    validate(layer: Layer): Array<Message> {
        this.index++

        LayerValidator.idSet.push(layer.id)
        this.checkEmpty('层级ID', layer.id)
        this.checkEmpty('类别', layer.categoryId)

        if (layer.layer.up && layer.layer.up < 0) {
            this.errMessage("上层级数 不能为负数")
        }
        if (layer.layer.down && layer.layer.down > 0) {
            this.errMessage("下层级数 不能为正数")
        }

        if (layer.layer.down) {
            this.notRepeat('下层级数', layer.layer.down, LayerValidator.layerDownSet)
        }
        if (layer.layer.up) {
            this.notRepeat('上层级数', layer.layer.up, LayerValidator.layerUpSet)
        }
        return this.container
    }
}
