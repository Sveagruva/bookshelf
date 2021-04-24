const setReadedNow = async file => {
    let books = JSON.parse(fs.readFileSync(booksPath, "utf-8"));

    books.forEach(book => {
        if(book.file == file){
            book.last_read = new Date();
        }
    });

    fs.writeFile(booksPath, JSON.stringify(books), e=> e);
}

const backgroundsData = request => {
    if(request == "library.jpg") {
        return libraryBack;
    }else if(request == "book.jpg"){
        return bookBack;
    }else{
        return Buffer.from("not found", 'utf8');
    }
}

const updateBacks = () => {
    if(settings.library.background){
        libraryBack = fs.readFileSync(p.join(settings.app.backgroundsDir + settings.library.background));
    }

    if(settings.book.background){
        bookBack = fs.readFileSync(p.join(settings.app.backgroundsDir + settings.book.background));
    }
}