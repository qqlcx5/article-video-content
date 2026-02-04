// ==UserScript==
// @name         VS Code 插件市场下载助手 (Ultimate)
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  在 VS Code 插件市场页面添加下载按钮。零依赖，内联 SVG，自动检测版本，支持拖拽和剪贴板。
// @author       BestMinds
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // =========================================================================
  // 1. CONSTANTS & ASSETS (样式与图标)
  // =========================================================================
  const COLORS = {
      primary: '#0078d4',
      hover: '#106ebe',
      bg: '#ffffff',
      text: '#323130',
      shadow: 'rgba(0,0,0,0.15)'
  };

  const ICONS = {
      download: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 11.5l-5-5h3V1h4v5.5h3L8 11.5zM8 12.5c-2.5 0-4.5 2-4.5 4.5h9c0-2.5-2-4.5-4.5-4.5z"/></svg>`,
      copy: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 4h7v2H4V4zm0 3h7v2H4V7zm0 3h5v2H4v-2z"/><path d="M12 1H3a1 1 0 00-1 1v12a1 1 0 001 1h9a1 1 0 001-1V2a1 1 0 00-1-1zm0 13H3V2h9v12z"/></svg>`,
      ide: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M14 2H2a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1zM2 13V3h12v10H2z"/><path d="M4 5l4 3-4 3V5z"/></svg>`,
      version: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13a6 6 0 110-12 6 6 0 010 12zm-.5-6V4h1v4.5l3 1.5-.5.8-3.5-1.8z"/></svg>`
  };

  // =========================================================================
  // 2. CORE UTILS (核心逻辑)
  // =========================================================================
  const Utils = {
      getParams: () => {
          const params = new URLSearchParams(window.location.search);
          const itemName = params.get('itemName');
          if (!itemName || !itemName.includes('.')) return null;
          const [publisher, extension] = itemName.split('.');
          return { publisher, extension, itemName };
      },

      // --- 核心修复：更强健的版本获取逻辑 ---
      getVersion: () => {
          try {
              // 方法 1: 侧边栏元数据扫描 (Text-based search)
              // 遍历所有可能是 Label 的元素，找到内容为 "Version" 的，取其兄弟节点
              const cells = document.querySelectorAll('.meta-data-list-cell, td');
              for (let cell of cells) {
                  if (cell.textContent.trim() === 'Version') {
                      const valueNode = cell.nextElementSibling;
                      if (valueNode && /^\d+\.\d+\.\d+$/.test(valueNode.textContent.trim())) {
                          return valueNode.textContent.trim();
                      }
                  }
              }

              // 方法 2: 尝试找版本历史表格的第一行 (即使它还没完全显示)
              const historyVer = document.querySelector('.version-history-container-row:first-child .version-history-container-column:first-child');
              if (historyVer && /^\d+\.\d+\.\d+$/.test(historyVer.textContent.trim())) {
                  return historyVer.textContent.trim();
              }

              // 方法 3: 尝试从页面 Title 或 Meta 标签获取 (备用)
              // 有时候 script 标签里会有 json 数据
              const scriptTags = document.querySelectorAll('script[type="application/json"]');
              for (let script of scriptTags) {
                  if (script.textContent.includes('"Version":"')) {
                      const match = script.textContent.match(/"Version":"(\d+\.\d+\.\d+)"/);
                      if (match) return match[1];
                  }
              }
          } catch (e) {
              console.error('版本检测出错:', e);
          }
          return null;
      },

      getDownloadUrl: (pub, ext, ver) => {
          return `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${pub}/vsextensions/${ext}/${ver}/vspackage`;
      },

      copyToClipboard: (text) => {
          if (typeof GM_setClipboard !== 'undefined') {
              GM_setClipboard(text);
              return Promise.resolve();
          }
          return navigator.clipboard.writeText(text);
      },

      download: (url, name) => {
          if (typeof GM_download !== 'undefined') {
              GM_download({ url, name, saveAs: true });
          } else {
              const a = document.createElement('a');
              a.href = url;
              a.download = name;
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              setTimeout(() => a.remove(), 1000);
          }
      },

      toast: (msg, type = 'info') => {
          const existing = document.querySelector('.vsc-toast');
          if (existing) existing.remove();

          const el = document.createElement('div');
          el.className = `vsc-toast vsc-toast-${type}`;
          el.innerHTML = msg; // 允许 HTML
          document.body.appendChild(el);
          el.offsetHeight; // 强制重绘
          el.classList.add('show');
          setTimeout(() => {
              el.classList.remove('show');
              setTimeout(() => el.remove(), 300);
          }, 3000);
      }
  };

  // =========================================================================
  // 3. UI RENDERER (视图层)
  // =========================================================================
  function injectStyles() {
      const css = `
          #vsc-dl-container {
              position: fixed;
              bottom: 40px;
              right: 40px;
              z-index: 9999;
              font-family: "Segoe UI", system-ui, sans-serif;
              display: flex;
              flex-direction: column-reverse;
              align-items: flex-end;
          }
          #vsc-fab {
              width: 56px;
              height: 56px;
              border-radius: 28px;
              background: ${COLORS.primary};
              color: #fff;
              border: none;
              cursor: pointer;
              box-shadow: 0 4px 12px ${COLORS.shadow};
              transition: transform 0.2s, box-shadow 0.2s;
              display: flex;
              align-items: center;
              justify-content: center;
          }
          #vsc-fab:hover {
              transform: scale(1.05);
              box-shadow: 0 6px 16px rgba(0,0,0,0.25);
              background: ${COLORS.hover};
          }
          #vsc-menu {
              background: ${COLORS.bg};
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              padding: 8px 0;
              width: 230px;
              transform-origin: bottom right;
              transform: scale(0.9) translateY(10px);
              opacity: 0;
              pointer-events: none;
              transition: all 0.2s ease;
              border: 1px solid #e1dfdd;
              position: absolute;
              bottom: 70px;
              right: 0;
          }
          #vsc-menu.visible {
              transform: scale(1) translateY(0);
              opacity: 1;
              pointer-events: auto;
          }
          .vsc-item {
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 10px 16px;
              color: ${COLORS.text};
              cursor: pointer;
              font-size: 14px;
              user-select: none;
          }
          .vsc-item:hover { background: #f3f2f1; }
          .vsc-divider { height: 1px; background: #edebe9; margin: 6px 0; }
          .vsc-version-info {
              font-size: 12px;
              color: #605e5c;
              padding: 8px 16px;
              border-bottom: 1px solid #edebe9;
              background: #faf9f8;
              border-radius: 8px 8px 0 0;
          }
          .vsc-version-warn { color: #a4262c; font-weight: bold; }
          .vsc-toast {
              position: fixed; top: 20px; left: 50%;
              transform: translateX(-50%) translateY(-20px);
              background: #323130; color: #fff;
              padding: 10px 20px; border-radius: 4px;
              font-size: 13px; opacity: 0; transition: all 0.3s;
              z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          .vsc-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
          .vsc-toast-success { background: #107c10; }
      `;
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
  }

  function createUI(meta) {
      const container = document.createElement('div');
      container.id = 'vsc-dl-container';

      const fab = document.createElement('button');
      fab.id = 'vsc-fab';
      fab.innerHTML = ICONS.download;

      const menu = document.createElement('div');
      menu.id = 'vsc-menu';

      // 状态变量
      let currentVersion = null;

      // 渲染菜单内容的函数
      const updateMenuContent = () => {
          const displayVer = currentVersion || '<span class="vsc-version-warn">检测中...</span>';
          menu.innerHTML = `
              <div class="vsc-version-info">
                  当前版本: <b>${displayVer}</b>
              </div>
              <div class="vsc-item" id="btn-dl-direct">
                  ${ICONS.download} <span>下载 .vsix</span>
              </div>
              <div class="vsc-item" id="btn-copy-link">
                  ${ICONS.copy} <span>复制链接</span>
              </div>
              <div class="vsc-divider"></div>
              <div class="vsc-item" id="btn-dl-custom">
                  ${ICONS.version} <span>手动输入版本...</span>
              </div>
              <div class="vsc-item" id="btn-open-ide">
                  ${ICONS.ide} <span>IDE 打开</span>
              </div>
          `;
          bindEvents();
      };

      const bindEvents = () => {
          const $ = s => menu.querySelector(s);

          // 辅助：获取有效版本或提示
          const getValidVer = () => {
              if (currentVersion) return currentVersion;
              const manual = prompt('未检测到版本号，请手动输入 (如 1.0.0):');
              return manual ? manual.trim() : null;
          };

          $('#btn-dl-direct').onclick = () => {
              const ver = getValidVer();
              if (!ver) return;
              const url = Utils.getDownloadUrl(meta.publisher, meta.extension, ver);
              Utils.toast(`正在下载 v${ver}...`, 'success');
              Utils.download(url, `${meta.publisher}.${meta.extension}-${ver}.vsix`);
          };

          $('#btn-copy-link').onclick = () => {
              const ver = getValidVer();
              if (!ver) return;
              const url = Utils.getDownloadUrl(meta.publisher, meta.extension, ver);
              Utils.copyToClipboard(url).then(() => Utils.toast('链接已复制'));
          };

          $('#btn-dl-custom').onclick = () => {
              const ver = prompt('输入要下载的版本号:', currentVersion || '');
              if (ver) {
                  const url = Utils.getDownloadUrl(meta.publisher, meta.extension, ver);
                  Utils.download(url, `${meta.publisher}.${meta.extension}-${ver}.vsix`);
              }
          };

          $('#btn-open-ide').onclick = () => {
              window.location.href = `vscode:extension/${meta.publisher}.${meta.extension}`;
          };
      };

      // 首次尝试获取版本
      currentVersion = Utils.getVersion();
      updateMenuContent();

      // 交互逻辑
      let isMenuOpen = false;
      fab.addEventListener('click', (e) => {
          e.stopPropagation();
          isMenuOpen = !isMenuOpen;

          // 关键逻辑：每次打开菜单时，如果版本还是空的，再次尝试获取
          // 这样即使页面是异步加载的，用户点开时也能拿到最新数据
          if (!currentVersion) {
              currentVersion = Utils.getVersion();
              updateMenuContent();
          }

          menu.classList.toggle('visible', isMenuOpen);
      });

      document.addEventListener('click', (e) => {
          if (isMenuOpen && !container.contains(e.target)) {
              isMenuOpen = false;
              menu.classList.remove('visible');
          }
      });

      // 观察页面变化 (Observer)，应对慢速加载
      const observer = new MutationObserver(() => {
          if (!currentVersion) {
              const ver = Utils.getVersion();
              if (ver) {
                  currentVersion = ver;
                  updateMenuContent(); // 找到版本后更新UI，但不自动弹出菜单
                  // 找到后可以停止观察，节省性能
                  // observer.disconnect();
              }
          }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      container.appendChild(menu);
      container.appendChild(fab);
      document.body.appendChild(container);
  }

  function init() {
      const meta = Utils.getParams();
      if (!meta) return;
      injectStyles();
      createUI(meta);
  }

  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
  } else {
      init();
  }
})();
