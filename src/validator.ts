import * as _ from "lodash";
import * as JSZip from "jszip";

export class Datum {

}

export interface I18N {
    cn: string
    hk: string
    tw: string
}

export abstract class Validator {

    public static fileSize: number = 500 * 1024

    abstract validate(datum: Datum, errorInfo: ErrorInfo): void

    protected static files: Array<string> = []

    zip: JSZip

    constructor(zip?: JSZip) {
        this.zip = zip
    }

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
            if (!data || data.length <= 0) {
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

    protected validateFile(name: string, filename: string, index: number, errorInfo: ErrorInfo) {
        if (filename.length <= 0) {
            errorInfo.message.push({
                index: index,
                message: name + "不能为空"
            })
        }

        if (!_.includes(Validator.files, filename)) {
            errorInfo.message.push({
                index: index,
                message: name + "文件必须存在:" + filename
            })
        }

        let _filename = 'abc/images/' + filename + '.png'
        let file = this.zip.file(_filename)
        if (file) {
            let size:number|string = JSON.stringify(file)
                .substr(0, 300)
                .match(/"uncompressedSize":(\d+)/).pop()
            if (parseInt(size) > Validator.fileSize) {
                errorInfo.message.push({
                    index: index,
                    message: name + ":" + filename + ", 文件大小超过500k"
                })
            }
        } else {
            errorInfo.message.push({
                index: index,
                message: name + ":" + filename + ", 不存在无法计算大小"
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

    constructor(filename: string, index?: number) {
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