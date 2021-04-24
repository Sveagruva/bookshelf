const fs = require('fs');
const p = require('path');
const toShow = require('../publicSettings');

module.exports = class htmlBuilder{    
    Library(){
        let libraryPath = this.settings.library.path;
        let booksPath = p.join(libraryPath, ".bookshelf", "book.json");

        let books = JSON.parse(fs.readFileSync(booksPath, "utf-8"));
        let html = '<div id="library"><div id="books" view="bookshelf" description="false"></div><div id="info"><div class="meta"><div class="title"></div><div class="creator"></div><div class="time"></div><div class="description"></div><div class="file"></div></div><div class="continue" book="">continue</div></div></div>';
        return (this.getHeader(this.libraryCSS, this.libraryScript, Object.assign({}, this.toRender, {"books": books})) + html + this.getFooter()).toBuffer();
    }

    Book(spine, progress){
        let varibsJS = Object.assign({},this.toRender, {"spine": JSON.stringify(spine), "progress": progress,"gap": this.settings["css"]["pages-gap"], "fontFamily": `\`${this.settings["css"]["font-family"]}\``});
        return (this.getHeader(this.bookCss, this.bookScript, varibsJS) + this.getFooter()).toBuffer();
    }

    Settings(settings, settingsPath){
        let varibsJS = Object.assign({}, this.toRender, {"settings": JSON.stringify(settings), "toShow": JSON.stringify(toShow), "settingsPath": settingsPath});
        return (this.getHeader(this.settingsCss, this.settingsScript, varibsJS) + this.getFooter()).toBuffer();
    }

    setSettings(settings){
        this.settings = settings;
        this.toRender = this.get2Render();
    }

    getCssVaribles() {
        let variables = this.settings["css"];
        let varibs = "html{";
        for (let key in variables) {
            varibs += `--${key}: ${variables[key]};`; 
        }
        return varibs += "}";
    }

    get2Render(){
        let libBack = this.settings.library.background ? true : false;
        let bokBack = this.settings.book.background ? true : false;

        return {
            "libraryPath": `${this.settings.library.path.split("\\").join("\\\\")}`, 
            "order": this.settings.library.order,
            "libraryBack": libBack, "bookBack": bokBack,
            "bookView": this.settings.book.view,
            "textColor": this.settings.css.text,
            "libraryView": this.settings.library.view,
            "FS_book": this.settings.book.FS
        };
    }
    
    constructor(settings, appPath){
        this.settings = settings;
        this.controls = fs.readFileSync(p.join(appPath, 'resources/js/controls.js'), "utf8");
        this.style = fs.readFileSync(p.join(appPath, 'resources/css/style.css'), "utf8");

        this.bookCss = fs.readFileSync(p.join(appPath, 'resources/css/book.css'), "utf-8");
        this.bookScript = fs.readFileSync(p.join(appPath, 'resources/js/book.js'), "utf-8");
        this.libraryCSS = fs.readFileSync(p.join(appPath, 'resources/css/library.css'), "utf8");
        this.libraryScript = fs.readFileSync(p.join(appPath, 'resources/js/library.js'), "utf-8");
        this.settingsCss = fs.readFileSync(p.join(appPath, 'resources/css/settings.css'), "utf-8");
        this.settingsScript = fs.readFileSync(p.join(appPath, 'resources/js/settingsScript.js'), "utf-8");
        this.toRender = this.get2Render();
    }

    getHeader(stylesheet, script, varibsJS){
        let varibsJ = "var varibs = " + JSON.stringify(varibsJS) + ";";

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        ${this.getCssVaribles()}

        ${this.style}

        ${stylesheet}
    </style>
    <script>
        ${varibsJ}

        ${this.controls}

        ${script}
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src file: 'unsafe-inline'; img-src file: 'self' data:" />
    <title>Bookshelf</title>
</head>
<body>
<div id="content">`;
    }

    getFooter(){
        return '</div></body></html>';
    }
}

String.prototype.toBuffer = () => 
    Buffer.from(this, 'utf8');