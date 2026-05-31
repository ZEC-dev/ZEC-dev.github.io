---
title: 文件托管生成器
tags:
  - javascript
categories: WEB
date: 2026-05-17 16:58:12
---
文件托管&&index.html生成器
<!-- more -->
~~DS写的~~
开发服务器（node.js）
```javascript
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import moment from 'moment';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 生成目录索引HTML
async function generateDirectoryIndex(dirPath, requestPath) {
    const items = await fs.readdir(dirPath);
    const rows = [];

    // 添加返回上级目录的链接（如果不是根目录）
    if (requestPath !== '/') {
        rows.push(`
      <tr>
        <td><a href="../">../</a></td>
        <td>-</td>
        <td>-</td>
      </tr>
    `);
    }

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);
        const isDirectory = stat.isDirectory();
        const itemName = isDirectory ? `${item}/` : item;
        const itemPath = path.join(requestPath, item);

        const size = isDirectory ? '-' : formatFileSize(stat.size);
        const modifiedTime = moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss');

        rows.push(`
      <tr>
        <td><a href="${itemPath}">${itemName}</a></td>
        <td>${modifiedTime}</td>
        <td>${size}</td>
      </tr>
    `);
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Index of ${requestPath}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          line-height: 1.6;
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
          color: #333;
        }
        h1 { font-size: 1.8rem; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #eaecef; }
        th { background-color: #f6f8fa; font-weight: 600; }
        tr:hover { background-color: #f6f8fa; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .footer { margin-top: 30px; font-size: 0.8rem; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <h1>Index of ${requestPath}</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>Last Modified</th><th>Size</th></tr>
        </thead>
        <tbody>
          ${rows.join('')}
        </tbody>
      </table>
      <div class="footer">Powered by Node.js</div>
    </body>
    </html>
  `;
}

// 辅助函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 中间件：处理静态文件或目录索引
app.use(async (req, res) => {
    const filePath = path.join(__dirname, 'public', req.path);

    try {
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            // 如果是目录，生成索引页面
            const html = await generateDirectoryIndex(filePath, req.path);
            res.send(html);
        } else {
            // 如果是文件，直接返回
            res.sendFile(filePath);
        }
    } catch (error) {
        // 文件不存在或其他错误
        res.status(404).send('File not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Serve files from ./public directory');
});
```
生成器
```javascript
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import moment from 'moment';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const OUTPUT_DIR = path.join(__dirname, 'html');

// 辅助函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 生成目录索引HTML（与服务器风格完全一致）
async function generateDirectoryIndex(dirPath, requestPath) {
    const items = await fs.readdir(dirPath);
    const rows = [];

    // 添加返回上级目录的链接（如果不是根目录）
    if (requestPath !== '/') {
        rows.push(`
      <tr>
        <td><a href="../">../</a></td>
        <td>-</td>
        <td>-</td>
      </tr>
    `);
    }

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);
        const isDirectory = stat.isDirectory();
        const itemName = isDirectory ? `${item}/` : item;
        const itemPath = path.join(requestPath, item);

        const size = isDirectory ? '-' : formatFileSize(stat.size);
        const modifiedTime = moment(stat.mtime).format('YYYY-MM-DD HH:mm:ss');

        rows.push(`
      <tr>
        <td><a href="${itemPath}">${escapeHtml(itemName)}</a></td>
        <td>${modifiedTime}</td>
        <td>${size}</td>
      </tr>
    `);
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Index of ${requestPath}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          line-height: 1.6;
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
          color: #333;
        }
        h1 { font-size: 1.8rem; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #eaecef; }
        th { background-color: #f6f8fa; font-weight: 600; }
        tr:hover { background-color: #f6f8fa; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .footer { margin-top: 30px; font-size: 0.8rem; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <h1>Index of ${requestPath}</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>Last Modified</th><th>Size</th></tr>
        </thead>
        <tbody>
          ${rows.join('')}
        </tbody>
      </table>
      <div class="footer">Powered by Node.js | Static Generated</div>
    </body>
    </html>
  `;
}

// HTML转义函数（防止XSS攻击）
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 递归处理目录并生成HTML文件
async function processDirectory(dirPath, outputPath, webPath) {
    // 创建输出目录
    await fs.mkdir(outputPath, { recursive: true });
    
    // 生成当前目录的索引HTML
    const html = await generateDirectoryIndex(dirPath, webPath);
    const indexPath = path.join(outputPath, 'index.html');
    await fs.writeFile(indexPath, html, 'utf-8');
    console.log(`✓ 生成: ${webPath || '/'} -> ${indexPath}`);
    
    // 处理子目录和文件
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = await fs.stat(itemPath);
        const itemOutputPath = path.join(outputPath, item);
        const itemWebPath = webPath === '/' ? `/${item}` : `${webPath}/${item}`;
        
        if (stat.isDirectory()) {
            // 递归处理子目录
            await processDirectory(itemPath, itemOutputPath, itemWebPath);
        } else {
            // 复制文件到输出目录（保留原文件）
            const fileOutputPath = itemOutputPath;
            const fileDir = path.dirname(fileOutputPath);
            await fs.mkdir(fileDir, { recursive: true });
            await fs.copyFile(itemPath, fileOutputPath);
            console.log(`✓ 复制文件: ${itemWebPath}`);
        }
    }
}

// 清理输出目录
async function cleanOutputDir() {
    try {
        await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
        console.log('✓ 清理输出目录');
    } catch (error) {
        // 目录不存在时忽略错误
    }
}

// 主函数
async function main() {
    console.log('🚀 开始生成静态网站...\n');
    
    // 检查public目录是否存在
    try {
        await fs.access(PUBLIC_DIR);
    } catch (error) {
        console.error('❌ public 目录不存在！请先创建 public 目录并放入文件。');
        process.exit(1);
    }
    
    // 清理并重建输出目录
    await cleanOutputDir();
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // 开始处理
    await processDirectory(PUBLIC_DIR, OUTPUT_DIR, '/');
    
    console.log('\n✨ 静态网站生成完成！');
    console.log(`📁 输出目录: ${OUTPUT_DIR}`);
    console.log('\n🌐 可以使用以下命令预览：');
    console.log('   npx serve html');
    console.log('   python -m http.server --directory html 8080');
    console.log('   cd html && php -S localhost:8000');
}

// 运行
main().catch(console.error);
```
依赖如下
`express`和`moment`