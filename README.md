# 文件上传js插件
> 支持批量上传，预览和删除

## Quick Start
>将src目录拷贝到你的项目下，引入如下三个文件

``` html
<link rel="stylesheet" type="text/css" href="src/uploader.css">
<script type="text/javascript" src="http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript" src="src/uploader.js"></script>
```

## Quick Start
```js
//使用默认值初始化
$('.file-uploader').fileUploader();

//带文件的初始化（适用于编辑页面）
$('.file-uploader-with-init-file').fileUploader({
    'files': [{
        "name": "test.png",
        "url": "https://test.com/test.jpeg",
        "size":10000
    }]
});

//配置前端上传文件
$('.file-uploader-with-init-file').fileUploader({
        'uploadConfig':{'url':'your server upload adress', 'params': {//your server upload auth params}}
        'onUploadSucess':function(re){},
        'onUploadSucess':function(re){},
    'files': [{
        "name": "test.png",
        "url": "https://test.com/test.jpeg",
        "size":10000
    }]
});
```

## demo

[picture1](http://blog.luojia.ren/upload/WechatIMG1.jpeg)

[picture1](http://blog.luojia.ren/upload/WechatIMG2.jpeg)

## License
MIT

>使用效果见test.html。更多信息：https://www.luojia.ren/index.php/archives/3909
