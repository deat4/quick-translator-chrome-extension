# Quick Translator Chrome Extension

## 概述

Quick Translator 是一个 Chrome 浏览器扩展，允许用户快速翻译网页上选中的文本。它使用有道翻译 API 来提供准确的翻译结果，支持多种语言。

## 功能

- 选中文本即时翻译
- 支持多种目标语言（英语、法语、德语、日语、韩语、西班牙语）
- 可自定义目标语言设置
- 翻译结果以弹出框形式显示
- 自动检测源语言

## 安装

1. 克隆或下载此仓库到本地机器。
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`。
3. 启用右上角的"开发者模式"。
4. 点击"加载已解压的扩展程序"。
5. 选择包含扩展文件的文件夹。

## 使用方法

1. 在任何网页上选中要翻译的文本。
2. 释放鼠标按钮后，翻译结果会自动显示在弹出框中。
3. 要更改目标语言，点击 Chrome 工具栏中的扩展图标，在弹出的设置页面中选择所需语言，然后点击"保存"。

## 文件结构

- `manifest.json`: 扩展的配置文件
- `background.html`: 背景页面 HTML 文件
- `background.js`: 背景脚本，处理翻译请求和语言设置
- `content.js`: 内容脚本，处理用户交互和显示翻译结果
- `popup.html`: 弹出设置页面的 HTML 文件
- `popup.js`: 弹出设置页面的脚本文件
- `translator.js`: 包含翻译逻辑和 API 调用的脚本
- `crypto-js.min.js`: 用于 API 签名的加密库

## 开发

### 前提条件

- Chrome 浏览器
- 有道翻译 API 密钥（在 `translator.js` 中配置）

### 本地开发

1. 按照上述安装步骤加载扩展。
2. 修改代码后，在 `chrome://extensions/` 页面点击扩展的刷新按钮以更新。

### 调试

- 使用 Chrome 开发者工具调试 content scripts 和 popup。
- 背景页面可以通过扩展管理页面的"检查视图"来调试。

## 安全注意事项

- API 密钥存储在 `translator.js` 中。在生产环境中，应考虑更安全的密钥管理方式。
- 确保在生产环境中移除或减少控制台日志输出。

## 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 该仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

此项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 联系方式

如有任何问题或建议，请开启一个 issue 或直接联系项目维护者。

## 致谢

- 感谢有道翻译 API 提供翻译服务。
- 感谢 CryptoJS 库提供加密功能。
