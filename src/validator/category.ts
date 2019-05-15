import {Datum, ErrorInfo, I18N, Validator} from "../validator";
import * as _ from 'lodash'
import * as JSZip from "jszip";

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

    static index = 0
    static idSet: Array<number> = []
    static categorySet: Array<string> = []
    static categoryHkSet: Array<string> = []
    static categoryTwSet: Array<string> = []
    gender: Array<number> = [1, 2]

    constructor(zip: JSZip) {
        super(zip);
    }


    validate(categoryItem: CategoryItem, errorInfo: ErrorInfo): void {
        ++CategoryValidator.index

        if (categoryItem.id <= 0) {
            errorInfo.message.push({
                index: CategoryValidator.index,
                message: "类别ID不能为空"
            })
        }

        if (_.includes(CategoryValidator.idSet, categoryItem.id)) {
            errorInfo.message.push({
                index: CategoryValidator.index,
                message: "类别ID不能重复"
            })
        } else {
            CategoryValidator.idSet.push(categoryItem.id)
        }

        this.validateCategory('服装类别(简体中文)', categoryItem.name.cn, CategoryValidator.index, CategoryValidator.categorySet, errorInfo)
        this.validateCategory('服装类别(台湾繁体)', categoryItem.name.tw, CategoryValidator.index, CategoryValidator.categoryTwSet, errorInfo)
        this.validateCategory('服装类别(香港繁体)', categoryItem.name.hk, CategoryValidator.index, CategoryValidator.categoryHkSet, errorInfo)

        if (categoryItem.gender <= 0) {
            errorInfo.message.push({
                index: CategoryValidator.index,
                message: "性别不能为空"
            })
        }

        if (!_.includes(this.gender, categoryItem.gender)) {
            errorInfo.message.push({
                index: CategoryValidator.index,
                message: "性别只能为男或女"
            })
        }

        this.validateFile("切片-正常", categoryItem.slice.normal, CategoryValidator.index, errorInfo)
        this.validateFile("切片-灰", categoryItem.slice.grey, CategoryValidator.index, errorInfo)
    }

    private validateCategory(name: string, category: string, index: number, set: Array<string>, errorInfo: ErrorInfo) {
        if (category.length <= 0) {
            errorInfo.message.push({
                index: index,
                message: name + "不能为空"
            })
        }

        if (_.includes(set, category)) {
            errorInfo.message.push({
                index: index,
                message: name + "不能重复"
            })
        } else {
            set.push(category)
        }

        if (category.length > 20) {
            errorInfo.message.push({
                index: index,
                message: name + "长度检测（不能超过20个字）"
            })
        }
    }


}