import {CategoryItem} from "./validator/category";


export class Datum {

}

export abstract class Validator {

    public static fileSize: number

    abstract validate(datum: Datum, errorInfo: ErrorInfo): void

    protected static files: Array<string> = []

    errorInfo: ErrorInfo

    public static setFiles(files: Array<string>) {
        Validator.files = files
    }

    protected checkEmpty(name: string, data: any, errorInfo: ErrorInfo, index: number,
                         ngt?: number | null, nlt?: number | null) {
        let flag = false;
        if (typeof data === 'number') {
            if (data <= 0) {
                flag = true
            }
        } else {
            if (data.length <= 0) {
                flag = true
            }
        }
        if (flag) {
            errorInfo.message.push({
                index: index,
                message: name + "不能为空"
            })
        }

        if (ngt && typeof data === 'string' && data.length > ngt) {
            errorInfo.message.push({
                index: index,
                message: name + '长度检测（不能超过20个字）'
            })
        }

        if (nlt && typeof data === 'number' && data < nlt) {
            errorInfo.message.push({
                index: index,
                message: name + '需大于或等于1'
            })
        }
    }
}

export interface Message {
    index: number
    message: string
}

export class ErrorInfo {
    filename: string
    index: number
    message: Array<object>

    constructor(filename: string, index: number) {
        this.filename = filename
        this.index = index
        this.message = []
    }

    public setFileName(filename: string) {
        this.filename = filename
        return this
    }

    public setIndex(index: number) {
        this.index = index
        return this
    }

    public trace() {
        let traces: Array<string> = []
        this.message.forEach((element: Message) => {
            traces.push(
                [this.filename, element.index, element.message].join(' ')
            )
        })
        return traces
    }
}

export class GlobalConfig {
    static boxConfig: Array<number> = []
    static itemsConfig: Array<number> = []
}