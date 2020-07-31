class Mount{constructor(point, index, page, direction){
    this.point = point;
    this.index = index;
    this.page = page;
    this.direction = direction;
}}

const saveState = async () => {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/saveState/" + mount.page + "/" + mount.index, true);
    xhttp.send();
}

class Watcher{
    constructor(){
        this.observer = new IntersectionObserver(entries => {
            if(resizing) return;
            let toppest;
            for (let i = 0; i < entries.length; i++) {
                toppest = i;
                if(entries[i].isIntersecting) break;
            }

            mount.point = entries[toppest].target;

            let max = this.container.length;
            let index = mount.index;
            while(max > index && index > -1){
                if(this.container[index] === mount.point){
                    mount.index = index;
                    break;
                }

                index += this.direction ? 1 : -1;
            }

            saveState();
        }, {threshold: [0.8]});
    }

    watch(container, dir){
        if(this.container !== undefined) container.forEach(element => this.observer.unobserve(element));
        this.container = container;
        container.forEach(element => this.observer.observe(element));
        mount.index = dir ? 0 : container.length - 1;
    }
}

const spine = JSON.parse(varibs.spine);
const gap = parseInt(varibs.gap);
const fontFamily = varibs.fontFamily;
const progress = JSON.parse(varibs.progress);
var mount = new Mount(0, 0, 0, true);
var resizing = false;
const watcher = new Watcher();
var timeoutResize;

window.addEventListener("resize", () => {
    if(resizing){
        clearTimeout(timeoutResize);
    }
    blurApp();
    resizing = true;
    let mountLocal = Object.assign({}, mount);
    let current = document.querySelector("#book iframe[visible=true]");
    setTimeout(() => {
        current.contentWindow.scroll({
            left: Math.floor(watcher.container[mountLocal.index].offsetLeft/(current.contentWindow.innerWidth + gap))*(current.contentWindow.innerWidth + gap)
        });
        mount = Object.assign({}, mountLocal);
    }, 20);

    timeoutResize = window.setTimeout(() => {
        resizing = false;
        unblurApp();
    }, 25);
});

const allChilds = (element, array) => {
    let children = element.childNodes;
    let bool = true;
    for(let i=0; i < children.length; i++) {
        if (children[i].nodeType == 1){
            bool = false;
            array = allChilds(children[i], array);
        }
    }
    if(bool) array.push(element);
    return array;
}

String.prototype.toElm = function(){
    var div = document.createElement('div');
    div.innerHTML = this;

    return div.firstChild;
}

const createIframe = (appOrBefore, parent, scr, hr) => {
    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", scr);
    ifrm.setAttribute("hr", hr);
    if(appOrBefore){
        parent.appendChild(ifrm);
    }else{
        parent.before(ifrm);
    }

    ifrm.setAttribute("load", "false");
    return ifrm;
}

const setVisible = iframe => {
    iframe.setAttribute("visible", "true");
    iframe.style.visibility = "visible";
}

const setHide = iframe => {
    iframe.setAttribute("visible", "false");
    iframe.style.visibility = "hidden";
}

const setCss = (elm, array) => {
    array.forEach(style => {
        elm.style[style[0]] = style[1];
    });
}

//  Not only adding styles
const addStandardStyles = iframe => {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'screen';
    style.textContent = `
        body{
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            column-gap: ${gap}px !important;
            column-count: 2 !important;
            overflow: hidden;
            color: white;
            font-family: ${fontFamily};
        }

        html{
            height: 100%;
            width: 100%;
        }
    `;
    iframe.contentDocument.head.appendChild(style);
    iframe.setAttribute("load", "true");// <================ Not only adding styles
    style = null;
}

