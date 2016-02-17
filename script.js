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
        // that.elMenuContainer = document.getElementById("menu-container");

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
        };

        var getContainer = function() {
            if (!that.container)
                that.container = document.getElementById("menu-container");

            return that.container;
        };

        /**
         * Draws the menu according to the passed json data
         */
        var draw = function() {
            var ulMenu = document.createElement("ul");

            var i;
            for (i = 0; i < that.arrMainMenuItems.length; i++) {
                ulMenu.appendChild(that.arrMainMenuItems[i].draw());
            }

            getContainer().appendChild(ulMenu);
        };

        /**
         * Attaches event listeners to all menu items
         */
        var attachListeners = function() {
            getContainer().addEventListener("click", function(e) {
                if (e.target.id !== "")
                       displayContent(e.target.id);
            });
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
                draw();
                attachListeners();
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
        for (var key in value) {
            this[key] = value[key];
        }
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
        var li = document.createElement('li');
        li.setAttribute("id", this.id);
        li.setAttribute("class", this.cssClass);
        li.innerHTML = this.description;

        // Check for submenu nodes
        var arrSubMenu = this.menu;
        if (arrSubMenu !== null) {
            li.setAttribute("id", this.id);
            li.setAttribute("class", this.cssClass);
            li.setAttribute("style", "border-right: 5px solid orange");
            li.innerHTML = this.description;

            var ul = document.createElement("ul");
            ul.setAttribute("id", this.id);
            ul.setAttribute("style", "display: none");

            var j;
            for (j = 0; j < arrSubMenu.length; j++) {
                var innerLi = document.createElement("li");
                innerLi.setAttribute("id", arrSubMenu[j].id);
                innerLi.setAttribute("class", arrSubMenu[j].cssClass);
                innerLi.innerHTML = arrSubMenu[j].description;
                ul.appendChild(innerLi);
            }
            li.appendChild(ul);
        }
        
        return li;
    };


    var menu = new Menu();
    menu.init();
})();