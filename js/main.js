const {remote} = require('electron');
const fs = remote.require('fs');
const Epub = remote.require('./epub');

console.log(remote.process.platform);
let settingsPathLet;
if(remote.process.platform === "win32"){
    settingsPathLet = remote.app.getPath('exe').slice(0, remote.app.getPath('exe').lastIndexOf("\\") + 1);
}else{
    settingsPathLet = remote.app.getPath('exe').slice(0, remote.app.getPath('exe').lastIndexOf("/") + 1);
}

const settingsPath = settingsPathLet; 
settingsPathLet = null;

console.log(settingsPath);

fs.exists(settingsPath, (exists) => { 
    console.log(exists ? 'Found' : 'Not Found!');
});

window.onload = () => {
    document.getElementById("file").addEventListener('change', async event => {
        try {
            var epub = await new Epub(event.target.files[0]);
            console.log(epub);
            console.log(epub.file);
        } catch (error) {
            console.error(error);
        }
    });

    document.getElementById("close").addEventListener("click", () => {
        remote.getCurrentWindow().close();
    });

    document.getElementById("size_changer").addEventListener("click", () => {
        if(remote.getCurrentWindow().isMaximized()){
            document.getElementById("size_changer").setAttribute("full", "false");
            remote.getCurrentWindow().unmaximize();
        }else{
            remote.getCurrentWindow().maximize();
            document.getElementById("size_changer").setAttribute("full", "true");
        }
    });

    remote.getCurrentWindow().on('maximize',()=>{
        document.getElementById("size_changer").setAttribute("full", "true");
    });
    
    remote.getCurrentWindow().on('unmaximize',()=>{
        document.getElementById("size_changer").setAttribute("full", "false");
    });

    document.getElementById("minimize").addEventListener("click", () => {
        remote.getCurrentWindow().minimize();
    });
}