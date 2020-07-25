module.exports = class htmlBuilder{
    constructor(style, controls){
        this.style = style;
        this.controls = controls;
    }
    
    Page(stylesheet, script, html){
        if(stylesheet == undefined) stylesheet = "";
        if(script == undefined) script = "";
        if(html == undefined) html = "";

        return this.getHeader(stylesheet, script) + html + this.getFooter();
    }

    getHeader(stylesheet, script){
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        ${this.style}

        ${stylesheet}
    </style>
    <script>
        ${this.controls}

        ${script}
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src file: 'unsafe-inline'; img-src file: 'self' data:" />
    <title>Epubreader</title>
</head>
<body>
<header>
    <div id="topLogo"></div>
    <div class="controls">
        <div id="minimize"></div>
        <div id="size_changer" full="false"><span></span></div>
        <div id="close"><span></span></div>
    </div>
</header>
<div id="content">`;
    }

    getFooter(){
        return `
</div>
</body>
</html>`;
    }
}