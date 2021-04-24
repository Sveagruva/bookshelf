const front = require("../front");

module.exports = class Loader {
    constructor(window){
        this.window = window;
    }

    load = async (request, callback) => {
        const path = request.url.slice(8).split('/');

        const send = content => callback({
            data: Buffer.from(content, 'utf-8')
        });

        const window = this.window;
        switch (path.shift()) {
            case 'app':
                return send(front(path));
            case 'navigate':
                return window.setUrl('/app/' + path.join('/'));
            case 'action':
                return;
            default:
                send(`cannot execute ${request.url} not found`);


            // case "saveState":
            //     request = request.slice(10);
            //     fs.writeFile(p.join(progressPath, book.name + ".bin"), '{"page": ' + parseInt(request.slice(0, request.indexOf("/"))) + ', "elm": ' + parseInt(request.slice(request.indexOf("/") + 1)) + '}', { overwrite: true }, e => e);
        
            //     callback({
            //         data: Buffer.from("200", 'utf8')
            //     });
            //     break;
            // case "book":
            //     bookHandler(request.slice(5)).then(info => {
            //         callback({
            //             data: info
            //         });
            //     });
            //     break;
            // case "cover":
            //     request = request.slice(6);
            //     request = request.slice(0, -4);
        
            //     fs.readFile(p.join(coversPath, decodeURI(request) + ".bin"), "utf-8", (err, img) => {
            //         callback({
            //             data: Buffer.from(img, 'base64')
            //         });
            //     });
            //     break;
            // case "openbook":
            //     currentPage = "book";
            //     request = request.slice(9);
                
            //     book = await Epub(p.join(settings.library.path, decodeURI(request)));
            //     // setReadedNow(decodeURI(request));
        
            //     progressBook = fs.readFileSync(p.join(progressPath, book.name + ".bin"), "utf-8");
        
            //     mainWindow.webContents.send('reload');
            //     mainWindow.loadFile("/book/app_book_" + book.name);
            //     break;
            // case "openLibrary":
            //     mainWindow.webContents.send('reload');
            //     mainWindow.loadFile("/library");
            //     break;
            // case "openSettings":
            //     currentPage = "settings";
    
            //     mainWindow.webContents.send('reload');
            //     mainWindow.loadFile("/settings");
            //     break;
            // case "settings":
            //     callback({
            //         data: html.Settings(settings, Setings.settingsPath)
            //     });
            //     break;
            // case "background":
            //     callback({
            //         data: backgroundsData(request.slice(11))
            //     });
            //     break;
            // case "scan":
            //     scan(settings.library.path, () => {
            //         if(currentPage == "library"){
            //             mainWindow.webContents.send('reload');
            //             mainWindow.loadFile("/library");
            //         }
            //     });
            //     break;
            // case "reloadSettings":
            //     Setings = new Settings();
            //     settings = Setings.getSettings();
            //     calcPaths(settings.library.path);
            //     updateBacks();
            //     html.setSettings(settings);
            //     mainWindow.webContents.send('reload');
            //     mainWindow.loadFile("/settings");
            //     break;
        }
    }
}



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