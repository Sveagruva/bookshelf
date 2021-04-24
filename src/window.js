const Localshortcut = require('electron-localshortcut');
const electron = require('electron');

module.exports = class {
    constructor(){
        const browserWindow = new electron.BrowserWindow({
            width: 800,
            height: 600,
            minWidth: 750,
            minHeight: 470,
            webPreferences: {
                nodeIntegration: false,
                enableRemoteModule: false
            }
        });

        browserWindow.on('closed', electron.app.quit);

        if (process.env.NODE_ENV === 'debug')
            browserWindow.webContents.openDevTools();

        Localshortcut.register(browserWindow, 'Right', () => browserWindow.webContents.send('moveForward'));
        Localshortcut.register(browserWindow, 'Up', () => browserWindow.webContents.send('moveForward'));
        Localshortcut.register(browserWindow, 'Down', () => browserWindow.webContents.send('moveBack'));
        Localshortcut.register(browserWindow, 'Left', () => browserWindow.webContents.send('moveBack'));
    
        this.browserWindow = browserWindow;
    }

    setUrl(url){
        this.browserWindow.loadFile(url);
    }
}