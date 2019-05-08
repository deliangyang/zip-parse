
### How to compile this project

```bash
npm run dev
```

复制文件```dist/bundle.js```到你的项目中，如何使用请看```index.html```

```js
$("#file").on("change", function(evt) {
    var files = evt.target.files;
    ZipParse(files[0]).then(function(data) {
        $('.error').html('')
        data.forEach(function(element, index) {
            $('.error').append(++index + ":\t" + element + "<br />")
        })
    }).catch(function(e) {
        console.log(e)
    })
})
```

### Result

![测试结果图片](images/result.png)