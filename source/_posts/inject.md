---
title: Hexo代码注入&&页面模板
tags:
  - 帮助
categories: 帮助
date: 2026-05-02 13:43:51
---
~~主要介绍EJS和自定义鼠标~~
<!-- more -->
# 关于代码注入&&自定义页面模板
代码注入请参考:  
[fliud](https://hexo.fluid-dev.com/docs/advance/#hexo-%E6%B3%A8%E5%85%A5%E4%BB%A3%E7%A0%81)和[hexo](https://hexo.io/zh-cn/api/injector)
自定义页面模板如下
```
/你的博客目录/layout/          ← 在博客根目录创建这个文件夹
└── test.ejs               ← 你的自定义模板
```
# CSS 鼠标样式更改与 EJS 模板引擎详解

## 一、CSS 鼠标样式更改

在 CSS 中，通过 `cursor` 属性可以改变鼠标指针在不同元素上的显示样式。这对于提升用户体验、提供视觉反馈非常有帮助。

### 1.1 基础语法

```css
selector {
    cursor: value;
}
```

### 1.2 常用鼠标样式值

| 属性值 | 效果描述 |
|--------|----------|
| `auto` | 浏览器根据当前上下文自动决定显示哪种光标（默认值） |
| `default` | 默认箭头光标 `↖` |
| `pointer` | 手型光标 `☝`，表示可点击链接 |
| `text` | I 型光标 `I`，表示可选中文本 |
| `wait` | 等待/加载中光标 `⏳` |
| `progress` | 进行中光标，带小沙漏 `⌛` |
| `move` | 移动光标 `✥`，表示可移动 |
| `help` | 帮助光标 `?` |
| `crosshair` | 十字准星光标 `＋` |
| `not-allowed` | 禁止光标 `🚫` |
| `zoom-in` | 放大镜光标 `🔍+` |
| `zoom-out` | 缩小镜光标 `🔍-` |
| `grab` | 抓手光标（可抓取状态）`✋` |
| `grabbing` | 抓手光标（正在抓取状态）`✊` |

### 1.3 示例代码

```css
/* 1. 链接悬停时显示手型 */
a:hover {
    cursor: pointer;
}

/* 2. 按钮禁用状态显示禁止图标 */
button.disabled {
    cursor: not-allowed;
}

/* 3. 可拖拽区域显示移动光标 */
.draggable {
    cursor: move;
}

/* 4. 提示信息区域显示帮助光标 */
.tooltip {
    cursor: help;
}

/* 5. 可缩放元素显示对应方向光标 */
.resize-e {
    cursor: ew-resize;      /* 东西向缩放 ↔️ */
}
.resize-n {
    cursor: n-resize;        /* 南北向缩放 ↕️ */
}
.resize-corner {
    cursor: nw-resize;       /* 对角线缩放 ↖️ */
}
```

### 1.4 使用自定义图片作为光标

```css
/* 语法：cursor: url('图片路径'), 备用光标; */
.custom-cursor {
    cursor: url('cursor.png') 0 0, auto;  /* 0 0 是热点的 x y 坐标 */
}

/* 支持多格式备选 */
.custom-cursor {
    cursor: url('cursor.cur'), url('cursor.png') 0 0, pointer;
}

/* 注意点：
 * - 推荐使用 .cur 或 .png 格式
 * - 图片大小建议 32x32 像素以内
 * - 必须指定至少一个备用的系统光标类型
 */
```

### 1.5 实际应用场景

```css
/* 场景1：文章阅读页面 - 段落区域显示文本选择光标 */
.article-content p {
    cursor: text;
}

/* 场景2：代码块区域显示代码光标 */
code, pre {
    cursor: text;
}

/* 场景3：可点击卡片效果 */
.card {
    cursor: pointer;
    transition: transform 0.2s;
}
.card:hover {
    transform: scale(1.02);
}

/* 场景4：强制显示默认箭头（覆盖其他样式） */
.clickable-area {
    cursor: default;
}
```

---

## 二、EJS 模板引擎详解

EJS（Embedded JavaScript Templates）是一个简单、高效的 JavaScript 模板引擎。在 Hexo 博客主题（如 Fluid、NexT）中，EJS 被广泛用于动态生成 HTML 页面。

### 2.1 什么是 EJS？

EJS 允许你在 HTML 中嵌入 JavaScript 代码，在服务端执行这些代码，最终生成纯 HTML 字符串返回给浏览器。

**核心特点：**
- 语法简单，学习曲线低
- 纯 JavaScript，无需学习新的模板语言
- 支持包含、继承等高级功能
- 在 Node.js 生态中使用广泛

### 2.2 基础语法

| 标签类型 | 语法 | 说明 |
|----------|------|------|
| 输出变量（转义） | `<%= variable %>` | 自动 HTML 转义，防止 XSS 攻击 |
| 输出变量（不转义） | `<%- variable %>` | 不转义，可以输出 HTML 标签 |
| 执行 JS 代码 | `<% code %>` | 运行 JavaScript 代码，不输出任何内容 |
| 注释 | `<%# comment %>` | 服务端注释，不会出现在生成的 HTML 中 |
| 包含其他文件 | `<%- include('path') %>` | 引入其他 EJS 模板文件 |
| 自定义分隔符 | `<? ... ?>` | 通过 `delimiter` 选项修改 |

### 2.3 基本示例

```ejs
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <!-- 输出变量 -->
    <h1><%= page.title %></h1>
    
    <!-- 不转义输出 HTML -->
    <div><%- contentHtml %></div>
    
    <!-- 条件判断 -->
    <% if (user.isAdmin) { %>
        <button>管理面板</button>
    <% } else { %>
        <button>普通用户面板</button>
    <% } %>
    
    <!-- 循环输出列表 -->
    <ul>
    <% posts.forEach(function(post) { %>
        <li>
            <a href="<%= post.url %>"><%= post.title %></a>
            <span class="date"><%= post.date %></span>
        </li>
    <% }); %>
    </ul>
    
    <!-- 自定义变量 -->
    <% 
        var className = 'active';
        var showButton = true;
    %>
    
    <div class="<%= className %>">
        <% if (showButton) { %>
            <button>点击</button>
        <% } %>
    </div>
</body>
</html>
```

### 2.4 Hexo + EJS 实战

在 Hexo 主题开发中，EJS 模板可以访问 Hexo 提供的丰富变量和辅助函数。

```ejs
<!-- Hexo 主题中的常见 EJS 模式 -->

<!-- 1. 获取站点配置 -->
<title><%= config.title %></title>
<meta name="description" content="<%= config.description %>">

<!-- 2. 获取页面/文章数据 -->
<h1 class="post-title"><%= page.title %></h1>
<div class="post-date">
    发布于：<%= date(page.date, 'YYYY-MM-DD') %>
</div>
<div class="post-content">
    <%- page.content %>
</div>

<!-- 3. 条件渲染（根据页面类型显示不同内容） -->
<% if (is_post()) { %>
    <div class="post-meta">
        文章作者：<%= page.author || config.author %>
    </div>
<% } else if (is_page()) { %>
    <div class="page-meta">
        最后更新：<%= date(page.updated, 'YYYY-MM-DD') %>
    </div>
<% } %>

<!-- 4. 遍历分类/标签 -->
<div class="post-categories">
    分类：
    <% if (page.categories && page.categories.length) { %>
        <% page.categories.forEach(function(cat) { %>
            <a href="<%= url_for(cat.path) %>"><%= cat.name %></a>
        <% }); %>
    <% } else { %>
        <span>未分类</span>
    <% } %>
</div>

<!-- 5. 使用 Hexo 辅助函数 -->
<a href="<%- url_for('/about') %>">关于我们</a>
<span><%- fragment_cache('footer', function(){ %>© 2024<%; }) %></span>
```

### 2.5 包含与组件化

EJS 支持通过 `include` 实现模板复用，这是主题开发的核心技巧。

```ejs
<!-- 主模板：layout.ejs -->
<!DOCTYPE html>
<html>
<head>
    <%- include('_partials/head', { title: page.title }) %>
    <%- css('css/style.css') %>
</head>
<body>
    <%- include('_partials/header') %>
    
    <main class="container">
        <%- body %>
    </main>
    
    <%- include('_partials/footer') %>
    
    <%- include('_partials/scripts') %>
</body>
</html>

<!-- 局部模板：_partials/header.ejs -->
<header class="site-header">
    <div class="logo">
        <a href="/"><%= config.title %></a>
    </div>
    <nav>
        <ul>
            <li><a href="/">首页</a></li>
            <li><a href="/archives">归档</a></li>
            <li><a href="/about">关于</a></li>
        </ul>
    </nav>
</header>

<!-- 传递数据的 include -->
<%- include('_partials/card', { 
    title: '文章标题',
    content: '这是卡片内容',
    showButton: true 
}) %>
```

### 2.6 EJS 常用模式与技巧

```ejs
<!-- 技巧1：防止变量未定义错误 -->
<% if (locals.someVariable) { %>
    <div><%= someVariable %></div>
<% } %>
<%= locals.someVariable || '默认值' %>

<!-- 技巧2：格式化日期 -->
<span><%= date(page.date, 'YYYY年MM月DD日') %></span>

<!-- 技巧3：限制字符串长度 -->
<p><%= post.excerpt.substring(0, 100) %><% if (post.excerpt.length > 100) { %>...<% } %></p>

<!-- 技巧4：生成 JSON 数据（用于前端 JavaScript） -->
<script>
    window.blogConfig = <%- JSON.stringify(config.theme_config) %>;
    window.postData = <%- JSON.stringify(page) %>;
</script>

<!-- 技巧5：条件 CSS 类 -->
<div class="post-item <%= post.featured ? 'featured' : '' %>">
    <!-- 内容 -->
</div>

<!-- 技巧6：在循环中使用索引 -->
<ul>
    <% posts.forEach(function(post, index) { %>
        <li data-index="<%= index %>">
            <%= index + 1 %>. <a href="<%= post.url %>"><%= post.title %></a>
        </li>
    <% }); %>
</ul>
```

### 2.7 Hexo 中的 EJS 变量参考

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `config` | Object | Hexo 站点配置（`_config.yml`） |
| `theme` | Object | 主题配置（`_config.fluid.yml`） |
| `page` | Object | 当前页面/文章的元数据 |
| `post` | Object | 文章数据（与 page 类似） |
| `site` | Object | 全站数据（包含所有文章、页面等） |
| `is_post()` | Function | 判断当前是否为文章页 |
| `is_page()` | Function | 判断当前是否为独立页面 |
| `is_home()` | Function | 判断当前是否为首页 |
| `is_archive()` | Function | 判断当前是否为归档页 |
| `url_for()` | Function | 生成站点相对路径 |
| `date()` | Function | 格式化日期 |
| `partial()` | Function | 引入局部模板（类似 include） |

### 2.8 调试技巧

```ejs
<!-- 调试1：直接输出变量查看结构 -->
<pre><%- JSON.stringify(page, null, 2) %></pre>

<!-- 调试2：条件输出调试信息 -->
<% if (hexo.env.debug) { %>
    <script>console.log(<%- JSON.stringify(page) %>);</script>
<% } %>

<!-- 调试3：使用 console.log（输出到终端而非页面） -->
<% console.log('当前页面类型:', page.layout) %>
<% console.log('文章数量:', site.posts.length) %>
```

---

## 三、综合应用：自定义 Fluid 注入组件

结合 CSS 鼠标样式和 EJS，在 Hexo 博客中创建一个自定义组件。

```ejs
<!-- 文件位置：source/_inject/custom-sidebar.ejs -->

<div class="custom-widget">
    <h3 class="widget-title">✨ 特别推荐</h3>
    <div class="widget-content">
        <ul>
            <% site.posts.slice(0, 5).forEach(function(post) { %>
                <li class="recommend-item">
                    <a href="<%- url_for(post.path) %>" class="post-link">
                        <%= post.title %>
                    </a>
                    <span class="post-date">
                        <%= date(post.date, 'MM-DD') %>
                    </span>
                </li>
            <% }); %>
        </ul>
    </div>
</div>

<style>
.custom-widget {
    margin-bottom: 20px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    transition: all 0.3s ease;
}

/* CSS 鼠标样式示例 */
.custom-widget:hover {
    cursor: pointer;
    background: #f0f0f0;
}

.recommend-item {
    cursor: pointer;
    transition: transform 0.2s;
}

.recommend-item:hover {
    cursor: pointer;
    transform: translateX(5px);
}

.post-link {
    cursor: pointer;
    text-decoration: none;
    color: #333;
}

.post-link:hover {
    cursor: pointer;
    color: #007acc;
}

.widget-title {
    cursor: default;
    margin-bottom: 10px;
    font-size: 1.2em;
}
</style>
```

---

## 四、资源与参考

- **CSS cursor 文档**：[MDN Web Docs - cursor](https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor)
- **EJS 官方文档**：[https://ejs.co](https://ejs.co)
- **Hexo 模板文档**：[https://hexo.io/zh-cn/docs/templates](https://hexo.io/zh-cn/docs/templates)
- **Fluid 主题文档**：[https://fluid-dev.github.io/hexo-fluid](https://fluid-dev.github.io/hexo-fluid)

---

通过 CSS 鼠标样式的灵活运用，你可以大幅提升网页的交互体验；而掌握 EJS 模板引擎，则能让你真正掌控 Hexo 主题的每一个细节。两者结合，足以打造出高度定制化的个人博客。