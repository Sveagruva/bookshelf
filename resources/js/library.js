window.onload = () => {
    const createElementCl = clas => {
        let elm = document.createElement("div");
        elm.classList.add(clas);
        return elm;
    }

    const addText = (elm, tx) => {
        if(tx === undefined) return elm;
        elm.appendChild(document.createTextNode(tx));
        return elm;
    }

    const createBook = book => {
        let bookElm = createElementCl("book");
        let img = document.createElement("img");
        img.setAttribute("src", `/cover/${book.file}.jpg`);
        let cover = createElementCl("cover");
        cover.appendChild(img)
        bookElm.appendChild(cover);

        let info = createElementCl("info");
        info.appendChild(addText(createElementCl("name"), book.name));
        info.appendChild(addText(createElementCl("autor"), book.autor));
        info.appendChild(addText(createElementCl("time"), book.time));
        info.appendChild(addText(createElementCl("description"), book.description));
        info.appendChild(addText(createElementCl("file"), book.file));
        info.appendChild(addText(createElementCl("last_read"), book.last_read));

        bookElm.appendChild(info);

        return bookElm;
    }

    const books = document.getElementById("books");
    if(varibs.libraryBack){
        books.style.backgroundImage = 'url("/background/library.jpg")';
    }

    var mode = varibs.order;
    var lib = varibs.books;

    if(mode == "none_added"){
        // none_added is already done
    }else if(mode == "none_abc"){
        lib = lib.sort((a, b) => abcSort(a, b));
    }else{
        var wasReaded = lib.filter(book => book.last_read != "never");
        let wasNotReaded = lib.filter(book => book.last_read == "never");

        wasReaded.sort((a,b) => {
            return new Date(b.last_read) - new Date(a.last_read);
        });

        if(mode == "last_abc") wasNotReaded.sort((a, b) => abcSort(a, b));

        lib = wasReaded.concat(wasNotReaded);
    }

    lib.forEach(book => {
        books.appendChild(createBook(book));
    });


    document.querySelectorAll("#books>.book").forEach(book1 => {
        book1.addEventListener('click', book => {
            book = book.currentTarget ;
            document.querySelector("#info .meta .title").textContent = book.querySelector(".info .name").textContent;
            document.querySelector("#info .meta .creator").textContent = book.querySelector(".info .autor").textContent;
            document.querySelector("#info .meta .time").textContent = book.querySelector(".info .time").textContent;
            document.querySelector("#info .meta .description").textContent = book.querySelector(".info .description").textContent;
            document.querySelector("#info .meta .file").textContent = book.querySelector(".info .file").textContent;
        });
    });

    document.querySelector("#info .continue").addEventListener("click", event => {
        let file = document.querySelector("#info .file").textContent;
        if(file === undefined) return;
        toBook(file);
    });
}

const abcSort = (a, b) => {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    return 0;
};