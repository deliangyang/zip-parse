import {I18N, Validator} from "../validator";
import {Message} from "../message";
import * as _ from "lodash";
import {Hash} from "../excel2json";

export interface Effect {
    weight: number
    id: number
    effectSingId: number
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

    static effectSingId: Array<number> = []

    static effectLines: Hash = {}

    validate(effect: Effect): Array<Message> {
        this.index++

        this.checkEmpty('动效编号', effect.id)
        //this.checkEmpty('演唱动效ID', effect.effectSingId)
        this.checkEmpty('名称', effect.name.cn)
        this.checkEmpty('名称(台湾繁体)', effect.name.tw)
        this.checkEmpty('名称(香港繁体)', effect.name.hk)
        this.checkEmpty('获取方式', effect.obtain.cn)
        this.checkEmpty('获取方式（台湾）', effect.obtain.tw)
        this.checkEmpty('获取方式（香港）', effect.obtain.hk)
        this.checkEmpty('动效图片', effect.image)

        this.notRepeat('动效编号', effect.id, EffectValidator.effectIdSet)
        if (effect.effectSingId) {
            this.notRepeat('演唱动效ID', effect.effectSingId, EffectValidator.effectSingId)
        }
        this.notRepeat('名称', effect.name.cn, EffectValidator.effectCnNameSet)
        this.notRepeat('名称(台湾繁体)', effect.name.tw, EffectValidator.effectTwNameSet)
        this.notRepeat('名称(香港繁体)', effect.name.hk, EffectValidator.effectHhNameSet)
        this.validateFile('动效图片', effect.image)

        EffectValidator.effectLines['id#' + effect.id] = this.index
        EffectValidator.effectLines['effectSingId#' + effect.effectSingId] = this.index

        return this.container;
    }

    public checkRepeat(): void {
        console.log(EffectValidator.effectLines)
        EffectValidator.effectIdSet.forEach((element: number) => {
            if (_.includes(EffectValidator.effectSingId, element)) {
                let index = EffectValidator.effectLines['id#' + element] || 0
                this.container.push({
                    index: index,
                    message: `上麦动效ID不能与演唱动效ID重复 ${element}`
                })
            }
        });

        EffectValidator.effectSingId.forEach((element: number) => {
            if (element && _.includes(EffectValidator.effectIdSet, element)) {
                let index = EffectValidator.effectLines['effectSingId#' + element] || 0
                this.container.push({
                    index: index,
                    message: `演唱动效ID不能与上麦动效ID重复 ${element}`
                })
            }

        });
    }
}