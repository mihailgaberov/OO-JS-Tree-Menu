/**
 * OO JS task - Tree menu
 *
 * @author: Mihail Gaberov
 * @email: me@mihail-gaberov.eu
 */
(function () {
    "use strict";
    /**
     * Main menu object
     * Responsible for loading and parsing JSON, initialize and draw the tree menu
     * @constructor
     */
    function Menu() {
        var that = this;
        that.arrAllMenuObjects = [];
        that.arrMainMenuItems = [];

        var loadJSON = function (callback) {
            var xobj = new XMLHttpRequest();

            xobj.overrideMimeType("application/json");
            xobj.open("GET", "menu.json", true);

            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        };

        /**
         * Converts json data to js objects
         * @param jsonData
         */
        var convertData = function(jsonData) {
            var arrMenu = jsonData.menu;

            var i;
            for (i = 0; i < arrMenu.length; i++) {
                var menuItem = new MenuItem(arrMenu[i]);
                that.arrMainMenuItems.push(menuItem);
                that.arrAllMenuObjects.push(menuItem);

                var arrSubMenu = menuItem.menu;
                if (arrSubMenu !== null) {
                    var j;
                    for (j = 0; j < arrSubMenu.length; j++) {
                        var subMenuItem = new MenuItem(arrSubMenu[j]);
                        that.arrAllMenuObjects.push(subMenuItem);
                    }
                }
            }

            draw();
        };

        /**
         * Draws the menu according to the passed json data
         */
        var draw = function() {
            var strMenuHtml = "";

            var i;
            for (i = 0; i < that.arrMainMenuItems.length; i++) {
                strMenuHtml += that.arrMainMenuItems[i].draw();
            }

            var container = document.getElementById("menu-container");
            var ulMenu = document.createElement("ul");
            ulMenu.innerHTML = strMenuHtml;
            container.appendChild(ulMenu);

            attachListeners();
        };

        /**
         * Attaches event listeners to all menu items
         */
        var attachListeners = function() {
            var arrElements = document.getElementsByTagName('li');

            var i;
            for (i = 0; i < arrElements.length; i++) {
                var elementId = arrElements[i].getAttribute("id");
                document.getElementById(elementId).addEventListener("click", function (e) {
                    displayContent(e.currentTarget.id);
                    e.stopPropagation();
                });
            }
        };

        var displayContent = function(itemId) {
            that.arrAllMenuObjects.map(function (obj) {
                if (obj.id === itemId) {
                    obj.displayContent();
                }
            });
            toggleSubMenuItems(itemId);
        };

        var toggleSubMenuItems = function(itemId) {
            var clickedItem = document.getElementById(itemId);

            // If there is a submenu - toggle it
            if (clickedItem.children.length > 0) {
                var isDisplayed = clickedItem.firstElementChild.style.display;
                clickedItem.firstElementChild.style.display = (isDisplayed === 'block' ? 'none' : 'block');
            }

        };

        /**
         * Initialize the project
         */
        this.init = function() {
            loadJSON(function (response) {
                // Parse JSON string into object
                try {
                    var actualJson = JSON.parse(response);
                } catch (e) {
                    throw new Error("Failed loading JSON source file.");
                }

                convertData(actualJson);
            });
        };
    }

    /**
     * Menu Item object
     * Containing all the info the a menu element.
     *
     * @constructor
     */
    function MenuItem(value) {
        this.id = value.id;
        this.leaf = value.leaf;
        this.description = value.description;
        this.link = value.link;
        this.content = value.content;
        this.cssClass = value.cssClass;
        this.menu = value.menu;
    }

    /**
     * Displays the content of a selected menu on the page
     */
    MenuItem.prototype.displayContent = function displayContent() {
        document.getElementById("content").innerHTML = this.content;
    };


    /**
     * Returns the HTML needed to draw a menu item and its sub items if any
     * @returns {string}
     */
    MenuItem.prototype.draw = function draw() {
        var strHtml = "<li id='" + this.id + "' class='" + this.cssClass + "'>" + this.description + "</li>";

        // Check for submenu nodes
        var arrSubMenu = this.menu;
        if (arrSubMenu !== null) {
            strHtml = "<li style='border-right: 5px solid orange;' id='" + this.id + "' class='" + this.cssClass + "'>" + this.description +
                "<ul id='" + this.id + "' style='display: none;'>";
            var j;
            for (j = 0; j < arrSubMenu.length; j++) {
                strHtml += "<li id='" + arrSubMenu[j].id + "' class='" + arrSubMenu[j].cssClass + "'>" + arrSubMenu[j].description + "</li>";
            }
            strHtml += "</ul></li>";
        }

        return strHtml;
    };


    var menu = new Menu();
    menu.init();
})();