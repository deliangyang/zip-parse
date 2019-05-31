import * as JSZip from "jszip";
import {Validator} from "./validator";
import {ExcelToJson, Hash} from "./excel2json";
import {CategoryValidator} from "./validator/category";
import {LayerValidator} from "./validator/layer";
import {MaterialValidator} from "./validator/material";
import {BoxConfigValidator} from "./validator/box-config";
import {BoxValidator} from "./validator/box";
import {Message} from "./message";
import {EffectValidator} from "./validator/effect";

export class Parser {

    debug: boolean = false

    private result: Array<string> = []
    /**
     * 设置debug模式
     *
     * @param debug
     */
    public setDebug(debug: boolean) {
        this.debug = debug
    }

    /**
     * 打包上传
     *
     * @param data any
     * @param filename string
     * @param content string
     * @param removeFiles Array<string>
     * @return Promise(File)
     */
    public package(data: any, filename: string, content: string, removeFiles: Array<string>) {
        return new Promise((resolve, rejects) => {
            JSZip.loadAsync(data).then(function (zip) {
                removeFiles.forEach(_filename => {
                    zip.remove(_filename)
                })
                zip.file(filename, content)
                zip.generateAsync({type : "uint8array"}).then(value => {
                    let file = new File([value], 'config.zip')
                    resolve(file)
                })
            }).catch(e => {
                rejects(e)
            })
        })
    }

    /**
     * 校验
     *
     * @param key
     * @param data
     * @param validate
     */
    protected validate(key: string, data: Hash, validate: Validator) {
        let error:string = ''

        data[key].forEach((element: any) => {
            validate.validate(element)
        })

        validate.getErrors().forEach(item => {
            error = Message.parse(key, item.index, item.message)
            this.result.push(error)
        })
    }

    /**
     * 解压且校验文本的正确性
     *
     * @param data
     * @param filename
     * @return Promise({json: '', result: []})
     */
    public unzip(data: any, filename: string) {
        let self = this
        return new Promise((resolve, rejects) => {
            JSZip.loadAsync(data).then(function (zip) {
                self.fileContainer(zip)

                try {
                    self.checkFiles(zip, filename, 'images')
                } catch (e) {
                    return rejects(e)
                }

                zip.file(filename).async('array').then(function(data) {
                    let excel2Json = new ExcelToJson()
                    excel2Json.parse(data).then((items: Hash) => {
                        self.result = []
                        self.validate('effect', items, new EffectValidator(zip))
                        self.validate('categories', items, new CategoryValidator(zip))
                        self.validate('layers', items, new LayerValidator(zip))
                        self.validate('items', items, new MaterialValidator(zip))
                        self.validate('boxes', items, new BoxConfigValidator(zip))
                        self.validate('boxItems', items, new BoxValidator(zip))

                        resolve({
                            json: items,
                            result: self.result,
                        })
                    }).catch(e => {
                        rejects(e)
                    })
                })
            }).catch(e => {
                rejects(e)
            })
        })
    }

    /**
     * 检查目录和文件是否存在
     *
     * @param zip
     * @param filename
     * @param folder
     */
    protected checkFiles(zip: JSZip, filename: string, folder?: string)
    {
        if (!zip.file(filename)) {
            throw new Error(`Excel ${filename} 不存在`)
        }
    }

    protected fileContainer(zip: JSZip) {
        let files: Array<string> = []
        let name: string
        zip.forEach((relativePath, zipEntry) => {
            name = zipEntry.name.split('/').pop()
                .replace(/\.png/, '')
            files.push(name)
        })

        Validator.setFiles(files)
    }
}