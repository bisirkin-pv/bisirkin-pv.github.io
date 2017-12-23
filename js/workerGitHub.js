;(function (){    
    "use strict";
    
    let version = '0.0.1'
        ,lastUpdateDate = '16.12.2017';         
    var isDebug = false                          //Flag debug mode
    ;
    let gitApi = {
        userRepositories : 'https://api.github.com/users/{username}/repos'
    }
    ;
        
    /*  
        Displaying messages in debug mode
        in: String msg - input object for output to the console
    */
    function debuglog(msg){
        if(!!isDebug) {console.log(msg)};
    }
    
    /*
        Object: WorkerGitHub, constructor
    */
    function WorkerGitHub(){
    }
        
    /*  
        Object: WorkerGitHub, return current version
        return: String - current version
    */
    function getVersion(){
        return version;
    }
    
    /*
        Object: WorkerGitHub, Return last change date
        return: String - current last change date
    */
    function getLastUpdateDate(){
        return lastUpdateDate;
    }
            
    /*
        Object: WorkerGitHub, private, Downloading the file in JSON format
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
        Object: WorkerGitHub, private, Filling out the JSON file
        In: String path - path to JSON file containing the syntax
        return: Object actual_JSON - Processed JSON object.
    */
    function _load(path) {
        var actual_JSON = {};
        _loadJSON(path||'', function(response) {
            try{
                actual_JSON = JSON.parse(response);                
            }catch(ex){
                debuglog('WorkerGitHub.load: Error parse JSON file.');
            }
        });
        return actual_JSON;
    };
      
    /*
        Object: Repo, private, contains information about repositories
    */
    function _Repo(userName, name, html_url, description, pushed_at){
        this.userName = userName;
        this.name = name;
        this.html_url = html_url;
        this.description = description;
        this.pushed_at = pushed_at;
    }
    
    
    /*
        Object: WorkerGitHub, get a list of repositories    
        In: String userName - username to get a list of repositories 
        return: List Object Repo
    */
    function getUserRepositories(userName){
        let repositories = _load(gitApi.userRepositories.replace('{username}',userName));
        debuglog(repositories);
        let jsonKey = Object.keys(repositories);
        var listRepo=[];
        for(var i = 0; i < jsonKey.length; i++){
            listRepo.push(new _Repo(repositories[jsonKey[i]].owner.login
                                    ,repositories[jsonKey[i]].name
                                    ,repositories[jsonKey[i]].html_url
                                    ,repositories[jsonKey[i]].description
                                    ,repositories[jsonKey[i]].pushed_at
                                    )
                         );
        };
        return listRepo;
    }
    
    /*
        Object: WorkerGitHub, get a HTML <ul> element list of repositories    
        In: String userName - username to get a list of repositories 
        return: List Object Repo
    */
    function getHTMLListRepositories(repos){
        if(repos.length<0){
            return '';
        }
        var html = '<ul class="workerGitHub-list-repo">';
        for(var i = 0; i< repos.length; i++){
            let li = '<li><a href="'+repos[i].html_url+'">'+repos[i].name+'</a></li>';
            html += li;
        }
        html += '</ul>';
        return html;
    }
        
    /*
        Functions available from outside
    */
    WorkerGitHub.getVersion = getVersion;
    WorkerGitHub.getUserRepositories = getUserRepositories;
    WorkerGitHub.getHTMLListRepositories = getHTMLListRepositories;

    /*
        "Export" the WorkerGitHub to the outside of the module
    */
    window.WorkerGitHub = WorkerGitHub;
}());