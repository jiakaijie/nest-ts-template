# nest-ts-template

基于 @nestjs/cli 创建的 nest 项目模版

## 开发环境依赖

node: v16.16.0

## Scripts

### `npm install`

装包

### `npm run dev`

本地启动观察文件改变

[http://localhost:3000]

### `npm run build`

打包

### `npm run test`

e2e tests

## 相关配置


## 快速创建一整个CRUD

nest g resource cats module

nest g resource(创建CRUD) cats(整个模块名称) module (src下的文件夹名称)

选择src -> REST API -> n(CRUD)

## 上线环境域名

测试：https://test-xxx.com

灰度：https://gray-xxx.com

线上：https://xxx.com

## 环境

测试环境：https://test-xxx.com -> xxx.0.1(集群访问ip)

灰度环境：https://gray-xxx.com -> xxx.0.1(集群访问ip)

正式环境：https://xxx.com -> xxx.0.1(集群访问ip)

### 1.shell启动mongodb

mongod:mongodb文件夹bin目录下的mongod用来启动mongodb服务
dbpath:指定数据库文件
/Users/jiakaijie/mongodb-macos-x86_64-5.0.1/bin/mongod --dbpath /Users/jiakaijie/mongodb-macos-x86_64-5.0.1/db

### 2.shell连接mongodb

mongo:mongodb文件夹bin目录下的mongo用来连接mongodb
mongo:localhost:127027 (连接方式mongo+域名+端口号，如果有账号密码查看更多文档)
/Users/jiakaijie/mongodb-macos-x86_64-5.0.1/bin/mongo mongo:localhost:12027
