
// ==UserScript==
// @name         vscode VS Code插件市场下载（简洁版）
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  在 VS Code Marketplace vscode插件市场 页面右下角添加"下载最新版本"按钮，赋能到第三方IDE市场使用
// @author       qqlcx5
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @grant        GM_setClipboard
// @grant        GM_download
// @resource     fontAwesome https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544267/VS%20Code%E6%8F%92%E4%BB%B6%E5%B8%82%E5%9C%BA%EF%BC%88%E7%AE%80%E6%B4%81%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544267/VS%20Code%E6%8F%92%E4%BB%B6%E5%B8%82%E5%9C%BA%EF%BC%88%E7%AE%80%E6%B4%81%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加 Font Awesome 图标库
  function addFontAwesome() {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
  }

  // 等待页面加载完成
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
  } else {
      setTimeout(init, 1000);
  }

  function init() {
      // 添加 Font Awesome
      addFontAwesome();

      // 全局样式
      const style = document.createElement('style');
      style.textContent = `
          #vsc-downloader-container {
              position: fixed;
              bottom: 30px;
              right: 30px;
              z-index: 10000;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
          }

          #vsc-downloader-main-btn {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background: linear-gradient(135deg, #0078d4, #106ebe);
              color: white;
              border: none;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              transition: all 0.3s ease;
          }

          #vsc-downloader-main-btn:hover {
              transform: scale(1.05);
              box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
          }

          #vsc-downloader-menu {
              background: white;
              border-radius: 12px;
              box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
              margin-bottom: 15px;
              overflow: hidden;
              transform: scale(0);
              transform-origin: bottom right;
              opacity: 0;
              transition: all 0.3s ease;
              max-height: 0;
          }

          #vsc-downloader-menu.show {
              transform: scale(1);
              opacity: 1;
              max-height: 300px;
          }

          .vsc-menu-item {
              padding: 14px 20px;
              display: flex;
              align-items: center;
              gap: 12px;
              cursor: pointer;
              color: #323130;
              font-size: 14px;
              font-weight: 500;
              border: none;
              background: none;
              width: 100%;
              text-align: left;
              transition: background 0.2s;
          }

          .vsc-menu-item:hover {
              background: #f3f2f1;
          }

          .vsc-menu-item i {
              font-size: 16px;
              width: 20px;
          }

          .vsc-menu-divider {
              height: 1px;
              background: #edebe9;
              margin: 5px 0;
          }

          #vsc-downloader-msg {
              position: fixed;
              right: 24px;
              bottom: 100px;
              z-index: 10000;
              padding: 12px 18px;
              border-radius: 8px;
              font-size: 14px;
              color: #fff;
              background: #323130;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              opacity: 0;
              transition: opacity 0.3s;
              display: flex;
              align-items: center;
              gap: 8px;
          }

          #vsc-downloader-msg.show {
              opacity: 1;
          }

          #vsc-downloader-msg i {
              font-size: 16px;
          }

          #vsc-downloader-msg.success {
              background: #107c10;
          }

          #vsc-downloader-msg.error {
              background: #d13438;
          }

          #vsc-downloader-version {
              font-size: 12px;
              color: #605e5c;
              padding: 8px 16px;
              text-align: center;
              border-top: 1px solid #edebe9;
          }

          #vsc-custom-version-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 10001;
              opacity: 0;
              visibility: hidden;
              transition: all 0.3s;
          }

          #vsc-custom-version-modal.show {
              opacity: 1;
              visibility: visible;
          }

          #vsc-custom-version-dialog {
              background: white;
              border-radius: 8px;
              padding: 20px;
              width: 400px;
              max-width: 90%;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          #vsc-custom-version-dialog h3 {
              margin: 0 0 15px 0;
              font-size: 18px;
              color: #323130;
          }

          #vsc-custom-version-input {
              width: 100%;
              padding: 10px;
              border: 1px solid #edebe9;
              border-radius: 4px;
              margin-bottom: 15px;
              font-size: 14px;
          }

          #vsc-custom-version-input:focus {
              outline: none;
              border-color: #0078d4;
          }

          #vsc-custom-version-buttons {
              display: flex;
              justify-content: flex-end;
              gap: 10px;
          }

          #vsc-custom-version-buttons button {
              padding: 8px 16px;
              border-radius: 4px;
              border: none;
              cursor: pointer;
              font-size: 14px;
          }

          #vsc-custom-version-cancel {
              background: #f3f2f1;
              color: #323130;
          }

          #vsc-custom-version-download {
              background: #0078d4;
              color: white;
          }
      `;
      document.head.appendChild(style);

      // 工具：展示提示
      function showMessage(text, type = 'info', duration = 3000) {
          const msg = document.getElementById('vsc-downloader-msg') || (() => {
              const el = document.createElement('div');
              el.id = 'vsc-downloader-msg';
              document.body.appendChild(el);
              return el;
          })();

          // 设置图标
          let icon = 'info-circle';
          if (type === 'success') icon = 'check-circle';
          if (type === 'error') icon = 'exclamation-circle';

          msg.innerHTML = `<i class="fas fa-${icon}"></i> ${text}`;
          msg.className = '';
          msg.classList.add(type);
          msg.classList.add('show');

          setTimeout(() => msg.classList.remove('show'), duration);
      }

      // 从页面获取最新版本号
      function getLatestVersionFromPage() {
          try {
              // 尝试从版本历史表格获取版本号
              const versionCell = document.querySelector(
                  '.version-history-table-body .version-history-container-row:first-child .version-history-container-column:first-child'
              );

              if (versionCell) {
                  return versionCell.textContent.trim();
              }

              // 尝试从其他位置获取版本号
              const versionElements = document.querySelectorAll('[class*="version"]');
              for (const el of versionElements) {
                  const text = el.textContent.trim();
                  if (text.match(/^\d+\.\d+\.\d+/)) {
                      return text;
                  }
              }

              return null;
          } catch (error) {
              console.error('获取版本信息失败:', error);
              return null;
          }
      }

      // 创建自定义版本模态框
      function createCustomVersionModal(publisher, extension, itemName) {
          const modal = document.createElement('div');
          modal.id = 'vsc-custom-version-modal';

          const dialog = document.createElement('div');
          dialog.id = 'vsc-custom-version-dialog';

          dialog.innerHTML = `
              <h3>下载指定版本</h3>
              <input type="text" id="vsc-custom-version-input" placeholder="请输入版本号（如：1.0.0）">
              <div id="vsc-custom-version-buttons">
                  <button id="vsc-custom-version-cancel">取消</button>
                  <button id="vsc-custom-version-download">下载</button>
              </div>
          `;

          modal.appendChild(dialog);
          document.body.appendChild(modal);

          // 取消按钮事件
          document.getElementById('vsc-custom-version-cancel').addEventListener('click', () => {
              modal.classList.remove('show');
          });

          // 下载按钮事件
          document.getElementById('vsc-custom-version-download').addEventListener('click', () => {
              const version = document.getElementById('vsc-custom-version-input').value.trim();
              if (!version) {
                  showMessage('请输入版本号', 'error');
                  return;
              }

              modal.classList.remove('show');
              downloadCustomVersion(publisher, extension, itemName, version);
          });

          // 点击模态框背景关闭
          modal.addEventListener('click', (e) => {
              if (e.target === modal) {
                  modal.classList.remove('show');
              }
          });

          // 按回车键触发下载
          document.getElementById('vsc-custom-version-input').addEventListener('keypress', (e) => {
              if (e.key === 'Enter') {
                  document.getElementById('vsc-custom-version-download').click();
              }
          });

          return modal;
      }

      // 下载自定义版本
      function downloadCustomVersion(publisher, extension, itemName, version) {
          const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;

          // 显示开始下载的消息
          showMessage(`开始下载版本 ${version}`, 'info', 3000);

          // 使用GM_download如果可用，否则使用常规方法
          if (typeof GM_download !== 'undefined') {
              GM_download({
                  url: downloadUrl,
                  name: `${itemName}-${version}.vsix`,
                  onload: function() {
                      showMessage('下载完成', 'success');
                  },
                  onerror: function(error) {
                      showMessage('下载失败: ' + error.error, 'error');
                  }
              });
          } else {
              // 降级方案
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = `${itemName}-${version}.vsix`;
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              a.remove();
          }
      }

      // 主逻辑
      const urlParams = new URLSearchParams(window.location.search);
      const itemName = urlParams.get('itemName');
      if (!itemName) return;

      const parts = itemName.split('.');
      if (parts.length < 2) {
          console.error('Invalid itemName format');
          return;
      }

      const [publisher, extension] = parts;

      // 创建UI容器
      const container = document.createElement('div');
      container.id = 'vsc-downloader-container';
      document.body.appendChild(container);

      // 创建菜单
      const menu = document.createElement('div');
      menu.id = 'vsc-downloader-menu';
      container.appendChild(menu);

      // 获取最新版本号
      const latestVersion = getLatestVersionFromPage();

      // 添加版本信息
      if (latestVersion) {
          const versionInfo = document.createElement('div');
          versionInfo.id = 'vsc-downloader-version';
          versionInfo.textContent = `版本: ${latestVersion}`;
          menu.appendChild(versionInfo);
      }

      // 添加菜单项
      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'vsc-menu-item';
      downloadBtn.innerHTML = '<i class="fas fa-download"></i> 下载最新版本';
      menu.appendChild(downloadBtn);

      const copyLinkBtn = document.createElement('button');
      copyLinkBtn.className = 'vsc-menu-item';
      copyLinkBtn.innerHTML = '<i class="fas fa-link"></i> 复制下载链接';
      menu.appendChild(copyLinkBtn);

      // 添加自定义版本下载按钮
      const customVersionBtn = document.createElement('button');
      customVersionBtn.className = 'vsc-menu-item';
      customVersionBtn.innerHTML = '<i class="fas fa-code-branch"></i> 下载指定版本';
      menu.appendChild(customVersionBtn);

      // 添加分隔线
      const divider = document.createElement('div');
      divider.className = 'vsc-menu-divider';
      menu.appendChild(divider);

      // 添加打开IDE按钮
      const openIdeBtn = document.createElement('button');
      openIdeBtn.className = 'vsc-menu-item';
      openIdeBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> 在IDE中打开';
      menu.appendChild(openIdeBtn);

      // 创建主按钮
      const mainBtn = document.createElement('button');
      mainBtn.id = 'vsc-downloader-main-btn';
      mainBtn.innerHTML = '<i class="fas fa-download"></i>';
      container.appendChild(mainBtn);

      // 创建自定义版本模态框
      const customVersionModal = createCustomVersionModal(publisher, extension, itemName);

      // 切换菜单显示
      mainBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.classList.toggle('show');
      });

      // 点击页面其他地方关闭菜单
      document.addEventListener('click', (e) => {
          if (!container.contains(e.target)) {
              menu.classList.remove('show');
          }
      });

      // 下载功能
      downloadBtn.addEventListener('click', async () => {
          menu.classList.remove('show');

          try {
              let version = latestVersion;

              // 如果没有从页面获取到版本号，尝试再次获取
              if (!version) {
                  version = getLatestVersionFromPage();
                  if (!version) {
                      throw new Error('无法获取版本信息');
                  }
              }

              const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;

              // 使用GM_download如果可用，否则使用常规方法
              if (typeof GM_download !== 'undefined') {
                  GM_download({
                      url: downloadUrl,
                      name: `${itemName}-${version}.vsix`,
                      onload: function() {
                          showMessage('下载完成', 'success');
                      },
                      onerror: function(error) {
                          showMessage('下载失败: ' + error.error, 'error');
                      }
                  });
              } else {
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `${itemName}-${version}.vsix`;
                  a.style.display = 'none';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  showMessage('已开始下载', 'success');
              }
          } catch (err) {
              showMessage(err.message || '下载失败', 'error');
          }
      });

      // 复制下载链接
      copyLinkBtn.addEventListener('click', async () => {
          menu.classList.remove('show');

          try {
              let version = latestVersion;

              // 如果没有从页面获取到版本号，尝试再次获取
              if (!version) {
                  version = getLatestVersionFromPage();
                  if (!version) {
                      throw new Error('无法获取版本信息');
                  }
              }

              const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;

              // 使用GM_setClipboard如果可用，否则使用常规方法
              if (typeof GM_setClipboard !== 'undefined') {
                  GM_setClipboard(downloadUrl);
                  showMessage('下载链接已复制到剪贴板', 'success');
              } else {
                  navigator.clipboard.writeText(downloadUrl).then(() => {
                      showMessage('下载链接已复制到剪贴板', 'success');
                  }).catch(() => {
                      // 降级方案
                      const textArea = document.createElement('textarea');
                      textArea.value = downloadUrl;
                      textArea.style.position = 'fixed';
                      document.body.appendChild(textArea);
                      textArea.focus();
                      textArea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textArea);
                      showMessage('下载链接已复制到剪贴板', 'success');
                  });
              }
          } catch (err) {
              showMessage(err.message || '复制失败', 'error');
          }
      });

      // 自定义版本下载
      customVersionBtn.addEventListener('click', () => {
          menu.classList.remove('show');
          customVersionModal.classList.add('show');
          // 自动聚焦到输入框
          setTimeout(() => {
              document.getElementById('vsc-custom-version-input').focus();
          }, 100);
      });

      // 在IDE中打开
      openIdeBtn.addEventListener('click', () => {
          menu.classList.remove('show');

          try {
              // 尝试使用vscode://协议打开
              const vscodeUrl = `vscode://extension/${publisher}/${extension}`;
              window.location.href = vscodeUrl;

              // 如果协议处理失败，3秒后显示提示
              setTimeout(() => {
                  showMessage('未检测到IDE支持，尝试手动安装下载的扩展', 'info', 5000);
              }, 3000);
          } catch (err) {
              showMessage('打开IDE失败: ' + err.message, 'error');
          }
      });
  }
})();

