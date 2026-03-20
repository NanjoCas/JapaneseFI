# Furigana Injector Chrome Extension

这是一个为网页中的日语汉字自动添加振假名（读音）的 Chrome 扩展。

## 功能介绍
- 自动扫描页面中的日语汉字。
- 使用 `kuroshiro` 和 `kuromoji` 进行日语形态分析。
- 支持平假名显示。

## 安装步骤
1. 打开 Chrome 浏览器，进入 `chrome://extensions/`。
2. 开启右上角的 **开发者模式 (Developer mode)**。
3. 点击 **加载已解压的扩展程序 (Load unpacked)**。
4. 选择本项目中的 `dist` 文件夹（或者整个项目根目录，如果 `manifest.json` 在根目录）。
   - 注意：如果通过 `npm run build` 构建，`manifest.json` 应该在 `dist` 文件夹中。

## 开发与构建
1. 安装依赖：
   ```bash
   npm install
   ```
2. 构建项目：
   ```bash
   npm run build
   ```
3. 持续构建（开发模式）：
   ```bash
   npm run watch
   ```

## 项目结构
- `src/content.ts`: 核心注入逻辑，遍历 DOM 节点并替换文本。
- `src/background.ts`: 后台脚本。
- `src/popup.ts`: 弹出窗口交互逻辑。
- `public/lib/dict/`: `kuromoji` 词典文件。

## 注意事项
- 由于需要加载数 MB 的词典文件，首次在页面运行时可能有短暂延迟。
- 仅支持现代浏览器。