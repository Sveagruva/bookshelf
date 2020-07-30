window.onload = () => {
    document.querySelector("#info .continue").addEventListener("click", event => {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/openbook/hp asdf", true);
        xhttp.send();
    });

    document.querySelectorAll(".book .click_area").forEach(book => {
        book.addEventListener('click', book => {
            book = book.target.parentElement;
            document.querySelector("#info .meta .title").textContent = book.querySelector(".info .name").textContent;
            document.querySelector("#info .meta .creator").textContent = book.querySelector(".info .autor").textContent;
            document.querySelector("#info .meta .time").textContent = book.querySelector(".info .time").textContent;
            document.querySelector("#info .meta .description").textContent = book.querySelector(".info .description").textContent;
            console.log(book);
        });
    });
}