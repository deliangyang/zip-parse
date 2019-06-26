import {Validator} from "../validator";
import {Message} from "../message";
import * as _ from "lodash";

export interface DefaultConfig {
    id: number
    name: string
    gender: number
    categoryId: number
    layerId: number
    picUp: string
    upCoordinate: {
        x: number,
        y: number
    }
}


export class DefaultConfigValidator extends Validator {
    gender: Array<number> = [1, 2]

    validate(datum: DefaultConfig): Array<Message> {
        this.checkEmpty('ID', datum.id)
        this.checkEmpty('物品名称（简体中文）', datum.name)
        this.checkEmpty('性别', datum.gender)
        this.checkEmpty('类别ID', datum.categoryId)
        this.checkEmpty('层级ID', datum.layerId)
        this.checkEmpty('上层切片x坐标', datum.upCoordinate.x)
        this.checkEmpty('上层切片y坐标', datum.upCoordinate.y)

        if (!_.includes(this.gender, datum.gender)) {
            this.errMessage('性别 只能为男或女');
        }

        this.validateFile("上层切片", datum.picUp)

        return this.container

    }

}