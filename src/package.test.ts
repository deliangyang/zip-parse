import {ExcelToJson, Hash} from "./excel2json";
import * as fs from 'fs'
import {Parser} from "./parser";

describe('Config.xlsx Test', () => {

    it('Config content parse', () => {
        return true;
        let excel2json = new ExcelToJson()
        fs.readFile('config.xlsx', function(err, data) {
            excel2json.parse(data).then((data) => {
                console.log(JSON.stringify(data))
            })
        })
    });
});

describe('interface Test', () => {

    it('Config content parse', () => {
        return false;
        fs.readFile('226.zip', function(err, data) {
            let parser = new Parser()
            parser.package(data, 'xxx', "a", []).then(res => {
                console.log(res)
            })
        });
    });
});

describe('Unzip Test', () => {

    it('unzip content parse', () => {
        fs.readFile('226.zip', function(err, data) {
            let parser = new Parser()
            parser.unzip(data, 'config.xlsx').then((res: Hash) => {
                for (let item in res['result']) {
                    console.log(JSON.stringify(res['result'][item]))
                }
                console.log(JSON.stringify(res))
            }).catch(e => {
                console.log(e)
            })
        })
    });
});

