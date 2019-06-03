import {Datum, I18N, Validator} from "../validator";
import * as _ from 'lodash'
import {Message} from "../message";

interface Slice {
    normal: string,
    grey: string
}

interface SliceSize {
    normal: number,
    grey: number
}

export interface CategoryItem extends Datum {
    id: number
    name: I18N
    gender: number
    slice: Slice
    // sliceSize: SliceSize
}

export class CategoryValidator extends Validator {

    static idSet: Array<number> = []
    static categorySet: Array<string> = []
    static categoryHkSet: Array<string> = []
    static categoryTwSet: Array<string> = []
    gender: Array<number> = [1, 2]

    validate(categoryItem: CategoryItem): Array<Message> {
        this.index++

        this.checkEmpty('类别ID', categoryItem.id)
        this.notRepeat('类别ID', categoryItem.id, CategoryValidator.idSet)
        this.validateCategory('服装类别(简体中文)', categoryItem.name.cn, CategoryValidator.categorySet)
        this.validateCategory('服装类别(台湾繁体)', categoryItem.name.tw, CategoryValidator.categoryTwSet)
        this.validateCategory('服装类别(香港繁体)', categoryItem.name.hk, CategoryValidator.categoryHkSet)

        if (categoryItem.gender <= 0) {
            this.errMessage("性别 不能为空");
        }

        if (!_.includes(this.gender, categoryItem.gender)) {
            this.errMessage("性别 只能为男或女");
        }

        this.validateFile("切片-正常", categoryItem.slice.normal)
        this.validateFile("切片-灰", categoryItem.slice.grey)
        return this.container
    }

    private validateCategory(name: string, category: string, set: Array<string>) {
        this.checkEmpty(name, category)
        // this.notRepeat(name, category, set)
        if (category && category.length > 20) {
            this.errMessage(`${name}长度检测（不能超过20个字）`)
        }
    }
}