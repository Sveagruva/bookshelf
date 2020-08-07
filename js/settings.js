const {app} = require('electron');
const fs = require("fs");
const hide = require("hidefile");

module.exports = class{
    constructor(){
        var settingsPath;
        if(process.platform === "win32") settingsPath = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("\\") + 1);
        else settingsPath = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("/") + 1);

        settingsPath += "settings.json";
        this.settingsPath = settingsPath;

        let defaultSettings = this.getDefault();

        if(!fs.existsSync(settingsPath)){
            fs.writeFile(settingsPath, JSON.stringify(defaultSettings), e => e);
            this.settings = defaultSettings; 
        }else{
            this.settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
        }

        this.setHiddenFolder(this.settings.library.path);

        if(!fs.existsSync(this.settings.app.backgroundsDir)){
            fs.mkdirSync(this.settings.app.backgroundsDir);
        }
    }

    setHiddenFolder(libraryPath){
        if(!fs.existsSync(libraryPath)){
            fs.mkdirSync(libraryPath);
        }

        if(!fs.existsSync(libraryPath + ".bookshelf")){
            fs.mkdirSync(libraryPath + ".bookshelf");
            hide.hideSync(libraryPath + ".bookshelf");
        }

        let coversPath;
        if(process.platform === "win32") coversPath = libraryPath + ".bookshelf\\covers";
        else coversPath = libraryPath + ".bookshelf/covers";

        let booksPath;
        if(process.platform === "win32") booksPath = libraryPath + ".bookshelf\\book.json";
        else booksPath = libraryPath + ".bookshelf/book.json";

        let progressPath;
        if(process.platform === "win32") progressPath = libraryPath + ".bookshelf\\progress";
        else progressPath = libraryPath + ".bookshelf/progress";

        if(!fs.existsSync(progressPath)){
            fs.mkdirSync(progressPath);
        }

        if(!fs.existsSync(coversPath)){
            fs.mkdirSync(coversPath);
        }

        if(!fs.existsSync(booksPath)){
            fs.writeFileSync(booksPath, "[]", e => e);
        }
    }

    changeLibraryPaht(to){
        this.settings.library.path = to;
        this.writeDown();
    }

    writeDown(){
        fs.writeFile(this.settingsPath, JSON.stringify(this.settings), e => e);
    }

    getSettings(){
        return this.settings;
    }

    getDefault(){
        var libraryPath = app.getPath("documents");
        if(process.platform === "win32") libraryPath += "\\library\\";
        else libraryPath += "/library/";

        var backgroundsDir;
        if(process.platform === "win32") backgroundsDir = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("\\") + 1) + "backgrounds\\";
        else backgroundsDir = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("/") + 1) + "backgrounds/";

        var defaultSettings = { // for all posible options see publicSettings.js
            css: {
                "primary": "#383838",
                "accent": "#343538",
                "accent-focus": "#52453e",
                "accent-focus-hover": "#705c51",
                "hh": "30px",
                "text": "#ffffff",
                "library-gap": "10px",
                "list-height": "60px",
                "book-padding": "50px",
                "font-family": "Arial",
                "pages-gap": "28"
            },
            library: {
                "path": libraryPath,
                "view": "bookshelf",
                "background": false,
                "order": "last_abc" // fitst part is last or none (exm none_abc) it means how to sort readed books. second part how to sort not read part (or all if first part is none), 
            },
            book: {
                "view": "two_pages",
                "background": false
            },
            app: {
                "backgroundsDir": backgroundsDir
            }
        }

        return defaultSettings;
    }
}