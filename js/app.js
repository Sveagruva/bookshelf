//originally created by Sveagruva
const electron = require('electron');
const {app, BrowserWindow, protocol} = electron;
const fs = require("fs");
const Epub = require('./epub');
const htmlBuilder = require('./htmlBuilder');
const menu = electron.Menu;
const Localshortcut = require('electron-localshortcut');
const Settings = require('./settings');
const scan = require("./scan");
const Setings = new Settings();
// const mime = require("./mime");

var book;
var currentPage = "library";

var settings = Setings.getSettings();
const html = new htmlBuilder(settings);

app.whenReady().then(async () => {
    menu.setApplicationMenu(menu.buildFromTemplate([]));
    const mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, minWidth: 750, minHeight: 470, webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
    }});

    mainWindow.setIcon('icon.ico');
    await scan(settings.library.path, e => e);
    mainWindow.loadFile("/library.html");
    mainWindow.webContents.openDevTools();
    
    mainWindow.on('closed', () => {
        app.quit();
    });

    protocol.interceptBufferProtocol('file', async (request, callback) => {
        request = request.url.slice(6);
        request = request.slice(request.indexOf(":")+2);
        if(request.slice(0,7) == "library"){
            currentPage = "library";

            callback({
                data: html.Library()
            });
        }else if(request.slice(0,4) == "book"){
            callback({
                data: bookHandler(request.slice(5))
            });
        }else if(request.slice(0, 5) == "cover"){
            request = request.slice(6);
            request = request.slice(0, -4);

            let coversPath;
            if(process.platform === "win32") coversPath = settings.library.path + ".epubreader\\covers\\";
            else coversPath = settings.library.path + ".epubreader/covers/";

            fs.readFile(coversPath + decodeURI(request) + ".bin", "utf-8", (err, img) => {
                callback({
                    data: Buffer.from(img, 'base64')
                });
            });
        }else if(request.slice(0, 8) == "openbook"){
            currentPage = "book";
            console.log(request.slice(8));

            book = await new Epub(settings.library.path + "book.epub");
            mainWindow.webContents.send('reload');
            mainWindow.loadFile("/book/app_book_" + book.name + ".html");
        }else if(request.slice(0, 11) == "openLibrary"){
            mainWindow.webContents.send('reload');
            mainWindow.loadFile("/library.html");
        }else if(request.slice(0, 4) == "scan"){
            scan(settings.library.path, () => {
                if(currentPage == "library"){
                    mainWindow.webContents.send('reload');
                    mainWindow.loadFile("/library.html");
                }
            });
        }else{
            callback({
                data: Buffer.from("not found", 'utf8')
            });
        }
    });

    const bookHandler = async request => {
        if(request.slice(0, 9) != "app_book_"){
            return book.content[request].async("nodebuffer").then(async function(info){
                return info;
            });
        }

        var spine = Array();
        book.spine.forEach(e => {
            if(book.manifest[e].media_type == 'application/xhtml+xml' || book.manifest[e].media_type == 'text/html'){
                spine.push(book.root + book.manifest[e].href);
            }
        });

        return html.Book(spine);
    }

    Localshortcut.register(mainWindow, 'Right', () => mainWindow.webContents.send('moveForward'));
    Localshortcut.register(mainWindow, 'Up', () => mainWindow.webContents.send('moveForward'));
    Localshortcut.register(mainWindow, 'Down', () => mainWindow.webContents.send('moveBack'));
    Localshortcut.register(mainWindow, 'Left', () => mainWindow.webContents.send('moveBack'));

    mainWindow.on('unmaximize', () => mainWindow.webContents.executeJavaScript('document.getElementById("size_changer").setAttribute("full", "false");'));
    mainWindow.on('maximize', () => mainWindow.webContents.executeJavaScript('document.getElementById("size_changer").setAttribute("full", "true");'));
});