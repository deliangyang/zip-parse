import * as JSZip from "jszip";
import * as fs from 'fs'

import * as chai from 'chai';
import {ErrorInfo} from "../validator";
import {CategoryItem, CategoryValidator} from "../validator/category";
import {Layer, LayerValidator} from "../validator/layer";
import {Box, BoxValidator} from "../validator/box";

const expect = chai.expect;

describe('Layer Test', () => {

    it('layer content parse' , () => {
        fs.readFile("abc.zip", (err: any, data: any) => {
            if (err) throw err
            JSZip.loadAsync(data).then(function (zip) {
                zip.forEach(function (relativePath, zipEntry) {
                    if (/type\.json$/.test(zipEntry.name)) {
                        zip.file(zipEntry.name).async("text")
                            .then((text: string) => {
                                text = text.replace(String.fromCharCode(65279), '')
                                let errorInfo = new ErrorInfo(zipEntry.name, 0)
                                let items:Array<CategoryItem> = JSON.parse(text)
                                items.forEach((element: CategoryItem) => {
                                    let category = new CategoryValidator()
                                    category.validate(element, errorInfo)
                                })
                                console.log(errorInfo.trace())
                            }).catch(e => {
                                console.log(e)
                        })
                    }

                    if (/hierarchy\.json$/.test(zipEntry.name)) {
                        zip.file(zipEntry.name).async("text")
                            .then((text: string) => {
                                text = text.replace(String.fromCharCode(65279), '')
                                let errorInfo = new ErrorInfo(zipEntry.name, 0)
                                let items:Array<Layer> = JSON.parse(text)
                                items.forEach((element: Layer) => {
                                    let layer = new LayerValidator()
                                    layer.validate(element, errorInfo)
                                })
                                console.log(errorInfo.trace())
                            }).catch(e => {
                            console.log(e)
                        })
                    }

                    if (/gift_box\.json$/.test(zipEntry.name)) {
                        zip.file(zipEntry.name).async("text")
                            .then((text: string) => {
                                text = text.replace(String.fromCharCode(65279), '')
                                let errorInfo = new ErrorInfo(zipEntry.name, 0)
                                let items:Array<Box> = JSON.parse(text)
                                items.forEach(element => {
                                    let layer = new BoxValidator()
                                    layer.validate(element, errorInfo)
                                })
                                console.log(errorInfo.trace())
                            }).catch(e => {
                            console.log(e)
                        })
                    }
                });
            }).catch(e => {
                console.log(e)
            })
        })

    });
});