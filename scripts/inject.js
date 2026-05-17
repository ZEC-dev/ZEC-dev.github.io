
hexo.extend.filter.register('theme_inject', function(injects) {
    injects.head.raw('js',`<script defer src="https://cloud.umami.is/script.js" data-website-id="c32e9625-677e-42ce-9bc2-d09a84da3333"></script>`)
    // 只注入 CSS 样式，使用 raw() 方法
    injects.head.raw('custom-cursor', `
        <style>
            body {
                cursor: url('/img/mouse_main.png') 0 0, auto;
            }
            a:hover{cursor: url('/img/mouse_link.png') 0 0, pointer;}
        </style>
    `);
    injects.head.raw('CSS',`<link rel="stylesheet" href="/css/back.css">`);
});