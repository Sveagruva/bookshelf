const {remote, ipcRenderer} = require('electron');
const move = remote.require('./move');
const fs = remote.require('fs');

const fileDialog = arg => {
    var input = document.createElement('input');

    input.setAttribute('type', 'file');
    if(typeof arg !== undefined) {
        if(arg.multiple === true) input.setAttribute('multiple','');
        if(arg.accept !== undefined) input.setAttribute('accept',arg.accept);
        if(arg.folder !== undefined) input.toggleAttribute('webkitdirectory');
    }

    return new Promise(resolve => {
        input.addEventListener('change', e => resolve(input.files));

        var e = document.createEvent('MouseEvents');
        e.initMouseEvent('click');
        input.dispatchEvent(e);
    });
}

const close = () => {
    remote.getCurrentWindow().close();
}

const minimize = () => {
    remote.getCurrentWindow().minimize();
}

const size_changer = () => {
    if(remote.getCurrentWindow().isMaximized()){
        remote.getCurrentWindow().unmaximize();
    }else{
        remote.getCurrentWindow().maximize();
    }
}

const sendRequest = url => {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.send();
}

const toLibrary = () => sendRequest("/openLibrary");
const toSettings = () => sendRequest("/openSettings");
const toBook = file => sendRequest("/openbook/" + file);

const addBook = async () => {
    fileDialog({ multiple: true, accept: "application/epub+zip" }).then(files => {
        var done = Array();
        for (let i = 0; i < files.length; i++){
            if(files[i].type != "application/epub+zip") continue;
            let newPath = varibs.libraryPath + files[i].path.split('\\').pop().split('/').pop();
            if(newPath === files[i].path) continue;
            (async (Path, oldPath) => {
                let newPath = Path;
                let nTry = 1;
                while(fs.existsSync(newPath)){
                    newPath = Path.slice(0, -5) + "(" + nTry + ").epub";
                    nTry++;
                }

                move(oldPath, newPath).then(() => {
                    done.push(i);
                    if(done.length == files.length){
                        var xhttp = new XMLHttpRequest();
                        xhttp.open("GET", "/scan", true);
                        xhttp.send();
                    }
                });
            })(newPath, files[i].path);
        }
    });
}

const onload = () => {
    window.removeEventListener("load", onload);
    if(remote.getCurrentWindow().isMaximized()){
        document.getElementById("size_changer").setAttribute("full", "true");
    }else{
        document.getElementById("size_changer").setAttribute("full", "false");
    }
    document.getElementById("close").addEventListener("click", close);
    document.getElementById("size_changer").addEventListener("click", size_changer);
    document.getElementById("minimize").addEventListener("click", minimize);

    document.getElementById("addBook").addEventListener("click", addBook);
    document.getElementById("topLogo").addEventListener("click", toLibrary);
    document.getElementById("settings").addEventListener("click", toSettings);
}

const gonnaClose = () => {
    document.dispatchEvent(new Event("close"));
    document.getElementById("close").removeEventListener("click", close);
    document.getElementById("size_changer").removeEventListener("click", size_changer);
    document.getElementById("minimize").removeEventListener("click", minimize);
    document.getElementById("addBook").removeEventListener("click", addBook);
    document.getElementById("topLogo").removeEventListener("click", toLibrary);
    document.getElementById("settings").removeEventListener("click", toSettings);
}

window.addEventListener("load", onload);
ipcRenderer.on('reload', gonnaClose);

const blurApp = () => {
    document.getElementById("content").setAttribute("blur", "true");
}

const unblurApp = () => {
    document.getElementById("content").setAttribute("blur", "false");
}