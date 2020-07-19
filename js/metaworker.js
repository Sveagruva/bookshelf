const metaCheck = meta => {
    if(meta.tagName == "meta" && meta.getAttribute("name") != null && meta.getAttribute("content") != null) return "meta"; 
    else if(meta.tagName.includes("dc:") && meta.textContent != "") return "dc";
    return "this string doen't matter";
}

const metaName = meta => {
    return meta.getAttribute("name");
}

const metaContent = meta => {
    return meta.getAttribute("content");
}

const dcName = meta => {
    return meta.tagName.slice(3);
}

const dcContent = meta => {
    return meta.textContent;
}

const meta2array = metaD => {
    switch (metaCheck(metaD)){
        case "dc":
            return {
                "name": dcName(metaD),
                "content": dcContent(metaD)
            };
        case "meta":
            return {
                "name": metaName(metaD),
                "content": metaContent(metaD)
            };
    }
}