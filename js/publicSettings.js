module.exports = {
    "css": [
        {
            "name": "primary color",
            "type": "color",
            "setting_name": "primary"
        },{
            "name": "accent color",
            "type": "color",
            "setting_name": "accent"
        },{
            "name": "accent-focus color",
            "type": "color",
            "setting_name": "accent-focus"
        },{
            "name": "accent-focus color when hover",
            "type": "color",
            "setting_name": "accent-focus-hover"
        },{
            "name": "text color",
            "type": "color",
            "setting_name": "text"
        },{
            "name": "gap between books when view is set to bookshelf",
            "type": "text",
            "setting_name": "library-gap"
        },{
            "name": "height of book when view is set to list",
            "type": "text",
            "setting_name": "list-height"
        },{
            "name": "padding of open book",
            "type": "text",
            "setting_name": "book-padding"
        },{
            "name": "font-family",
            "type": "text",
            "setting_name": "font-family"
        },{
            "name": "gap between pages when book is displayed in two pages",
            "type": "text",
            "setting_name": "pages-gap"
        }
    ], "library": [
        {
            "name": "library view",
            "type": "option",
            "setting_name": "view",
            "options": [
                {
                    "name": "bookshelf",
                    "value": "bookshelf"
                },{
                    "name": "list_full",
                    "value": "list_full"
                },{
                    "name": "list_short",
                    "value": "list_short"
                }
            ]
        },{
            "name": "library location",
            "type": "folder",
            "setting_name": "path"
        },{
            "name": "library background",
            "type": "image",
            "setting_name": "background"
        },{
            "name": "how to sort books in library",
            "type": "option",
            "setting_name": "order",
            "options": [
                {
                    "name": "last opened and them in alphabetical order",
                    "value": "last_abc"
                },{
                    "name": "last opened and them in order that they were added",
                    "value": "last_added"
                },{
                    "name": "sort all in alphabetical order",
                    "value": "none_abc"
                },{
                    "name": "sotr all in order that they were added",
                    "value": "none_added"
                }
            ]
        }
    ], "book": [
        {
            "name": "book view",
            "type": "option",
            "setting_name": "view",
            "options": [
                {
                    "name": "auto",
                    "value": "auto"
                },{
                    "name": "two pages",
                    "value": "two_pages"
                },{
                    "name": "one page",
                    "value": "one_page"
                }
                // },{
                //     "name": "scroll",
                //     "value": "scroll"
                // }
            ]
        },{
            "name": "book background",
            "type": "image",
            "setting_name": "background"
        }
    ]
}
