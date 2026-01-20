# 🪟 Windows 环境构建指南

## ⚠️ 重要提示
在 Windows PowerShell 中，npm 命令需要使用 `.cmd` 后缀！

---

## 📋 正确的构建步骤

### Step 1: 测试前端构建

```powershell
cd d:/饮食app

# Windows 正确命令格式
npm.cmd run build
```

### Step 2: 检查 dist 文件夹

```powershell
# 查看是否生成了 dist 文件夹
ls dist
```

**期望看到：**
- dist/index.html
- dist/assets/ 文件夹

---

## 🔧 如果构建失败

### 选项 A：重新安装依赖

```powershell
npm.cmd install
npm.cmd run build
```

### 选项 B：清理缓存后重建

```powershell
# 删除可能的缓存
Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue

# 重新构建
npm.cmd run build
```

---

## ✅ 构建成功后

### Step 3: 重新初始化 Android

```powershell
# 1. 删除不完整的 android 文件夹
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue

# 2. 重新添加 Android 平台
npx.cmd cap add android

# 3. 同步代码
npx.cmd cap sync

# 4. 打开 Android Studio  
npx.cmd cap open android
```

---

## 🚀 测试开发环境（不需要 Android Studio）

如果 Android Studio 配置有问题，可以先测试 Web 模式：

```powershell
# 终端 1 - 启动后端 API 服务器
npm.cmd run server

# 终端 2（新开一个 PowerShell）- 启动前端
npm.cmd run dev
```

然后访问：http://localhost:3000

---

## 📞 常用命令速查（Windows 版本）

```powershell
# 安装依赖
npm.cmd install

# 构建前端
npm.cmd run build

# 开发模式
npm.cmd run dev

# 启动后端
npm.cmd run server

# 添加 Android 平台
npx.cmd cap add android

# 同步代码
npx.cmd cap sync

# 打开 Android Studio
npx.cmd cap open android
```

---

## 💡 下一步

1. **先执行：** `npm.cmd run build`
2. **检查：** 是否生成了 `d:/饮食app/dist` 文件夹
3. **告诉我结果：** 成功了还是有错误

如果有错误，把完整的错误信息发给我！
