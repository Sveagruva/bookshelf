const electron = require('electron');
const {app, BrowserWindow, protocol} = electron;
const fs = require("fs");
const Epub = require('./epub');
const htmlBuilder = require('./htmlBuilder');
const menu = electron.Menu;

var settings;
var book;

var settingsPath;
if(process.platform === "win32") settingsPath = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("\\") + 1);
else settingsPath = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("/") + 1);

settingsPath += "settings.json";


var libraryPath = app.getPath("documents");
if(process.platform === "win32") libraryPath += "\\library\\";
else libraryPath += "/library/";


var defaultSettings = {
    colors: {
        "primary": "grey",
        "accent": "#343538",
        "accent-focus": "#52453e",
        "accent-focus-hover": "#705c51",
        "success": "green",
        "hh": "30px",
        "text": "white",
        "library-gap": "10px",
        "list-height": "60px"
    },
    library: libraryPath
}

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

String.prototype.toBuffer = function(){
    return Buffer.from(this, 'utf8');
}

app.whenReady().then(async () => {
    //                  initialize so it load only one time

    //TODO change to async load
    var style = fs.readFileSync('css/style.css', "utf8");
    var controls = fs.readFileSync('js/controls.js', "utf8");

    const html = new htmlBuilder(style, controls);
    style = null; controls = null;

    var libraryCSS = fs.readFileSync('css/library.css', "utf8");
    var libraryScript = fs.readFileSync('js/library.js', "utf-8");
    var libraryHTML = fs.readFileSync('html/library.html', "utf-8");

    var settingsCSS = fs.readFileSync('css/settings.css', "utf-8");
    var settingsScript = fs.readFileSync('js/settingsScript.js', "utf-8");
    var settingsHTML = fs.readFileSync('html/settings.html', "utf-8");

    var bookJS = fs.readFileSync('js/book.js', "utf-8");


    //initialize 
    //                  load settings 
    var exists;
    await (async () => {fs.exists(settingsPath, e => {
        exists = e;
    });})();

    if(!exists){
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings));
        settings = defaultSettings; 
    }else{
        settings = fs.readFileSync(settingsPath, "utf-8");
    }

    //load settings 


    menu.setApplicationMenu(menu.buildFromTemplate([]));
    const mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, minWidth: 750, minHeight: 470, webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
    }});


    mainWindow.loadFile("/app/library.html");
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        app.quit();
    });



    protocol.interceptBufferProtocol('file', async (request, callback) => {
        // console.log(request);
        request = request.url.slice(6);
        request = request.slice(request.indexOf(":")+2);
        if(request.slice(0,3) == "app"){
            let response;
            request = request.slice(4);

            if(request == "library.html"){
                response = html.Page(libraryCSS, libraryScript, libraryHTML);
            }else{
                response = html.Page(settingsCSS, settingsScript, settingsHTML);
            }

            callback({
                data: Buffer.from(response, 'utf8')
            });
        }else if(request.slice(0,4) == "book"){
            request = request.slice(5);

            // console.log("here: " + request);
            var spine = Array();
            if(request.slice(0, 9) == "app_book_"){
                book.spine.forEach(e => {
                    if(book.manifest[e].media_type == "application/xhtml+xml"){
                        spine.push(book.manifest[e].href);
                    }
                });

                // for (let i = 0; i < 4; i++) {
                //     code += `<iframe src="/book/${book.name + book.root}/${book.manifest[book.spine[i]].href}"></iframe>`;
                // }
    
                callback({
                    data: html.Page(`
                    
                    html{
                        --book-padding: 50px;
                    }

                    iframe{
                        position: absolute;
                        top:0;bottom:0;
                        left:0;right:0;
                        height: 100%;
                        width: 100%;
                        visibility: hidden;
                    }

                    #book{
                        margin: 50px;
                        position: relative;
                        height: calc(100% - 2 * var(--book-padding));
                        width: calc(100% - 2 * var(--book-padding));
                    }
                    
                    `, `var spine = ${JSON.stringify(spine)};` + bookJS, undefined).toBuffer()
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

            book = await new Epub(libraryPath + "book.epub");
            // console.log(book.content);
            // It's saying await has no effect but if you remove it all crash down!!!!

            mainWindow.loadFile("/book/app_book_" + book.name + ".html");
        }else{
            callback({
                data: "not found".toBuffer()
            });
        }
    });
});