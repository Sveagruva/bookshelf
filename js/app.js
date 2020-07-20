const electron = require('electron');
const {app, BrowserWindow, fs} = electron;
const menu = electron.Menu;

app.whenReady().then(() => {
    menu.setApplicationMenu(menu.buildFromTemplate([]));
    
    const mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, minWidth: 750, minHeight: 470, webPreferences: {
        nodeIntegration: true
    }});
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        app.quit();
    });
});