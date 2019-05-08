import * as JSZip from "jszip";
import * as fs from 'fs'

import * as chai from 'chai';
import {ErrorInfo, Validator} from "../validator";
import {CategoryItem, CategoryValidator} from "../validator/category";
import {Layer, LayerValidator} from "../validator/layer";
import {Box, BoxValidator} from "../validator/box";
import {BoxConfig, BoxConfigValidator} from "../validator/box-config";
import {Material, MaterialValidator} from "../validator/material";


const expect = chai.expect;

function ZipParse(data: any) {

    return new Promise((resolve, rejects) => {
        JSZip.loadAsync(data).then(async function (zip) {
            let result: Array<string> = []
            let files: Array<string> = []
            let name: string
            zip.forEach((relativePath, zipEntry) => {
                name = zipEntry.name.split('/').pop()
                    .replace(/\.png/, '')
                files.push(name)
            })

            Validator.setFiles(files)

            let filename = 'abc/type.json'
            let errorInfo = new ErrorInfo(filename, 0)
            await zip.file(filename).async("text").then((text: string) => {
                text = text.replace(String.fromCharCode(65279), '')
                let items: Array<CategoryItem> = JSON.parse(text)
                items.forEach(element => {
                    let category = new CategoryValidator(zip)
                    category.validate(element, errorInfo)
                })
            }).catch(e => {
                console.log(e)
            })
            result.push(...await errorInfo.trace())

            filename = 'abc/hierarchy.json'
            errorInfo = new ErrorInfo(filename, 0)
            await zip.file(filename).async("text").then((text: string) => {
                text = text.replace(String.fromCharCode(65279), '')
                let items: Array<Layer> = JSON.parse(text)
                items.forEach((element: Layer) => {
                    let layer = new LayerValidator()
                    layer.validate(element, errorInfo)
                })
            }).catch(e => {
                console.log(e)
            })
            result.push(...errorInfo.trace())

            filename = 'abc/assist.json'
            errorInfo = new ErrorInfo(filename, 0)
            await zip.file(filename).async("text").then((text: string) => {
                text = text.replace(String.fromCharCode(65279), '')
                let items: Array<Material> = JSON.parse(text)
                items.forEach(element => {
                    let layer = new MaterialValidator(zip)
                    layer.validate(element, errorInfo)
                })
            }).catch(e => {
                console.log(e)
            })
            result.push(...errorInfo.trace())

            filename = 'abc/gift_box_details.json'
            errorInfo = new ErrorInfo(filename, 0)
            await zip.file(filename).async("text").then((text: string) => {
                text = text.replace(String.fromCharCode(65279), '')
                let items: Array<BoxConfig> = JSON.parse(text)
                items.forEach(element => {
                    let layer = new BoxConfigValidator(zip)
                    layer.validate(element, errorInfo)
                })
            }).catch(e => {
                console.log(e)
            })
            result.push(...await errorInfo.trace())

            filename = 'abc/gift_box.json'
            errorInfo = new ErrorInfo(filename, 0)
            await zip.file(filename).async("text").then((text: string) => {
                text = text.replace(String.fromCharCode(65279), '')
                let items: Array<Box> = JSON.parse(text)
                items.forEach(element => {
                    let layer = new BoxValidator()
                    layer.validate(element, errorInfo)
                })
            }).catch(e => {
                console.log(e)
            })
            result.push(...errorInfo.trace())

            resolve(result)
        }).catch(e => {
            rejects(e)
        })
    })
}

describe('Layer Test', () => {

    it('layer content parse' , () => {
        fs.readFile("abc.zip", (err: any, data: any) => {
            if (err) throw err
            ZipParse(data).then((data: Array<string>) => {
                console.log(data.join('\n'))
            })
        })

    });
});