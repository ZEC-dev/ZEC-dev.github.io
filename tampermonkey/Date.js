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
    const pageLoadTime = new Date();
    
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
        let isDragging = false;
        let startX, startY, initialX, initialY;
        function getPageOpenTime() {
            const now = new Date();
            const diff = now - pageLoadTime;
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            if (hours > 0) {
                return `${hours}时${minutes}分${seconds}秒`;
            } else if (minutes > 0) {
                return `${minutes}分${seconds}秒`;
            } else {
                return `${seconds}秒`;
            }
        }
        
        function update() {
            const now = new Date();
            const time = now.toLocaleTimeString();
            const date = now.toLocaleDateString();
            const openTime = getPageOpenTime();
            
            infobox.innerHTML = `
                <div style="margin-bottom: 5px;">🕒 当前时间: ${time}</div>
                <div style="margin-bottom: 5px;">📅 当前日期: ${date}</div>
                <div style="margin-bottom: 5px;">⏱️ 网页打开: ${openTime}</div>
                <div style="font-size: 10px; opacity: 0.7;">拖动我 | 双击关闭</div>
            `;
        }
        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = infobox.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            infobox.style.cursor = 'grabbing';
            infobox.style.opacity = '0.8';
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
            
            e.preventDefault();
        }
        
        function onDrag(e) {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            infobox.style.right = 'auto';
            infobox.style.left = (initialX + dx) + 'px';
            infobox.style.top = (initialY + dy) + 'px';
        }
        
        function stopDrag() {
            isDragging = false;
            infobox.style.cursor = 'move';
            infobox.style.opacity = '1';
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        }
        function handleDoubleClick() {
            infobox.style.transition = 'all 0.5s ease';
            infobox.style.opacity = '0';
            infobox.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (infobox.parentNode) {
                    infobox.parentNode.removeChild(infobox);
                }
            }, 500);
        }
        infobox.addEventListener('mousedown', startDrag);
        infobox.addEventListener('dblclick', handleDoubleClick);
        
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
