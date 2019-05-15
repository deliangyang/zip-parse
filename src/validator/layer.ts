import * as _ from "lodash"
import { Validator, ErrorInfo } from "../validator"

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
    static index = 0

    validate(layer: Layer, errorInfo: ErrorInfo): void {
        let index = LayerValidator.index++

        LayerValidator.idSet.push(layer.id)
        if (layer.id <= 0) {
            errorInfo.message.push({
                index: index,
                message: "层级ID不能为空"
            })
        }
        if (!layer.categoryId || layer.categoryId.length <= 0) {
            errorInfo.message.push({
                index: index,
                message: "类别不能为空"
            })
        }
        if (layer.layer.up && layer.layer.up < 0) {
            errorInfo.message.push({
                index: index,
                message: "上层级数不能为负数"
            })
        }
        if (layer.layer.down && layer.layer.down > 0) {
            errorInfo.message.push({
                index: index,
                message: "下层级数不能为正数"
            })
        }

        if (layer.layer.down) {
            if (!_.includes(LayerValidator.layerDownSet, layer.layer.down)) {
                LayerValidator.layerDownSet.push(layer.layer.down)
            } else {
                errorInfo.message.push({
                    index: index,
                    message: "上层级数不能重复"
                })
            }
        }
        if (layer.layer.up) {
            if (!_.includes(LayerValidator.layerUpSet, layer.layer.up)) {
                LayerValidator.layerUpSet.push(layer.layer.up)
            } else {
                errorInfo.message.push({
                    index: index,
                    message: "上层级数不能重复"
                })
            }
        }
    }
}
