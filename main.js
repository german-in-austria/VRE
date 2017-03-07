const electron = require('electron')
// Module to control application life.
const app = electron.app
// shell
const shell = electron.shell
// menu
const Menu = electron.Menu
const Tray = electron.Tray
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// default menus, to enable copy and paste in the mac app
const defaultMenu = require('electron-default-menu')
const client = require('electron-connect').client;
// require('electron-debug')({
//   showDevTools: true,
//   enabled : true
// })

const globalShortcut = electron.globalShortcut
app.commandLine.appendSwitch('ignore-certificate-errors', true);
app.commandLine.appendSwitch('allow-insecure-localhost');
app.commandLine.appendSwitch('unsafely-treat-insecure-origin-as-secure');

var AutoLaunch = require('auto-launch');
var dioeAutoLauncher = new AutoLaunch({
	name: 'DiÖ Desktop Client',
	path: '/Applications/dioe.app',
});

var autostart = false;

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

var electronInstaller = require('electron-winstaller');

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};

//dioeAutoLauncher.enable();

dioeAutoLauncher.isEnabled()
.then(function(isEnabled){
    if(isEnabled){
		return;
    }
    dioeAutoLauncher.enable();
	autostart = true;
})
.catch(function(err){
    // handle error 
});

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
	  "web-preferences": {
		  defaultFontFamily: "Lato",
		  defaultFontSitze: 14,
		    //added to run dioecloud in a webview
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
let tray = null
app.on('ready', function() {
  var menu = defaultMenu(app, shell)
  createWindow()
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  
  if(dioeAutoLauncher.isEnabled()) { autostart = true; }
  
  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+X', () => {
    app.quit()
  })

  if (!ret) {
    console.log('registration failed')
  }
  
  //let image = nativeImage.createFromPath(path.join(__dirname, 'img', 'icon.ico'));
  
  //add a tray
  /*tray = new Tray("app-icon.ico")
  const contextMenu = Menu.buildFromTemplate([
    {
		label: 'App Schließen', 
		accelerator: 'CommandOrControl+X', 
		click: function() {
			app.quit();
		}
	},
    {
		label: 'Autostart Off', 
		type: 'radio', 
		checked: !autostart,
		click: function() {
			if(dioeAutoLauncher.isEnabled()) {
				dioeAutoLauncher.enable();
			}
		}
	},
    {
		label: 'Autostart On', 
		type: 'radio',
		checked: autostart,
		click: function() {
			if(dioeAutoLauncher.isEnabled()) {
				dioeAutoLauncher.disable();
				autostart = false;
			}
		}
	}
  ])
  tray.setToolTip('DiÖ Desktop Client')
  tray.setContextMenu(contextMenu)
  
  tray.on('click', () => {
	//opens a new instance if the app was minimized to the tray
	if(mainWindow==null) {
		createWindow()
	}
  })
  
  /*if(dioeAutoLauncher.isEnabled()) {
	  autostart = !autostart;
  }*/
})

//added this line to load our dioecloud (otherwise it's not possible with self signed certificates)
app.commandLine.appendSwitch("ignore-certificate-errors");

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
	//app will minimize to tray and can be closed via tray option or the command+x shortcut
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
