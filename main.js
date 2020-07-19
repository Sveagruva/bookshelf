const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');
const menu = electron.Menu;

app.whenReady().then(() => {
    menu.setApplicationMenu(menu.buildFromTemplate([]));

    const mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
  
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
})

app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
    app.quit();
})