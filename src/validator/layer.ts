import * as _ from "lodash"
import { Validator, ErrorInfo } from "../validator"


export interface Layer {
    layerId: number
    layerUp: number
    layerDown: number
    category: string
}

export class LayerValidator extends Validator {

    static layerDownSet: Array<number> = []
    static layerUpSet: Array<number> = []
    static layerIdSet: Array<number> = []
    static index = 0

    validate(layer: Layer, errorInfo: ErrorInfo): void {
        let index = LayerValidator.index++

        LayerValidator.layerIdSet.push(layer.layerId)
        if (layer.layerId <= 0) {
            errorInfo.message.push({
                index: index,
                message: "层级ID不能为空"
            })
        }
        if (!layer.category || layer.category.length <= 0) {
            errorInfo.message.push({
                index: index,
                message: "类别不能为空"
            })
        }
        if (layer.layerUp && layer.layerUp < 0) {
            errorInfo.message.push({
                index: index,
                message: "上层级数不能为负数"
            })
        }
        if (layer.layerDown && layer.layerDown > 0) {
            errorInfo.message.push({
                index: index,
                message: "下层级数不能为正数"
            })
        }

        if (layer.layerDown) {
            if (!_.includes(LayerValidator.layerDownSet, layer.layerDown)) {
                LayerValidator.layerDownSet.push(layer.layerDown)
            } else {
                errorInfo.message.push({
                    index: index,
                    message: "上层级数不能重复"
                })
            }
        }
        if (layer.layerUp) {
            if (!_.includes(LayerValidator.layerUpSet, layer.layerUp)) {
                LayerValidator.layerUpSet.push(layer.layerUp)
            } else {
                errorInfo.message.push({
                    index: index,
                    message: "上层级数不能重复"
                })
            }
        }
    }
}
