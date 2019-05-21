import * as _ from "lodash";
import * as JSZip from "jszip";
import {Message} from "./message";

export class Datum {}

export interface I18N {
    cn: string
    hk: string
    tw: string
}

export abstract class Validator {

    /**
     * 文件大小 500kb
     */
    public static fileSize: number = 500 * 1024

    protected static files: Array<string> = []

    protected static index: number = 0;

    zip: JSZip

    container: Array<Message>

    constructor(zip?: JSZip) {
        this.zip = zip
    }

    abstract validate(datum: Datum): Array<Message>

    protected errMessage(message: string) {
        this.container.push({
            index: ++Validator.index,
            message: message
        })
    }

    public static setFiles(files: Array<string>) {
        Validator.files = files
    }

    protected checkEmpty(name: string, data: any, ngt?: number | null, nlt?: number | null) {
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
            this.errMessage(name + '不能为空')
        }

        if (ngt && typeof data === 'string' && data.length > ngt) {
            this.errMessage(name + '长度检测（不能超过20个字）')
        }

        if (nlt && typeof data === 'number' && data < nlt) {
            this.errMessage(name + '需大于或等于1')
        }
    }

    protected validateFile(name: string, filename: string) {
        if (filename.length <= 0) {
            this.errMessage(name + "不能为空")
        }

        if (!_.includes(Validator.files, filename)) {
            this.errMessage(name + "文件必须存在:" + filename)
        }

        let _filename = 'abc/images/' + filename + '.png'
        let file = this.zip.file(_filename)
        if (file) {
            let size:number|string = JSON.stringify(file)
                .substr(0, 300)
                .match(/"uncompressedSize":(\d+)/).pop()
            if (parseInt(size) > Validator.fileSize) {
                this.errMessage(name + ":" + filename + ", 文件大小超过500k")
            }
        } else {
            this.errMessage(name + ":" + filename + ", 不存在无法计算大小")
        }
    }

    protected notRepeat<T>(name: string, data: T, set: Array<T>) {
        if (_.includes(set, data)) {
            this.errMessage(name + "不能重复")
        } else {
            set.push(data)
        }
    }

    protected checkExist<T>(name: string, value: T, set: Array<T>) {
        if (!_.includes(set, value)) {
            this.errMessage(name + '不存在')
        }
    }
}
