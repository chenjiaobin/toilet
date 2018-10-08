var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res, next) {
  if (!req.session.user) {
    // 重定向到登录页面
    return res.redirect('/login')
  }
  return res.render('index', {})
});

// 登录页面
router.get('/login', function(req, res, next) {
  res.render('login', {})
})

// 首页
router.get('/index', function(req, res, next) {
  res.render('index', {})
})

// 推荐
router.get('/tuijian', function(req, res, next) {
  if(!req.session.user){
    return res.render('login', {});
  }
  res.render('tuijian', {});
});

// 编辑
router.get('/edit', function(req, res, next) {
  if(!req.session.user){
    return res.render('login', {});
  }
  console.log(123)
  console.log(req.session.user)
  var type = req.query.type;
  if(type){
    var obj = {};
    switch (type){
      case 'sanwen':
        obj = {};
        break;
      case 'it':
        obj = {};
        break;
      case 'manager':
        obj = {};
        break;
      case 'cookies':
        obj = {};
        break;
      default :
        return res.send({
          status:0,
          info: '参数错误'
        });
        break;
    }
    fs.readFile(PATH + type + '.json', (err, data) => {
      if (err) {
        return res.send({
          status:0,
          info: 'fail.....'
        });
      }
      var obj = JSON.parse(data.toString());
      return res.render('edit', {
        data: obj
      });
    });

  }else{
    return res.send({
      status:0,
      info: '参数错误'
    });
  }
});

module.exports = router;
