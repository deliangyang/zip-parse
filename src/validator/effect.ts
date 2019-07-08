import {I18N, Validator} from "../validator";
import {Message} from "../message";

export interface Effect {
    weight: number
    id: number
    name: I18N
    obtain: I18N
    image: string
    link: string
}

export class EffectValidator extends Validator {

    static effectIdSet: Array<number> = []

    static effectCnNameSet: Array<string> = []

    static effectTwNameSet: Array<string> = []

    static effectHhNameSet: Array<string> = []

    validate(effect: Effect): Array<Message> {
        this.index++

        this.checkEmpty('动效编号', effect.id)
        this.checkEmpty('名称', effect.name.cn)
        this.checkEmpty('名称(台湾繁体)', effect.name.tw)
        this.checkEmpty('名称(香港繁体)', effect.name.hk)
        this.checkEmpty('获取方式', effect.obtain.cn)
        this.checkEmpty('获取方式（台湾）', effect.obtain.tw)
        this.checkEmpty('获取方式（香港）', effect.obtain.hk)
        this.checkEmpty('动效图片', effect.image)

        this.notRepeat('动效编号', effect.id, EffectValidator.effectIdSet)
        this.notRepeat('名称', effect.name.cn, EffectValidator.effectCnNameSet)
        this.notRepeat('名称(台湾繁体)', effect.name.tw, EffectValidator.effectTwNameSet)
        this.notRepeat('名称(香港繁体)', effect.name.hk, EffectValidator.effectHhNameSet)
        this.validateFile('动效图片', effect.image)

        return this.container;
    }
    
}