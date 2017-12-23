;(function (){    
    "use strict";
    
    let version = '0.0.5'
        ,lastUpdateDate = '23.12.2017';
    var isDebug = true                        //Flag debug mode
        ,mainClass = "dgkbg-block"            //Class on main block
        ,targetElementId                      //Id element for inset keyboard
    ;
    /*
        Object: DigitalKeyboard, constructor
    */
    function DigitalKeyboard(){
    }   
    /*  
        Object: DigitalKeyboard, return current version
        return: String - current version
    */
    function getVersion(){
        return version;
    }
    /*  
        Object: DigitalKeyboard, return main element
        return: HTMLNode - main element
    */
    function getKeyboardElement(){
        return document.querySelector(targetElementId);
    }
    /*  
        Object: DigitalKeyboard, return HTML template keyboard
        return: String - HTML
    */
    function _templateHTML(){
        return '\
        <div class="'+mainClass+'" ">\
            <input type="password" id="dgkbg_pass" value="" hidden>\
            <div data-number="1"><span></span></div>\
            <div data-number="2"><span></span></div>\
            <div data-number="3"><span></span></div>\
            <div data-number="4"><span></span></div>\
            <div data-number="5"><span></span></div>\
            <div data-number="6"><span></span></div>\
            <div data-number="7"><span></span></div>\
            <div data-number="8"><span></span></div>\
            <div data-number="9"><span></span></div>\
            <div id="dgkbg_clear" class="dgkbg-hidden"><span class="dgkbg-hidden"></span></div>\
            <div data-number="0"><span></span></div>\
            <div id="dgkbg_enter" class="dgkbg-hide"><span class="dgkbg-hide"></span></div>\
        </div>'
    }
    /*  
        Object: DigitalKeyboard, private, display of control buttons depending on the current state
    */
    function _observeInput(elem){
        let elemClear = document.querySelector("#dgkbg_clear");
        let elemEnter = document.querySelector("#dgkbg_enter");
        let elemClearS = document.querySelector("#dgkbg_clear span");
        let elemEnterS = document.querySelector("#dgkbg_enter span");
        if(elem.value.length>0){
            elemClear.className = "dgkbg-clear";
            elemClearS.className = "dgkbg-clear";
            if(elem.value.length>5){
                elemEnter.className = "dgkbg-enter";
                elemEnterS.className = "dgkbg-enter";
            }
        }else{
            elemClear.className =  "dgkbg-hidden";
            elemClearS.className = "dgkbg-hidden";
            elemEnter.className = "dgkbg-hide";
            elemEnterS.className = "dgkbg-hide";
        }

    }
    /*  
        Object: DigitalKeyboard, private, set listener of control buttons
    */
    function _setListeners(){
        let sourceElement = document.querySelectorAll(".dgkbg-block div:not(.dgkbg-hidden):not(.dgkbg-hide)");
        let action = "click";
        sourceElement.forEach( 
          function(currentValue, currentIndex, listObj) { 
            currentValue.addEventListener(action, function(obj){                    
                let dgkbgPass = document.querySelector("#dgkbg_pass");
                dgkbgPass.value += currentValue.getAttribute('data-number');
                _observeInput(dgkbgPass);
            }, true);
          }
        );
        
        var controlElement = document.querySelector("#dgkbg_clear");
        controlElement.addEventListener(action, function(obj){                    
            let dgkbgPass = document.querySelector("#dgkbg_pass");
            dgkbgPass.value = "";
            _observeInput(dgkbgPass);
        }, true);    
    }
    /*  
        Object: DigitalKeyboard, set callback function on press "enter" button
        In: Function fnc - callback function
    */
    function setActionOnEnter(fnc){
        var controlElement = document.querySelector("#dgkbg_enter");
        controlElement.addEventListener("click", function(obj){                    
            let dgkbgPass = document.querySelector("#dgkbg_pass");
            fnc(dgkbgPass);
            dgkbgPass.value = "";
            _observeInput(dgkbgPass);
            showOrHide(this);
        }, true);
    }
    /*  
        Object: DigitalKeyboard, Show or hide keyboard
        In: String elem - the selector on which the call occurred
    */
    function showOrHide(elem){
            let el = getKeyboardElement();
            if(el.style.display=="none"){
                el.style.left = elem.getBoundingClientRect().left + "px";
                let cl = document.documentElement;
                if(cl.clientHeight < elem.getBoundingClientRect().bottom + 202){
                    if((elem.getBoundingClientRect().top - 202)<0){
                        el.style.top = "2px";
                        el.style.left = (elem.getBoundingClientRect().right + 2) + "px";
                    }else {
                        el.style.top = (elem.getBoundingClientRect().top - 202) + "px";
                    }
                }else{
                    el.style.top = elem.getBoundingClientRect().bottom+2 +"px";
                }
                el.style.display = "block";
            }else{
                el.style.display = "none"
            }
    }
    /*
        in dev
    */
    function _addShowListener(sourceElementId){
        let sourceElement = document.querySelector(sourceElementId);
//        let action = "click";
//                sourceElement.addEventListener(action, function(obj){                    
//                    showOrHide(this);
//                }, true);
        sourceElement.onclick = function(event) {
            var target = event.target; // где был клик?

            if (target.className != "block") return;
            showOrHide(target);
          
        };
        }
    /*  
        Object: DigitalKeyboard, private, set style on main element
        In: String elem - the selector on which the call occurred
    */
    function _setStyleOnBlock(){
        let el = document.querySelector(targetElementId);
        el.style.position = "absolute";
        el.style.zindex = "99999";
    }
    /*  
        Object: DigitalKeyboard, Create and initialization keybord
        In: String targetId - the selector on include keyboard on page
    */
    function init(targetId){
        targetElementId = targetId;
        document.querySelector(targetId).innerHTML = _templateHTML();
        _setListeners();
        _setStyleOnBlock();
    }
    /*
        Functions available from outside
    */
    DigitalKeyboard.getVersion = getVersion;
    DigitalKeyboard.init = init;
    DigitalKeyboard.setActionOnEnter = setActionOnEnter;
    DigitalKeyboard.getKeyboardElement = getKeyboardElement;
    DigitalKeyboard.showOrHide = showOrHide;
    
    /*
        "Export" the ColorCode to the outside of the module
    */
    window.DigitalKeyboard = DigitalKeyboard;
}());