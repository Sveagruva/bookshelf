const {app} = require('electron');
const fs = require('fs');
const hide = require('hidefile');
const p = require('path');

module.exports = class{
    constructor(){
        var settingsPath = p.join(app.getPath("userData"), "settings.json");
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

        if(!fs.existsSync(p.join(libraryPath, ".bookshelf"))){
            fs.mkdirSync(p.join(libraryPath, ".bookshelf"));
            hide.hideSync(p.join(libraryPath, ".bookshelf"));
        }

        let coversPath = p.join(libraryPath, ".bookshelf", "covers");
        let booksPath = p.join(libraryPath, ".bookshelf", "book.json");
        let progressPath = p.join(libraryPath, ".bookshelf", "progress");

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
        let libraryPath = p.join(app.getPath("documents"), "library");
        let backgroundsDir = p.join(app.getPath("userData"), "backgrounds");

        return { // for all posible options see publicSettings.js
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
                "background": false,
                "FS": "18px"
            },
            app: {
                "backgroundsDir": backgroundsDir
            }
        }
    }
}