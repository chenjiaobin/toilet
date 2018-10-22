## toilet(厕所去哪儿)

`前言：该项目主要是用来学习用的，后端通过express应用程序生成器生成的了，主要提供后台接口和后台录入页面`
### 启动方式
- npm run super //默认监控所有文件、文件夹的变化的；一旦有变化，服务就会重启
- npm start // 启动服务
### 启动服务后访问
地址：localhost:3000(3000是默认端口，可以自己设置)<br>
账号：admin
密码：123456
### 安装依赖
- 全局安装express-generator来生成express的应用骨架
- cookie-parser主要是用来对cookie的处理
- nedb-session-store和express-session主要使用来做session处理用的
```
<!-- 在app.js里面使用如下 -->
var session = require('express-session')
<!-- session持久化中间件，即在设定的实效内session都有效 -->
var NedbStore = require('nedb-session-store')( session );
<!-- session持久化中间件配置 -->
const sessionMiddleware = session({
    secret: "fas fas",// 加密key，可以随意填写
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000   // 一天
    },
    store: new NedbStore({
      <!-- 执行后会在你的根目录生成这个文件 -->
      filename: 'path_to_nedb_persistence_file.db'
    })
  })
  <!-- 加入配置好的中间件 -->
  app.use(sessionMiddleware);
```
### express提供的接口(/views/data.js)
- 读取数据，供用户调用`data/read?type = it[传递方法：get]`
- 插入数据，供后端调用`data/write[参数：type,title,url,img],传递方式：post`
- 模块配置`data/write_config`,参数如下
```
传递方式：post
参数：{"recommendTopic":[{"img":"推荐专题1","url":"推荐专题1","title":"推荐专题1"}],"category":[{"text":"分类管理1"}],"other":[{"img":"文章欣赏","title":"文章欣赏","url":"文章欣赏"}]}
```
### 后台页面录入数据(/view/index.js)
- /view/edit.ejs编辑页面
- /view/login.ejs登录页面
- /view/tuijian.ejs模块配置页面