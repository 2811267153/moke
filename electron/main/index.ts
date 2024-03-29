// @ts-ignore
import electron, { screen, app, BrowserWindow, shell, ipcMain, Menu, Tray } from 'electron';

import { release } from 'node:os';
import { join } from 'node:path';

import * as path from 'path';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
let tray = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
  // 创建主窗口（如果它被销毁）
  win = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden',
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width: 1200,
    height: 700,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
      // sandbox: true
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
    win.webContents.openDevTools();
  }
  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  const trayIconPath = path.join(app.isPackaged ? `${process.resourcesPath}build/icon.ico` : __dirname, '../../build/icon.ico');

  tray = new Tray(trayIconPath);
  tray.setToolTip('简音乐-让音乐更简单');
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: '打开',
      click: () => {
        win.show();
      }
    }, {
      label: '退出',
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.on('click', () => {
    win.show();
  });
  tray.on('right-click', () => {
    tray.popUpContextMenu(trayContextMenu);
  });

  tray.on('click', () => {
    // 显示已创建的主窗口
    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});


ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
      // sandbox: true
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.on('btn0', (e, type: string) => {

  if (type === '') {
    win.close();
  } else {
    win.hide();
  }
});
ipcMain.on('btn2', (e) => {
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});
ipcMain.on('btn1', (e) => {
  win.minimize();
});

ipcMain.on("getStaticResourcePath", () => {
  if (app.isPackaged){
    win?.webContents.send('message-channel', `${process.resourcesPath}/`);
  }else {
    win?.webContents.send('message-channel', '../../build');
  }
})
//创建新窗口
let songsWindow = null;

function createSongsWindow(data) {
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;
  songsWindow = new BrowserWindow({

    width: 250,
    height: 70,
    x: width - 260,
    y: 30,
    frame: false,
    resizable: false,
    alwaysOnTop: true
  });

  songsWindow.loadFile(join('songs.html'));
  songsWindow.webContents.on('did-finish-load', () => {
    songsWindow.webContents.send('songsData', data);
  });

  songsWindow.on('closed', () => {
    songsWindow = null;
  });
}

ipcMain.on('changeSongs', (event, data) => {
  if (!songsWindow) {
    createSongsWindow(data);
  } else {
    songsWindow.webContents.send('songsData', data);
  }
});