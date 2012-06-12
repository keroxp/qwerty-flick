(function(){
    // @interface
    var QWERTY,
    // Classes
    Textarea = {},
    Keyboard = {},
    Candies  = {},
    Key      = {},
    Pie      = {},
    PiePiece = {},
    Handler  = {},
    // Data
    rows = [],
    dictionary = {},
    // Constants
    PI = 0.0,
    iPad   = false,
    Android = false,
    // Helper objectas ( an interface of event handlers);
    current = {},
    // Helper functions
    addListener = function(type,obj,fn){},
    stopEvent   = function(event){};
    // Initializer 
    $(function(){
        // private vars
        var MAIN,
        textarea = {},
        keyboard = {},
        candies  = {},
        maxes = [],
        i, j, row, char, key;

        // Extend DOM objects to UI objects (actually, we instantiate UI Objects which inherit from HTMLDivElement object) 
        textarea = $.extend($("#textarea")[0], Textarea).init(); 
        keyboard = $.extend($("#keyboard")[0], Keyboard).init();
        candies  = $.extend($("#candies")[0],  Candies).init();

        // Attach window object with event handler
        addListener("down", window, Handler.window.ondown);
        addListener("move", window, Handler.window.onmove);
        addListener("up"  , window, Handler.window.onup);

        // Setup keys for keyboard
        for(i = 0 , maxes[0] = rows.length ; i < maxes[0] ; i++){
            row = div(); 
            row.id = "key-row-" + i;
            row.className = "key-row clearfix";
            for(j = 0 , maxes[1] = rows[i].length ; j < maxes[1] ; j++){
                char = rows[i][j];
                key = $.extend(div(),Key,Handler.key).init(char);
                row.appendChild(key);
            }
            keyboard.appendChild(row);
        }
    });
    // キー配列
    rows = [];
    rows[0] = ["1","2","3","4","5","6","7","8","9","0"];
    rows[1] = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "delete"]
    rows[2] = ["a", "s", "d", "f", "g", "h", "j", "k", "l","enter"]
    rows[3] = ["shift","z", "x", "c", "v", "b", "n", "m", ",", ".","-"];
    rows[4] = ["command","space","num"];

    // パイメニュー
    dictionary = {
        "1" : {center : "1", pieces : [] },
        "2" : {center : "2", pieces : [] },
        "3" : {center : "3", pieces : [] },
        "4" : {center : "4", pieces : [] },
        "5" : {center : "5", pieces : [] },
        "6" : {center : "6", pieces : [] },
        "7" : {center : "7", pieces : [] },
        "8" : {center : "8", pieces : [] },
        "9" : {center : "9", pieces : [] },
        "0" : {center : "0", pieces : [] },
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
    iPad = (navigator.userAgent.indexOf("iPad") < 0 ) ?  false : true;
    Android = (navigator.userAgent.indexOf("Android") < 0 ) ? false : true;

    // @implementation of Keyboard

    Keyboard = {
        init : function(){
            return this;
        }
    };

    // @implementation of Candies

    Candies = {
        init : function(){
            return this;
        }
    };

    // @implementation of Textarea

    Textarea = {
        init : function(){
            this.id = "textarea";
            this.disabled = "disabled";
            if(iPad || Android){
                $(this).on("touchstart.qwerty", Handler.textarea.ondown); 
            }else{
                $(this).on("mousedown.qwerty", Handler.textarea.ondown);
            }
            $(this).on("delete.qwerty" , this.delete);
            $(this).on("textchanged.qwerty" , AutoCorrector.onchange);
            addListener("move", this, Handler.textarea.onmove);
            addListener("up"  , this, Handler.textarea.onup);
            return this;
        },
        insertChar : function(c){
            var chara = c || "",
            pos = this.selectedRange(),
            text = this.value,
            prev = text.substr(0,pos.s),
            next = text.substr(pos.e,text.length - pos.end),
            newpos = (prev + chara).length;
            this.value = prev + chara + next; 
            this.setCaret(newpos);
        },
        insertPat : function(pat){
            var pat = pat,
            pos = this.selectedRange(),
            text = this.value,
            prev = text.substr(0, pos.s),
            next = text.substr(pos.e, text.length - pos.e),
            newpos = (prev + pat).length;
            this.value = prev + pat + next;
            this.setSelectionRange(pos.s,(prev+pat).length);
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
    };

    // @implementation of Key
    Key = {
        init : function(c){
            this.id = "key-" + c;
            this.dataset.key = c;
            this.className = "key gg ds";

            if(iPad || Android){
                $(this).on("touchstart.qwerty", Handler.key.ondown);
                $(this).on("touchmove.qwerty" , Handler.key.onmove);
                $(this).on("touchend.qwerty"  , Handler.key.onup);
            }else{
                $(this).on("mousedown.qwerty", Handler.key.ondown);
                $(this).on("mousemove.qwerty", Handler.key.onmove);
                $(this).on("mouseup.qwerty"  , Handler.key.onup);
            }

           // when this is meta key
            if(c.length > 1){
                this.className += " key-" + c;
            };  

            // setup child node
            this.char = div();
            this.char.className = "key-char";
            this.char.innerHTML = dictionary[c].center.toUpperCase();
            this.appendChild(this.char);

            return this;
        },
        char : {},
    };

    // @implementation of Pie
    Pie = {
        init : function(c) {

            this.className = "pie gbl";
            this.center = div();
            this.center.className = "pie-char";
            this.center.dataset.key = c;
            this.center.innerHTML = dictionary[c].center;
            this.appendChild(this.center);

            for(var i = 0, max = 5, p = {} ; i < max ; i++){
                p = $.extend(div(),PiePiece).init(c,i);
                this.pieces.push(p);
                this.appendChild(p);
            }
            return this;
        },
        center : {},
        pieces : []
    }

    // @implementation of PiePiece
    PiePiece = {
        init : function(key,index) {
            this.className = "pie-piece";
            this.dataset.key = dictionary[key].pieces[index];
            this.innerHTML = dictionary[key].pieces[index];
            return this;
        }
    }

    // @implementation of AutoCorecctor
    
    AutoCorrector = {
        init : function(){
            return this;
        },
        str : "",
        buffer : [],
        isKana : function(text,index){
            if(text[index] == "") return false;
            if(text.charCodeAt(index) >= 0x3041 && text.charCodeAt(index) <= 0x3093){
                return true;
            }
            return false;
        },
        sandwhich : function(){
            //確認用の配列
            var len, 
            count = 0;

            for(var i = 0; i < this.str.length; i++){
                this.buffer[i] = this.str[i];
            }
           //配列の最後のポインタ
            len = this.buffer.length - 1;

            if(this.isKana(this.str, len) && !this.isKana(this.str, len-1)){
                if(this.str[len-1] == "n"){
                    count = this.numberOfRepeats();
                    if(this.isKana(this.str, len-count-1)){
                        this.replaceBuffer("ん", count);
                        if(count!=1){
                            this.buffer.splice(len-1);
                        }
                        console.log(this.buffer);
                        this.str = this.buffer.join("");
                        textarea.value = this.str;
                    }
                }else{
                    count = this.numberOfRepeats();
                    if(this.isKana(this.str, len-count-1)){
                        this.replaceBuffer("っ", count);
                        this.str = this.buffer.join("");
                        textarea.value = this.str;
                    }
                }
            }

        },
        replaceBuffer : function(chara,length){
            for(var i = 1 , len = this.buffer.length - 1; i < length + 1 ; i++){
                this.buffer[len - i] = chara;
            };
        },
        numberOfRepeats : function(){
            var count;
            for(var i = 0 , count = 0 , max = this.buffer.length - 1 ; i< max ; i++){
                if(this.buffer[max-i] != this.buffer[max]){
                    break;
                }else{
                    count++;
                }
            }
            return count;
        },
        onchange : function(){
            AutoCorrector.str = this.value;
            AutoCorrector.buffer = [];
            AutoCorrector.sandwhich();
        }
    };

    // @implementation of Handler
    Handler = {
        window : {
            ondown : function(e){
                e.preventDefault(); 
            },
            onmove : function(e){
                e.preventDefault();
                if(current.event){
                    var cpp, 
                    pos = getPosition(e),
                    prevPos = getPosition(current.event),
                    dx = pos.x - prevPos.x, 
                    dy = -(pos.y - prevPos.y),
                    angle = Math.atan2(dy,dx);

                    if(angle < 0 ){
                        angle += PI * 2;
                    }

                    if((0 <= angle && angle < PI*3/10) || (PI*19/10 <= angle && angle <= PI*2)){
                        // 右上
                        cpp = current.pie.pieces[1];
                    }else if(PI*3/10  <= angle && angle < PI*7/10 ){
                        // 上
                        cpp = current.pie.pieces[0];
                    }else if(PI*7/10  <= angle && angle < PI*11/10 ){
                        // 左上
                        cpp = current.pie.pieces[4];
                    }else if(PI*11/10  <= angle && angle < PI*15/10 ){
                        // 左下
                        cpp = current.pie.pieces[3];
                    }else if(PI*15/10  <= angle && angle < PI*19/10 ){
                        // 右下
                        cpp = current.pie.pieces[2];
                    }

                    if(cpp !== current.piece){
                        if($(current.piece).hasClass("pie-piece")) {
                            current.piece.className = "pie-piece";
                        }
                        cpp.className += " gbv";
                        current.piece = cpp;
                    }
                }
            },
            onup : function(e){
                e.preventDefault();
                //キャラクタをインサート
                var piece = current.piece,
                chara = piece.getAttribute("data-key");
                if(chara.length <= 2){
                    textarea.insertChar(chara);
                    $(textarea).trigger("textchanged.qwerty");
                }else if(chara.length > 2){
                    switch(chara){
                        case "delete" :
                        //    textarea.delete(); 
                            $("#textarea").trigger("delete.qwerty");
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
                            break;
                        default :
                            return false;
                            break;
                    }
                }
                $(current.key).removeClass("ggr").addClass("gg");
                if(current.pie){
                    current.key.removeChild(current.key.pie);
                }
                current.event = null;
                current.key = null;
                current.pie = null;
                current.piece = null;
            }
        },
        keyboard : {
            ondown : function(e) {
            },
            onmove : function(e) {
            },
            onup   : function(e) {
            }
        },
        key : {
            ondown : function(e) {
                e.preventDefault();
                var key = this.getAttribute("data-key"),
                p = $.extend(div(),Pie).init(key);

                // 凹ませる
                $(this).removeClass("gg").addClass("ggr");
                this.appendChild(p);
                this.pie = p;
                // Centering pieces
                for(var i = 0 , max = p.pieces.length ; i < max ; i++){
                    p.pieces[i].style.left = p.pieces[i].offsetLeft - (p.pieces[i].offsetWidth  / 2 - p.offsetWidth ) - p.offsetWidth  / 2 - 4 + "px";
                    p.pieces[i].style.top  = p.pieces[i].offsetTop  - (p.pieces[i].offsetHeight / 2 - p.offsetHeight) - p.offsetHeight / 2 - 4 + "px";
                    p.pieces[i].style.left = p.pieces[i].offsetLeft + 70 * Math.cos((72 * i - 90) * PI / 180) + "px";
                    p.pieces[i].style.top  = p.pieces[i].offsetTop  + 70 * Math.sin((72 * i - 90) * PI / 180) + "px";
                };
                // Register buffers 
                current.pie  = p;
                current.piece = p.center;
                current.event = e;
                current.key   = this;
            },
            onmove : function(e) {
            },
            onup   : function(e) {
                var key = this.getAttribute("data-key"),
                    pos = getPosition(e);
                    switch(key){
                        case "num" :
                            if($(this).hasClass("open")){
                                $(this).removeClass("open");
                                $("#key-row-0").css("display","none");
                            }else{
                                $(this).addClass("open");
                                $("#key-row-0").css("display","block");
                            }
                            break;
                        case "delete" :
                            //textarea.delete();
                            break;
                        case "space" :
                            textarea.insertChar(" ");
                            break;
                        default :
                    }
                    $(this).removeClass("ggr").addClass("gg");
            }
        },
        textarea : {
            ondown : function(e){},
            onmove : function(e){},
            onup   : function(e){}
        }
    };


    // Utility functions

    getPosition = function(e){
        if(e.touches){
            return { x : e.changedTouches[0].pageX , y : e.changedTouches[0].pageY };
        }else{
            return { x : e.pageX , y : e.pageY };
        };
    }

    stopEvent = function(e){
        if(e.stopPropagation){
            e.stopPropagation();
        }else if(e.cancelBubble){
            e.cancelBubble();
        }
    };

    addListener = function(type,obj,fn){
        switch(type){
            case "down" :
                if(iPad || Android) {
                    obj.addEventListener("touchstart",fn,false);
                }else if(obj.addEventListener){
                    obj.addEventListener("mousedown",fn,false);
                }else if(obj.attachEvent){
                    obj.attachEvent("onmousedown",fn,false);
                }
                break;
            case "move" :
                if(iPad || Android){
                    obj.addEventListener("touchmove",fn,false);
                }else if(obj.addEventListener){
                    obj.addEventListener("mousemove",fn,false);
                }else if(obj.attachEvent){
                    obj.attachEvent("onmousemove",fn,false);
                }
                break;
            case "up" :
                if(iPad || Android){
                    obj.addEventListener("touchend",fn,false);
                }else if(obj.addEventListener){
                    obj.addEventListener("mouseup",fn,false);
                }else if(obj.attachEvent){
                    obj.attachEvent("onmouseup",fn,false);
                }
                break;
            default :
                console.log("missing event type");
                return false;
        }
    };

    div = function(){
        return document.createElement("div");
    };
}());
