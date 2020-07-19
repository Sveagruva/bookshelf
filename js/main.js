window.onload = () => {
    document.getElementById("file").addEventListener('change', async event => {
        let epub = await new Epub(event.target.files[0]);
        // epub = null;
        console.log(epub);
    });
}