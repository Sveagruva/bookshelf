//originally created by Sveagruva
const electron = require('electron');
const {app, BrowserWindow, protocol, dialog} = electron;
const p = require('path');
const fs = require('fs');
const Epub = require('./epub');
const htmlBuilder = require('./htmlBuilder');
const menu = electron.Menu;
const Localshortcut = require('electron-localshortcut');
const Settings = require('./settings');
const scan = require("./scan");
var Setings = new Settings();
// const mime = require("./mime");

var book, progressPath, progressBook, booksPath, coversPath, libraryBack, bookBack;
var currentPage = "library";

var settings = Setings.getSettings();
const html = new htmlBuilder(settings, app.getAppPath());

const calcPaths = libPath => {
    coversPath = p.join(libPath, ".bookshelf", "covers");
    booksPath = p.join(libPath, ".bookshelf", "book.json");
    progressPath = p.join(libPath, ".bookshelf", "progress");
}

calcPaths(settings.library.path);
app.whenReady().then(async () => {
    protocol.interceptBufferProtocol('file', async (request, callback) => {
        request = process.platform === "win32" ? request.url.slice(6) : request.url.slice(7);
        request = request.slice(request.indexOf(":")+2);

        let requestPaths = request.split('/');


        switch (requestPaths[0]) {
            case "saveState":
                request = request.slice(10);
                fs.writeFile(p.join(progressPath, book.name + ".bin"), '{"page": ' + parseInt(request.slice(0, request.indexOf("/"))) + ', "elm": ' + parseInt(request.slice(request.indexOf("/") + 1)) + '}', { overwrite: true }, e => e);
        
                callback({
                    data: Buffer.from("200", 'utf8')
                });
                break;

            case "library":
                currentPage = "library";

                callback({
                    data: html.Library()
                });
                break;
            case "book":
                bookHandler(request.slice(5)).then(info => {
                    callback({
                        data: info
                    });
                });
                break;
            case "cover":
                request = request.slice(6);
                request = request.slice(0, -4);
        
                fs.readFile(p.join(coversPath, decodeURI(request) + ".bin"), "utf-8", (err, img) => {
                    callback({
                        data: Buffer.from(img, 'base64')
                    });
                });
                break;
            case "openbook":
                currentPage = "book";
                request = request.slice(9);
                
                book = await new Epub(p.join(settings.library.path, decodeURI(request)));
                setReadedNow(decodeURI(request));
        
                progressBook = fs.readFileSync(p.join(progressPath, book.name + ".bin"), "utf-8");
        
                mainWindow.webContents.send('reload');
                mainWindow.loadFile("/book/app_book_" + book.name);
                break;
            case "openLibrary":
                mainWindow.webContents.send('reload');
                mainWindow.loadFile("/library");
                break;
            case "openSettings":
                currentPage = "settings";
    
                mainWindow.webContents.send('reload');
                mainWindow.loadFile("/settings");
                break;
            case "settings":
                callback({
                    data: html.Settings(settings, Setings.settingsPath)
                });
                break;
            case "background":
                callback({
                    data: backgroundsData(request.slice(11))
                });
                break;
            case "scan":
                scan(settings.library.path, () => {
                    if(currentPage == "library"){
                        mainWindow.webContents.send('reload');
                        mainWindow.loadFile("/library");
                    }
                });
                break;
            case "reloadSettings":
                Setings = new Settings();
                settings = Setings.getSettings();
                calcPaths(settings.library.path);
                updateBacks();
                html.setSettings(settings);
                mainWindow.webContents.send('reload');
                mainWindow.loadFile("/settings");
                break;
            default:
                callback({
                    data: Buffer.from(`path ${requestPaths[0]} not found`, 'utf8')
                });
                break;
        }
    });

    const bookHandler = request => {
        return new Promise(async resolve => {
            if(request.slice(0, 9) != "app_book_"){
                try {
                    await book.content[request].async("nodebuffer").then(info => {
                        resolve(info);
                    });
                }catch(e){
                    resolve(new Buffer.from("404", 'utf8'));
                }
            }
    
            var spine = Array();
            book.spine.forEach(e => {
                if(book.manifest[e].media_type == 'application/xhtml+xml' || book.manifest[e].media_type == 'text/html'){
                    spine.push(book.root + book.manifest[e].href);
                }
            });
            
            resolve(html.Book(spine, progressBook));
        });
    }

    menu.setApplicationMenu(menu.buildFromTemplate([]));
    const mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, minWidth: 750, minHeight: 470, webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
    }});

    await scan(settings.library.path, e => e);
    updateBacks();

    mainWindow.loadFile("/library");
    
    mainWindow.on('closed', () => {
        app.quit();
    });

    Localshortcut.register(mainWindow, 'Right', () => mainWindow.webContents.send('moveForward'));
    Localshortcut.register(mainWindow, 'Up', () => mainWindow.webContents.send('moveForward'));
    Localshortcut.register(mainWindow, 'Down', () => mainWindow.webContents.send('moveBack'));
    Localshortcut.register(mainWindow, 'Left', () => mainWindow.webContents.send('moveBack'));

    mainWindow.on('unmaximize', () => mainWindow.webContents.executeJavaScript('document.getElementById("size_changer").setAttribute("full", "false");'));
    mainWindow.on('maximize', () => mainWindow.webContents.executeJavaScript('document.getElementById("size_changer").setAttribute("full", "true");'));
});


const setReadedNow = async file => {
    let books = JSON.parse(fs.readFileSync(booksPath, "utf-8"));

    books.forEach(book => {
        if(book.file == file){
            book.last_read = new Date();
        }
    });

    fs.writeFile(booksPath, JSON.stringify(books), e=> e);
}

const backgroundsData = request => {
    if(request == "library.jpg") {
        return libraryBack;
    }else if(request == "book.jpg"){
        return bookBack;
    }else{
        return Buffer.from("not found", 'utf8');
    }
}

const updateBacks = () => {
    if(settings.library.background){
        libraryBack = fs.readFileSync(p.join(settings.app.backgroundsDir + settings.library.background));
    }

    if(settings.book.background){
        bookBack = fs.readFileSync(p.join(settings.app.backgroundsDir + settings.book.background));
    }
}