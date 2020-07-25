const {remote} = require('electron');

window.addEventListener("load", () => {
    // document.removeEventListener("close");

    document.getElementById("close").removeEventListener("click", close);
    document.getElementById("size_changer").removeEventListener("click", size_changer);
    document.getElementById("minimize").removeEventListener("click", minimize);

    document.getElementById("close").addEventListener("click", close);
    document.getElementById("size_changer").addEventListener("click", size_changer);
    document.getElementById("minimize").addEventListener("click", minimize);
    
    remote.getCurrentWindow().on('maximize',()=>{
        document.getElementById("size_changer").setAttribute("full", "true");
    });
    
    remote.getCurrentWindow().on('unmaximize',()=>{
        document.getElementById("size_changer").setAttribute("full", "false");
    });
});


// const onload = () => {
//     window.removeEventListener("load", onload);

//     document.getElementById("close").removeEventListener("click", close);
//     document.getElementById("size_changer").removeEventListener("click", size_changer);
//     remote.getCurrentWindow().removeEventListener('maximize', onmaximize);
//     remote.getCurrentWindow().removeEventListener('unmaximize', onunmaximize);
//     document.getElementById("minimize").removeEventListener("click", minimize);
    
//     document.getElementById("close").addEventListener("click", close);
//     document.getElementById("size_changer").addEventListener("click", size_changer);
//     remote.getCurrentWindow().addEventListener('maximize', onmaximize);
//     remote.getCurrentWindow().addEventListener('unmaximize', onunmaximize);
//     document.getElementById("minimize").addEventListener("click", minimize);
// }

// const onmaximize = () => {
//     document.getElementById("size_changer").setAttribute("full", "true");
// }

// const onunmaximize = () => {
//     document.getElementById("size_changer").setAttribute("full", "false");
// }

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

// window.addEventListener("load", onload);