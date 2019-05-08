import * as JSZip from "jszip";

class Unzip {
    unzip() {
        JSZip.loadAsync("../../abc.zip").then(function (zip) {
            zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
                console.log(relativePath + zipEntry.name)
            });
        }).catch(e => {
            console.log(e)
        })
    }
}