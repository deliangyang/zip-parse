import {I18N, Validator} from "../validator";
import {Message} from "../message";
import * as _ from "lodash";
import {Hash} from "../excel2json";

export interface Effect {
    weight: number
    id: number
    category: number
    name: I18N
    obtain: I18N
    image: string
    link: string
}

export class AllEffectValidator extends Validator {

    static effectIdSet: Array<number> = [];

    static effectCnNameSet: Array<string> = [];

    static effectTwNameSet: Array<string> = [];

    static effectHhNameSet: Array<string> = [];

    static effectSingId: Array<number> = [];

    static effectLines: Hash = {};

    static effectCategory: Array<number> = [
        0x1, 0x2,
    ];

    validate(effect: Effect): Array<Message> {
        this.index++

        this.checkEmpty('动效ID', effect.id)
        this.checkEmpty('名称', effect.name.cn)
        this.checkEmpty('名称(台湾繁体)', effect.name.tw)
        this.checkEmpty('名称(香港繁体)', effect.name.hk)
        this.checkEmpty('获取方式', effect.obtain.cn)
        this.checkEmpty('获取方式（台湾）', effect.obtain.tw)
        this.checkEmpty('获取方式（香港）', effect.obtain.hk)
        this.checkEmpty('动效图片', effect.image)

        if (!_.includes(AllEffectValidator.effectCategory, effect.category)) {
            this.errMessage("动效类别只能为" + AllEffectValidator.effectCategory.join(','));
        }

        this.notRepeat('动效ID', effect.id, AllEffectValidator.effectIdSet)

        this.notRepeat('名称', effect.name.cn, AllEffectValidator.effectCnNameSet)
        this.notRepeat('名称(台湾繁体)', effect.name.tw, AllEffectValidator.effectTwNameSet)
        this.notRepeat('名称(香港繁体)', effect.name.hk, AllEffectValidator.effectHhNameSet)
        this.validateFile('动效图片', effect.image)

        return this.container;
    }

    public checkRepeat(): void {
        console.log(AllEffectValidator.effectLines)
        AllEffectValidator.effectIdSet.forEach((element: number) => {
            if (_.includes(AllEffectValidator.effectSingId, element)) {
                let index = AllEffectValidator.effectLines['id#' + element] || 0
                this.container.push({
                    index: index,
                    message: `上麦动效ID不能与演唱动效ID重复 ${element}`
                })
            }
        });

        AllEffectValidator.effectSingId.forEach((element: number) => {
            if (element && _.includes(AllEffectValidator.effectIdSet, element)) {
                let index = AllEffectValidator.effectLines['effectSingId#' + element] || 0
                this.container.push({
                    index: index,
                    message: `演唱动效ID不能与上麦动效ID重复 ${element}`
                })
            }

        });
    }
}
