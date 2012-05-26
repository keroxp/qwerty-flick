(function(){
    // @interface
    var QWERTY,
    // Classes
    Textarea,
    Key, 
    Pie,
    PiePiece,
    // Data
    rows = [],
    dictionary = {},
    // Constants
    PI = 0.0,
    iPad   = false,
    Android = false
    // Helper objects
    handler = {
        window : {
            ondown : function(e){},
            onmove : function(e){},
            onup   : function(e){}
        },
        keyboard : {
            ondown : function(e){},
            onmove : function(e){},
            onup   : function(e){}

        },
        key : {
            ondown : function(e){},
            onmove : function(e){},
            onup   : function(e){}
        }
    },
    current = {
        event : null,
        key : null,
        pie : null,
        piece : null
    },
    // Helper functions
    addListener = function(type,obj,fn){},
    stopEvent   = function(event){},
    log         = function(text){};
    // メインイベントメディエータであるwindowオブジェクトの拡張
    // イニシャライザ
    $(function(){
        //textareaオブジェクトの生成
        var MAIN,
        textarea = Textarea(), 
        keyboard = document.getElementById("keyboard"),
        candies = document.getElementById("candies"),
        maxes = [],
        i, j, row, char, key;

        addListener("down",window,handler.window.ondown);
        addListener("move",window,handler.window.onmove);
        addListener("up"  ,window,handler.window.onup);

        textarea.id = "textarea";
        textarea.disabled = "disabled";
        document.getElementById("textarea-wrapper").appendChild(textarea);

        // keyboardオブジェクトの生成
        for(i = 0 , maxes[0] = rows.length ; i < maxes[0] ; i++){
            row = document.createElement("div");
            row.id = "key-row-" + i;
            row.className = "key-row clearfix";
            for(j = 0 , maxes[1] = rows[i].length ; j < maxes[1] ; j++){
                char = rows[i][j];
                key = Key(char);
                row.appendChild(key);
            }
            keyboard.appendChild(row);
        }
    });
    // キー配列
    rows = [];
    rows[1] = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "delete"]
    rows[2] = ["a", "s", "d", "f", "g", "h", "j", "k", "l","enter"]
    rows[3] = ["shift","z", "x", "c", "v", "b", "n", "m", ",", ".","-"];
    rows[4] = ["command","space","num"];
    rows[0] = ["1","2","3","4","5","6","7","8","9","0"];

    // パイメニュー
    dictionary = {
        "q" : ["q", "くぁ", "くぃ", "く", "くぇ", "くぉ"],
        "w" : ["w", "わ", "うぃ", "う", "うぇ", "を"],
        "e" : ["e", "え", "え", "え", "え", "え"],
        "r" : ["r", "ら", "り", "る", "れ", "ろ"],
        "t" : ["t", "た", "ち", "つ", "て", "と"],
        "y" : ["y", "や", "い", "ゆ", "え", "お"],
        "u" : ["u", "う", "う", "う", "う", "う"],
        "i" : ["i", "い", "い", "い", "い", "い"],
        "o" : ["o","お", "お", "お", "お", "お"],
        "p" : ["p", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
        "a" : ["a", "あ", "あ", "あ", "あ", "あ"],
        "s" : ["s", "さ", "し", "す", "せ", "そ"],
        "d" : ["d", "だ", "ぢ", "づ", "で", "ど"],
        "f" : ["f", "ふぁ", "ふぃ", "ふ", "ふぇ", "ふぉ"],
        "g" : ["g", "が", "ぎ", "ぐ", "げ", "ご"],
        "h" : ["h", "は", "ひ", "ふ", "へ", "ほ"],
        "j" : ["j", "じゃ", "じ", "じゅ", "じぇ", "じょ"],
        "k" : ["k", "か", "き", "く", "け", "こ"],
        "l" : ["l", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"],
        "z" : ["z", "ざ", "じ", "ず", "ぜ", "ぞ"],
        "x" : ["x", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ"],
        "c" : ["c", "つぁ", "つぃ", "つ", "つぇ", "つぉ"],
        "v" : ["v", "ヴぁ", "ヴぃ", "ヴ", "ヴぇ", "ヴぉ"],
        "b" : ["b", "ば", "び", "ぶ", "べ", "ぼ"],
        "n" : ["n", "な", "に", "ぬ", "ね", "の"],
        "m" : ["m", "ま", "み", "む", "め", "も"],
        "," : [",", "、", "。", "ー", "！", "？"],
        "." : [".", "", "", "", "", ""],
        "enter" : ["⏎","","","","",""],
        "command" : ["⌘","","","","",""],
        "shift" : ["⇧","","","","",""],
        "space" : ["","全角","","","",""],
        "delete" : ["⌫","","","","",""],
        "num": ["num","","","","",""]
    };

    // 定数

    PI = 3.14159265;
    iPad = (navigator.userAgent.indexOf("iPad") < 0 ) ?  false : true;
    Android = (navigator.userAgent.indexOf("Android") < 0 ) ? false : true;

    // 現在担当しているイベント情報の格納庫
    current = {
        key : null,
        pie : null,
        piece : null,
        event : null
    };

    handler = {
        window : {
            ondown : function(e){
                e.preventDefault(); 
            },
            onmove : function(e){
                e.preventDefault();
                if(current.event){
                    var cpp, 
                    dx = e.pageX - current.event.pageX,
                    dy = -(e.pageY - current.event.pageY),
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
                log(chara);
                if(chara.length <= 2){
                    textarea.insertChar(chara);
                }else if(chara.length > 2){
                    switch(chara){
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
                    className = this.className;
                // 凹ませる
                $(this).removeClass("gg").addClass("ggr");
                // カレントオブジェクトを登録
                current.event = e;
                current.key   = this;
            },
            onmove : function(e) {
                // タップが発生し、かつ動いた場合
                if(current.event){
                    if(e.srcElement === current.event.srcElement && !current.pie){
                        // Pieオブジェクトを作成
                        var key = this.getAttribute("data-key"),
                        p = Pie(key),
                        i,max;
                        this.appendChild(p);
                        this.pie = p;
                        for(i = 0 , max = p.pieces.length ; i < max ; i++){
                            p.pieces[i].style.left = p.pieces[i].offsetLeft - (p.pieces[i].offsetWidth / 2 - p.offsetWidth) - p.offsetWidth / 2 - 4 + "px";
                            p.pieces[i].style.top  = p.pieces[i].offsetTop - (p.pieces[i].offsetHeight / 2 - p.offsetHeight) - p.offsetHeight / 2 - 4  + "px";
                            p.pieces[i].style.left = p.pieces[i].offsetLeft + 70 * Math.cos((72 * i - 90) * PI / 180) + "px";
                            p.pieces[i].style.top  = p.pieces[i].offsetTop  + 70 * Math.sin((72 * i - 90) * PI / 180) + "px";
                        }
                        // カレントオブジェクトを登録
                        current.pie  = p;
                        current.piece = p.center;
                    }
                }else{
                    stopEvent(e);
                }
            },
            onup   : function(e) {
                var key = this.getAttribute("data-key"),
                    pos = (e.changedTouches) ? {x : e.changedTouches[0].pageX , y : e.changedTouches[0].pageY } : {x : e.pageX , y : e.pageY };
                if(Math.abs(pos.x - current.event.pageX) < 10 && Math.abs(pos.y -  current.event.pageY) < 10){
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
                            textarea.delete();
                            break;
                        case "space" :
                            textarea.insertChar(" ");
                            break;
                        default :
                            textarea.insertChar(this.getAttribute("data-key"));
                    }
                    current.event = null;
                    $(this).removeClass("ggr").addClass("gg");
                    stopEvent(e);
                }
            }
        }
    };

    //テクストエリアオブジェクトを生成する関数
    Textarea = function(){
        var t = document.createElement("textarea");
        t.insertChar = function(c){
            var chara = c || "",
            pos = this.selectedRange(),
            text = this.value,
            prev = text.substr(0,pos.s),
            next = text.substr(pos.e,text.length - pos.end),
            newpos = (prev + chara).length;
            this.value = prev + chara + next; 
            this.setCaret(newpos);
        };
        t.insertPat = function(pat){
            var pat = pat,
            pos = this.selectedRange(),
            text = this.value,
            prev = text.substr(0, pos.s),
            next = text.substr(pos.e, text.length - pos.e),
            newpos = (prev + pat).length;
            this.value = prev + pat + next;
            this.setSelectionRange(pos.s,(prev+pat).length);
        };
        t.delete = function(){
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
        };
        t.selectedRange = function(){
            return {s : this.selectionStart, e: this.selectionEnd}
        };
        t.selectedStr = function(){
            var pos = this.selectedRange();
            return this.value.substr(pos.s,pos.e - pos.s)
        };
        t.setCaret = function(newpos){
            this.setSelectionRange(newpos,newpos);
        };
        return t;
    }

    // Keyオブジェクトを生成する関数
    Key = function(c){
        var k = document.createElement("div"),
        kc =document.createElement("div");
        k.id = "key-" + c;
        k.dataset.key = c;
        k.className = "key gg ds";

        kc.className = "key-char";
        kc.innerHTML = c.toUpperCase();

        addListener("down", k, handler.key.ondown);
        addListener("move", k, handler.key.onmove);
        addListener("up",   k, handler.key.onup);

        if(c.length > 1){
            k.className += " key-meta";
            switch(c){
                case "shift" : 
                    k.className += " key-shift";
                    kc.innerHTML = "⇧";
                    break;
                case "enter" : 
                    k.className += " key-enter";
                    break;
                case "command" :
                    k.className += " key-command";
                    kc.innerHTML=  "⌘"
                    break;
                case "delete":
                    k.className += " key-delete";
                    kc.innerHTML = "⌫";
                    break;
                case "space" :
                    k.className += " key-space";
                    break;
                case "num" :
                    k.className += " key-num";
                    break;
                default :
            }
        }
        k.appendChild(kc);
        return k;
    }

    // Pieオブジェクトの生成関数

    Pie = function(c){
        var p = document.createElement("div"),
        pc = document.createElement("div"),
        ps = PiePieces(c);

        p.className = "pie gbl";

        pc.className = "pie-char";
        pc.dataset.key = c;
        pc.innerHTML = c;
        p.appendChild(pc);

        p.center = pc;

        for(var i = 0 , max = ps.length ; i < max ; i++){
            p.appendChild(ps[i]);
        }
        p.pieces = ps;

        return p;
    }

    // PiePieceオブジェクトの生成関数

    PiePieces = function(key){
        var ps = [],
        dict = dictionary[key];
        for(var i = 0 , max = 5 ; i < max ; i++){
            var p = document.createElement("div");
            p.className = "pie-piece";
            p.dataset.key = dict[i+1];
            p.innerHTML = dict[i+1];
            ps.push(p);
        }
        return ps;
    }

    // Utility functions

    stopEvent = function(e){
        if(e.stopPropagation){
            e.stopPropagation();
        }else if(e.cancelBubble){
            e.cancelBubble();
        }
    }

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
                log("missing event type");
                return false;
        }
    }

    log = function(m) {
        var _m = m;
        console.log(_m);
    }
}());
