(function (){    
    'use strict'
    
    let version = '1.0.1'
        ,lastUpdateDate = '01.10.2019'
    
    var state = []
        ,table = undefined
        ,start_btn = undefined
        ,counter = undefined 
        ,msg = undefined
        ,count_move = 0
        ,active_elem = undefined
    
    /*
        Object: FifteenGame, constructor
    */
    function FifteenGame(){
    }
        
    /*  
        Object: FifteenGame, return current version
        return: String - current version
    */
    function getVersion(){
        return version
    }
    
    /*  
        Object: FifteenGame, return current version
        In: DomElement table - Table for playing field
    */
    function init(table_game, start_button, count_block, message_block){
        table = table_game
        start_btn = start_button
        counter = count_block
        msg = message_block
        if (!(   typeof table     == 'object' 
              && typeof start_btn == 'object' 
              && typeof counter   == 'object' 
              && typeof msg       == 'object'
             )
           ){
            console.log('Error: setup all parameters')
            return
        }
        
        table.addEventListener('click', function(obj){                    
                     move(obj.target)
                }, true);
        addStartListener(start_btn)
        
        for(let i=0; i<16; i++){
            state.push(i)
        }
        start()
    }
    
    /*  
        Object: FifteenGame, create table for game
    */
    function tableHTML(){
        _clearTableHTML()
        let i = 0
        for(let row = 1; row < 5; row++){
            var tr = document.createElement('tr')
            for(let cell = 1; cell < 5; cell++){
                var td = document.createElement('td')
                td.innerHTML = state[i]
                td.dataset.number = i
                if(state[i] === 0){
                    td.classList = 'zero_block'
                }else{
                    td.classList = ''
                }
                tr.appendChild(td)
                i++
            }
            table.appendChild(tr)
        }

    }
    
    /*  
        Object: FifteenGame, remove rows in table 
    */
    function _clearTableHTML(){
        while(table.rows.length > 0) {
            table.deleteRow(0);
        }
    }
    
    /*  
        Object: FifteenGame, start new game
    */
    function start(){
        active_elem = undefined
        msg.innerHTML = ''
        count_move = 0
        _change_counterHTML(count_move)
        _shuffle(state)
        tableHTML()
    }
    
    /*
        Object: FifteenGame, suffle
        In: Array array - digit array
    */
    function _shuffle(array){
        for(let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * i)
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    }
    
    /*
        Object: FifteenGame, sets the listener for user click start
        In: DomElement selectorSource - element to start button
    */
    function addStartListener(sourceElement){
        let action = "click";
        sourceElement.addEventListener(action, function(obj){                    
             start()
        }, true);
    }
    
    /*
        Object: FifteenGame, check move and set active block
        In: DomElement elem - current element for action
    */
    function move(elem){
        if(active_elem){
            if(elem.classList.contains('zero_block')){
                let current_id = parseInt(elem.dataset.number)
                let active_id = parseInt(active_elem.dataset.number)           
                if(_check_move(current_id, active_id)){
                    active_elem.classList.add('zero_block')
                    elem.innerHTML = active_elem.innerHTML
                    active_elem.innerHTML = 0
                    elem.classList.remove('zero_block')
                    state[current_id] = state[active_id]
                    state[active_id] = 0
                    
                    _change_counterHTML(++count_move)
                    
                    if(_check_win()){
                        msg.innerHTML = 'You win!'
                    }
                }
            }
            active_elem.classList.remove('active_block')
            active_elem = undefined
        }else{
            if(elem.classList.contains('zero_block')){
                return
            }
            active_elem = elem
            elem.classList.add('active_block')
        }
    }
    
    /*
        Object: FifteenGame, check capability move block
        In: Int current_id - current block number
        In: Int active_id - active block number
    */
    function _check_move(current_id, active_id){
        return  (active_id % 4 != 0 && current_id == active_id - 1)
              ||(active_id % 4 != 3 && current_id == active_id + 1)
              ||(Math.floor(active_id / 4) != 0 && current_id == active_id - 4)
              ||(Math.floor(active_id / 4) != 3 && current_id == active_id + 4)
    }
    
    /*
        Object: FifteenGame, check win combination
    */
    function _check_win(){
        var win = true
        var result = 1
        for(let i = 0; i<state.length - 1; i++){
            if(state[i] != result){
                win = false
                break
            }
            result++
        }
        return win
    }
    
    /*
        Object: FifteenGame, refresh HTML for count move
    */
    function _change_counterHTML(cnt){
        counter.innerHTML = cnt
    }
    /*
        Functions available from outside
    */
    FifteenGame.getVersion = getVersion
    FifteenGame.init = init
    FifteenGame.start = start
    FifteenGame.addStartListener = addStartListener
   

    /*
        "Export" the FifteenGame to the outside of the module
    */
    window.FifteenGame = FifteenGame
}())