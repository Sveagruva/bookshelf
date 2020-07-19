class Epub{
    constructor(file){
        if(file.type != "application/epub+zip") throw "incorrect type";
        this.file = file;
        return (async file => {
            try{
                var ziper = new JSZip();
            }catch(ex){
                throw "can't create JSZip object";
            }
    
            var packag;
            var content;
            await ziper.loadAsync(file).then(async function(zip){
                let META_INF = zip.files["META-INF/container.xml"];
                if(META_INF == undefined) throw "meta info is not found";
                console.log(META_INF);
                await META_INF.async("string").then(async function(info){
                    let doc = new DOMParser().parseFromString(info, 'text/xml');
                    content = doc;
                    let rootfile = null; 
                    for (let rootfileTry of doc.querySelectorAll("rootfile")) {
                        if(rootfileTry.getAttribute("media-type") == "application/oebps-package+xml"){
                            rootfile = rootfileTry;
                            break;
                        }
                    }
                    if(rootfile == null) throw "no rootfile";
                    let path = rootfile.getAttribute("full-path");
                    if(path == undefined) throw "no path in rootfile";
                    let contentFile = zip.files[path];
                    if(contentFile == undefined) throw "incorrect path";
                    await contentFile.async("string").then(function(contentAsync){
                        packag = contentAsync;
                    });
                });
            },function(e){
                throw "Error while reading " + file.name + "with: " + e.message;
            });
            this.packag = packag;
            this.content = content;
            packag = null; content = null;
            return this;
        })(file);
    }
}