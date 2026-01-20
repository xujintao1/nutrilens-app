# NutriLens Capacitor 手机 App 改造指南

本文档说明如何将 NutriLens Web 应用改造成手机 App。

## 📋 已完成的改动

### 1. **依赖更新**
- ✅ 添加 Capacitor 核心库和插件
- ✅ 添加后端 API 服务器依赖（Express + CORS）
- ✅ 移除 ESM CDN 依赖，改用 npm 打包

### 2. **API 安全化**
- ✅ 创建后端代理服务器（`server/index.js`）
- ✅ 前端改为调用后端 API（`geminiService.ts`）
- ✅ API Key 不再暴露在前端代码中

### 3. **Capacitor 配置**
- ✅ 创建 `capacitor.config.ts` 配置文件
- ✅ 配置相机权限、启动屏幕等

### 4. **构建配置**
- ✅ 更新 `vite.config.ts`，添加 API 代理
- ✅ 更新 `index.html`，移除 importmap

---

## 🚀 安装步骤

### Step 1: 安装依赖

```bash
cd d:/饮食app
npm install
```

### Step 2: 初始化 Capacitor

```bash
# 初始化 Capacitor（配置文件已创建，跳过此步）
# npx cap init

# 添加 Android 平台
npx cap add android

# 如果需要 iOS（需要 macOS）
# npx cap add ios
```

### Step 3: 构建 Web 应用

```bash
npm run build
```

### Step 4: 同步代码到原生项目

```bash
npx cap sync
```

---

## 🖥️ 开发模式运行

### 方式一：Web 开发（推荐边开发边测试）

开两个终端：

**终端 1 - 启动后端 API 服务器：**
```bash
npm run server
```

**终端 2 - 启动前端开发服务器：**
```bash
npm run dev
```

访问：http://localhost:3000

### 方式二：原生 App 开发

```bash
# 1. 构建前端
npm run build

# 2. 同步到原生项目
npx cap sync

# 3. 打开 Android Studio
npx cap open android
```

在 Android Studio 中：
1. 等待 Gradle 构建完成
2. 连接真机或启动模拟器
3. 点击运行按钮

---

## 📱 配置相机权限（Android）

已在 `capacitor.config.ts` 中配置，同步后会自动生成权限配置。

如果需要手动配置，编辑 `android/app/src/main/AndroidManifest.xml`：

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

---

## 🔐 环境变量配置

确保 `.env.local` 文件中有 Gemini API Key：

```env
GEMINI_API_KEY=your_actual_api_key_here
```

---

## 🎨 自定义 App 图标和启动屏幕

### 1. 准备资源文件
- **App 图标**：1024x1024 PNG（命名为 `icon.png`）
- **启动屏幕**：2732x2732 PNG（命名为 `splash.png`）

### 2. 生成多尺寸资源

```bash
# 方式一：使用 Capacitor 资源生成工具
npm install -g @capacitor/assets
npx capacitor-assets generate --iconBackgroundColor '#8daa9d' --splashBackgroundColor '#8daa9d'

# 方式二：手动放置到 android/app/src/main/res/ 目录
```

---

## 📦 打包 APK

### 开发版 APK（快速测试）

```bash
# 1. 构建前端
npm run build

# 2. 同步到 Android
npx cap sync

# 3. 打开 Android Studio
npx cap open android

# 4. 在 Android Studio 中
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

生成的 APK 位于：
`android/app/build/outputs/apk/debug/app-debug.apk`

### 发布版 APK（上架应用商店）

需要先配置签名密钥，详见：
https://capacitorjs.com/docs/android/deploying-to-google-play

---

## 🐛 常见问题

### 1. 相机无法打开
- 确保已授予相机权限
- 检查 `AndroidManifest.xml` 是否有 CAMERA 权限

### 2. API 调用失败
- 确保后端服务器正在运行（`npm run server`）
- 检查 `.env.local` 中的 API Key 是否正确
- 查看浏览器控制台和后端终端的错误信息

### 3. 真机测试时无法连接后端
- 修改 `capacitor.config.ts`：
  ```typescript
  server: {
    url: 'http://你的电脑IP:3000',  // 例如 http://192.168.1.100:3000
    cleartext: true
  }
  ```
- 确保手机和电脑在同一 Wi-Fi 网络

### 4. TypeScript 报错
- 运行 `npm install` 安装所有依赖
- 重启 IDE

---

## 📚 下一步优化

### 短期（1-2周）
- [ ] 实现 Capacitor Camera 原生拍照（替代 Web API）
- [ ] 使用 Capacitor Preferences 替代 localStorage
- [ ] 添加推送通知功能
- [ ] 优化启动性能

### 中期（1个月）
- [ ] 集成原生健康数据（HealthKit/Google Fit）
- [ ] 添加离线模式
- [ ] 实现 App 内购买
- [ ] 上架 Google Play

### 长期（3个月+）
- [ ] 考虑迁移到 React Native（如需更极致体验）
- [ ] 添加 Apple Watch 小组件
- [ ] 多语言支持

---

## 🔗 有用的链接

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Capacitor Camera 插件](https://capacitorjs.com/docs/apis/camera)
- [Android 开发指南](https://capacitorjs.com/docs/android)
- [iOS 开发指南](https://capacitorjs.com/docs/ios)

---

## 💡 提示

- 开发时使用 Web 模式（`npm run dev`）更快
- 定期同步代码到原生项目（`npx cap sync`）
- 在真机上测试相机、通知等原生功能
- 保持 `.env.local` 文件的安全，不要提交到 Git

---

**需要帮助？** 遇到问题可以随时询问！
