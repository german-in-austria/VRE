var installer = require('electron-winstaller');
var path      = require('path');
const dialog  = require('electron').dialog;
const pkg = require('./package.json');
const appName = pkg.productName;

console.log("packaging into a exe...\n");
resultPromise = installer.createWindowsInstaller({
    appDirectory: path.join(
	__dirname,
	'..',
	'installers',
	'win32-x64',
	`${appName}-win32-x64`
	),
    outputDirectory: path.join(
    __dirname,
    '..',
    'installers',
    'win32-x64-with-installer'
    ),
    exe:             'dioe_desktop_client.exe',
    setupExe:        'dioe_app.exe',
    noMsi:           true,
    iconUrl:         'app-icon.ico',
    setupIcon:       'app-icon.ico'
});

resultPromise.then(function () {
    console.log("Installer created");
    dialog.showMessageBox({
        type:    'info',
        title:   'electron-winstaller',
        message: "Installer created",
        buttons: ['ok']
    });
    require('electron').app.quit();
});