# Furigana Injector

一个 Chrome 扩展程序，自动为网页上的日语文本添加**注音假名（振り仮名）**。



## ✨ 功能特性

- 🇯🇵 **自动注音转换** - 使用 Kuroshiro + Kuromoji 进行高精度日语形态分析
- 🌐 **白名单管理** - 预配置 44+ 常用日语网站，支持自定义添加/删除
- ⚡ **高性能处理** - 并行批处理，智能防抖，最小化 CPU 占用
- 🔄 **动态内容支持** - 实时监控 DOM 变化，自动处理动态加载的文本
- 💾 **持久化存储** - Chrome Storage API 本地保存用户偏好设置
- 🚀 **即插即用** - 一键启用/禁用，零配置开箱即用

## 📥 安装方法

### 直接加载扩展（开发者模式）

1. **下载最新版本**
   - 访问 [Release 页面](https://github.com/NanjoCas/JapaneseFI/releases)
   - 下载 `Furigana-Injector-v1.0.0.zip`
   - 解压到本地文件夹

2. **在 Chrome 中加载**
   - 打开 `chrome://extensions/`
   - 启用右上角的 **开发者模式**
   - 点击 **加载未打包的扩展程序**
   - 选择解压后的 `dist` 文件夹
   - ✅ 完成！扩展程序已激活

## 🎯 使用方法

### 基础操作

1. **启用/禁用扩展**
   - 点击 Chrome 工具栏中的 Furigana Injector 图标
   - Popup 中显示当前网页状态
   - 点击 **添加到白名单** 启用该网站

2. **管理白名单**
   - 点击 Popup 中的 **设置** 按钮
   - 在选项页面管理站点列表
   - 支持添加/删除/启用/禁用任意网站

3. **刷新转换**
   - 修改页面内容后，点击 **刷新页面** 按钮
   - 或手动刷新网页（F5/Cmd+R）

### 预配置的白名单网站

扩展程序已预配置以下网站的支持（共 44+ 个）：

**主流网站**:
- YouTube (youtube.com)
- Wikipedia (ja.wikipedia.org)
- Twitter/X (twitter.com, x.com)
- Reddit (reddit.com)

**学习平台**:
- NHK World (nhk.or.jp)
- Duolingo (duolingo.com)
- Memrise (memrise.com)
- Anki (ankiweb.net)

**新闻媒体**:
- NHK News (nhknews.com)
- Asahi Shimbun (asahi.com)
- Mainichi Shimbun (mainichi.jp)
- Yomiuri Online (yomiuri.co.jp)

**文学与文化**:
- AO3 (archiveofourown.org)
- Pixiv (pixiv.net)
- Niconico (nicovideo.jp)
- Weibo (weibo.com)

**商业与开发**:
- GitHub (github.com)
- Stack Overflow (stackoverflow.com)
- Medium (medium.com)
- Dev.to (dev.to)

*完整列表请查看源代码中的 `DEFAULT_WHITELIST` 数组*

## 🛠️ 技术栈

| 组件 | 技术 |
|------|------|
| **框架** | Chrome Manifest V3 |
| **语言** | TypeScript |
| **构建工具** | Webpack 5 |
| **日语处理** | Kuroshiro + Kuromoji |
| **字典** | 12 个 gzip 压缩词典文件 (17MB) |
| **存储** | Chrome Storage API |
| **UI** | HTML5 + CSS3 + Vanilla JavaScript |

### 项目结构

```
JPP/
├── src/
│   ├── popup.html       # 弹窗界面
│   ├── popup.ts         # 弹窗逻辑
│   ├── options.html     # 设置页面
│   ├── options.ts       # 设置逻辑
│   ├── content.ts       # 内容脚本（核心处理）
│   ├── background.ts    # 后台服务工作者
│   ├── decls.d.ts       # TypeScript 类型声明
│   └── styles.css       # 样式表
├── public/
│   └── lib/dict/        # Kuromoji 词典文件
├── dist/                # 编译输出（用于加载）
├── webpack.config.js    # Webpack 配置
├── tsconfig.json        # TypeScript 配置
├── package.json         # 项目依赖
├── manifest.json        # Chrome 扩展配置
└── README.md            # 本文件
```

## 🔧 开发与调试

### 环境要求
- Node.js 16+
- npm 8+
- Chrome 88+


### 调试方法

1. **打开扩展程序页面**
   ```
   chrome://extensions/
   ```

2. **查看日志**
   - 内容脚本: 按 F12 查看网页开发者工具的 Console
   - 后台脚本: 点击扩展程序卡片中的 "服务工作者"

3. **重新加载扩展**
   - 在 `chrome://extensions/` 中点击刷新按钮
   - 或按 Ctrl+Shift+J 在扩展程序管理器中重新加载


## 📥 Release 下载

最新版本: **v1.0.0**

### 下载选项

| 方式 | 链接 |
|------|------|
| **GitHub Release** | [Furigana-Injector-v1.0.0.zip](https://github.com/NanjoCas/JapaneseFI/releases/tag/v1.0.0) |
| **完整项目** | `git clone https://github.com/NanjoCas/JapaneseFI.git` |

### Release 内容

- ✅ 完整的编译源代码 (`dist/` 文件夹)
- ✅ 所有 Kuromoji 字典文件 (17MB)
- ✅ manifest.json 和配置文件
- ✅ 立即可用的 Chrome 扩展程序

### 快速安装 (3 步)

1. **下载并解压**
   ```bash
   wget https://github.com/NanjoCas/JapaneseFI/releases/download/v1.0.0/Furigana-Injector-v1.0.0.zip
   unzip Furigana-Injector-v1.0.0.zip
   ```

2. **打开 Chrome 扩展管理器**
   ```
   chrome://extensions/
   ```

3. **加载扩展**
   - 启用 **开发者模式** (右上角开关)
   - 点击 **加载未打包的扩展程序**
   - 选择解压的 `dist` 文件夹
   - ✅ 完成！

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 反馈渠道
- 🐛 **Bug 报告**: [GitHub Issues](https://github.com/NanjoCas/JapaneseFI/issues)
- 💡 **功能建议**: 欢迎在 Issues 中讨论
- 🔧 **代码贡献**: Fork → 修改 → Pull Request


## 📧 联系方式

- **GitHub**: [@NanjoCas](https://github.com/NanjoCas)
- **Email**: nanjocassava@outlook.com
- **问题反馈**: [GitHub Issues](https://github.com/NanjoCas/JapaneseFI/issues)

---

**祝你使用愉快！** 🎉

*最后更新: 2026 年 3 月 21 日*
