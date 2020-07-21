const electron = require('electron');
const {app, BrowserWindow} = electron;
const fs = require("fs");
const menu = electron.Menu;


var settingsPath;
if(process.platform === "win32") settingsPath = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("\\") + 1);
else settingsPath = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("/") + 1);

app.whenReady().then(async () => {
    menu.setApplicationMenu(menu.buildFromTemplate([]));
    const mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, minWidth: 750, minHeight: 470, webPreferences: {
        nodeIntegration: true
    }});

    var exists;
    await (async () => {fs.exists(settingsPath, e => {
        exists = e;
    });})();

    loadMain(mainWindow);
    // if(exists){
    //     loadMain(mainWindow);
    // }else{
    //     var hello = new BrowserWindow({width: 800, height: 600, frame: false, minWidth: 750, minHeight: 470, webPreferences: {
    //         nodeIntegration: true
    //     }});
    //     hello.loadFile('startup.html');
    //     hello.on('closed', () => {
    //         loadMain(mainWindow);
    //     });
    // }
});

const loadMain = mainWindow => {
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        app.quit();
    });
}