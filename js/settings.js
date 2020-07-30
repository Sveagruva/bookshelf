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
    }

    setHiddenFolder(libraryPath){
        if(!fs.existsSync(libraryPath + ".epubreader")){
            fs.mkdirSync(libraryPath + ".epubreader");
            hide.hideSync(libraryPath + ".epubreader");
        }

        let coversPath;
        if(process.platform === "win32") coversPath = libraryPath + ".epubreader\\covers";
        else coversPath = libraryPath + ".epubreader/covers";

        let booksPath;
        if(process.platform === "win32") booksPath = libraryPath + ".epubreader\\book.json";
        else booksPath = libraryPath + ".epubreader/book.json";

        let progressPath;
        if(process.platform === "win32") progressPath = libraryPath + ".epubreader\\progress";
        else progressPath = libraryPath + ".epubreader/progress";

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

        var defaultSettings = {
            css: {
                "primary": "#383838",
                "accent": "#343538",
                "accent-focus": "#52453e",
                "accent-focus-hover": "#705c51",
                "success": "green",
                "hh": "30px",
                "text": "white",
                "library-gap": "10px",
                "list-height": "60px",
                "book-padding": "50px",
                "font-family": "Arial",
                "pages-gap": "28"
            },
            library: {
                "path": libraryPath,
                "view": "bookshelf",
                "background": "none"
            },
            book: {
                "view": "book"
            }
        }

        return defaultSettings;
    }
}