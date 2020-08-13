const createElementCl = clas => {
    let elm = document.createElement("div");
    elm.classList.add(clas);
    return elm;
}

const createElementH2 = () => {
    let elm = document.createElement("h2");
    return elm;
}

const addText = (elm, tx) => {
    if(tx === undefined) return elm;
    elm.appendChild(document.createTextNode(tx));
    return elm;
}

const createInput = (type, name, id, value) => {
    let input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    input.setAttribute("id", id);
    if(value !== undefined) input.setAttribute("value", value);
    return input;
}

const createOption = (id, options, value) => {
    let select = document.createElement("select");
    select.setAttribute("id", id);
    
    options.forEach(item => {
        let option = document.createElement("option");
        option.setAttribute("value", item.value);
        option.textContent = item.name;
        select.appendChild(option);
    });

    select.value = value;

    return select;
}

const toShow = JSON.parse(varibs.toShow);
const settings = JSON.parse(varibs.settings);
const settingsPath = varibs.settingsPath;

const saveImg = (name, elm) => {
    fileDialog({ multiple: false, accept: "image/*" }).then(files => {
        move(files[0].path, settings.app.backgroundsDir + files[0].name + "." + name + ".bin").then(() => {});
        elm.setAttribute("value", files[0].name + "." + name + ".bin");
        let removeelm = createElementCl("remove");
        elm.before(addText(removeelm, "remove"));
        removeelm.setAttribute("onclick", `removeValueFrom(${elm.getAttribute("id")});`);
    });
}


window.onload = () => {
    const content = document.getElementById("content");
    const settingsElm = document.createElement("div");
    settingsElm.setAttribute("id", "settings_container");
    settingsElm.appendChild(document.createElement("form"));
    content.appendChild(settingsElm);

    const form = document.querySelector("#settings_container>form");

    for(let key in toShow){
        form.appendChild(addText(createElementH2(), key));

        toShow[key].forEach(item => {
            let itemLol = createElementCl("item");

            itemLol.appendChild(addText(createElementCl("name"), item.name));
            let value = createElementCl("value");
            let batn;

            switch (item.type){
                case "color":
                    value.appendChild(createInput("color", item.setting_name, key + "__" + item.setting_name, settings[key][item.setting_name]));
                    break;
                case "text":
                    value.appendChild(createInput("text", item.setting_name, key + "__" + item.setting_name, settings[key][item.setting_name]));
                    break;
                case "option":
                    value.appendChild(createOption(key + "__" + item.setting_name, item.options, settings[key][item.setting_name]));
                    break;
                case "image":
                    batn = createElementCl("choose");
                    batn.setAttribute("id", key + "__" + item.setting_name);
                    value.appendChild(addText(batn, "choose"));
                    if(settings[key][item.setting_name]) {
                        let removeelm = createElementCl("remove");
                        batn.before(addText(removeelm, "remove"));
                        removeelm.setAttribute("onclick", `removeValueFrom(${batn.getAttribute("id")});`);
                    }
                    break;
                case "folder":
                    batn = createElementCl("choose");
                    batn.setAttribute("id", key + "__" + item.setting_name);
                    value.appendChild(addText(batn, "choose"));
                    // let elm = createInput("file", item.setting_name, key + "__" + item.setting_name, settings[key][item.setting_name]);
                    // elm.toggleAttribute("webkitdirectory")
                    // value.appendChild(elm);
                    break;
            }

            itemLol.appendChild(value);
            form.appendChild(itemLol);
        });
    }

    let save = document.createElement("div");
    save.setAttribute("id", "save");
    save.textContent = "save";
    let bar = createElementCl("bar");
    bar.appendChild(save);

    form.appendChild(bar);

    document.getElementById("library__background").addEventListener("click", saveLibrary);
    document.getElementById("book__background").addEventListener("click", saveBook);
    document.getElementById("library__path").addEventListener("click", choosePath);

    save.addEventListener("click", saveSettings);
}

const saveLibrary = () => {
    saveImg("library", document.getElementById("library__background"));
}

const saveBook = () => {
    saveImg("book", document.getElementById("book__background"));
}

const choosePath = () => {
    fileDialog({ multiple: false, folder: true }).then(files => {
        console.log(files);
        let path = process.platform === "win32" ? files[0].path.slice(0, files[0].path.lastIndexOf("\\") + 1) : files[0].path.slice(0, files[0].path.lastIndexOf("/") + 1);
        document.getElementById("library__path").setAttribute("value", path);
    });
}

const saveSettings = () => {
    let newSettings = Object.assign({}, settings);

    for(let key in toShow){
        toShow[key].forEach((item, i) => {
            let elm = document.getElementById(key + "__" + item.setting_name);

            switch (item.type){
                case "option":
                    newSettings[key][item.setting_name] = elm.options[elm.selectedIndex].value;
                    break;
                case "image":
                    if(elm.getAttribute("value") != undefined){
                        newSettings[key][item.setting_name] = elm.getAttribute("value");
                    }else{
                        newSettings[key][item.setting_name] = false;
                    }
                    break;
                case "folder":
                    if(elm.getAttribute("value") != undefined){
                        newSettings[key][item.setting_name] = elm.getAttribute("value");
                    }
                    break;
                default:
                    newSettings[key][item.setting_name] = elm.value;
            }
        });
    }

    fs.writeFile(settingsPath, JSON.stringify(newSettings), e => sendRequest("/reloadSettings"));
}

const closing = () => {
    document.removeEventListener("close", closing);
    document.getElementById("library__background").removeEventListener("click", saveLibrary);
    document.getElementById("book__background").removeEventListener("click", saveBook);
    document.getElementById("library__path").removeEventListener("click", choosePath);
    save.removeEventListener("click", saveSettings);
}

document.addEventListener("close", closing);

const removeValueFrom = elm => {
    elm.removeAttribute("value");
    elm.parentElement.querySelector(".remove").remove();
}