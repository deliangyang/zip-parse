import * as fs from "fs";
import * as JSZip from "jszip";

fs.readFile('abc.zip', (err: any, data: any) => {
    if (err) throw err

    JSZip.loadAsync(data).then(function (zip) {
        zip.remove('abc/config.json')
        zip.file('abc/config.json', '{"xxx": "hello world"}')
        console.log(zip)
    })
})