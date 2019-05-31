import {ExcelToJson, Hash} from "./excel2json";
import * as fs from 'fs'
import {Parser} from "./parser";

describe('Config.xlsx Test', () => {

    it('Config content parse', () => {
        let excel2json = new ExcelToJson()
        fs.readFile('config2.xlsx', function(err, data) {
            excel2json.parse(data).then((data) => {
                console.log(JSON.stringify(data))
            })
        })
    });
});

describe('Unzip Test', () => {

    it('unzip content parse', () => {
        fs.readFile('531.zip', function(err, data) {
            let parser = new Parser()
            parser.unzip(data, 'config.xlsx').then((res: Hash) => {
                for (let item in res['result']) {
                    //console.log(res['result'][item])
                }
            }).catch(e => {
                console.log(e)
            })
        })
    });
});

