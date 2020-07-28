module.exports = class htmlBuilder{
    constructor(variables, style, controls){
        this.variables = variables;
        this.style = style;
        this.controls = controls;
    }
    
    Page(stylesheet, script, html, varibsJS){
        if(stylesheet == undefined) stylesheet = "";
        if(script == undefined) script = "";
        if(html == undefined) html = "";

        return this.getHeader(stylesheet, script, varibsJS) + html + this.getFooter();
    }

    getHeader(stylesheet, script, varibsJS){
        let varibs = "html{";
        for (let key in this.variables) {
            varibs += `--${key}: ${this.variables[key]};`; 
        }
        varibs += "}";

        let varibsJ = "";

        for (let key in varibsJS) {
            varibsJ += `var ${key} = ${varibsJS[key]};`; 
        }

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

        ${varibsJ}

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
        <div id="addBook"><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 495.84 443.5"><rect x="9.5" y="9.5" width="291.7" height="424.5" style="fill:none;stroke-miterlimit:10;stroke-width:19px"/><line x1="262.58" y1="143.13" x2="495.84" y2="143.13" style="fill:none;stroke-miterlimit:10;stroke-width:64px"/><line x1="379.21" y1="26.5" x2="379.21" y2="259.76" style="fill:none;stroke-miterlimit:10;stroke-width:64px"/></svg></span></div>
        <div id="settings"><span><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m272.066 512h-32.133c-25.989 0-47.134-21.144-47.134-47.133v-10.871c-11.049-3.53-21.784-7.986-32.097-13.323l-7.704 7.704c-18.659 18.682-48.548 18.134-66.665-.007l-22.711-22.71c-18.149-18.129-18.671-48.008.006-66.665l7.698-7.698c-5.337-10.313-9.792-21.046-13.323-32.097h-10.87c-25.988 0-47.133-21.144-47.133-47.133v-32.134c0-25.989 21.145-47.133 47.134-47.133h10.87c3.531-11.05 7.986-21.784 13.323-32.097l-7.704-7.703c-18.666-18.646-18.151-48.528.006-66.665l22.713-22.712c18.159-18.184 48.041-18.638 66.664.006l7.697 7.697c10.313-5.336 21.048-9.792 32.097-13.323v-10.87c0-25.989 21.144-47.133 47.134-47.133h32.133c25.989 0 47.133 21.144 47.133 47.133v10.871c11.049 3.53 21.784 7.986 32.097 13.323l7.704-7.704c18.659-18.682 48.548-18.134 66.665.007l22.711 22.71c18.149 18.129 18.671 48.008-.006 66.665l-7.698 7.698c5.337 10.313 9.792 21.046 13.323 32.097h10.87c25.989 0 47.134 21.144 47.134 47.133v32.134c0 25.989-21.145 47.133-47.134 47.133h-10.87c-3.531 11.05-7.986 21.784-13.323 32.097l7.704 7.704c18.666 18.646 18.151 48.528-.006 66.665l-22.713 22.712c-18.159 18.184-48.041 18.638-66.664-.006l-7.697-7.697c-10.313 5.336-21.048 9.792-32.097 13.323v10.871c0 25.987-21.144 47.131-47.134 47.131zm-106.349-102.83c14.327 8.473 29.747 14.874 45.831 19.025 6.624 1.709 11.252 7.683 11.252 14.524v22.148c0 9.447 7.687 17.133 17.134 17.133h32.133c9.447 0 17.134-7.686 17.134-17.133v-22.148c0-6.841 4.628-12.815 11.252-14.524 16.084-4.151 31.504-10.552 45.831-19.025 5.895-3.486 13.4-2.538 18.243 2.305l15.688 15.689c6.764 6.772 17.626 6.615 24.224.007l22.727-22.726c6.582-6.574 6.802-17.438.006-24.225l-15.695-15.695c-4.842-4.842-5.79-12.348-2.305-18.242 8.473-14.326 14.873-29.746 19.024-45.831 1.71-6.624 7.684-11.251 14.524-11.251h22.147c9.447 0 17.134-7.686 17.134-17.133v-32.134c0-9.447-7.687-17.133-17.134-17.133h-22.147c-6.841 0-12.814-4.628-14.524-11.251-4.151-16.085-10.552-31.505-19.024-45.831-3.485-5.894-2.537-13.4 2.305-18.242l15.689-15.689c6.782-6.774 6.605-17.634.006-24.225l-22.725-22.725c-6.587-6.596-17.451-6.789-24.225-.006l-15.694 15.695c-4.842 4.843-12.35 5.791-18.243 2.305-14.327-8.473-29.747-14.874-45.831-19.025-6.624-1.709-11.252-7.683-11.252-14.524v-22.15c0-9.447-7.687-17.133-17.134-17.133h-32.133c-9.447 0-17.134 7.686-17.134 17.133v22.148c0 6.841-4.628 12.815-11.252 14.524-16.084 4.151-31.504 10.552-45.831 19.025-5.896 3.485-13.401 2.537-18.243-2.305l-15.688-15.689c-6.764-6.772-17.627-6.615-24.224-.007l-22.727 22.726c-6.582 6.574-6.802 17.437-.006 24.225l15.695 15.695c4.842 4.842 5.79 12.348 2.305 18.242-8.473 14.326-14.873 29.746-19.024 45.831-1.71 6.624-7.684 11.251-14.524 11.251h-22.148c-9.447.001-17.134 7.687-17.134 17.134v32.134c0 9.447 7.687 17.133 17.134 17.133h22.147c6.841 0 12.814 4.628 14.524 11.251 4.151 16.085 10.552 31.505 19.024 45.831 3.485 5.894 2.537 13.4-2.305 18.242l-15.689 15.689c-6.782 6.774-6.605 17.634-.006 24.225l22.725 22.725c6.587 6.596 17.451 6.789 24.225.006l15.694-15.695c3.568-3.567 10.991-6.594 18.244-2.304z"/><path d="m256 367.4c-61.427 0-111.4-49.974-111.4-111.4s49.973-111.4 111.4-111.4 111.4 49.974 111.4 111.4-49.973 111.4-111.4 111.4zm0-192.8c-44.885 0-81.4 36.516-81.4 81.4s36.516 81.4 81.4 81.4 81.4-36.516 81.4-81.4-36.515-81.4-81.4-81.4z"/></svg></span></div>
    </div>
    <div class="controls">
        <div id="minimize"></div>
        <div id="size_changer" full="false"><span class="one"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 11 11'><rect x='0.5' y='0.5' width='10' height='10' style='fill:none;stroke-miterlimit:10'/></svg></span><span class="two"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'><polyline points='3.5 3.5 0.5 3.5 0.5 13.5 10.5 13.5 10.5 10.5 13.5 10.5 13.5 0.5 3.5 0.5 3.5 3.5 10.5 3.5 10.5 10.5' style='fill:none;stroke:#fff;stroke-miterlimit:10; stroke-width:1'/></svg></span></div>
        <div id="close"><span><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 7.78 7.78'><line x1='0.35' y1='0.35' x2='7.42' y2='7.42' style='fill:none;stroke-miterlimit:10'/><line x1='7.42' y1='0.35' x2='0.35' y2='7.42' style='fill:none;stroke-miterlimit:10'/></svg></span></div>
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