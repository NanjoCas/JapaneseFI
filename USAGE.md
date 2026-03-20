# Furigana Injector - 日语汉字读音标注 Chrome 插件

一个 Chrome 扩展程序，可以自动扫描网页中的日语汉字，并为其添加平假名读音标注。特别适合在 X (Twitter)、Facebook 等社交媒体平台上使用。

## ✨ 功能

- ✅ **自动识别日语汉字**：遍历网页 DOM，识别所有汉字字符
- ✅ **实时标注假名**：使用 Kuroshiro + Kuromoji 进行准确的日语形态分析
- ✅ **动态内容支持**：支持无限滚动和动态加载（专为社交媒体优化）
- ✅ **智能过滤**：自动跳过脚本、样式表和输入框，避免干扰

## 📋 前置要求

- Chrome 浏览器（推荐最新版本）
- Node.js（仅用于开发和构建）

## 🚀 快速开始

### 1. 获取项目文件

项目文件位于 `/Users/nanjo/Desktop/projects/JPP`

### 2. 加载到 Chrome

1. 打开 Chrome 浏览器，进入 `chrome://extensions/`
2. **启用右上角的"开发者模式"** (Developer Mode)
3. 点击 **"加载已解压的扩展程序"** (Load unpacked)
4. 选择项目目录中的 **`dist`** 文件夹

   ⚠️ **重要**：必须选择 `dist` 文件夹，而不是项目根目录或 `src` 文件夹

5. 插件加载完成后，会在扩展列表中显示 **"Furigana Injector"**

### 3. 使用

1. 访问任何包含日语内容的网页（如 X.com、日本 Wikipedia 等）
2. 页面加载完成后，汉字上方会自动显示平假名
3. 向下滚动页面时，新出现的内容也会自动处理

## 🔍 调试与故障排查

### 查看加载状态

1. 访问一个日文网页
2. 按 `F12` 打开开发者工具，选择 **Console (控制台)** 标签
3. 查看以下日志：

   - `Furigana: Starting initialization...` - 插件开始初始化
   - `Furigana: Received dict path: ...` - 词典路径已读取
   - `Furigana: ✓ Initialized successfully!` - 初始化完成
   - 如果都没有，检查是否选对了 `dist` 文件夹

### 常见问题

**问：插件没有反应，控制台没有日志**
- 答：确认已在 `chrome://extensions/` 中看到插件。如果看不到，说明没有加载成功。尝试删除后重新加载 `dist` 文件夹。

**问：加载速度很慢**
- 答：这是正常的。词典文件有 17MB，首次初始化需要 1-3 秒。之后速度会加快。

**问：已加载但仍然没有标注出现**
- 答：检查网页本身是否包含日语汉字。有些网页可能已经有假名标注，或者不含汉字内容。

## 🛠️ 开发与编译

### 安装依赖

```bash
npm install
```

### 编译项目

```bash
npm run build
```

编译后的文件会生成到 `dist/` 目录。

### 开发模式（监听文件变化自动编译）

```bash
npm run watch
```

## 📁 项目结构

```
JPP/
├── src/
│   ├── content.ts          # 核心插件逻辑（注入网页 DOM）
│   ├── background.ts       # 后台脚本（资源路径管理）
│   ├── popup.ts            # 弹窗交互脚本
│   └── popup.html          # 弹窗界面
├── public/
│   └── lib/
│       └── dict/           # Kuromoji 日语词典文件（自动复制）
├── dist/                   # 编译输出（用于加载的目录）
├── manifest.json           # Chrome 扩展配置文件
├── webpack.config.js       # Webpack 构建配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # NPM 依赖配置
```

## 🔧 核心技术栈

- **TypeScript**: 类型安全的代码
- **Webpack 5**: 模块打包和资源加载
- **Kuroshiro**: 日语转换库（汉字 → 平假名）
- **Kuromoji**: 日语形态分析（词法分割）
- **Chrome Extensions API**: 扩展程序开发

## ⚙️ 技术说明

### 为什么使用后台脚本传递路径？

由于 `chrome.runtime.getURL()` 在某些网页（如 X/Twitter）的特殊 CSP 环境下可能返回无效值，我们采用了通过后台脚本（Background Service Worker）作为中介，将正确的资源路径传递给内容脚本的方法。这确保了跨域和权限问题的完全解决。

### 性能考虑

- 词典文件（~17MB）在首次加载时会被缓存，后续访问速度很快
- 使用 `MutationObserver` 监听 DOM 变化，对无限滚动类网站有很好的支持
- 自动跳过 `<script>`、`<style>` 等非文本节点，减少不必要的处理

## 📝 许可证

MIT

## 🤝 反馈与建议

如果遇到任何问题或有改进建议，欢迎提出。

---

**最后更新**: 2026 年 3 月 20 日