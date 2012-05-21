(function(){
    // メインイベントメディエータであるwindowオブジェクトの拡張
    // 現在担当しているイベント情報の格納庫
 window.current = { 
key : null,
pie : null,
concent : null,
event : null
    }
}
// イニシャライザ

window.onload = function(){
// キーオブジェクトの生成
        var currentChar = 0;
        var keyboard = document.getElementById("keyboard-wrapper");
        for(var i = 0; i < charkeys.length; i++) {
        for(var j = 0; j < rowHas[i]; j++) {
        var k = object(Key);
        k.init(charkeys[currentChar]);
        k.dom.style.top = i * (keysize.h + margin.top) + "px";
        k.dom.style.left = j * (keysize.w + margin.left) + "px";
        keyboard.appendChild(k.dom);
        currentChar++;
        }
        }
         //メタキーオブジェクトの生成
         for(var i = 0 ; i < metakeys.length ; i++){
         var mk = object(Key);
         mk.init(metakeys[i]);
         keyboard.appendChild(mk.dom);
         }

         var ta = document.getElementById("textarea-wrapper");
         log(textarea);
         ta.appendChild(textarea);

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

        var Textarea = {
insertChar : function(chara){
                 var _chara = chara || "";
                 var _pos = this.selectedRange();
                 var _text = this.value;
                 var _prev = _text.substr(0,_pos.s);
                 var _next = _text.substr(_pos.e,_text.length - _pos.end);
                 this.value = _prev + _chara + _next; 
                 var _newpos = (_prev + _chara).length;
                 this.setCaret(_newpos);
             },
insertPat : function(pat){
                var _pat = pat;
                var _pos = this.selectedRange();
                var _text = this.value;
                var _prev = _text.substr(0,_pos.s);
                var _next = _text.substr(_pos.e,_text.length - _pos.e);
                this.value = _prev + _pat + _next;
                var _newpos = (_prev + _pat).length;
                this.setSelectionRange(_pos.s,(_prev+_pat).length);
            },
delete : function(){
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
selectedRange : function(){
                    return {s : this.selectionStart, e: this.selectionEnd}
                },
selectedStr : function(){
                  var _pos = this.selectedRange();
                  return this.value.substr(_pos.s,_pos.e - _pos.s)
              },
setCaret : function(newpos){
               this.setSelectionRange(newpos,newpos);
           }
 }
 //メイン処理
 $(document).ready(function(){
          });

 //windowにイベントハンドラを付与
 var onmouseup = function(event){
     // pieオブジェクトの外でmouseupされても消えるように
     if(currentHandlingKey && currentHandlingPie){
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
         currentHandlingKey = null;
         currentHandlingPie = null;
         $(_this.lastChild).animate({
opacity : 0.0
},fadeTime,function(){
_this.removeChild(_this.lastChild);
})
}
}

if(iPad){
    window.ontouchend = onmouseup;
}else{
    window.onmouseup = onmouseup;
}


  //Keyboardのスーパークラス

var Key = {
    // string キーボードの名前
    key : null,
      // boolean メタキーかどうか
      isMetakey : false,
      // object 自身のDOMオブジェクト
      dom : null,
      // object 表示する文字
      chara : null,
      // object 保持するパイメニューのオブジェクト
      pie : null,
      // function イニシャライザ
      init : function(key) {
          // キーの文字と長さを取得。keyがマルチバイト文字だった場合は知らん
          var _key = key;
          var _keylen = key.length;
          this.key = _key;
          this.dom = document.createElement("div");
          this.dom.className = "key dpshadow grad_gray";
          this.dom.id = "key-" + _key;
          this.dom.dataset.key = _key;
          //キャラクターのDOMオブジェクトを生成
          this.chara = document.createElement("div");
          this.chara.className = "char";
          this.chara.innerHTML = _key.toUpperCase();
          this.dom.appendChild(this.chara);
          //イベントハンドラを登録
          if(iPad){
              this.dom.ontouchstart = this.onmousedown;
          }else{
              this.dom.onmousedown = this.onmousedown;
          }
          //通常キーの場合の処理
          if(_keylen == 1) {
              this.isMetakey = false;
          } else if(_keylen > 1) {
              //メタキーの場合の処理
              this.isMetakey = true;
              switch( _key) {
                  case "Command" :
                      this.dom.style.left = "0px";
                  this.dom.style.top = (keysize.h + margin.top)*rowHas.length + "px";
                  this.chara.innerHTML = "⌘";
                  break;
                  case "Shift" :
                      this.dom.style.left = keysize.w + margin.left + "px";
                  this.dom.style.top  = (keysize.h + margin.top)*rowHas.length + "px";
                  this.dom.style.width = (keysize.w + margin.left)*2 - margin.left + "px";
                  this.chara.innerHTML = "Shift";
                  break;
                  case "Space" :
                      this.dom.style.left = (keysize.w + margin.left)*3 + "px";
                  this.dom.style.top = (keysize.h + margin.top)*rowHas.length + "px";
                  this.dom.style.width = (keysize.w + margin.left)*5 - margin.left + "px";
                  break;
                  case "Delete" :
                      this.dom.style.left = (keysize.w + margin.left)*(rowHas[2]-1) + "px";
                  this.dom.style.top = (keysize.h + margin.top)*rowHas.length + "px";
                  this.dom.style.width = keysize.w*2 + margin.left + "px";
                  this.chara.innerHTML = "⌫";
                  break;
                  case "Enter" :
                      this.dom.style.left = (keysize.w + margin.left)*rowHas[1] + "px";
                  this.dom.style.top = keysize.h + margin.top + "px";
                  this.dom.style.height = keysize.h * 2 + margin.top + "px";
                  this.chara.innerHTML = "⏎";
                  break;
                  default :
                  break;
              }
          }
      },
onmousedown : function(event){
                  event.preventDefault();
                  // カレントイベントに登録
                  currentHandlingEvent = event;
                  // 現在扱っているオブジェクトを登録
                  var _key = this.getAttribute("data-key");
                  var p = object(Pie);
                  p.init(_key);
                  // element.offsetTop, element.offsetLeft を正常に取得するために先に追加しておく
                  this.appendChild(p.dom);
                  currentHandlingKey = this;
                  currentHandlingPie = p.dom;
                  currentHandlingConcent = p.center.dom;

                  // パイメニューのセンタリング
                  p.dom.style.left = p.dom.offsetLeft - (p.dom.offsetWidth / 2 - this.offsetWidth ) - this.offsetWidth / 2 + "px";
                  p.dom.style.top = p.dom.offsetTop - (p.dom.offsetHeight / 2 - this.offsetHeight ) - this.offsetHeight / 2 + "px";
                  // パイセンターのセンタリング
                  p.center.chara.style.left = p.center.chara.offsetLeft - (p.center.chara.offsetWidth / 2 - p.center.dom.offsetWidth ) - p.center.dom.offsetWidth / 2 + "px";
                  p.center.chara.style.top = p.center.chara.offsetTop - (p.center.chara.offsetHeight / 2 - p.center.dom.offsetHeight ) - p.center.dom.offsetHeight / 2 + "px";

                  // パイコンセントのセンタリング
                  for(var i = 0; i < p.concents.length; i++) {
                      p.concents[i].dom.style.left = p.concents[i].dom.offsetLeft - (p.concents[i].dom.offsetWidth / 2 - p.dom.offsetWidth) - p.dom.offsetWidth / 2 - 4 + "px";
                      p.concents[i].dom.style.top = p.concents[i].dom.offsetTop - (p.concents[i].dom.offsetHeight / 2 - p.dom.offsetHeight) - p.dom.offsetHeight / 2 - 4 + "px";
                      p.concents[i].dom.style.left = p.concents[i].dom.offsetLeft + 72 * Math.cos((72 * i - 90) * PI / 180) + "px";
                      p.concents[i].dom.style.top = p.concents[i].dom.offsetTop + 72 * Math.sin((72 * i - 90) * PI / 180) + "px";
                      // パイコンセントキャラクタのセンタリング
                      p.concents[i].chara.style.left = p.concents[i].chara.offsetLeft - (p.concents[i].chara.offsetWidth / 2 - p.concents[i].dom.offsetWidth ) - p.concents[i].dom.offsetWidth / 2 + "px";
                      p.concents[i].chara.style.top = p.concents[i].chara.offsetTop - (p.concents[i].chara.offsetHeight / 2 - p.concents[i].dom.offsetHeight ) - p.concents[i].dom.offsetHeight / 2 + "px";
                  };
                  $(p.dom).animate({
opacity : 1.0
},0);
}
}

 // Pieメニューのオブジェクト。
 var Pie = { 
    // 保持している変換表
dictionary : null,
             // object 自身のDOMオブジェクト
             dom : null,
             // array 保持する個別のパイメニュー
             concents : null,
             // object 真ん中の文字
             center : null,
             // function イニシャライザ 引数は string のキー
             init : function(key) {
                 var _key = key;
                 if(_key.length > 0) {
                     //普通のキーの処理
                     this.dictionary = dictionary[_key];
                     this.dom = document.createElement("div");
                     this.dom.id = "pie-" + _key;
                     this.dom.className = "pie grad_black";
                     this.concents = [];
                     for(var i = 1; i < 6; i++) {
                         var concent = object(PiePiece);
                         concent.init({chara : this.dictionary[i],type : "concent"});
                         this.concents.push(concent);
                     }
                     var _center = object(PiePiece);
                     _center.init({chara : _key,type : "center"});
                     this.center = _center;
                     for(var i = 0; i < this.concents.length; i++) {
                         this.dom.appendChild(this.concents[i].dom);
                     }
                     this.dom.appendChild(this.center.dom);
                 } else if(_key.length > 1) {
                     //メタキーの処理
                 }
             }
}
var PiePiece = {
    //自身のDOMオブジェクト
dom : null,
      //キャラクタのDOMオブジェクト
      chara : null,
      init : function(opts) {
          var _chara = opts.chara;
          var _type = opts.type;
          this.dom = document.createElement("div");
          this.chara = document.createElement("div");
          this.chara.innerHTML = _chara;
          this.dom.dataset.key = _chara;
          this.dom.dataset.type = _type;
          this.dom.onmouseover = this.onmouseover;
          this.dom.onmouseout = this.onmouseout;
          this.dom.appendChild(this.chara);
          switch(_type) {
              case "concent" :
                  this.dom.className = "pieConcents";
              this.chara.className = "pieConcentsChar";
              break;
              case "center" :
                  this.dom.className = "pieCenter grad_gray inshadow";
              this.chara.className = "pieCenterChar";
              if(_chara.length > 1)
                  this.chara.innerHTML = dictionary[_chara][0];
              break;
              default :
              return false;
              break;
          }
      },
onmouseover : function(event){
                  var _type = this.getAttribute("data-type");
                  currentHandlingConcent = this;
                  switch(_type){
                      case "concent" : 
                          $(this).addClass("pieSelected grad_blue inshadow");
                      break;
                      case "center" : 
                          break;
                      default :
                      return false;
                      break
                  }
              },
onmouseout : function(event){
                 currentHandlingConcent = null;
                 $(this).removeClass("pieSelected grad_blue inshadow");
             }
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
