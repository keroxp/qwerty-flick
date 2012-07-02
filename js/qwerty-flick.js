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
    // Helper objectas ( an interface of event handlers)
    current = {},
    buffer = [],
    // Helper functions
    isMotherChar = function(char){},
    isChildChar = function(char){},
    getPosition = function(e){},
    getDistance = function(cure,preve){},
    getDirection = function(cure,preve){},
    getKeyPressed = function(pos){},
    stopEvent   = function(event){},
    // Debug
    $debug1,
    $debug2,

    __ENDVAR__;

    // Data for each rows of keyboard
    const CONSTANTS,
    distanceToRow2 = [100,50,0];
    keyInfo = {
        margin : {
            top : 4,
            left : 4
        },
        size : {
            w : 60,
            h : 48
        }
    },
    rows = [
        ["alt","space","symbol","enter","delete"],
        ["あ","か","さ","た","な"],
        ["は","ま","や","ら","わ"]
    ],
    // Data for Pie Menu 
    alterKeys = {
        "あ" : ["あ","い","う","え","お"],
        "か" : ["か","き","く","け","こ"],
        "さ" : ["さ","し","す","せ","そ"],
        "た" : ["た","ち","つ","て","と"],
        "な" : ["な","に","ぬ","ね","の"],
        "は" : ["は","ひ","ふ","へ","ほ"],
        "ま" : ["ま","み","む","め","も"],
        "や" : ["や","い","ゆ","え","よ"],
        "ら" : ["ら","り","る","れ","ろ"],
        "わ" : ["わ", "", "ん","", "を"],
        "symbol" : ["、","。","！","？","ー"]
    },
    dictionary = {
        "あ" : {a : "あ", i : "い", u :  "う", e : "え", o : "お"},
        "か" : {a : "か", i : "き", u :  "く", e : "け", o : "こ", ya : "きゃ", yi : "きぃ", yu : "きゅ", ye : "きぇ", yo : "きょ"},
        "さ" : {a : "さ", i : "し", u :  "す", e : "せ", o : "そ", ya : "しゃ", yi : "し", yu : "しゅ", ye : "しぇ", yo : "しょ"},
        "た" : {a : "た", i : "ち", u :  "つ", e : "て", o : "と", ya : "ちゃ", yi : "ち", yu : "ちゅ", ye : "ちぇ", yo : "ちょ" },
        "な" : {a : "な", i : "に", u :  "ぬ", e : "ね", o : "の", ya : "にゃ", yi : "にぃ", yu : "にゅ", ye : "にぇ", yo : "にょ"},
        "は" : {a : "は", i : "ひ", u :  "ふ", e : "へ", o : "ほ", ya : "ひゃ", yi : "ひぃ", yu : "ひゅ", ye : "ひぇ", yo : "ひょ"},
        "ま" : {a : "ま", i : "み", u :  "む", e : "め", o : "も", ya : "みゃ", yi : "みぃ", yu : "みゅ", ye : "みぇ", yo : "みょ"},
        "や" : {a : "や", i : "い", u :  "ゆ", e : "え", o : "よ"},
        "ら" : {a : "ら", i : "り"  , u :  "る"  , e : "れ"  , o : "ろ" , ya : "りゃ", yi : "い", yu : "りゅ", ye : "いぇ", yo : "よ"},
        "わ" : {a : "わ", i : "うぃ", u :  "う"  , e : "うぇ", o : "を" },
        "enter"   : {center : "↩", pieces : ["","","","",""]},
        "command" : ["","","","",""],
        "shift"   : ["","","","",""],
        "space"   : {center : "", pieces : [] },
        "symbol" :  {center : "、。", pieces : ["、","。","！","？","ー"]},
        "alt" : { center : "＠" , pieces : [] },
        "delete"  : {center : "⌫", pieces : ["","","","",""] },
        "num"     : {center : "123",pieces : ["","","","",""] }
    },
    children = ["か","さ","た","な","は","ま","や","ら","わ"],
    mothers = ["あ","い","う","え","お"],
    PI = 3.14159265,
    iPhone = (navigator.userAgent.indexOf("iPhone") < 0) ? false : true,
    iPad = (navigator.userAgent.indexOf("iPad") < 0 ) ?  false : true,
    Android = (navigator.userAgent.indexOf("Android") < 0 ) ? false : true; 
    // Initialiser 
    $(function(){

        $debug1 = document.createElement("input");
        $debug2 = document.createElement("input");

        $("#debug").append($debug1,$debug2);

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
            $(window).on("mousedown", ".key" , keyDidDown);
            $(window).on("mouseover" , ".key" , keyDidOver);
            $(window).on("mouseout" , ".key" , keyDidOut);
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
        for(var i = 0 , _keys = []; i < rows.length ; i++){
            // Instantiate Row object for each row of keyboard
            row = $.extend(div(),Row).init(i);
            for(var j = 0 ; j < rows[i].length ; j++){
                // Instantiate Key object
                key = $.extend(div(),Key).init(rows[i][j]);
                // Add reference with parent node and append it to DOM tree
                row.keys.push(key);
                row.appendChild(key);
                key.style.top = keyInfo.margin.top/2 + i * (keyInfo.size.h + keyInfo.margin.top) + "px";
                key.style.left = keyInfo.margin.left/2 + j * (keyInfo.size.w + keyInfo.margin.left) + "px";
                keyboard.appendChild(row);
            }
            // Add reference with parent node and append it to DOM tre
            keyboard.rows[i] = row;
            keyboard.appendChild(row);
            keyboard.style.height = rows.length * (keyInfo.size.h + keyInfo.margin.top) + "px";
        };

        // Deelegate methods

        function keyDidDown (e) {
            e.preventDefault();
            var withouts = [];
            // 凹ませる
            this.dent();
            if(typeof alterKeys[this.key] !== "undefined"){
//                textarea.value = "offs x : " + this.offsetLeft + " y : " + this.offsetTop;
                keyboard.modifyKeysWithKeyAtRowIndex(alterKeys[this.key], 0);
                withouts = alterKeys[this.key];
                keyboard.modifyKeys({
                    type : "disable",
                    withouts : withouts
                });
            }else{
                console.log("alterKeys not found for : "+this.key);
            }

            var keyOffset = {
                left : this.offsetLeft,
                top : this.offsetTop
            };

            var rowHeight = keyInfo.margin.top + keyInfo.size.h;
            var rowWidth  = keyInfo.size.w + keyInfo.margin.left;

            var ri = -1;
            if(0 < keyOffset.top && keyOffset.top < rowHeight){
                ri = 0;
            }else if(rowHeight <= keyOffset.top && keyOffset.top < 2 * rowHeight){
                ri = 1;
            }else if(2 * rowHeight <= keyOffset.top && keyOffset.top < 3 * rowHeight){
                ri = 2;
            }

            buffer.push(this.key);
            current.e = e;
            current.pos = getPosition(e);
            current.key = this;
            $debug1.value = "cur x : " + current.pos.x + " y : " + current.pos.y;
        }

        function keyDidMove (e) {
            e.preventDefault();
            if(current.e && (iPad || Android || iPhone)){
                var nowPos = getPosition(e);
//                this.dent();
                $debug2.value = "now x : " + nowPos.x + " y : " + nowPos.y;
                var index = getKeyIndexPressed(nowPos);
//                textarea.value = index;
                // mouseout処理
                if(current.keyIndex && current.keyIndex != index){
                    var key = keyboard.rows[0].keys[current.keyIndex];
                    key.push();
                }
                // mouseover処理
                if(index !== false){
                    var key = keyboard.rows[0].keys[index];
//                    textarea.value = key.key;
                    key.dent();
                    current.key = key;
                }
                current.keyIndex = index;
            };

            function getKeyIndexPressed (pos) {
                var kw = keyInfo.size.w;
                var kh = keyInfo.size.h;
                var kmt = keyInfo.margin.top;
                var kml = keyInfo.margin.left;
                var x = pos.x;

//                if(257 <= pos.y && pos.y <= 300){
                    if(0 < x && x < kw+kml){
                        return 0;
                    }else if(kw+kml <= x && x < 2*(kw+kml)){
                        return 1;
                    }else if(2*(kw+kml) <= x && x < 3*(kw+kml)){
                        return 2;
                    }else if(3*(kw+kml) <= x && x < 4*(kw+kml)){
                        return 3;
                    }else if(4*(kw+kml) <= x && x < 5*(kw+kml)){
                        return 4;
                    }
//                }else{
//                    return false;
//                }
            }
        }

        function keyDidOver (e){
            e.preventDefault();
            if(current.e){
                if(this.isEnabled){
                    this.dent();
//                    var _with = [];
//                    for(var i = 0 ; i < 5 ; i++){
//                        if(this.key != alterKeys[current.key.key][i]){
//                            _with.push(alterKeys[current.key.key][i]);
//                        }
//                    }
//                    keyboard.modifyKeys({
//                        type : "disable",
//                        with : _with 
//                    });
                    buffer.push(this.key);
                }
            }
        }

        function keyDidOut (e){
            e.preventDefault();
            if(current.e && this !== current.key){
                if(this.isEnabled){
                    this.push();
                    buffer.splice(buffer.length-1).pop;
                };
            }
        }

        function keyDidUp (e) {
            e.preventDefault();
            if(current.e){
                if(current.key.key.length > 2){
                    if(current.key.key == "delete"){
                        textarea.delete();
                    }else if(current.key.key == "enter"){
                        textarea.insertChar("\n");
                    }else if(current.key.key == "space"){
                        textarea.insertChar(" ");
                    }
                }else{
                    textarea.insertChar(current.key.key);
                }
                // 凸ませる
                keyboard.modifyKeys({
                    type : "enable",
                    withouts : []
                });

                
                var m = [];
                for(var i = 0 ; i < rows[0].length ; i++){
                    m[i] = rows[0][i];
                }
                keyboard.modifyKeysWithKeyAtRowIndex(m,0);
                console.log(buffer);
//                switch(buffer.length){
//                    case 1:
//                        // meta key
//                        if(buffer[0].length > 2){
//                            switch(buffer[0]){
//                                case "delete":
//                                    textarea.delete();
//                                    break;
//                                default :
//                                    break;
//                            }
//                        }else{
//                            if(buffer[0] == "n"){
//                                textarea.insertChar("ん");
//                            }else{
//                                textarea.insertChar(buffer[0]);
//                            }
//                        }
//                        break;
//                    case 2:
//                        var r = dictionary[buffer[0]][buffer[1]];
//                        if(r){
//                            textarea.insertChar(r);
//                        }
//                        break;
//                    case 3:
//                        var r = dictionary[buffer[0]]["y"+buffer[2]];
//                        if(r){
//                            textarea.insertChar(r);
//                        }
//                        break;
//                    default:
//                        break;
//                }
                buffer = [];
                current.e = null;
                current.key = null;
            }
        }

        function mouseDidUp (e){
            e.preventDefault();
            if(current.e){
                current.key.push();
                keyboard.modifyKeys({
                    type : "enable",
                    withouts : []
                    });
                console.log(buffer);
                buffer = [];
                current.e = null;
                current.key = null;
            };
        }

        function convert(){
        }

        function textareaDidChange (e,data) {
            console.log("inserted : " + data.inserted);
//            var corrected = corrector.sandwhich(data.inserted);
//            if(corrected){
//                console.log("corrected is " + corrected);
//                //textarea.correct(corrected);
//            }
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
        modifyKeysWithKeyAtRowIndex : function(keys,index){
            var cKeys = this.rows[index].keys; 
            var newKeys = [];           
            for(var i = 0 , max = keys.length ; i < max ; i++){
                var key = this.rows[index].keys[i];
                // bug
                key.key = keys[i];
                if(keys[i].length > 2){
                    key.char.innerHTML = dictionary[keys[i]].center;
                }else{
                    key.char.innerHTML = keys[i];
                }
            }
            return cKeys;
        },
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
            this.index = index;
            return this;
        },
        keys : [],
        index : -1
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
        },
        modifyDisplayChar : function(c) {
            this.char.innerHTML = c;
            this.key = c;
        }
    };

    KeyChar = {
        init : function(key){
            this.className = "key-char";
            if(iPhone){
                this.className += " key-char-iPhone";
            };
            if(key.length > 2){
                this.style.height = "28px";
                this.innerHTML = dictionary[key].center;
            }else{
                this.innerHTML = key.toUpperCase();
            }
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
        if(iPad || Android || iPhone){
            if(e.touches){
                return { x : e.changedTouches[0].pageX , y : e.changedTouches[0].pageY };
            }else if(e.originalEvent) {
                return { x : e.originalEvent.touches[0].pageX , y : e.originalEvent.touches[0].pageY }
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

    getKeyPressed = function(pos) {
        
    }

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

    

}());
