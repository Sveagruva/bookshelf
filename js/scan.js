const fs = require("fs");
const Epub = require('./epub');

module.exports = async (libraryPath, callback) => {
    let booksPath;
    if(process.platform === "win32") booksPath = libraryPath + ".epubreader\\book.json";
    else booksPath = libraryPath + ".epubreader/book.json";

    let coversPath;
    if(process.platform === "win32") coversPath = libraryPath + ".epubreader\\covers\\";
    else coversPath = libraryPath + ".epubreader/covers/";
    
    let progressPath;
    if(process.platform === "win32") progressPath = libraryPath + ".epubreader\\progress\\";
    else progressPath = libraryPath + ".epubreader/progress/";



    let books = JSON.parse(fs.readFileSync(booksPath, "utf-8"));

    var files = Array();
    var filesIndexed = Array();

    books.forEach(book => {
        filesIndexed.push(book.file);
    });

    fs.readdirSync(libraryPath).forEach(name => {
        if(fs.statSync(libraryPath + name).isFile()){
            files.push(name);
        }
    });

    let filesNotIndexed = files.filter(book => !filesIndexed.includes(book));

    let found = filesIndexed.filter(book => files.includes(book)); // remove books that are no longer there
    let toRemove = books.filter(book => !found.includes(book.file));
    books = books.filter(book => found.includes(book.file));

    toRemove.forEach(book => {
        fs.unlink(coversPath + book.file + ".bin", e => e);
        fs.unlink(progressPath + book.file + ".bin", e => e);
    });


    var beforePush = books.length;

    filesNotIndexed.forEach(async file => {
        let reading = await new Epub(libraryPath + file);
        var meta = {};

        reading.meta.forEach(me => {
            if(me["name"] != undefined && me["content"] != undefined){
                meta[me["name"]] = me["content"];
            }
        });

        reading.content[reading.root + reading.manifest[meta["cover"]].href].async("base64").then(async function(info){
            fs.writeFile(coversPath + file + ".bin", info, { overwrite: true }, e => e);
        });

        fs.writeFile(progressPath + file + ".bin", '{"page": 0, "elm": 0}', { overwrite: true }, e => e);

        books.push({
            "file": file,
            "name": meta["title"],
            "autor": meta["creator"],
            "time": meta["date"],
            "description": meta["description"]
        });

        reading = null;
        if(beforePush + filesNotIndexed.length == books.length){
            fs.writeFile(booksPath, JSON.stringify(books), e => {
                return callback();
            });
        }
    });

    if(filesNotIndexed.length == 0 && books.length != filesIndexed){
        fs.writeFile(booksPath, JSON.stringify(books), () => callback);
    }
}