window.onload = async () => {
    var arrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" style="display: block;" viewBox="0 0 9.06 16.21"><polyline points="0.35 0.35 8.35 8.35 0.85 15.85" style="fill:none;stroke:#000"/></svg>';
    const content = document.getElementById("content");

    var back = document.createElement("div");
    var forward = document.createElement("div");
    content.appendChild(back);
    content.appendChild(forward);


    var backButton = document.createElement("div");
    back.appendChild(backButton);
    back.classList.add("side");
    backButton.appendChild(arrowSvg.toElm());
    back.style.position = "absolute";
    document.querySelector(".side svg").style.transform = "rotate(180deg)";

    var forwardButton = document.createElement("div");
    forward.appendChild(forwardButton);
    forward.classList.add("side");
    forwardButton.appendChild(arrowSvg.toElm());
    forward.style.position = "absolute";


    const bookElm = document.createElement('div');
    forward.before(bookElm);
    bookElm.setAttribute("id", "book");


    const sidePadding = window.getComputedStyle(book).margin.replace('px','');





    let TempleSides = [
        ["top", "0"],
        ["bottom", "0"],
        ["width", sidePadding + "px"]
    ];

    setCss(back, TempleSides.concat([["left", "0"]]));
    setCss(forward, TempleSides.concat([["right", "0"]]));

    document.querySelectorAll(".side").forEach(e => 
        setCss(e, [
            ["display", "flex"],
            ["alignItems", "center"],
            ["justifyContent", "center"]
        ])
    );

    document.querySelectorAll(".side>div").forEach(e => 
        setCss(e, [
            ["width", "50%"],
            ["cursor", "pointer"]
        ]
    ));

    mount.page = progress.page;
    var ifrm = createIframe(true, bookElm, spine[mount.page], mount.page);
    ifrm.onload = e => {
        addStandardStyles(e.target);
        watcher.watch(allChilds(e.target.contentDocument.body, new Array()), true);
        mount.index = progress.elm;
        e.target.contentWindow.scroll({
            left: Math.floor(watcher.container[progress.elm].offsetLeft/(e.target.contentWindow.innerWidth + gap))*(e.target.contentWindow.innerWidth + gap)
        });
    }

    setVisible(ifrm);

    if(mount.page > 0){
        ifrm = createIframe(false, ifrm, spine[mount.page - 1], mount.page - 1);
        ifrm.onload = e => {
            addStandardStyles(e.target);
            e.target.contentWindow.scroll({
                left: e.target.contentDocument.body.scrollWidth
            });
        }
        setHide(ifrm);
    }

    if(spine.length > 1){
        ifrm = createIframe(true, bookElm, spine[mount.page + 1], mount.page + 1);
        ifrm.onload = e => addStandardStyles(e.target);
        setHide(ifrm);
    }


    const nextIf = current => {
        let newOne = document.querySelector("#book>iframe:last-child");
        watcher.watch(allChilds(newOne.contentDocument.body, new Array()), true);
        if(current === newOne) return;
        setVisible(newOne);
        try{
            document.querySelector("#book>iframe[visible=false]").remove();
        }catch(e){}
        setHide(current);
        let hr = parseInt(newOne.getAttribute("hr"));
        mount.page = hr;
        saveState();
        if(hr == spine.length - 1) return;
        ifrm = createIframe(true, bookElm, spine[hr + 1], hr + 1);
        ifrm.onload = e => addStandardStyles(e.target);
        setHide(ifrm);
    }

    const prevIf = current => {
        let newOne = document.querySelector("#book>iframe:first-child");
        watcher.watch(allChilds(newOne.contentDocument.body, new Array()), false);
        if(current === newOne) return;
        setVisible(newOne);
        try{
            document.querySelector("#book>iframe[visible=false]").remove();
        }catch(e){}
        setHide(current);
        let hr = parseInt(newOne.getAttribute("hr"));
        mount.page = hr;
        saveState();
        if(hr == 0) return;
        ifrm = createIframe(false, newOne, spine[hr - 1], hr - 1);
        ifrm.onload = e => {
            addStandardStyles(e.target);
            e.target.contentWindow.scroll({
                left: e.target.contentDocument.body.scrollWidth
            });
        }
        setHide(ifrm);
    }



    const moveForward = () => {
        watcher.direction = true;
        let current = document.querySelector("#book iframe[visible=true]");
        let body = current.contentDocument.body;
        if(body.clientWidth >= body.scrollWidth || current.contentWindow.pageXOffset + body.clientWidth == body.scrollWidth) return nextIf(current);
        current.contentWindow.scroll({
            left: Math.floor((body.clientWidth + current.contentWindow.pageXOffset + gap)/(body.clientWidth + gap))*(body.clientWidth + gap)
        });
    }

    const moveBack = () => {
        watcher.direction = false;
        let current = document.querySelector("#book iframe[visible=true]");
        let body = current.contentDocument.body;
        if(body.clientWidth >= body.scrollWidth || current.contentWindow.pageXOffset == 0) return prevIf(current);
        current.contentWindow.scroll({
            left: Math.floor((current.contentWindow.pageXOffset - body.clientWidth - gap)/(body.clientWidth + gap))*(body.clientWidth + gap)
        });
    }

    forwardButton.addEventListener("click", moveForward);
    backButton.addEventListener("click", moveBack);

    ipcRenderer.on('moveForward', moveForward);
    ipcRenderer.on('moveBack', moveBack);
}