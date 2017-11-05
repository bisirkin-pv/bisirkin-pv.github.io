;(function (){    
    "use strict";
    
    let version = '0.0.5'
        ,lastUpdateDate = '21.08.2017';         
    var isDebug = true                          //Flag debug mode
        ,syntax = {}                            //Stores downloaded syntaxes
        ,htmldata = 'data-colorCode'            //Attribute to find the syntax for highlighting
        ,isUpperCase = false                    //Global, attribute to bring everything to the upper case or not
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
    function ColorCode(){
    }
        
    /*  
        Object: ColorCode, return current version
        return: String - current version
    */
    function getVersion(){
        return version;
    }
    
    /*  
        Object: ColorCode, Sets the value for the uppercase attribute
        In: Boolean isUpper - flag uppercase
    */
    function setUpperCase(isUpper){
        isUpperCase = !!isUpper;
    }
    /*
        Object: ColorCode, Return last change date
        return: String - current last change date
    */
    function getLastUpdateDate(){
        return lastUpdateDate;
    }
            
    /*
        Object: ColorCode, private, Downloading the file in JSON format
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
        Object: ColorCode, private, Filling out the JSON file
        In: String path - path to JSON file containing the syntax
        return: Object actual_JSON - Processed JSON object.
    */
    function _load(path) {
        var actual_JSON = {};
        _loadJSON(path||'', function(response) {
            try{
                actual_JSON = JSON.parse(response);                
            }catch(ex){
                debuglog('ColorCode.load: Error parse JSON file.');
            }
        });
        return actual_JSON;
    };
        
    /*  
        Object: Code, private, the object stores data on the element for highlighting and parameters
        In: String tag - Element for highlighting
        In: Int bold - value property ccs "font-weight"
        In: String color - value property ccs "color"
    */
    function _Code(tag, bold, color, type){
            this.tag = tag;
            this.bold = bold;
            this.color = color;
            this.type = type;
    }
        
    /*
        Object: _Syntax, private, the object stores the _code objects for a specific syntax
        In: String name - Syntax name
    */
    function _Syntax(name){
        this.name = name;
        this.codeBase = [];
    }
    _Syntax.prototype.add = function(tag, bold, color, type){
        this.codeBase.push(new _Code(tag, bold, color, type||"word"));
    }
    
    /*
        Object: ColorCode, Add syntax
        In: String path - path to the JSON file
    */
    function addSyntax(path){
        var jsonObject = _load(path);
        let jsonKey = Object.keys(jsonObject);
         var bold = ""
            ,color = ""
            ,type = "";
        syntax[jsonKey] = new _Syntax(jsonKey[0]);
        for(var i = 0; i < jsonObject[jsonKey].length; i++){
            Object.keys(jsonObject[jsonKey][i]).map(function(objectKey, index) {
                var value = jsonObject[jsonKey][i][objectKey];
               
                if(objectKey=="bold"){
                    bold = value;
                }
                if(objectKey=="color"){
                    color = value;
                }
                if(objectKey=="type"){
                    type = value;
                }                
                if(typeof value =="object"){
                     Object.keys(value).map(function(tagKey, indexTag) {
                         var value = jsonObject[jsonKey][i][objectKey][tagKey];
                         syntax[jsonKey].add(value.name, bold, color, type);
                     });
                }
            });
        };
        _addStyle(jsonObject);
    }
    
    /*
        Object: ColorCode, add CSS styles
        In: JSON jsonObject - file JSON
    */
    function _addStyle(jsonObject){
        var style = document.createElement("style");
        style.type = 'text/css';
        let jsonKey = Object.keys(jsonObject)
            ,name = jsonKey[0];        
        for(var i = 0; i < jsonObject[jsonKey].length; i++){
            var bold = "";
            Object.keys(jsonObject[jsonKey][i]).map(function(objectKey, index) {
                var value = jsonObject[jsonKey][i][objectKey];
                if(objectKey=="color"){
                    style.innerText = style.innerText + "." + name + "-" + value.substring(1) + "{color:" + value;
                }
                if(objectKey=="bold"){
                    bold = ";font-weight:"+value;
                }
            });
            if(style.innerText!=''){
                style.innerText = style.innerText + bold + "}";                
            }
        style.appendChild(document.createTextNode(""));
        }
        document.head.appendChild(style);
    }

    /* 
        Object: _CodeBlock, creates a text block with text and highlighting
        in: txt - текст для поиска и замены        
        in: syntax - синтаксис текста
        return: txt - итоговый текст обернутый
    */
    function _CodeBlock(txt, syntax){
        if(typeof syntax != "object") {return "";}
        txt = _clearHtml(txt);
        for(var i = 0; i < syntax.codeBase.length; i++){            
            let tag = "";            
            if(syntax.codeBase[i].type=="word"){
                tag = "\\b(" + syntax.codeBase[i].tag + ")\\b";
            }else {
                if(syntax.codeBase[i].type=="regexp"){
                    tag = syntax.codeBase[i].tag;
                }
            }
            if(tag==""){return "";}
            let regexp = new RegExp(tag, "gim");
            
            var pretxt = "";
            if (isUpperCase) {                       
                txt = txt.replace(regexp,'<span class='+syntax.name + '-'+syntax.codeBase[i].color.substring(1)+'>'+syntax.codeBase[i].tag.toUpperCase()+'</span>');
            }else{
                txt = txt.replace(regexp,'<span class='+syntax.name + '-'+syntax.codeBase[i].color.substring(1)+'>$1</span>');               
            }
        }
        
        return txt;
    }
        
    /* 
        Object: ColorCode, replace all <,> on html code
        in: input string
        return: clear string
    */
    function _clearHtml(txt){
        txt = txt.replace(new RegExp('<','g'),'&#8249;');
        txt = txt.replace(new RegExp('>','g'),'&#8250;');
        return txt;
    }
        
    /*
        Object: ColorCode, searches all items for pages and adds them backlight
        In: String selectorSource - css selector to element with text
        In: String selectorTarget - css selector to element to insert text
        In: bool isRemove - flag to delete the source element or not
    */
    function init(selectorSource, selectorTarget, isRemove){
        var sourceElement = document.querySelector(selectorSource)
            ,txt = ""
            ,elemText = ""
        ;
        if(sourceElement.value){
            elemText = sourceElement.value;
        }else if(sourceElement.innerHTML){
            elemText = sourceElement.innerHTML;
        }
        txt = _CodeBlock(elemText, syntax[sourceElement.getAttribute(htmldata)]); 
        if(txt==""){return 0;}
        let targetElement = document.querySelector(selectorTarget);
        if(targetElement==null){
            sourceElement.insertAdjacentHTML("afterEnd", '<pre class="colorCode" id="colorCode"><code>' + txt +'</code></pre>');
        }else{            
            targetElement.innerHTML = txt;   
            targetElement.className = "colorCode";
        }
                
        if(isRemove){
            sourceElement.remove();
        }
    }
        
    /*
        Object: ColorCode, sets the listener for updates when the focus is lost
        In: String selectorSource - css selector to element with text
        In: String selectorTarget - css selector to element to insert text
    */
    function addListener(sourceElementId, targetElementId){
        let sourceElement = document.querySelector(sourceElementId);
        let action = "input";
                sourceElement.addEventListener(action, function(obj){                    
                    init(sourceElementId, targetElementId, false)    
                }, true);
    }
    
    /*
        Functions available from outside
    */
    ColorCode.getVersion = getVersion;
    ColorCode.getLastUpdateDate = getLastUpdateDate;
    ColorCode.addSyntax = addSyntax;
    ColorCode.init = init;
    ColorCode.addListener = addListener;
    ColorCode.setUpperCase = setUpperCase;

    /*
        "Export" the ColorCode to the outside of the module
    */
    window.ColorCode = ColorCode;
}());