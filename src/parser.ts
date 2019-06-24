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
import {DefaultConfigValidator} from "./validator/default-config";

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
    public validate(key: string, data: Hash, validate: Validator) {
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
                self.clean()

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
                        self.validate('effect', items['unFormats'], new EffectValidator(zip))
                        self.validate('categories', items['unFormats'], new CategoryValidator(zip))
                        self.validate('layers', items['unFormats'], new LayerValidator(zip))
                        self.validate('items', items['unFormats'], new MaterialValidator(zip))
                        self.validate('boxes', items['unFormats'], new BoxConfigValidator(zip))
                        self.validate('boxItems', items['unFormats'], new BoxValidator(zip))
                        self.validate('defaultConfig', items['unFormats'], new DefaultConfigValidator(zip))
                        console.log(items)
                        resolve({
                            json: items['data'],
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
        let effectFiles: Array<string> = []
        zip.forEach((relativePath, zipEntry) => {
            if (/^effect\/\d+\/$/.test(zipEntry.name)) {
                effectFiles.push(zipEntry.name);
            }
            name = zipEntry.name.split('/').pop()
                .replace(/\.png/, '')
            files.push(name)
        })
        Validator.setFiles(files)
        Validator.setEffectFiles(effectFiles)
    }

    protected clean()
    {
        Validator.setFiles([])
        Validator.setEffectFiles([])
        BoxValidator.itemIdSet = []
        BoxConfigValidator.boxIdSet = []
        BoxConfigValidator.boxNameHkSet = []
        BoxConfigValidator.boxNameSet = []
        BoxConfigValidator.boxNameTwSet = []

        CategoryValidator.categorySet = []
        CategoryValidator.idSet = []
        CategoryValidator.categoryHkSet = []
        CategoryValidator.categoryTwSet = []

        EffectValidator.effectIdSet = []
        EffectValidator.effectCnNameSet = []
        EffectValidator.effectHhNameSet = []
        EffectValidator.effectTwNameSet = []

        LayerValidator.idSet = []
        LayerValidator.layerDownSet = []
        LayerValidator.layerUpSet = []

        MaterialValidator.productSet = []
        MaterialValidator.nameHkSet = []
        MaterialValidator.nameSet = []
        MaterialValidator.nameTwSet = []
        MaterialValidator.refItemIdSet = []
        MaterialValidator.itemIdSet = []
    }
}