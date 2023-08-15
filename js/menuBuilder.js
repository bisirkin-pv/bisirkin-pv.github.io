(function () {
  "use strict";

  let version = "0.0.2",
    lastUpdateDate = "06.08.2023";
  var isDebug = false; //Flag debug mode
  let _menu = null;
  /*
        Displaying messages in debug mode
        in: String msg - input object for output to the console
    */
  function debuglog(msg) {
    if (!!isDebug) {
      console.log(msg);
    }
  }

  /*
        Object: ColorCode, constructor
    */
  function MenuBuilder() {}
  /*
        Object: ColorCode, return current version
        return: String - current version
    */
  function getVersion() {
    return version;
  }
  /*
        Object: MenuBuilder, private, Downloading the file in JSON format
        In: String path - path to JSON file containing the syntax
        In: Function callback - function performed when the file is received
    */
  function _loadJSON(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", path, false);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == "200") {
        callback(xhr.responseText);
      }
    };
    xhr.send(null);
  }

  /*
        Object: MenuBuilder, private, Filling out the JSON file
        In: String path - path to JSON file containing the syntax
        return: Object actual_JSON - Processed JSON object.
    */
  function _load(path) {
    var actual_JSON = {};
    _loadJSON(path || "", function (response) {
      try {
        actual_JSON = JSON.parse(response);
        _menu = actual_JSON;
      } catch (ex) {
        debuglog("MenuBuilder._load: Error parse JSON file.");
      }
    });
    return actual_JSON;
  }
  function create(path, elem) {
    var jsonObject = _load(path);
    debuglog(jsonObject);

    let targetElem = document.querySelector(elem);
    debuglog(targetElem);
    let jsonKey = Object.keys(jsonObject);
    debuglog(jsonKey);
    if (jsonKey[0] == "menu") {
      let currentPage = window.location.pathname.toString();
      let ul = document.createElement("ul");
      ul.className = "menu-builder";
      debuglog(jsonObject[jsonKey[0]]);
      jsonObject[jsonKey[0]].forEach(function (item, i, arr) {
        debuglog(item);

        let li = document.createElement("li");
        li.setAttribute("data-url", item.url);
        let iconBlock = document.createElement("span");
        let icon = document.createElement("img");
        iconBlock.className = "menu-icon";
        if (item.icon) {
          icon.src = `${item.icon}`;
          icon.height = 32;
          icon.width = 32;
          iconBlock.appendChild(icon);
        }
        
        
        let linkPage = document.createElement("span");
        linkPage.className = "menu-title";
        linkPage.innerHTML = item.name;
        li.className = currentPage == item.url ? "active" : "";
        li.appendChild(iconBlock);
        li.appendChild(linkPage);
        ul.appendChild(li);
      });
      targetElem.appendChild(ul);
    }
  }

  function getMenuItems(){
    return _menu;
  }
  /*
        Functions available from outside
    */
  MenuBuilder.getVersion = getVersion;
  MenuBuilder.create = create;
  MenuBuilder.getMenuItems = getMenuItems;
  /*
        "Export" the ColorCode to the outside of the module
    */
  window.MenuBuilder = MenuBuilder;
})();
