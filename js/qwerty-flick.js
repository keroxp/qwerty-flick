(function(){
    // メインイベントメディエータであるwindowオブジェクトの拡張
    // 現在担当しているイベント情報の格納庫
 window.current = { 
key : null,
pie : null,
concent : null,
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
            r.className = "key-row";
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
            "e" : ["e", "", "", "", "え", ""],
            "r" : ["r", "ら", "り", "る", "れ", "ろ"],
            "t" : ["t", "た", "ち", "つ", "て", "と"],
            "y" : ["y", "や", "い", "ゆ", "え", "お"],
            "u" : ["u", "", "", "う", "", ""],
            "i" : ["i", "", "い", "", "", ""],
            "o" : ["o", "", "", "", "", "お"],
            "p" : ["p", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
            "a" : ["a", "あ", "", "", "", ""],
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
        // ベースオブジェクト

        var Textarea = function(){
            var t = document.createElement("textarea");
            t.insertChar = function(chara){
                var _chara = chara || "";
                 var _pos = this.selectedRange();
                 var _text = this.value;
                 var _prev = _text.substr(0,_pos.s);
                 var _next = _text.substr(_pos.e,_text.length - _pos.end);
                 this.value = _prev + _chara + _next; 
                 var _newpos = (_prev + _chara).length;
                 this.setCaret(_newpos);
             },
            t.insertPat = function(pat){
                var _pat = pat;
                var _pos = this.selectedRange();
                var _text = this.value;
                var _prev = _text.substr(0,_pos.s);
                var _next = _text.substr(_pos.e,_text.length - _pos.e);
                this.value = _prev + _pat + _next;
                var _newpos = (_prev + _pat).length;
                this.setSelectionRange(_pos.s,(_prev+_pat).length);
            },
            t.delete = function(){
                var _selected = this.selectedStr();
                var _pos = this.selectedRange();
                if(_selected.length > 0){
                    this.insertPat("");
                }else{
                    if(_pos.s > 0){
                        var _text = this.value;
                        var _prev = _text.substr(0,_pos.s - 1);
                        log(_prev);
                        var _next = _text.substr(_pos.e,_text.length - _pos.e);
                        log(_next);
                        this.value = _prev + _next;
                        this.setCaret(_prev.length);
                    }
                }
         },
         t.selectedRange = function(){
             return {s : this.selectionStart, e: this.selectionEnd}
         },
        t.selectedStr = function(){
            var _pos = this.selectedRange();
            return this.value.substr(_pos.s,_pos.e - _pos.s)
        },
        t.setCaret = function(newpos){
            this.setSelectionRange(newpos,newpos);
        }

        return t;
 }

 var handler = {
    ondown : function(e){
                  e.preventDefault();
                  // Pieオブジェクトを作成
                  var key = this.getAttribute("data-key");
                  var p = Pie(key);
                  this.appendChild(p);
                  this.pie = p;
                   // カレントoオブジェクトを登録
                  window.current.event = e;
                  window.current.key = this;
                  window.current.pie  = p;
    },
    onmove : function(e){
        e.preventDefault();
        if(window.current.event){
            var dx,dy;
            var ce = window.current.event;

            dx = e.pageX - ce.pageX;
            dy = -(e.pageY - ce.pageY);

            var angle = Math.atan2(dy,dx);
            if(angle < 0 ){
                angle += PI * 2;
            }

            var add = -PI/10;

            if(0 + add <= angle && angle < PI*2/5 + add){
                console.log("2");
            }else if(PI*2/5 + add <= angle && angle < PI*4/5 + add){
                console.log("1");
            }else if(PI*4/5 + add <= angle && angle < PI*6/5 + add){
                console.log("5");
            }else if(PI*6/5 + add <= angle && angle < PI*8/5 + add){
                console.log("4");
            }else if(PI*8/5 + add <= angle && angle < PI*2 + add){
                console.log("3");
            }
        }
    },
    onup : function(e){
            // pieオブジェクトの外でmouseupされても消えるように
            if(window.current.event){
                //キャラクタをインサート
                if(currentHandlingConcent){
                    var _concent = currentHandlingConcent;
                    var _chara = _concent.getAttribute("data-key");
                    log(_chara);
                    currentHandlingConcent = null;
                    if(_chara.length <= 2){
                        textarea.insertChar(_chara);
                    }else if(_chara.length > 2){
                        switch(_chara){
                            case "Delete" :
                                textarea.delete(); 
                            break;
                            case "Shift" :
                                break;
                            case "Command" : 
                                break;
                            case "Space" : 
                                textarea.insertChar(" ");
                            break;
                            case "Enter" : 
                                textarea.insertChar("\n");
                            break;
                            default :
                            return false;
                            break;
                        }
                    }
                }
                var _this = currentHandlingKey;
                window.current.event = null;
                window.current.key = null;
                window.current.pie = null;
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
    var p = document.createElement("div");
    p.className = "pie gbl";
    var pc =document.createElement("div");
    pc.className = "pie-char";
    pc.innerHTML = c;
    var ps = PiePieces(c);
    p.appendChild(pc);
    for(var i = 0 , max = ps.length ; i < max ; i++){
        p.appendChild(ps[i]);
    }
    return p;
}

var PiePieces = function(key){
    var ps = [];
    var dict = dictionary[key];
    for(var i = 0 , max = 5 ; i < max ; i++){
        var p = document.createElement("div");
        p.className = "pie-piece";
        p.innerHTML = dict[i+1];
        p.style.left+= 72 * Math.cos((72 * i - 90) * PI / 180) + "px";
        p.style.top += 72 * Math.sin((72 * i - 90) * PI / 180) + "px";
        ps.push(p);
    }
    return ps;
}

// Utility functions

function object(o) {
    var f = object.f, i, len, n, prop;
    f.prototype = o;
    n = new f;
    for( i = 1, len = arguments.length; i < len; ++i)
        for(prop in arguments[i])
            n[prop] = arguments[i][prop];
    return n;
}

object.f = function() {
};
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
