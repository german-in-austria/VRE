const electron = require('electron')
// Module to control application life.
const app = electron.app
// shell
const shell = electron.shell
// menu
const Menu = electron.Menu
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// default menus, to enable copy and paste in the mac app
const defaultMenu = require('electron-default-menu')
const client = require('electron-connect').client;
// require('electron-debug')({
//   showDevTools: true,
//   enabled : true
// })
app.commandLine.appendSwitch('ignore-certificate-errors', true);
app.commandLine.appendSwitch('allow-insecure-localhost');
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth : 600,
    minHeight : 400,
    acceptFirstMouse : true,
    // titleBarStyle : 'hidden-inset',
    minimumFontSize : 6,
	  webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
		  defaultFontFamily: "Lato",
		  defaultFontSize: 14,
      contextIsolation: false,
		  allowDisplayInsecureContent: true
	  }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  var menu = defaultMenu(app, shell)
  createWindow()
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
})

//added this line to load our dioecloud (otherwise it's not possible with self signed certificates)
app.commandLine.appendSwitch("ignore-certificate-errors");

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
