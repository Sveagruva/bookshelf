window.onload = () => {
    document.querySelector("#info .continue").addEventListener("click", event => {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/openbook/hp asdf", true);
        xhttp.send();
    });
}