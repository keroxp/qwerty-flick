(function(){
    // @interface
    var QWERTY,
    DEBUG = true,
    // UI Classes
    Textarea = {},
    Candies  = {},
    Keyboard = {},
    Row      = {},
    Key      = {},
    KeyChar  = {},
    Pie      = {},
    PieCenter= {},
    PiePiece = {},
    // Controller Classes
    MainViewController = {},
    AutoCorrectController = {},
    WindowEventDelegate = {},
    // Data
    rows = [],
    dictionary = {},
    // Constants
    PI = 0.0,
    iPhone = false,
    iPad   = false,
    Android = false,
    // Helper objectas ( an interface of event handlers)
    current = {},
    // Helper functions
    getPosition = function(e){},
    getDistance = function(curPos,prevPos){},
    getDirection = function(curPos,prevPos){},
    stopEvent   = function(event){},
    // Debug
    $debug1,
    $debug2,
    $debug3,

    ENDVAR;


    // Initialiser 
    $(function(){

        if(DEBUG){
            $debug1 = document.createElement("input"); 
            $debug2 = document.createElement("input"); 
            $debug3 = document.createElement("input"); 
            $debug4 = document.createElement("input");
            $("#debug").append($debug1,$debug2,$debug3,$debug4);
        }
        
        // private vars
        var MAIN,
        // Controller
        corrector = {},
        // instances
        textarea = {},
        keyboard = {},
        candies  = {},
        row = {},
        key = {};

        // Instantiate auto-correct-controller
        corrector = $.extend({},AutoCorrectController).init();
        //eventController = $.extend({}, WindowEventDelegate).init();

        // Attach window object with event controller 
        if(iPhone || iPad || Android){
//            $(window).on("touchstart", ".key", keyDidDown);
//            $(window).on("touchmove",  keyDidMove);
//            $(window).on("touchend",  keyDidUp);
            window.addEventListener("touchstart", keyDidDown);
            window.addEventListener("touchmove" , keyDidMove);
            window.addEventListener("touchend"  , keyDidUp);
        }else{
        // $.onを使うとタッチイベントを検知できない？　んなばかな…
            $(window).on("mousedown", ".key", keyDidDown);
            $(window).on("mousemove", keyDidMove);
            $(window).on("mouseup"  , keyDidUp);
        }

        

        // Extend DOM objects to UI objects (actually, we instantiate UI Objects which inherit from HTMLDivElement object) 
        textarea = $.extend($("#textarea")[0], Textarea).init(); 
        keyboard = $.extend($("#keyboard")[0], Keyboard).init();
        candies  = $.extend($("#candies")[0],  Candies).init();

        // Attach Delegate with this object 

        $(textarea).on("textDidChange", textareaDidChange);
        $(textarea).on("textDidDelete", textareaDidDelete);


        // Setup keys for keyboard
        for(var i = 0 ; i < rows.length ; i++){
            // Instantiate Row object for each row of keyboard
            row = $.extend(div(),Row).init(i);
            for(var j = 0 ; j < rows[i].length ; j++){
                // Instantiate Key object
                key = $.extend(div(),Key).init(rows[i][j]);
                if(iPad || iPhone || Android){
//                    key.addEventListener("touchstart", keyDidDown, false);
                    key.ontouchstart = keyDidDown;
                }
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
            if(!current.e){
                //Create Pie object
                var key = this,
                pie = $.extend(div(),Pie).init(key.key);

                key.appendChild(pie);
                key.pie = pie;
                pie.centeringPieces();
                // 凹ませる
                key.dent();

                current.e = e;
                current.pos = getPosition(e);
                current.key = key;
            }
        }

        function keyDidMove (e) {
            e.preventDefault();
            if(current.e){
                // When we're handling some mouse click event
                var dir = getDirection(getPosition(e),current.pos),
                dis = getDistance(getPosition(e),current.pos);
                // If mouse is out of PieCenter (in other words, mouse is on PiePieces or out of Pie)
                if(dis > 5 && !current.piece){
                    current.piece = current.key.pie.pieces[dir];
                    $(current.piece).addClass("gbv");
                };

                if(current.piece && current.piece.direction !== dir){
                    $(current.piece).removeClass().addClass("pie-piece");
                    current.piece = current.key.pie.pieces[dir];
                    $(current.piece).addClass("gbv");
                };
            };
        }

        function keyDidUp (e) {
            e.preventDefault();
            if(current.e){
                if(!current.piece){
                    current.piece = current.key.pie.center;
                }
                if(current.key.key.length <=  2){
                    // Insert charactor
                    textarea.insertChar(current.piece.key)
                }else{
                    // Implement metakeys function
                    switch(current.key.key){
                        case "delete" :
                            textarea.delete(); 
                            break;
                        case "shift" :
                            break;
                        case "command" : 
                            break;
                        case "space" : 
                            textarea.insertChar(" ");
                            break;
                        case "enter" : 
                            textarea.insertChar("\n");
                            break;
                        case "num" :
                            $(keyboard.rows[0]).toggle();
                            break;
                        default :
                            console.log("invalid meta key : "+ current.key.key);
                            return false;
                            break;
                    }
                };
                // 凸ませる
                current.e = null;
                current.key.push();
                current.key.removeChild(current.key.pie);
                current.key = null;
                current.piece = null;
            }
        }

        function textareaDidChange (e,data) {
            console.log("inserted : " + data.inserted);
            var corrected = corrector.sandwhich(data.inserted);
            if(corrected){
                console.log("corrected is " + corrected);
                textarea.correct(corrected);
                var s = textarea.selectedRange();
                $debug4.value = "selected " + s.s + " to " + s.e; 
            }
            return true;
        }

        function textareaDidDelete (e,data) {
            console.log("deleted : " + data.deleted);
            corrector.buffer.splice(corrector.buffer.length - 1 , 1);
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
    };

    Row = {
        init : function(index){
            this.id = "key-row-" + index;
            this.className = "key-row clearfix";
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
        dent : function(){
            $(this).removeClass("gg").addClass("ggr");
        },
        push : function(){
            $(this).removeClass("ggr").addClass("gg");
        }
    };

    KeyChar = {
        init : function(key){
            this.className = "key-char";
            if(iPhone){
                this.className += " key-char-iPhone";
            };
            this.innerHTML = dictionary[key].center.toUpperCase();
            return this;
        }
    };

    // @implementation of Pie
    Pie = {
        init : function(key) {
            var center = {},
            pieces = [];
            this.className = "pie gbl";
            center = $.extend(div(),PieCenter).initWithKey(key);
            this.center = center;
            this.appendChild(center);

            for(var i = 0, max = 5, p = {} ; i < max ; i++){
                p = $.extend(div(),PiePiece).initWithKeyForIndex(key,i);
                pieces.push(p);
                this.appendChild(p);
            }
            this.pieces = pieces;
            return this;
        },
        center : {},
        pieces : [],
        centeringPieces : function(){
            for(var i = 0 , max = this.pieces.length ; i < max ; i++){
                this.pieces[i].style.left = this.pieces[i].offsetLeft - (this.pieces[i].offsetWidth  / 2 - this.offsetWidth ) - this.offsetWidth  / 2 - 4 + "px";
                this.pieces[i].style.top  = this.pieces[i].offsetTop  - (this.pieces[i].offsetHeight / 2 - this.offsetHeight) - this.offsetHeight / 2 - 4 + "px";
                this.pieces[i].style.left = this.pieces[i].offsetLeft + 70 * Math.cos((72 * i - 90) * PI / 180) + "px";
                this.pieces[i].style.top  = this.pieces[i].offsetTop  + 70 * Math.sin((72 * i - 90) * PI / 180) + "px";
            };
            return this;
        }
    }

    // @implementation of PieCenter
    PieCenter = {
        initWithKey : function(key){
            this.className = "pie-char";
            this.dataset.key = key;
            this.innerHTML = dictionary[key].center;
            this.key = key;
            return this;
        },
        key : ""
    };

    // @implementation of PiePiece
    PiePiece = {
        initWithKeyForIndex : function(key,index) {
            this.className = "pie-piece";
            this.dataset.key = dictionary[key].pieces[index];
            this.innerHTML = dictionary[key].pieces[index];
            this.key = dictionary[key].pieces[index];
            this.direction = index;
            return this;
        },
        key : "",
        direction : -1 
    }

    // @implementation of WindowEventDelegate 
    // (i.e. This class will be used for extending window object)

    WindowEventDelegate = {
        init : function(){
            return this;
        },
        ondown : function(e){
            e.preventDefault();
            // Mouse or Touch Event
            console.log(event);
            // jQuery Event
            console.log(e);
            current.e = event;
            current.key = this;
            $(window).trigger("keyDidDown", [event,this]);
        },
        onmove : function(e){
            e.preventDefault();
            if(current.e){
                $(window).trigger("keyDidMove", [event,current.key]);
            }
        },
        onup   : function(e){
            e.preventDefault();
            if(current.e){
                var piece = current.piece || current.key.pie.center;
                $(window).trigger("keyDidUp", [event,current.key,piece]);
                current.e = null;
                current.key.removeChild(current.key.pie);
                current.key = null;
                current.piece = null;
            }
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
//            console.log(this.buffer);
            $debug3.value = this.buffer;

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
                $debug3.value = this.buffer;
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

    getPosition = function(e){
        if(iPad || Android || iPhone){
            if(e.touches){
                return { x : e.changedTouches[0].pageX , 
                    y : e.changedTouches[0].pageY };
            }else if(e.originalEvent){
                return { x : e.originalEvent.touches[0].pageX , 
                    y : e.originalEvent.touches[0].pageY}
            }else{
                console.log("invalid touch event");
                return { x: -1 , y : -1}
            }
        }else{
            return { x : e.pageX , y : e.pageY };
        }
    };

    getDistance = function(curPos, prevPos){
//        var curPos = getPosition(curE),
//        prevPos = getPosition(prevE);
        return Math.floor(Math.sqrt(Math.pow((curPos.x - prevPos.x),2) + Math.pow((curPos.y - prevPos.y),2)));
    };

    getDirection = function(curPos, prevPos){
//        var curPos = getPosition(curE),
//        prevPos = getPosition(prevE),
        var dx = curPos.x - prevPos.x, 
        dy = -(curPos.y - prevPos.y),
        angle = Math.atan2(dy,dx);

        $debug1.value = "current x : " + curPos.x + " y : " + curPos.y;
        $debug2.value = "prev x : " + prevPos.x + " y : " + prevPos.y;

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
        "q" : {center : "q", pieces : ["くぁ", "くぃ", "く", "くぇ", "くぉ"] },
        "w" : {center : "w", pieces : ["わ", "うぃ", "う", "うぇ", "を"] },
        "e" : {center : "e", pieces : ["え", "え", "え", "え", "え"] },
        "r" : {center : "r", pieces : ["ら", "り", "る", "れ", "ろ"] },
        "t" : {center : "t", pieces : ["た", "ち", "つ", "て", "と"] },
        "y" : {center : "y", pieces : ["や", "い", "ゆ", "え", "よ"] },
        "u" : {center : "u", pieces : ["う", "う", "う", "う", "う"] },
        "i" : {center : "i", pieces : ["い", "い", "い", "い", "い"] },
        "o" : {center : "o", pieces : ["お", "お", "お", "お", "お"] },
        "p" : {center : "p", pieces : ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"] },
        "a" : {center : "a", pieces : ["あ", "あ", "あ", "あ", "あ"] },
        "s" : {center : "s", pieces : ["さ", "し", "す", "せ", "そ"] },
        "d" : {center : "d", pieces : ["だ", "ぢ", "づ", "で", "ど"] },
        "f" : {center : "f", pieces : ["ふぁ", "ふぃ", "ふ", "ふぇ", "ふぉ"] },
        "g" : {center : "g", pieces : ["が", "ぎ", "ぐ", "げ", "ご"] },
        "h" : {center : "h", pieces : ["は", "ひ", "ふ", "へ", "ほ"] },
        "j" : {center : "j", pieces : ["じゃ", "じ", "じゅ", "じぇ", "じょ"] },
        "k" : {center : "k", pieces : ["か", "き", "く", "け", "こ"] },
        "l" : {center : "l", pieces : ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ"] },
        "z" : {center : "z", pieces : ["ざ", "じ", "ず", "ぜ", "ぞ"] },
        "x" : {center : "x", pieces : ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ"] },
        "c" : {center : "c", pieces : ["つぁ", "つぃ", "つ", "つぇ", "つぉ"] },
        "v" : {center : "v", pieces : ["ヴぁ", "ヴぃ", "ヴ", "ヴぇ", "ヴぉ"] },
        "b" : {center : "b", pieces : ["ば", "び", "ぶ", "べ", "ぼ"] },
        "n" : {center : "n", pieces : ["な", "に", "ぬ", "ね", "の"] },
        "m" : {center : "m", pieces : ["ま", "み", "む", "め", "も"] },
        "," : {center : ",", pieces : ["、", "。", "ー", "！", "？"] },
        "." : {center : ".", pieces : ["", "", "", "", ""] },
        "-" : {center : "-", pieces : ["", "", "", "", ""] },
        "enter"   : {center : "⏎", pieces : ["","","","",""] },
        "command" : {center : "⌘", pieces : ["","","","",""] },
        "shift"   : {center : "⇧", pieces : ["","","","",""] },
        "space"   : {center : "space",  pieces : ["全角","","","",""] },
        "delete"  : {center : "⌫", pieces : ["","","","",""] },
        "num"     : {center : "123",pieces : ["","","","",""] }
    };

    // Constants
    PI = 3.14159265;
    iPhone = (navigator.userAgent.indexOf("iPhone") < 0) ? false : true;
    iPad = (navigator.userAgent.indexOf("iPad") < 0 ) ?  false : true;
    Android = (navigator.userAgent.indexOf("Android") < 0 ) ? false : true;

}());
