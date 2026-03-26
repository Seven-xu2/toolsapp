# 全栈工具箱 APP

## 项目简介

全栈工具箱 APP 是一个前后端分离的移动端工具箱项目：

- 前端：`uni-app` 手机应用工程
- 后端：`Spring Boot 3`
- 数据库：`MySQL 8`
- 架构：前后端分离，接口前缀统一为 `/api/v1`

项目包含用户账号、工具目录、收藏同步、历史同步、个人中心，以及 6 个常用本地工具页面。

## 目录结构

- `backend`：Spring Boot 3 后端服务
- `mobile`：uni-app 手机端工程
- `sql`：数据库初始化脚本
- `scripts`：数据库初始化、启动、联调、打包辅助脚本
- `docs`：项目说明文档

## 功能清单

- 用户注册、登录
- 游客进入
- 首页工具列表
- 计算器
- 单位转换
- 手电筒
- 二维码生成
- 时间戳转换
- 文本工具
- 收藏云同步
- 使用历史云同步
- 个人中心

## 当前使用方式

### 游客模式

- 无需注册登录
- 可直接使用本地工具
- 不依赖后端即可运行本地工具能力

### 登录模式

- 需要后端服务和 MySQL
- 支持收藏、历史、个人中心等云同步能力

## 环境要求

- JDK 17：`D:\aboutwork\soft\jdk\jdk-17.0.10`
- Maven 3.9+
- MySQL 8：`127.0.0.1:3306`
- HBuilderX：`D:\aboutwork\soft\hbuilder\HBuilderX`

## 快速启动

### 1. 初始化数据库

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\init-db.ps1
```

### 2. 启动后端

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-backend.ps1
```

默认后端端口：`8080`

### 3. 运行接口冒烟测试

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-api.ps1
```

### 4. 前端调试

- 使用 HBuilderX 打开 `mobile`
- H5 调试默认请求：`http://127.0.0.1:8081/api/v1`
- Android APP 调试请在 `mobile/src/config/env.js` 配置局域网后端地址
- 如果不准备部署后端，可直接通过游客模式使用本地工具

### 5. 前端本地工具测试

```powershell
cd .\mobile
node --test .\tests\utils.test.mjs
```

## 文档入口

- 运行依赖说明：`docs/runtime-dependencies.md`
- 部署与交付说明：`docs/deployment.md`
- API 摘要：`docs/api.md`
- 打包说明：`docs/build.md`
- HBuilderX 打包辅助说明：`scripts/build-android-notes.md`

## 当前交付结论

- H5 页面已修复白屏并可正常运行
- 已支持游客模式
- 无后端时可使用本地工具
- 登录模式下后端 API 冒烟测试已通过
- Android APK 可继续基于当前 `mobile` 工程重新云打包