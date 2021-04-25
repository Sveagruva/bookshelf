//originally created by Sveagruva
const electron = require('electron');
const Loader = require('./loader');
const Window = require("./window");

electron.Menu.setApplicationMenu(null);
process.env.NODE_ENV = 'debug';

electron.app.whenReady().then(() => {
    const window = new Window();
    const loader = new Loader(window);

    electron.protocol.interceptStreamProtocol('file', loader.load);
    
    window.setUrl("/app/home");
});