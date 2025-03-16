## ![](https://socialify.git.ci/xiaowine/chip-docs-web/image?description=1&descriptionEditable=%E5%9F%BA%E4%BA%8E%20Vue%203%20%E5%BA%93%E6%9E%84%E5%BB%BA%E7%9A%84%E8%8A%AF%E7%89%87%E6%96%87%E6%A1%A3%E5%9C%A8%E7%BA%BF%E6%B5%8F%E8%A7%88%E5%B9%B3%E5%8F%B0&language=1&name=1&owner=1&theme=Auto)

[![Deploy to GitHub Pages](https://github.com/xiaowine/chip-docs-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/xiaowine/chip-docs-web/actions/workflows/deploy.yml)

## 在线访问

[chip-docs.xiaowine.cc](https://chip-docs.xiaowine.cc)

## 数据来源

本项目展示的芯片文档数据来源于以下仓库：

- **文档仓库**：[github.com/xiaowine/chip-docs](https://github.com/xiaowine/chip-docs)

## 项目功能

该项目主要实现了以下功能：

- 芯片文档在线浏览与查看
- 文件树形结构导航
- Markdown 文档实时渲染
- 文件下载功能（支持进度显示与取消）
- 主题切换（亮色/暗色模式支持）
- 响应式布局设计

## 技术栈

- **前端框架**：Vue 3
- **构建工具**：Vite
- **组件库**：Wine UI (自研组件库)
- **样式预处理器**：SCSS
- **语言**：TypeScript
- **渲染引擎**：Marked.js (Markdown 渲染)

## 项目结构

```
chip-docs-web/
├── web/               # 主应用代码
│   ├── components/    # 组件目录
│   ├── services/      # 服务目录
│   └── App.vue        # 主应用组件
├── wine-ui/           # 组件库源码
│   └── styles/        # 组件样式
├── chip-docs/         # 芯片文档内容
└── vite.config.ts     # Vite 配置
```

## 核心特性

### 文件树导航

项目实现了完整的文件树结构导航系统，支持展开/折叠目录，点击文件可查看详情。

### 文档渲染

使用 Markdown 渲染器将文档内容转换为 HTML，支持代码高亮、表格渲染等功能。

### 主题系统

基于 CSS 变量实现的主题系统，支持亮色/暗色模式切换，并提供平滑的过渡动画。

### 响应式设计

适配不同屏幕尺寸，在移动设备上保持良好的用户体验。

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 主题定制

项目使用 Wine UI 组件库的主题系统，所有颜色都基于 CSS 变量定义，可在 `wine-ui/styles/theme.scss` 中进行自定义。

## 开源许可

[MIT License](LICENSE)

---

欢迎贡献代码或提出建议！

## 项目统计

[![Star History Chart](https://api.star-history.com/svg?repos=xiaowine/chip-docs-web&type=Timeline)](https://star-history.com/#xiaowine/chip-docs-web&Timeline)
