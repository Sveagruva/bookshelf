//originally created by Sveagruva
const electron = require('electron');
const Router = require('./router');
const Window = require("./window");

electron.Menu.setApplicationMenu(null);
process.env.NODE_ENV = 'debug';

electron.app.whenReady().then(() => {
    const window = new Window();
    const router = new Router(window);

    electron.protocol.interceptBufferProtocol('file', router.route);
    
    window.setUrl("/app/home");
});