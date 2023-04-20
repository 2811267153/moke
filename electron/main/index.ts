// @ts-ignore
import { screen ,app, BrowserWindow, shell, ipcMain, Notification } from 'electron'

import { release } from 'node:os'
import { join } from 'node:path'
import * as path from 'path';


const Store = require("electron-store");
const store = new Store();
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
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {

  win = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden',
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    width: 1200,
    height: 700,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  // 启动 Service Worker
  // ServiceWorker.register(path.join(__dirname, 'service-worker.js'));
  console.log(path.join(__dirname));

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  console.log("tui chu ");
  win = null
  if (process.platform !== 'darwin') {
    store.store; // 保存数据到文件
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  console.log("da kai");
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation : false,

    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.on('setCookie', (e, cookie = "") => {
  //清楚上一次添加的cookie
  //设置新的cookie
  store.set("cookie", '')
  store.set("cookie", cookie)
})
ipcMain.on('getCookie', (e) => {
  const getCookie = store.get("cookie")
  e.sender.send('getCookie', {getCookie})
})
ipcMain.on("btn0", (e) => {
  win.close();
})
ipcMain.on("btn1", (e) => {
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
})
ipcMain.on("btn2", (e) => {
  win.minimize();
})

ipcMain.on("currentMusic", (e, data) => {
  store.set("currentMusic", [])
  store.set("currentMusic", data)
})
ipcMain.on("getCurrentMusic", (e) => {
  const currentMusic = store.get("currentMusic")
  e.sender.send("currentMusic", currentMusic)
})
ipcMain.on("setSongHistoryListData", (e, data: any) => {
  if(store.get("songHistoryListData")){
    store.set("songHistoryListData", [])
    store.set("songHistoryListData", data)
  }
  store.set("songHistoryListData", data)
})
ipcMain.on("getSongHistoryListData", (e) => {
  const songHistoryListData = store.get("songHistoryListData")
  e.sender.send("getsongHistoryList", songHistoryListData)
})
ipcMain.on("setSongplayingList", (e, data: any) => {
  if(store.get("setSongplayingList")){
    store.set("setSongplayingList", [])
    store.set("setSongplayingList", data)
  }
  store.set("setSongplayingList", data)
})
ipcMain.on("getSongplayingList", (e) => {
  const songHistoryListData = store.get("setSongplayingList")
  e.sender.send("getSongplayingListData", songHistoryListData)
})
ipcMain.on("setHistorySearchList", (e, data: any) => {
  if(store.get("setHistorySearchList")){
    store.set("setHistorySearchList", [])
    store.set("setHistorySearchList", data)
  }
  store.set("setHistorySearchList", data)
})
ipcMain.on("getHistorySearchList", (e) => {
  const songHistoryListData = store.get("setHistorySearchList")
  e.sender.send("getHistorySearchList", songHistoryListData)
})
//创建新窗口
let songsWindow = null;
function createSongsWindow(data) {
  let display = screen.getPrimaryDisplay()
  let width = display.bounds.width
  let height = display.bounds.height
  songsWindow = new BrowserWindow({

    width: 250,
    height: 70,
    x: width - 260,
    y: 30,
    frame: false,
    resizable: false,
    alwaysOnTop: true
  })



  songsWindow.loadFile(join( 'songs.html'))
  songsWindow.webContents.on('did-finish-load', () => {
    songsWindow.webContents.send('songsData', data)
  })

  songsWindow.on('closed', () => {
    songsWindow = null
  })
}
ipcMain.on('changeSongs', (event, data) => {
  if (!songsWindow) {
    createSongsWindow(data)
  } else {
    songsWindow.webContents.send('songsData', data)
  }
})