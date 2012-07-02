(function(){
    // @interface
    var __QWERTY__,
    // UI Classes
    Textarea = {},
    Candies  = {},
    Keyboard = {},
    Row      = {},
    Key      = {},
    KeyChar  = {},
    // Controller Classes
    AutoCorrectController = {},
    // Data
    rows = [],
    dictionary = {},
    mothers = [],
    children = [],
    // Constants
    PI = 0.0,
    iPhone = false,
    iPad   = false,
    Android = false,
    // Helper objectas ( an interface of event handlers)
    current = {},
    buffer = [],
    // Helper functions
    isMotherChar = function(char){},
    isChildChar = function(char){},
    getPosition = function(e){},
    getDistance = function(cure,preve){},
    getDirection = function(cure,preve){},
    stopEvent   = function(event){},
    // Debug
    $debug1,
    $debug2,

    __ENDVAR__;


    // Initialiser 
    $(function(){

        $debug1 = $("#debug1")[0];
        $debug2 = $("#debug2")[0];

        // private vars
        var MAIN,
        // Controller
        corrector = {},
        eventController = {},
        // instances
        textarea = {},
        keyboard = {},
        candies  = {},
        row = {},
        key = {};

        // Instantiate auto-correct-controller
        corrector = $.extend({},AutoCorrectController).init();

        // Attach window object with event controller 
        if(iPhone || iPad || Android){
            $(window).on("touchstart", ".key", keyDidDown);
            $(window).on("touchmove",  keyDidMove);
            $(window).on("touchend",  keyDidUp);
        }else{
            $(window).on("mousemove", keyDidMove);
            $(window).on("mouseup"  , mouseDidUp);
        }

        // Extend DOM objects to UI objects (actually, we instantiate UI Objects which inherit from HTMLDivElement object) 
        textarea = $.extend($("#textarea")[0], Textarea).init(); 
        keyboard = $.extend($("#keyboard")[0], Keyboard).init();
        candies  = $.extend($("#candies")[0],  Candies).init();

        // Attach Delegate with this object 

        $(textarea).on("textDidChange", textareaDidChange);
        $(textarea).on("textDidDelete", textareaDidDelete);


        // Setup keys for keyboard
        for(var i = 0 , _keys = []; i < rows.length ; i++){
            // Instantiate Row object for each row of keyboard
            row = $.extend(div(),Row).init(i);
            for(var j = 0 ; j < rows[i].length ; j++){
                // Instantiate Key object
                key = $.extend(div(),Key).init(rows[i][j]);
                $(key).on("mousedown", keyDidDown);
                $(key).on("mouseup"  , keyDidUp);
                $(key).on("mouseover", keyDidOver);
                $(key).on("mouseout" , keyDidOut);
                // Add reference with parent node and append it to DOM tree
                row.keys.push(key);
                row.appendChild(key);
            }
            // Add reference with parent node and append it to DOM tre
            keyboard.rows.push(row);
            keyboard.appendChild(row);
        };

        // Deelegate methods

        function keyDidDown (e) {
            e.preventDefault();
            var withouts = [];
            // 凹ませる
            this.dent();
            if(!isMotherChar(this.key)){
               withouts = ["a","i","u","e","o"]; 
               withouts.push("y");
               withouts.push("h");
            }else if(isMotherChar(this.key)){
                withouts = [];
            }

            keyboard.modifyKeys({
                type : "disable",
                withouts : withouts
            });

            buffer.push(this.key);
            current.event = e;
            current.key = this;
        }

        function keyDidMove (e) {
            e.preventDefault();
            if(current.event){
            };
        }

        function keyDidOver (e){
            e.preventDefault();
            if(current.event){
                if(this.isEnabled){
                    this.dent();
                    if(this.key == "y"){
                        keyboard.modifyKeys({
                            type : "disable",
                            with : ["h"]
                        })
                    }else if(this.key == "h"){
                        keyboard.modifyKeys({
                            type : "disable",
                            with : ["y"]
                        })
                    }else if(isMotherChar(this.key)){
                        var index = children.indexOf(this.key),
                        _with = ["a","i","u","e","o","y","h"];
                        _with.splice(index,1).pop();
                        /*
                        keyboard.modifyKeys({   
                            type : "disable",
                            with : _with 
                        });
                        */
                    }
                    buffer.push(this.key);
                }
            };
        }

        function keyDidOut (e){
            e.preventDefault();
            if(current.event && this !== current.key){
                if(this.isEnabled){
                    if(this.key == "y" || this.key == "h" && (this.isEnabled)){
                        this.dent();
                    }else if(isMotherChar(this.key)){
                        this.push();
                        buffer.splice(buffer.length-1).pop;
                    }
                };
            }
        }

        function keyDidUp (e) {
            e.preventDefault();
            if(current.event){
                // 凸ませる
                keyboard.modifyKeys({
                    type : "enable",
                    withouts : []
                });
                console.log(buffer);
                switch(buffer.length){
                    case 1:
                        // meta key
                        if(buffer[0].length > 2){
                            switch(buffer[0]){
                                case "delete":
                                    textarea.delete();
                                    break;
                                default :
                                    break;
                            }
                        }else{
                            if(buffer[0] == "n"){
                                textarea.insertChar("ん");
                            }else{
                                textarea.insertChar(buffer[0]);
                            }
                        }
                        break;
                    case 2:
                        var r = dictionary[buffer[0]][buffer[1]];
                        if(r){
                            textarea.insertChar(r);
                        }
                        break;
                    case 3:
                        var r = dictionary[buffer[0]]["y"+buffer[2]];
                        if(r){
                            textarea.insertChar(r);
                        }
                        break;
                    default:
                        break;
                }
                buffer = [];
                current.event = null;
                current.key = null;
            }
        }

        function mouseDidUp (e){
            e.preventDefault();
            if(current.event){
                current.key.push();
                keyboard.modifyKeys({
                    type : "enable",
                    withouts : []
                    });
                console.log(buffer);
                buffer = [];
                current.event = null;
                current.key = null;
            };
        }

        function convert(){
        }

        function textareaDidChange (e,data) {
            console.log("inserted : " + data.inserted);
            var corrected = corrector.sandwhich(data.inserted);
            if(corrected){
                console.log("corrected is " + corrected);
                //textarea.correct(corrected);
            }
            return true;
        }

        function textareaDidDelete (e,data) {
            console.log("deleted : " + data.deleted);
            return true;
        }

        function textDidCorrect (e,data){

        }

    });

    // @implementation of Textarea
    Textarea = {
        init : function(){
            var $this = $(this);

            this.id = "textarea";
            this.disabled = "disabled";
            return this;
        },
        selectedRange : function(){
            return {s : this.selectionStart, e: this.selectionEnd}
        },
        selectedStr : function(){
            var pos = this.selectedRange(),
            text = this.value;
            return text.substr(pos.s,pos.e - pos.s);
        },
        setCaret : function(newpos){
            this.setSelectionRange(newpos,newpos);
        },
        insertChar : function(char){
            var pos = this.selectedRange(),
            text = this.value,
            prev = text.substr(0,pos.s),
            next = text.substr(pos.e,text.length - pos.e),
            newpos = (prev + char).length;

            this.value = prev + char + next; 
            this.setCaret(newpos);
            $(this).trigger("textDidChange",[{inserted : char}]);
        },
        insertPat : function(pat){
            var pos = this.selectedRange(),
            text = this.value,
            prev = text.substr(0, pos.s),
            next = text.substr(pos.e, text.length - pos.e),
            newpos = (prev + pat).length;

            this.value = prev + pat + next;
            this.setSelectionRange(pos.s,(prev+pat).length);
            $(this).trigger("textDidChange",[{inserted : pat}]);
        },
        delete : function(){
            var selected = this.selectedStr(),
            pos = this.selectedRange(),
            text = this.value,
            prev = text.substr(0, pos.s - 1),
            next = text.substr(pos.e, text.length - pos.e);

            if(selected.length > 0){
                this.insertPat("");
            }else{
                if(pos.s > 0){
                    this.value = prev + next;
                    this.setCaret(prev.length);
                }
            }
            $(this).trigger("textDidDelete", [{deleted : text.substr(pos.s,pos.e)}]); 
        },
        enter : function(){
            $(this).trigger("textDidEnter");
        },
        correct : function(text){
            var pos = this.selectedRange();
            console.log(text);
            if(pos.s === pos.e){
                this.setSelectionRange(pos.s - text.length, pos.e);
                this.insertChar(text);
            }
        }
    };

    // @implementation of Candies

    Candies = {
        init : function(){
            return this;
        }
    };


    // @implementation of Keyboard

    Keyboard = {
        init : function(){
            return this;
        },
        rows : [],
        modifyKeys : function(arg){
            for(var i = 0 , maxi = this.rows.length ; i < maxi ; i++){
                for(var j = 0 , maxj = this.rows[i].keys.length ; j < maxj ; j++){
                    var key = this.rows[i].keys[j];
                    if(arg.withouts){
                        if(arg.type == "disable" && arg.withouts.indexOf(key.key) == -1){
                            key.disable(); 
                        }
                        if(arg.type == "enable" && arg.withouts.indexOf(key.key) == -1){
                            key.enable();
                        }
                    }else if(arg.with){
                        if(arg.type == "disable" && arg.with.indexOf(key.key) > -1){
                            key.disable();
                        }else if(arg.type == "enable" && arg.with.indexOf(key.key) > -1){
                            key.enable();
                        }
                    }
                }
            }
        }
    };

    Row = {
        init : function(index){
            this.id = "key-row-" + index;
            this.className = "key-row clearfix";
            this.keys = [];
            return this;
        },
        keys : []
    };


    // @implementation of Key
    Key = {
        init : function(key){
            var $this = $(this),
            char  = {};

            this.id = "key-" + key;
            this.dataset.key = key;
            this.className = "key gg ds";
            this.key = key;

            // when this is meta key
            if(key.length > 1){
                this.className += " key-" + key;
                this.isMetaKey = true;
            };  

            // setup child node
            char = $.extend(div(),KeyChar).init(key);
            this.char = char;
            this.appendChild(char);

            return this;
        },
        char : {},
        key : "",
        isMetaKey : false,
        isEnabled : true,
        enable : function(){
            $(this).addClass("gg");
            this.isEnabled = true;
            this.push();
        },
        disable : function(){
            $(this).removeClass("gg");
            this.isEnabled = false;
        },
        dent : function(){
            $(this).removeClass("gg").addClass("gbv");
        },
        push : function(){
            $(this).removeClass("gbv").addClass("gg");
        }
    };

    KeyChar = {
        init : function(key){
            this.className = "key-char";
            if(iPhone){
                this.className += " key-char-iPhone";
            };
            this.innerHTML = key.toUpperCase();
            return this;
        }
    };

    // @implementation of AutoCorecctor

    AutoCorrectController = {
        init : function(){
            return this;
        },
        str : "",
        buffer : [],
        sandwhich : function(char){
            var len,
            repeat,
            corrected = "",
            count = 0;

            // Don't allow a text to be pushed
            if(char.length > 1){
                return false;
            };

            // If buffer is empty, allow anything to be pushed
            if(this.buffer.length === 0){
                this.buffer.push(char);
                return false;
            }else if(this.buffer.length === 1 && this.isKana(this.buffer[0]) && this.isKana(char)){
                // But don't allow repeat of Kanas
                this.buffer[0] = char;
                return false;
            }

            this.buffer.push(char);
            len = this.buffer.length - 1;
            repeat = this.buffer[len-1];
            console.log(this.buffer);

            // If the last object of buffer is Kana string and its previous object is not Kana string
            if(this.isKana(char) && !this.isKana(repeat)){
                // countup number of repeats same charactors
                count = this.numberOfRepeats();
                if(this.buffer[len-1] == "n"){
                    this.replaceBuffer("ん", { from : 1 , to : len - 1});
                    //                    if(count!=1){
                        //                        this.buffer.splice(len-1);
                        //                    };
                }else{
                    this.replaceBuffer("っ", { from : 1 , to : len - 1});
                };
                corrected = this.buffer.join("");
                this.buffer = [];
                return corrected;
            };
            return false;
        },
        isKana : function(char){
            if(char.charCodeAt(0) >= 0x3041 && char.charCodeAt(0) <= 0x3093){
                return true;
            };
            return false;
        },
        // Replace charactors bwtween Start of buffer and End of buffer
        replaceBuffer : function(chara,range){
            for(var i = range.from ; i < range.to + 1 ; i++){
                this.buffer[i] = chara;
            };
        },
        // Count the number of repeats of same charactors
        numberOfRepeats : function(){
            var count;
            for(var i = 0 , count = 0 , max = this.buffer.length - 1 ; i< max ; i++){
                if(this.buffer[max-i] != this.buffer[max]){
                    break;
                }else{
                    count++;
                };
            };
            return count;
        }
    };

    // Utility functions
    
    isMotherChar = function(char){
        if(mothers.indexOf(char) > -1){
            return true;
        }else{
            return false;
        }
    };

    isChildChar = function(char){
        if(children.indexOf(char) > -1 ){
            return true;
        }else{
            return false;
        }
    };

    hasSmallY = function(char){
    };

    getPosition = function(e){
        if(e.touches){
            return { x : e.changedTouches[0].pageX , y : e.changedTouches[0].pageY };
        }else{
            return { x : e.pageX , y : e.pageY };
        };
    };

    getDistance = function(curE, prevE){
        var curPos = getPosition(curE),
        prevPos = getPosition(prevE);
        return Math.floor(Math.sqrt(Math.pow((curPos.x - prevPos.x),2) + Math.pow((curPos.y - prevPos.y),2)));
    };

    getDirection = function(curE, prevE){
        var curpos = getPosition(curE),
        prevPos = getPosition(prevE),
        dx = curpos.x - prevPos.x, 
        dy = -(curpos.y - prevPos.y),
        angle = Math.atan2(dy,dx);

        $debug1.value = "x : " + curpos.x + " y : " + curpos.y;
        $debug2.value = "x : " + prevPos.x + " y : " + prevPos.y;

        if(angle < 0 ){
            angle += PI * 2;
        }

        if((0 <= angle && angle < PI*3/10) || (PI*19/10 <= angle && angle <= PI*2)){
            // 右上
            return 1;
        }else if(PI*3/10  <= angle && angle < PI*7/10 ){
            // 上
            return 0;
        }else if(PI*7/10  <= angle && angle < PI*11/10 ){
            // 左上
            return 4
        }else if(PI*11/10  <= angle && angle < PI*15/10 ){
            // 左下
            return 3;
        }else if(PI*15/10  <= angle && angle < PI*19/10 ){
            // 右下
            return 2;
        }else{
            console.log("invalid angle : "+angle);
        }
    };

    stopEvent = function(e){
        if(e.stopPropagation){
            e.stopPropagation();
        }else if(e.cancelBubble){
            e.cancelBubble();
        }
    };

    div = function(){
        return document.createElement("div");
    }

    // Data for each rows of keyboard
    rows[0] = ["1","2","3","4","5","6","7","8","9","0"];
    rows[1] = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "delete"]
    rows[2] = ["a", "s", "d", "f", "g", "h", "j", "k", "l","enter"]
    rows[3] = ["shift","z", "x", "c", "v", "b", "n", "m", ",", ".","-"];
    rows[4] = ["command","space","num"];

    // Data for Pie Menu 
    dictionary = {
        "1" : {center : "1", pieces : ["","","","","",""] },
        "2" : {center : "2", pieces : ["","","","","",""] },
        "3" : {center : "3", pieces : ["","","","","",""] },
        "4" : {center : "4", pieces : ["","","","","",""] },
        "5" : {center : "5", pieces : ["","","","","",""] },
        "6" : {center : "6", pieces : ["","","","","",""] },
        "7" : {center : "7", pieces : ["","","","","",""] },
        "8" : {center : "8", pieces : ["","","","","",""] },
        "9" : {center : "9", pieces : ["","","","","",""] },
        "0" : {center : "0", pieces : ["","","","","",""] },
        "q" : { a : "くぁ", i : "くぃ", u :  "く"  , e : "くぇ", o : "くぉ"},
        "w" : { a : "わ"  , i : "うぃ", u :  "う"  , e : "うぇ", o : "を" },
        "e" : { a : "え"  , i : "え"  , u :  "え"  , e : "え"  , o : "え" },
        "r" : { a : "ら"  , i : "り"  , u :  "る"  , e : "れ"  , o : "ろ" , ya : "りゃ", yi : "い", yu : "りゅ", ye : "いぇ", yo : "よ"},
        "t" : { a : "た"  , i : "ち"  , u :  "つ"  , e : "て"  , o : "と" , ya : "ちゃ", yi : "ち", yu : "ちゅ", ye : "ちぇ", yo : "ちょ" },
        "y" : { a : "や"  , i : "い"  , u :  "ゆ"  , e : "え"  , o : "よ"},
        "u" : { a : "う"  , i : "う"  , u :  "う"  , e : "う"  , o : "う"},
        "i" : { a : "い"  , i : "い"  , u :  "い"  , e : "い"  , o : "い"},
        "o" : { a : "お"  , i : "お"  , u :  "お"  , e : "お"  , o : "お"},
        "p" : { a : "ぱ"  , i : "ぴ"  , u :  "ぷ"  , e : "ぺ"  , o : "ぽ" , ya : "ぴゃ" , yi : "ぴぃ" , yu : "ぴゅ", ye : "ぴぇ", yo : "ぴょ" },
        "a" : { a : "あ"  , i : "あ"  , u :  "あ"  , e : "あ"  , o : "あ"},
        "s" : { a : "さ"  , i : "し"  , u :  "す"  , e : "せ"  , o : "そ" , ya : "しゃ", yi : "し", yu : "しゅ", ye : "しぇ", yo : "しょ"},
        "d" : { a : "だ"  , i : "ぢ"  , u :  "づ"  , e : "で"  , o : "ど" , ya : "ぢゃ", yi : "ぢぃ", yu : "ぢゅ", ye : "ぢぇ", yo :"ぢょ" },
        "f" : { a : "ふぁ", i : "ふぃ", u :  "ふ"  , e : "ふぇ", o : "ふぉ" , ya : "ふゃ" , yi : "ふぃ" , yu : "ふゅ", ye : "ふぇ", yo : "ふょ"},
        "g" : { a : "が"  , i : "ぎ"  , u :  "ぐ"  , e : "げ"  , o : "ご" , ya : "ぎゃ", yi : "ぎぃ", yu : "ぎゅ", ye :"ぎぇ" , yo : "ぎょ"},
        "h" : { a : "は"  , i : "ひ"  , u :  "ふ"  , e : "へ"  , o : "ほ" , ya : "ひゃ", yi : "ひぃ", yu : "ひゅ", ye : "ひぇ", yo : "ひょ"},
        "j" : { a : "じゃ", i : "じ"  , u :  "じゅ", e : "じぇ", o : "じょ" },
        "k" : { a : "か"  , i : "き"  , u :  "く"  , e : "け"  , o : "こ" , ya : "きゃ", yi : "きぃ", yu : "きゅ", ye : "きぇ", yo : "きょ"},
        "l" : { a : "ぁ"  , i : "ぃ"  , u :  "ぅ"  , e : "ぇ"  , o : "ぉ" , ya : "ゃ", yi : "ぃ" , yu : "ゅ" , ye : "ぇ", yo : "ょ"},
        "z" : { a : "ざ"  , i : "じ"  , u :  "ず"  , e : "ぜ"  , o : "ぞ" , ya : "じゃ", yi : "じ", yu : "じゅ", ye : "じぇ", yo : "じょ"},
        "x" : { a : "ぁ"  , i : "ぃ"  , u :  "ぅ"  , e : "ぇ"  , o : "ぉ" , ya : "ゃ", yi  : "ぃ" , yu : "ゅ" , ye : "ぇ", yo : "ょ"},
        "c" : { a : "つぁ", i : "つぃ", u :  "つ"  , e : "つぇ", o : "つぉ" , ya : "ちゃ", yi : "ち", yu : "ちゅ", ye : "ちぇ", yo : "ちょ"},
        "v" : { a : "ヴぁ", i : "ヴぃ", u :  "ヴ"  , e : "ヴぇ", o : "ヴぉ"},
        "b" : { a : "ば"  , i : "び"  , u :  "ぶ"  , e : "べ"  , o : "ぼ" , ya : "びょ", yi : "びぃ", yu : "びゅ", ye : "びぇ", yo : "びょ"},
        "n" : { a : "な"  , i : "に"  , u :  "ぬ"  , e : "ね"  , o : "の" , ya : "にゃ", yi : "にぃ", yu : "にゅ", ye : "にぇ", yo : "にょ"},
        "m" : { a : "ま"  , i : "み"  , u :  "む"  , e : "め"  , o : "も" , ya : "みゃ", yi : "みぃ", yu : "みゅ", ye : "みぇ", yo : "みょ"},
        "," : "、",
        "." : "。",
        "-" : "ー",
        "enter"   : ["","","","",""],
        "command" : ["","","","",""],
        "shift"   : ["","","","",""],
        "space"   : "",
        "delete"  : {center : "⌫", pieces : ["","","","",""] },
        "num"     : {center : "123",pieces : ["","","","",""] }
    };

    children = ["k","s","t","n","h","m","y","r","w","g","z","d","b","j","c"];
    mothers = ["a","i","u","e","o"];

    // Constants
    PI = 3.14159265;
    iPhone = (navigator.userAgent.indexOf("iPhone") < 0) ? false : true;
    iPad = (navigator.userAgent.indexOf("iPad") < 0 ) ?  false : true;
    Android = (navigator.userAgent.indexOf("Android") < 0 ) ? false : true;

}());
