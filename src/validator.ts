import * as _ from "lodash";
import * as JSZip from "jszip";
import {Message} from "./message";
import {JSZipObject} from "jszip";

export class Datum {}

export interface I18N {
    cn: string
    hk: string
    tw: string
}

type UnKnownFileObject = boolean | JSZipObject

export abstract class Validator {

    /**
     * 文件大小 500kb
     */
    public static fileSize: number = 500 * 1024

    protected static files: Array<string> = []

    protected static effectFiles: Array<string> = []

    protected index: number = 2;

    protected zip: JSZip

    protected static currentId: number = 2

    protected container: Array<Message> = []

    constructor(zip?: JSZip) {
        this.zip = zip
        ++Validator.currentId
    }

    abstract validate(datum: Datum): Array<Message>

    protected errMessage(message: string) {
        this.container.push({
            index: this.index,
            message: message
        })
    }

    public static setFiles(files: Array<string>) {
        Validator.files = files
    }

    public static setEffectFiles(files: Array<string>) {
        Validator.effectFiles = files;
    }

    /**
     * 校验是否为空
     *
     * @param name
     * @param data
     * @param ngt
     * @param nlt
     */
    protected checkEmpty(name: string, data: any, ngt?: number | null, nlt?: number | null) {
        let flag = false;
        if (typeof data === 'number') {
            if (data === null) {
                flag = true
            }
        } else {
            if (!data || data.length <= 0) {
                flag = true
            }
        }
        if (flag) {
            this.errMessage(`${name} 不能为空(${name}, ${data})`)
        }

        if (ngt && typeof data === 'string' && data.length > ngt) {
            this.errMessage(`${name} 长度检测（不能超过20个字）`)
        }

        if (nlt && typeof data === 'number' && data < nlt) {
            this.errMessage(`${name} 需大于或等于1`)
        }
    }

    /**
     * 验证文件
     *
     * @param name
     * @param filename
     */
    protected validateFile(name: string, filename: string): void {
        this.checkEmpty(name, filename)
        this.checkExist(name, filename, Validator.files);

        let pngFile = 'images/' + filename + '.png';
        let file = this.checkFileExist(pngFile);

        if (file) {
            return this.checkSize(file, pngFile)
        }

        let jpgFile = 'images/' + filename + '.jpg';
        file = this.checkFileExist(jpgFile);
        if (file) {
            return this.checkSize(file, jpgFile)
        }

        this.errMessage(`${name} ${filename}不存在无法计算大小`)
    }

    protected checkFileExist(filename: string): UnKnownFileObject
    {
        let file = this.zip.file(filename);
        return file
    }

    protected checkSize(file: UnKnownFileObject, filename: string):void
    {
        let size:number|string = JSON.stringify(file)
            .substr(0, 300)
            .match(/"uncompressedSize":(\d+)/).pop()
        if (parseInt(size) > Validator.fileSize) {
            this.errMessage(`${name} ${filename}文件大小超过500k`)
        }
        return ;
    }

    /**
     * 检查某个元素是否在集合内不存在
     *
     * @param name
     * @param data
     * @param set
     */
    protected notRepeat<T>(name: string, data: T, set: Array<T>) {
        if (_.includes(set, data)) {
            this.errMessage(`${name} 不能重复`)
        } else {
            set.push(data)
        }
    }

    /**
     * 检查元素是否存在某个集合内
     *
     * @param name
     * @param value
     * @param set
     */
    protected checkExist<T>(name: string, value: T, set: Array<T>) {
        if (!_.includes(set, value)) {
            this.errMessage(`${name} 不存在`)
        }
    }

    public getErrors(): Array<Message> {
        return this.container
    }

    public checkRepeat(): void {}
}
