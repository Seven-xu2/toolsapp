# Android packaging notes

1. Open `D:\aboutwork\soft\hbuilder\HBuilderX\HBuilderX.exe`
2. Open `E:\traeproject\toolsapp\mobile`
3. In `manifest.json`, use HBuilderX basic settings and click `重新获取` to obtain a real DCloud appid
4. Run `powershell -ExecutionPolicy Bypass -File .\scripts\publish-app-resource.ps1`
5. In HBuilderX use `发行 -> 原生App-云打包`
6. Select Android and build the test package
7. Download the APK and record the output path in `docs/build.md`

Known blocker discovered in this environment:
- The account phone binding is fixed, but the project appid has not been generated yet.