const JSZip = require('jszip');
const fs = require('fs');
const parser = require('xml-js');

module.exports = class{constructor(file){
    this.file = file;
    this.name = file.split('\\').pop().split('/').pop();
    // this.name = name.substring(0, name.lastIndexOf("."));
    return (async (file) => {
        var ziper = new JSZip();

        var manifest = {};
        var content;
        var root = "";
        var meta = Array();
        var spine = Array();
        // there so much promises but I'm too lazy to refactor it :)
        await fs.promises.readFile(file).then(async data => {
            await ziper.loadAsync(data).then(async function(zip){
                content = zip.files;
                let META_INF = zip.files["META-INF/container.xml"];
                if(META_INF == undefined) throw "meta info is not found";
                await META_INF.async("string").then(async function(info){
                    let rootfile, path;
                    let json = JSON.parse(parser.xml2json(info));
    
                    try{rootfile = json.elements[0].elements[0].elements[0]; if(rootfile.name != "rootfile") throw "no rootfile";}
                    catch(e){throw "no rootfile"}
                    json = null;
    
                    try{path = rootfile.attributes["full-path"];}
                    catch{throw "no path in rootfile"}
    
                    let contentFile = zip.files[path];
                    if(contentFile == undefined) throw "incorrect path";
                    if(path.includes("/")) root = path.slice(0, path.lastIndexOf("/") + 1);
                    await contentFile.async("string").then(function(contentAsync){
                        let json = JSON.parse(parser.xml2json(contentAsync));
                        json = json.elements[0].elements;
    
                        const getObjectByName = (obj, name) => {
                            var index = null;
                            obj.forEach((e, i) => {
                                if(e.name == name) index = i;
                            });
                            if(index == null) throw "can't found: " + name;
                            return obj[index];
                        }
    
                        getObjectByName(json, "metadata").elements.forEach(e => {
                            if(e.name == "meta"){
                                if(e.attributes["name"] !== undefined){
                                    meta.push({
                                        "name": e.attributes["name"],
                                        "content": e.attributes["content"]
                                    });
                                }
                            }else if(e.name.slice(0, 3) == "dc:"){
                                meta.push({
                                    "name": e.name.slice(3),
                                    "content": e.elements[0].text
                                });
                            }
                        });

                        getObjectByName(json, "manifest").elements.forEach(e => {
                            manifest[e.attributes["id"]] = {
                                "href": e.attributes["href"],
                                "media_type": e.attributes["media-type"]
                            };
                        });

                        getObjectByName(json, "spine").elements.forEach(e => {
                            spine.push(e.attributes["idref"]);
                        });
                    });
                });
            }, function(e){
                throw "can't read " + file + " cz of this error: " + e.message;// Good code in my blood
            });
        });

        this.content = content;
        this.manifest = manifest;
        this.meta = meta;
        this.root = root;
        this.spine = spine;
        manifest = null; ziper = null; meta = null; content = null; spine = null;
        return this;
    })(file);
}}