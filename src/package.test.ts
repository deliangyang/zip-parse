import {ExcelToJson, Hash} from "./excel2json";
import * as fs from 'fs'
import {Parser} from "./parser";

describe('Config.xlsx Test', () => {

    it('Config content parse', () => {
        let excel2json = new ExcelToJson()
        fs.readFile('22.xlsx', function(err, data) {
            excel2json.parse(data).then((data) => {
                console.log(JSON.stringify(data))
            })
        })
    });
});

describe('interface Test', () => {

    it('Config content parse', () => {
        return false;
        fs.readFile('1559544433.zip', function(err, data) {
            let parser = new Parser()
            parser.package(data, 'xxx', "a", []).then(res => {
                console.log(res)
            })
        });
    });
});

describe('Unzip Test', () => {

    it('unzip content parse', () => {
        fs.readFile('1559544433.zip', function(err, data) {
            return false;
            let parser = new Parser()
            parser.unzip(data, 'config.xlsx').then((res: Hash) => {
                for (let item in res['result']) {
                    console.log(res['result'][item])
                }
            }).catch(e => {
                console.log(e)
            })
        })
    });
});

