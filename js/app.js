//originally created by Sveagruva
const electron = require('electron');
const {app, BrowserWindow, protocol} = electron;
const fs = require("fs");
const Epub = require('./epub');
const htmlBuilder = require('./htmlBuilder');
const menu = electron.Menu;
const Localshortcut = require('electron-localshortcut');
const Settings = require('./settings');

const Setings = new Settings();
var settings = Setings.getSettings();
var book;

var toRender = {
    "libraryPath": `\"${settings.library.path.split("\\").join("\\\\")}\"`
};
// transfer this array as variables to render thr js

var mime = {
    "html": 'text/html',
    "txt": 'text/plain',
    "css": 'text/css',
    "gif": 'image/gif',
    "jpg": 'image/jpeg',
    "png": 'image/png',
    "svg": 'image/svg+xml',
    "js": 'application/javascript',
    "xhtml": 'application/xhtml+xml',
    "epub": "application/epub+zip"
};

String.prototype.toBuffer = function(){
    return Buffer.from(this, 'utf8');
}

app.whenReady().then(async () => {
    //                  initialize so it load only one time
    var style = fs.readFileSync('resources/css/style.css', "utf8");

    const html = new htmlBuilder(settings["css"], "",  fs.readFileSync('resources/js/controls.js', "utf8"));

    var libraryCSS = fs.readFileSync('resources/css/library.css', "utf8");
    var libraryScript = fs.readFileSync('resources/js/library.js', "utf-8");
    var libraryHTML = fs.readFileSync('resources/html/library.html', "utf-8");

    var bookCss = fs.readFileSync('resources/css/book.css', "utf-8");
    var bookScript = fs.readFileSync('resources/js/book.js', "utf-8");
    //initialize 


    menu.setApplicationMenu(menu.buildFromTemplate([]));
    const mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, minWidth: 750, minHeight: 470, webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
    }});

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.insertCSS(style);
    });

    mainWindow.setIcon('icon.ico');
    mainWindow.loadFile("/library.html");
    mainWindow.webContents.openDevTools();
    
    mainWindow.on('closed', () => {
        app.quit();
    });

    protocol.interceptBufferProtocol('file', async (request, callback) => {
        request = request.url.slice(6);
        request = request.slice(request.indexOf(":")+2);
        if(request.slice(0,7) == "library"){
            let response;
            request = request.slice(4);

            response = html.Page(libraryCSS, libraryScript, libraryHTML, toRender);

            callback({
                data: Buffer.from(response, 'utf8')
            });
        }else if(request.slice(0,4) == "book"){
            request = request.slice(5);

            var spine = Array();
            if(request.slice(0, 9) == "app_book_"){
                book.spine.forEach(e => {
                    if(book.manifest[e].media_type == mime["xhtml"] || book.manifest[e].media_type == mine["html"]){
                        spine.push(book.root + book.manifest[e].href);
                    }
                });

                callback({
                    data: html.Page(bookCss, bookScript, undefined, Object.assign({},toRender, {"spine": JSON.stringify(spine), "gap": settings["css"]["pages-gap"], "fontFamily": `\`${settings["css"]["font-family"]}\``})).toBuffer()
                });
            }else{
                book.content[request].async("nodebuffer").then(async function(info){
                    callback({
                        data: info
                    });
                });
            }
        }else if(request.slice(0, 8) == "openbook"){
            console.log(request.slice(8));

            book = await new Epub(settings.library.path + "book.epub");
            // It's saying await has no effect but if you remove it all crash down!!!!
            mainWindow.webContents.send('reload');
            mainWindow.loadFile("/book/app_book_" + book.name + ".html");
        }else if(request.slice(0, 11) == "openLibrary"){
            mainWindow.webContents.send('reload');
            mainWindow.loadFile("/library.html");
        }else{
            callback({
                data: "not found".toBuffer()
            });
        }
    });

    Localshortcut.register(mainWindow, 'Right', () => mainWindow.webContents.send('moveForward'));
    Localshortcut.register(mainWindow, 'Up', () => mainWindow.webContents.send('moveForward'));
    Localshortcut.register(mainWindow, 'Down', () => mainWindow.webContents.send('moveBack'));
    Localshortcut.register(mainWindow, 'Left', () => mainWindow.webContents.send('moveBack'));

    mainWindow.on('unmaximize', () => mainWindow.webContents.executeJavaScript('document.getElementById("size_changer").setAttribute("full", "false");'));
    mainWindow.on('maximize', () => mainWindow.webContents.executeJavaScript('document.getElementById("size_changer").setAttribute("full", "true");'));
});