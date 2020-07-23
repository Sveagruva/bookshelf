// String.prototype.toElm = function(number){
//     var div = document.createElement('div');
//     div.innerHTML = this;

//     // Change this to div.childNodes to support multiple top-level nodes
//     if(number === undefined){
//         return div.firstChild;
//     }else{
//         try {
//             return div.childNodes[number];
//         }catch(e){
//             return div.firstChild;
//         }
//     }
// }


const createIframe = (parent, scr) => {
    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", scr);
    // ifrm.style.width = "640px";
    // ifrm.style.height = "480px";
    parent.appendChild(ifrm);
    return ifrm;
}

window.onload = async () => {
    const content = document.getElementById("content");
    content.appendChild(document.createElement('div'));
    const bookElm = document.querySelector("#content div");
    bookElm.setAttribute("id", "book");

    if(spine.length > 2){
        for (let i = 0; i < 3; i++) {        
            let ifrm = createIframe(bookElm, spine[i]);
            ifrm.onload = () => {
                let style = document.createElement('style');style.type = 'text/css';style.media = 'screen';
                style.textContent = `body{
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    column-gap: 28px !important;
                    column-count: 2 !important;
                }
                
                html{
                    height: 100%;
                    width: 100%;
                }`;
                console.log(ifrm);
                // console.log(ifrm.document);
                ifrm.contentDocument.head.appendChild(style);
            }
        }

        document.querySelectorAll("iframe").forEach(e => {

        });
    }else if(spine.length == 2){

    }else{

    }
}