// ==UserScript==
// @name         实时时间
// @namespace    https://ZEC-dev.github.io
// @version      1.0.0
// @description  实时时间
// @author       ZEC-dev
// @homepage     https://ZEC-dev.github.io
// @icon         https://ZEC-dev.github.io/img/ico.ico
// @license      MIT

// @match        *://*/*
// ==/UserScript==

(function () {
    'use strict';
    
    function Create() {
        const infobox = document.createElement('div');
        Object.assign(infobox.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(40, 44, 52, 0.95)',
            color: '#61dafb',
            padding: '12px 18px',
            borderRadius: '25px',
            fontFamily: 'Monaco, Consolas, monospace',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            zIndex: '10000',
            border: '1px solid rgba(97, 218, 251, 0.3)',
            maxWidth: '280px',
            textAlign: 'center',
            lineHeight: '1.4',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            cursor: 'move',
            userSelect: 'none'
        });
        
        function update() {
            const now = new Date();
            const time = now.toLocaleTimeString();
            const date = now.toLocaleDateString();
            infobox.innerHTML = `
                <div style="margin-bottom: 5px;">时间: ${time}</div>
                <div>日期: ${date}</div>
            `;
        }
        
        update();
        
        setInterval(update, 1000);
        document.body.appendChild(infobox);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', Create);
    } else {
        Create();
    }
})();
