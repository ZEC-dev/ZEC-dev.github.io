// 路径: /你的博客根目录/scripts/inject.js

hexo.extend.filter.register('theme_inject', function(injects) {
    
    // 只注入 CSS 样式，使用 raw() 方法
    injects.head.raw('custom-cursor', `
        <style>
            body {
                cursor: url('/img/mouse_main.png') 0 0, auto;
            }
            a:hover{cursor: url('/img/mouse_link.png') 0 0, pointer;}
        </style>
    `);
    
});