var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';


// 读取json文件数据
// data/read?type = it
router.get('/read', function(req, res, next) {
    var type = req.param('type');
    fs.readFile(PATH + type + '.json', function(err, data) {
        if (err) {
            return res.send({
                status: 0,
                data: [],
                message: '读取文件异常'
            })
        }
        var count = 50;
        var obj = [];
        // 防止json文件格式出现报错导致程序停止执行
        try {
            obj = JSON.parse(data.toString());
        } catch(err) {
            obj = [];
        }
        return res.send({
            status: 1,
            data: obj,
            message: 'success'
        })
    })
})

router.get('/write', function(req, res, next) {
    // 存储数据的类型
    var type = req.param('type') || ''
    // 存储的数据参数
    var title = req.param('title') || ''
    var url = req.param('url') || ''
    var img = req.param('img') || ''
    if (!type || !title || !url || !img) {
        return res.send({
            status: 0,
            message: '提交字段不全'
        })
    }
    var filePath = PATH + type + '.json'
    // 读取文件
    fs.readFile(filePath, function(err, data) {
        if (err) {
            return res.send({
                status: 0,
                message: '读取文件异常'
            })
        }
        var obj = JSON.parse(data.toString())
        var addData = {
            id: getGuid(),
            title: title,
            url: url,
            img: img,
            time: new Date()
        }
        console.log(addData)
        obj.splice(0, 0, addData)
        // 写入文件
        var newData = JSON.stringify(obj)
        fs.writeFile(filePath, newData, function(err) {
            if (err) {
                return res.send({
                    status: 0,
                    message: '写入失败'
                })
            }
            return res.send({
                status: 1,
                data: obj,
                message: '写入成功'
            })
        })
    })
})

function getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0
        var v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString() 
    }).toUpperCase()
}

module.exports = router;