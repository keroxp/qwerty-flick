(function(){
 // メインイベントメディエータであるwindowオブジェクトの拡張
 // 現在担当しているイベント情報の格納庫
 window.current = { 
key : null,
pie : null,
piece : null,
event : null
}
// イニシャライザ

window.onload = function(){
    //textareaオブジェクトの生成
        var tw = document.getElementById("textarea-wrapper");
        var textarea = Textarea(); 
        textarea.id = "textarea";
        textarea.disabled = "disabled";
        tw.appendChild(textarea);

        // keyboardオブジェクトの生成
        var keyboard = document.getElementById("keyboard");
        var candies = document.getElementById("candies");

        for(var i = 0 , max = rows.length ; i < max ; i++){
            var r = document.createElement("div");
            r.id = "key-row-" + i;
            r.className = "key-row clearfix";
            for(var j = 0 , max = rows[i].length ; j < max ; j++){
                var c = rows[i][j];
                var k = Key(c);
                r.appendChild(k);
            }
            keyboard.appendChild(r);
        }
}
// キーボード用辞書
var rows = [];
rows[0] = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "delete"]
rows[1] = ["a", "s", "d", "f", "g", "h", "j", "k", "l","enter"]
rows[2] = ["shift","z", "x", "c", "v", "b", "n", "m", ",", ".","-"];
rows[3] = ["command","space"];

var dictionary = {
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
    "delete" : ["⌫","","","","",""]
}

// 定数

var PI = 3.14159265;
var iPad = (navigator.userAgent.indexOf("iPad") < 0 ) ?  false : true;
var Android = (navigator.userAgent.indexOf("Android") < 0 ) ? false : true;

//テクストエリアオブジェクトを生成する関数
var Textarea = function(){
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

 var handler = {
    ondown : function(e){
         e.preventDefault(); // Pieオブジェクトを作成
         var key = this.getAttribute("data-key");
         var p = Pie(key);
         this.appendChild(p);
         this.pie = p;
         for(var i = 0 , max = p.pieces.length ; i < max ; i++){
             p.pieces[i].style.left = p.pieces[i].offsetLeft - (p.pieces[i].offsetWidth / 2 - p.offsetWidth) - p.offsetWidth / 2 - 4 + "px";
             p.pieces[i].style.top  = p.pieces[i].offsetTop - (p.pieces[i].offsetHeight / 2 - p.offsetHeight) - p.offsetHeight / 2 - 4  + "px";
             p.pieces[i].style.left = p.pieces[i].offsetLeft + 70 * Math.cos((72 * i - 90) * PI / 180) + "px";
             p.pieces[i].style.top  = p.pieces[i].offsetTop  + 70 * Math.sin((72 * i - 90) * PI / 180) + "px";
         }
         // カレントoオブジェクトを登録
         window.current.event = e;
         window.current.key = this;
         window.current.pie  = p;
         window.current.piece = p.center;
    },
    onmove : function(e){
        e.preventDefault();
        if(window.current.event){
            var cpp, 
                dx = e.pageX - window.current.event.pageX,
                dy = -(e.pageY - window.current.event.pageY),
                angle = Math.atan2(dy,dx);

            if(angle < 0 ){
                angle += PI * 2;
            }

            if((0 <= angle && angle < PI*3/10) || (PI*19/10 <= angle && angle <= PI*2)){
                // 右上
                cpp = window.current.pie.pieces[1];
            }else if(PI*3/10  <= angle && angle < PI*7/10 ){
                // 上
                cpp = window.current.pie.pieces[0];
            }else if(PI*7/10  <= angle && angle < PI*11/10 ){
                // 左上
                cpp = window.current.pie.pieces[4];
            }else if(PI*11/10  <= angle && angle < PI*15/10 ){
                // 左下
                cpp = window.current.pie.pieces[3];
            }else if(PI*15/10  <= angle && angle < PI*19/10 ){
                // 右下
                cpp = window.current.pie.pieces[2];
            }

//            if(window.current.piece.className.indexOf("piece") < 0) {
//                window.current.piece = cpp;
//            }
//
            if(cpp !== window.current.piece){
                if(window.current.piece.className.indexOf("pie-piece") > -1) {
                    window.current.piece.className = "pie-piece";
                }
                cpp.className += " gbv";
                window.current.piece = cpp;
            }
        }
    },
    onup : function(e){
            if(window.current.event){
                //キャラクタをインサート
                if(window.current.pie){
                    var piece = window.current.piece,
                        chara = piece.getAttribute("data-key");
                    log(chara);
                    if(chara.length <= 2){
                        textarea.insertChar(chara);
                    }else if(chara.length > 2){
                        switch(chara){
                        case "delete" :
                            log("delete");
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
                        default :
                            return false;
                            break;
                        }
                    }
                }
                window.current.key.removeChild(window.current.key.pie);
                window.current.event = null;
                window.current.key = null;
                window.current.pie = null;
                window.current.piece = null;
            }
        }
}

if(iPad || Android){
    window.ontouchend = handler.onup;
    window.ontouchmove= handler.onmove;
}else{
    window.onmouseup = handler.onup;
    window.onmousemove=handler.onmove;
}

var Key = function(c){
    // keyオブジェクトの作成
    var k = document.createElement("div");

    k.id = "key-" + c;
    k.dataset.key = c;
    k.className = "key gg ds";
    
    if(iPad || Android){
        k.ontouchstart = handler.ondown;
    }else{
        k.onmousedown  = handler.ondown;
    }

    // key-charオブジェクトの作成
    var kc =document.createElement("div");
    kc.className = "key-char";
    kc.innerHTML = c.toUpperCase();
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
            default :
        }
    }
    k.appendChild(kc);
    return k;
}

var Pie = function(c){
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

var PiePieces = function(key){
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

var ce = function(elem, attr, inner) {
    var _elem = document.createElement(elem);
    if(inner) {
        if( typeof inner == "string") {
            _elem.innerHTML = inner || "";
        } else if( typeof inner == "object") {
            _elem.appendChild(inner);
        }
    }
    if(attr) {
        for(var i in attr) {
            if(i == "className") {
                _elem.className = attr[i];
            } else {
                _elem.setAttribute(i, attr[i]);
            }
        }
    }
    return _elem;
}
var log = function(m) {
    var _m = m;
    console.log(_m);
}
}());
