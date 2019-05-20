
import * as chai from 'chai';
import {Material, MaterialValidator} from "./validator/material";
import {ExcelToJson, Hash} from "./excel2json";
import {CategoryItem, CategoryValidator} from "./validator/category";
import {ErrorInfo, Validator} from "./validator";
import * as JSZip from "jszip";
import * as fs from "fs";
import {Layer, LayerValidator} from "./validator/layer";
import {Box, BoxValidator} from "./validator/box";
import {BoxConfig, BoxConfigValidator} from "./validator/box-config";

describe('Layer Test', () => {

    it('layer content parse', () => {/**/

        function run(filename: string) {
            return new Promise((resolve, rejects) => {
                fs.readFile(filename, (err: any, data: any) => {
                    if (err) throw err
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
                        excel2Json.parse('config.xlsx').then((items: Hash) => {
                            let errorInfo: ErrorInfo = null;
                            errorInfo = new ErrorInfo('categories');
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

        run('abc.zip').then((data: Hash) => {
            console.log(data['json'])
            console.log(JSON.stringify(data['result']))
        })

    });
});
