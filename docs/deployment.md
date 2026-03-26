# 部署与交付说明

## 一、部署组成

完整运行本项目需要以下组成：

- `mobile`：uni-app 前端工程，最终打包为 Android APK
- `backend`：Spring Boot 3 后端服务
- `MySQL 8`：数据库服务

## 二、推荐部署拓扑

### 开发调试

- H5 前端：`http://127.0.0.1:8080/`
- 后端接口：`http://127.0.0.1:8081/api/v1`
- MySQL：`127.0.0.1:3306`

### APK 交付

推荐部署方式：

- 将后端部署到一台可长期运行的服务器或云主机
- 将 MySQL 部署在同机或内网数据库实例
- APP 端配置为可访问的公网或局域网 API 地址

例如：

- 后端：`http://your-server-ip:8080/api/v1`
- APP：在 `mobile/src/config/env.js` 中配置 `app-local` 的 `baseUrl`

## 三、数据库部署

### 初始化步骤

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\init-db.ps1
```

执行内容：

- 创建数据库 `toolsapp`
- 创建用户、工具目录、收藏、历史相关表
- 初始化工具目录种子数据

## 四、后端部署

### 本地运行

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1
```

### 手动运行

```powershell
cd .\backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### 关键配置文件

- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/application-local.yml`

需要关注：

- 数据库连接地址
- 数据库用户名密码
- JWT 密钥
- 端口配置

## 五、前端部署与打包

### H5 调试

- 使用 HBuilderX 打开 `mobile`
- 当前 H5 调试接口默认连接：`http://127.0.0.1:8081/api/v1`

### Android APK

- 使用 HBuilderX 打开 `mobile`
- 检查 `mobile/manifest.json`
- 检查 AppID、包名、版本号、权限配置
- 使用 HBuilderX 云打包 Android 测试包

## 六、交付给别人时需要提供什么

### 如果你自己部署了后端

给用户提供：

- APK 安装包
- 账号注册入口或测试账号
- 可访问的后端服务地址

### 如果你把整个项目交给别人自己部署

建议提供：

- 项目源码
- 数据库初始化脚本
- 后端启动方式说明
- 前端打包方式说明
- 本文档和 `docs/runtime-dependencies.md`

## 七、验收建议

正式交付前建议至少验证以下内容：

- 用户可正常注册、登录
- 首页工具列表可加载
- 收藏、历史可正常同步
- 个人中心可正常显示和修改昵称
- Android APK 可安装启动
- 手机网络可以访问后端 API

## 八、当前版本的交付定位

当前版本更适合以下两种方式：

- **演示版**：你本机运行后端，手机连接你的服务进行演示
- **完整部署版**：部署后端和数据库后，再分发 APK

当前版本**不建议作为纯离线单机版 APK 直接分发**。