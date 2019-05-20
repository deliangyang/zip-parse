import * as JSZip from "jszip";
import {Datum, ErrorInfo, Validator} from "./validator";
import {ExcelToJson, Hash} from "./excel2json";
import {CategoryItem, CategoryValidator} from "./validator/category";
import {Layer, LayerValidator} from "./validator/layer";
import {Material, MaterialValidator} from "./validator/material";
import {BoxConfig, BoxConfigValidator} from "./validator/box-config";
import {Box, BoxValidator} from "./validator/box";

export class Parser {

    debug: boolean = false

    public setDebug(debug: boolean) {
        this.debug = debug
    }

    /**
     * 打包上传
     *
     * @param data
     * @param filename
     * @param content
     * @return Promise(FormData)
     */
    public package(data: any, filename: string, content: string) {
        let self = this
        return new Promise((resolve, rejects) => {
            JSZip.loadAsync(data).then(function (zip) {
                // 移除原始的excel文件
                zip.remove('config.xlsx')
                zip.file(filename, content)
                zip.generateAsync({type : "uint8array"}).then(value => {
                    if (self.debug) {
                        console.log(value)
                    }
                    var formdata = new FormData();
                    formdata.append('file', new File([value], 'config.zip'))
                    resolve(formdata)
                })
            }).catch(e => {
                rejects(e)
            })
        })
    }

    protected validate<T extends Validator>(
        key: string, data: Hash, validate: T) {

        let errorInfo = new ErrorInfo(key)
        data[key].forEach((element: any) => {
            validate.validate(element, errorInfo)
        })
        if (this.debug) {
            console.log(key, data[key], errorInfo.trace())
        }
        return errorInfo.trace()
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
                let result: Array<string> = []
                let files: Array<string> = []
                let name: string
                zip.forEach((relativePath, zipEntry) => {
                    name = zipEntry.name.split('/').pop()
                        .replace(/\.png/, '')
                    files.push(name)
                })
                Validator.setFiles(files)

                let excel2Json = new ExcelToJson()
                zip.file(filename).async('array').then(function(data) {
                    console.log(data)
                    excel2Json.parse(data).then((items: Hash) => {

                        result.push(
                            ...self.validate('categories', items, new CategoryValidator(zip)),
                            ...self.validate('layers', items, new LayerValidator(zip)),
                            ...self.validate('items', items, new MaterialValidator(zip)),
                            ...self.validate('boxes', items, new BoxConfigValidator(zip)),
                            ...self.validate('boxItems', items, new BoxValidator(zip))
                        )

                        resolve({
                            json: items,
                            result: result,
                        })
                    }).catch(e => {
                        rejects(e)
                    });
                })

            })
        })
    }

}