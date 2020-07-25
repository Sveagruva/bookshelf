// const fs = remote.require('fs');
// const Epub = remote.require('./epub');

// console.log(remote.process.platform);
// let settingsPathLet;
// if(remote.process.platform === "win32"){
//     settingsPathLet = remote.app.getPath('exe').slice(0, remote.app.getPath('exe').lastIndexOf("\\") + 1);
// }else{
//     settingsPathLet = remote.app.getPath('exe').slice(0, remote.app.getPath('exe').lastIndexOf("/") + 1);
// }

// const settingsPath = settingsPathLet; 
// settingsPathLet = null;

// console.log(settingsPath);

// fs.exists(settingsPath, (exists) => { 
//     console.log(exists ? 'Found' : 'Not Found!');
// });

window.onload = () => {
    // document.getElementById("file").addEventListener('change', async event => {
    //     try {
    //         let dir = await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
    //             properties: ['openDirectory']
    //         });
    //         console.log(dir);
    //         if(event.target.files[0].type != "application/epub+zip") throw "incorrect type";
    //         var epub = await new Epub(event.target.files[0].path);
    //         console.log(epub);
    //         console.log(epub.file);
    //     }catch (error) {
    //         console.error(error);
    //     }
    // });

    document.querySelector("#info .continue").addEventListener("click", event => {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/openbook/hp asdf", true);
        xhttp.send();
        // remote.getCurrentWindow().loadFile("/app/html/book.html");
    });
}