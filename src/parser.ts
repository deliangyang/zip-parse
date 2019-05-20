import * as JSZip from "jszip";
import {ErrorInfo, Validator} from "./validator";
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
                zip.remove(filename)
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

    /**
     * 解压且校验文本的正确性
     *
     * @param data
     * @param filename
     * @return Promise({json: '', result: []})
     */
    public unzip(data: any, filename: string) {
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
                        let errorInfo: ErrorInfo = null;
                        errorInfo = new ErrorInfo('categories');
                        console.log(items)
                        items['categories'].forEach((element: CategoryItem) => {
                            let category = new CategoryValidator(zip)
                            category.validate(element, errorInfo)
                        })
                        result.push(...errorInfo.trace())

                        errorInfo = new ErrorInfo('layers');
                        items['layers'].forEach((element: Layer) => {
                            let category = new LayerValidator(zip)
                            category.validate(element, errorInfo)
                        })
                        result.push(...errorInfo.trace())

                        errorInfo = new ErrorInfo('items');
                        items['items'].forEach((element: Material) => {
                            let category = new MaterialValidator(zip)
                            category.validate(element, errorInfo)
                        })
                        result.push(...errorInfo.trace())

                        errorInfo = new ErrorInfo('boxes');
                        items['boxes'].forEach((element: BoxConfig) => {
                            let category = new BoxConfigValidator(zip)
                            category.validate(element, errorInfo)
                        })
                        result.push(...errorInfo.trace())

                        errorInfo = new ErrorInfo('boxItems');
                        items['boxItems'].forEach((element: Box) => {
                            let category = new BoxValidator(zip)
                            category.validate(element, errorInfo)
                        })
                        result.push(...errorInfo.trace())
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