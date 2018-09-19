var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';

/**
 * 读取数据，供用户调用
 * data/read?type = it
 */
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
        if (obj.length > count) {
            obj = obj.slice(0, count)
        }
        return res.send({
            status: 1,
            data: obj,
            message: 'success'
        })
    })
})

/**
 * 写入数据到json文件，供后台开发使用
 */
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

/**
 * 阅读模块配置接口，供后台开发者使用
 */
router.post('write_config', function(req, res, newt) {
    // 下面这两部主要是为了验证数据
    // 防止xss攻击
    // 安装xss  npm install xss
    // 使用 require('xss')  xss('name')
    var data = req.body.data
    var obj = JSON.parse(data)
    var newData = JSON.stringify(obj)
    fs.write(PATH + 'config.json', newData, function(err) {
        if (err) {
            return res.send({
                status: 0,
                message: '写入失败'
            })
        }
        return res.send({
            status: 1,
            message: '写入成功'
        })
    })
})

// 登陆模块
router.post('/login', function(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    if (!username || !password) {
        return res.send({
            status: 0,
            message: '请正确输入账号和密码'
        })
    }
    if (username == 'admin' && password == '123456') {
        req.session.user = {
            username: username
        }
        return res.send({
            status: 1,
            data: [],
            message: '登陆成功'
        })
    }
    return res.send({
        status: 0,
        message: '登陆失败'
    })
})

/**
 * 获取随机guid，作为数据的id
 */
function getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0
        var v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString() 
    }).toUpperCase()
}

module.exports = router;