;(function (){
    "use strict";

    let version = '0.0.1'
        ,lastUpdateDate = '20.11.2017';
    var isDebug = false                          //Flag debug mode
    ;

    /*
        Displaying messages in debug mode
        in: String msg - input object for output to the console
    */
    function debuglog(msg){
        if(!!isDebug) {console.log(msg)};
    }

    /*
        Object: ColorCode, constructor
    */
    function MenuBuilder(){
    }
    /*
        Object: ColorCode, return current version
        return: String - current version
    */
    function getVersion(){
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
        xhr.open('GET', path, false);
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
        _loadJSON(path||'', function(response) {
            try{
                actual_JSON = JSON.parse(response);
            }catch(ex){
                debuglog('MenuBuilder._load: Error parse JSON file.');
            }
        });
        return actual_JSON;
    };
    function create(path, elem){
        var jsonObject = _load(path);
        debuglog(jsonObject);

        let targetElem = document.querySelector(elem);
        debuglog(targetElem);
        let jsonKey = Object.keys(jsonObject);
        debuglog(jsonKey);
        if(jsonKey[0]=="menu"){
            let currentPage = window.location.pathname.toString();
            let ul = document.createElement("ul");
            ul.className = "nemuBuilder";
            debuglog(jsonObject[jsonKey[0]]);
            jsonObject[jsonKey[0]].forEach(function(item, i, arr){
                debuglog(item);

                let li = document.createElement('li');
                let linkPage = document.createElement('a');
                linkPage.href = item.url;
                linkPage.innerHTML = item.name;
                linkPage.className = currentPage == item.url ? "active" : "";
                li.appendChild(linkPage);
                ul.appendChild(li);
            })
            targetElem.appendChild(ul);
        }
    }
    /*
        Functions available from outside
    */
    MenuBuilder.getVersion = getVersion;
    MenuBuilder.create = create;
    /*
        "Export" the ColorCode to the outside of the module
    */
    window.MenuBuilder = MenuBuilder;
}());
