const { app, BrowserWindow, ipcMain, shell } = require('electron');
const http = require('http');
const path = require('path');

// 配置
const CONFIG = {
  httpPort: 18790,
  windowWidth: 1400,
  windowHeight: 900
};

let mainWindow = null;
let httpServer = null;

// 创建主窗口
function createWindow() {
  if (mainWindow) {
    // 窗口已存在，聚焦并显示
    mainWindow.show();
    mainWindow.focus();
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    return mainWindow;
  }

  mainWindow = new BrowserWindow({
    width: CONFIG.windowWidth,
    height: CONFIG.windowHeight,
    minWidth: 1000,
    minHeight: 700,
    title: '创世者编辑器 - 镜像囚笼',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    show: false, // 先隐藏，加载完成后再显示
    backgroundColor: '#1a1a2e'
  });

  // 加载本地HTML文件
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // 开发工具（开发模式时开启）
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // 窗口准备好后显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // 窗口关闭时不清空引用，只是隐藏（保持HTTP服务运行）
  mainWindow.on('close', (event) => {
    // macOS上只是隐藏，不退出
    if (process.platform === 'darwin') {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // 真正关闭时清理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

// 创建HTTP服务器监听远程启动请求
function createHttpServer() {
  httpServer = http.createServer((req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // 只处理POST请求到 /api/open
    if (req.method === 'POST' && req.url === '/api/open') {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          console.log('[HTTP] Received request:', data);

          // 处理打开请求
          if (data.action === 'open_creator') {
            // 在主线程中创建/显示窗口
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
              if (mainWindow.isMinimized()) {
                mainWindow.restore();
              }
              // 通知渲染进程
              mainWindow.webContents.send('menu-triggered', data);
            } else {
              createWindow();
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: true, 
              message: 'Window opened',
              timestamp: Date.now()
            }));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: false, 
              message: 'Unknown action' 
            }));
          }
        } catch (err) {
          console.error('[HTTP] Error parsing request:', err);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            message: 'Invalid JSON' 
          }));
        }
      });
    } else if (req.method === 'GET' && req.url === '/health') {
      // 健康检查端点
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'ok', 
        service: 'novel-editor-creator',
        version: '1.0.0'
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        success: false, 
        message: 'Not found' 
      }));
    }
  });

  httpServer.listen(CONFIG.httpPort, '127.0.0.1', () => {
    console.log(`[HTTP] Server running at http://127.0.0.1:${CONFIG.httpPort}`);
    console.log(`[HTTP] Health check: http://127.0.0.1:${CONFIG.httpPort}/health`);
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[HTTP] Port ${CONFIG.httpPort} is already in use`);
      // 端口被占用时尝试连接检查是否是另一个实例
      checkExistingInstance();
    } else {
      console.error('[HTTP] Server error:', err);
    }
  });
}

// 检查是否已有实例在运行
function checkExistingInstance() {
  const http = require('http');
  const options = {
    hostname: '127.0.0.1',
    port: CONFIG.httpPort,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.service === 'novel-editor-creator') {
          console.log('[App] Another instance is already running, sending open request...');
          // 向已有实例发送打开请求
          sendOpenRequest();
          // 退出当前实例
          setTimeout(() => app.quit(), 500);
        }
      } catch (e) {
        console.error('[App] Unexpected response from health check');
      }
    });
  });

  req.on('error', () => {
    console.error('[App] Port in use but no response from health check');
  });

  req.end();
}

// 发送打开请求到已有实例
function sendOpenRequest() {
  const http = require('http');
  const data = JSON.stringify({ action: 'open_creator', timestamp: Date.now() });
  
  const options = {
    hostname: '127.0.0.1',
    port: CONFIG.httpPort,
    path: '/api/open',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    console.log('[App] Open request sent to existing instance, status:', res.statusCode);
  });

  req.on('error', (err) => {
    console.error('[App] Failed to send open request:', err);
  });

  req.write(data);
  req.end();
}

// 应用启动
app.whenReady().then(() => {
  createHttpServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      // 显示已有窗口
      const win = BrowserWindow.getAllWindows()[0];
      win.show();
      win.focus();
    }
  });
});

// 所有窗口关闭时
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (httpServer) {
      httpServer.close();
    }
    app.quit();
  }
});

// 防止多开（通过单一实例锁）
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log('[App] Another instance is already running');
  // 尝试唤醒已有实例
  checkExistingInstance();
  setTimeout(() => app.quit(), 1000);
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时，聚焦到第一个实例的窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// IPC处理
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});
