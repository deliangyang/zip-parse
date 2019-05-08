import {Datum, ErrorInfo, Validator} from "../validator";
import * as _ from 'lodash'

export interface CategoryItem extends Datum {
    categoryId: number
    pic: string
    category: string
    categoryHk: string
    categoryTw: string
    gender: string
    picGrey: string
    size: number
}

export class CategoryValidator extends Validator {

    static index = 0
    static idSet: Array<number> = []
    static categorySet: Array<string> = []
    static categoryHkSet: Array<string> = []
    static categoryTwSet: Array<string> = []

    constructor() {
        super()
        this.setFiles([])
    }

    validate(categoryItem: CategoryItem, errorInfo: ErrorInfo): void {
        ++CategoryValidator.index

        if (categoryItem.categoryId <= 0) {
            errorInfo.message.push({
                index: CategoryValidator.index,
                message: "类别ID不能为空"
            })
        }

        if (_.includes(CategoryValidator.idSet, categoryItem.categoryId)) {
            errorInfo.message.push({
                index: CategoryValidator.index,
                message: "类别ID不能重复"
            })
        } else {
            CategoryValidator.idSet.push(categoryItem.categoryId)
        }

        this.validateCategory('服装类别(简体中文)', categoryItem.category, CategoryValidator.index, CategoryValidator.categorySet, errorInfo)
        this.validateCategory('服装类别(台湾繁体)', categoryItem.categoryTw, CategoryValidator.index, CategoryValidator.categoryTwSet, errorInfo)
        this.validateCategory('服装类别(香港繁体)', categoryItem.categoryHk, CategoryValidator.index, CategoryValidator.categoryHkSet, errorInfo)

        if (categoryItem.gender.length <= 0) {
            errorInfo.message.push({
                index: CategoryValidator.index,
                message: "性别不能为空"
            })
        }

        if (categoryItem.gender !== '男' && categoryItem.gender !== '女') {
            errorInfo.message.push({
                index: CategoryValidator.index,
                message: "性别只能为男或女"
            })
        }

        this.validateFile("切片-正常", categoryItem.pic, CategoryValidator.index, categoryItem.size, errorInfo)
        this.validateFile("切片-灰", categoryItem.picGrey, CategoryValidator.index, categoryItem.size, errorInfo)
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

    private validateFile(name: string, filename: string, index: number, size: number, errorInfo: ErrorInfo) {
        if (filename.length <= 0) {
            errorInfo.message.push({
                index: index,
                message: name + "不能为空"
            })
        }

        if (!_.includes(Validator.files, filename)) {
            errorInfo.message.push({
                index: index,
                message: name + "文件必须存在"
            })
        }

        if (size > Validator.fileSize) {
            errorInfo.message.push({
                index: index,
                message: name + "文件格式及大小"
            })
        }
    }

}