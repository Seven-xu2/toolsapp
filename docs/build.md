# Build Notes

## 已完成配置

- HBuilderX 路径：`D:\aboutwork\soft\hbuilder\HBuilderX`
- 项目路径：`E:\traeproject\toolsapp\mobile`
- Android 包名：`com.toolsapp.toolbox`
- AppID：`__UNI__834E028`
- 版本号：`1.0.0`

## 当前打包前状态

- H5 白屏问题已修复
- 主要页面已验证可正常渲染
- 可基于当前工程重新提交 Android 云打包

## 打包前检查项

- 确认 `mobile/manifest.json` 中 AppID、包名、版本号正确
- 确认后端地址配置正确
- 确认需要的 Android 权限已勾选或写入
- 如需真机联网调试，确认手机能访问后端地址

## 建议打包流程

1. 使用 HBuilderX 打开 `mobile`
2. 确认 `manifest.json` 配置无误
3. 执行云打包 Android 测试包
4. 安装 APK 到 Android 设备
5. 验证登录、首页、工具、收藏、历史、个人中心

## 备注

- 当前 APK 在功能上依赖后端服务，详见：`docs/runtime-dependencies.md`
- 如果准备分发给其他人使用，建议先部署后端服务，再提供 APK