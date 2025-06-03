# news-fetcher-platform-v2

## 项目简介

`news-fetcher-platform-v2` 是一个基于 Vue 3 和 Element Plus 构建的播客内容展示平台。项目通过调用后端接口获取播客列表，并提供全局音频播放功能，适配桌面端和移动端，支持在浏览器中直接浏览和收听最新播客。

主要特性包括：

- **响应式布局**：根据屏幕尺寸自动调整列表展示，移动端和桌面端均有优化。
- **无限滚动加载**：主页按需向后端请求数据，滚动到底部自动加载更多内容。
- **全局音频管理**：通过 `globalAudioManager.js` 维护音频实例，实现跨页面的播放控制。
- **播客生成页**：`/create-podcast` 路由用于显示后台生成播客的进度。
- **基于 Vue Router 的单页应用**：前端路由管理简单清晰。

## 目录结构

```
├── src
│   ├── assets            # 全局样式与资源
│   ├── components        # 通用组件（播放器、头部等）
│   ├── pages             # 页面组件(HomePage、CreatePodcastPage)
│   ├── globalAudioManager.js
│   ├── router.js         # 路由配置
│   └── main.js           # 应用入口
├── public                # 公共资源与模板
├── css / js              # 构建后的静态文件
├── package.json          # 项目依赖与脚本
└── vue.config.js         # Vue CLI 配置
```

## 环境要求

- Node.js 版本 14 及以上
- npm 或 yarn

## 项目启动

1. 安装依赖

   ```bash
   npm install
   ```

2. 启动开发服务器

   ```bash
   npm run serve
   ```

   默认会在 <http://localhost:8080> 启动热重载开发环境。

## 构建与发布

生成生产环境代码：

```bash
npm run build
```

构建完成的文件会输出到 `dist` 目录，可部署到任意静态文件服务器。

## 代码检查

项目使用 ESLint 进行代码质量检查：

```bash
npm run lint
```

如需修改规则，可在 `package.json` 的 `eslintConfig` 字段中调整。

## 自定义配置

更多配置项请参考 [Vue CLI 官方文档](https://cli.vuejs.org/config/)。在 `vue.config.js` 中可以对打包路径、代理等进行定制。

## 开源协议

本项目遵循 MIT 协议，欢迎自由使用和二次开发。以下为完整协议内容：

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
