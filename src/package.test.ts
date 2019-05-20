import {ExcelToJson} from "./excel2json";
import * as fs from 'fs'

describe('Layer Test', () => {

    it('layer content parse', () => {
        let excel2json = new ExcelToJson()
        fs.readFile('config.xlsx', function(err, data) {
            console.log(data)
            excel2json.parse(data).then((data) => {
                console.log(JSON.stringify(data))
            })
        })
    });
});
