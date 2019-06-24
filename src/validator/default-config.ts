import {Validator} from "../validator";
import {Message} from "../message";

export interface DefaultConfig {
    id: number
    name: string
    gender: number
    layerId: number
    picUp: string
    upCoordinate: {
        x: number,
        y: number
    }
}


export class DefaultConfigValidator extends Validator {
    validate(datum: DefaultConfig): Array<Message> {
        return this.container
    }

}