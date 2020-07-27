const {remote, ipcRenderer} = require('electron');

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
}

const gonnaClose = () => {
    document.getElementById("close").removeEventListener("click", close);
    document.getElementById("size_changer").removeEventListener("click", size_changer);
    document.getElementById("minimize").removeEventListener("click", minimize);
}

window.addEventListener("load", onload);
ipcRenderer.on('reload', gonnaClose);