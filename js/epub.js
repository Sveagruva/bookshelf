class Epub{ constructor(file){
    if(file.type != "application/epub+zip") throw "incorrect type";
    this.file = file;
    return (async file => {
        try{
            var ziper = new JSZip();
        }catch(ex){
            throw "can't create JSZip object";
        }

        var manifest = {};
        var content;
        var root = "";
        var meta = Array();
        await ziper.loadAsync(file).then(async function(zip){
            content = zip.files;
            let META_INF = zip.files["META-INF/container.xml"];
            if(META_INF == undefined) throw "meta info is not found";
            await META_INF.async("string").then(async function(info){
                let parser = new DOMParser().parseFromString(info, 'text/xml');
                let rootfile = null; 
                for (let rootfileTry of parser.querySelectorAll("rootfile")) {
                    if(rootfileTry.getAttribute("media-type") == "application/oebps-package+xml"){
                        rootfile = rootfileTry;
                        break;
                    }
                }
                parser = null;
                if(rootfile == null) throw "no rootfile";
                let path = rootfile.getAttribute("full-path");
                if(path == undefined) throw "no path in rootfile";
                let contentFile = zip.files[path];
                if(contentFile == undefined) throw "incorrect path";
                if(path.includes("/")) root = path.slice(0, path.lastIndexOf("/") + 1);
                await contentFile.async("string").then(function(contentAsync){
                    let parser = new DOMParser().parseFromString(contentAsync, 'text/xml');
                    parser.querySelectorAll("package>metadata>*").forEach(metaD => {
                        meta.push(meta2array(metaD));
                    });

                    parser.querySelectorAll("package>manifest>item").forEach(item => {
                        manifest[item.getAttribute("id")] = {
                            "href": item.getAttribute("href"),
                            "media_type": item.getAttribute("media-type")
                        };
                    });
                    parser = null;
                });
            });
        }, function(e){
            throw "Error while reading " + file.name + "with: " + e.message;
        });

        this.content = content;
        this.manifest = manifest;
        this.meta = meta;
        this.root = root;
        manifest = null; content = null; ziper = null; meta = null;
        return this;
    })(file);
}}