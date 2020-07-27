const {app} = require('electron');
const fs = require("fs");

module.exports = class{
    constructor(){
        var settingsPath;
        if(process.platform === "win32") settingsPath = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("\\") + 1);
        else settingsPath = app.getPath('exe').slice(0, app.getPath('exe').lastIndexOf("/") + 1);

        settingsPath += "settings.json";
        this.settingsPath = settingsPath;

        var settings;
        if(!fs.existsSync(settingsPath)){
            let defaultSettings = this.getDefault();
            fs.writeFile(settingsPath, JSON.stringify(defaultSettings), e => e);
            settings = defaultSettings; 
        }else{
            settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
        }
        this.settings = settings;
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