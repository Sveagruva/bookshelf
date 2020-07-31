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

        bookElm.appendChild(info);

        return bookElm;
    }

    const books = document.querySelector("#books");
    varibs.books.forEach(book => {
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

        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/openbook/" + file, true);
        xhttp.send();
    });
}