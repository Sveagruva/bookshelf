module.exports = class htmlBuilder{
    constructor(variables, style, controls){
        this.variables = variables;
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
        let varibs = "html{";
        for (let key in this.variables) {
            varibs += `--${key}: ${this.variables[key]};`; 
        }
        varibs += "}"
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        ::-webkit-scrollbar {     
            box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            background-color:  rgba(0,0,0,.2);
        }
        
        ::-webkit-scrollbar-button{
            display: none;
        }
        
        ::-webkit-resizer{
            display: none;
        }
        
        ::-webkit-scrollbar-thumb {
            background-color:  rgba(0,0,0,.3);
        }

        ${varibs}

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
    <div class="left_corner">
        <div id="topLogo"><span></span></div>
    </div>
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