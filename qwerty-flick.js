/*
 * キーボード用辞書
 */

var charkeys = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", ",", "."];
var metakeys = ["Command", "Shift", "Space", "Enter", "Delete"];
var dictionary = {
    "q" : ["q", "くぁ", "くぃ", "く", "くぇ", "くぉ"],
    "w" : ["w", "わ", "うぃ", "う", "うぇ", "を"],
    "e" : ["e", "え", "", "", "", ""],
    "r" : ["r", "ら", "り", "る", "れ", "ろ"],
    "t" : ["t", "た", "ち", "つ", "て", "と"],
    "y" : ["y", "や", "い", "ゆ", "え", "お"],
    "u" : ["u", "う", "", "", "", ""],
    "i" : ["i", "い", "", "", "", ""],
    "o" : ["o", "お", "", "", "", ""],
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
    "." : [".", "", "", "", "", ""]
}
/*
 * 定数
 */

//各行がもっているキャラクタキー
var rowHas = [10, 9, 9];
//キーのサイズ
var keysize = {
    "w" : 64,
    "h" : 64
};
//隣のキーとのマージン
var margin = {
    "top" : 10,
    "left" : 10 
};

var PI = 3.14159265;

var keys = {};
//メイン処理
$(document).ready(function(){
    // イベントハンドラの生成
    var handler = object(EventHandler);
    // キーオブジェクトの生成
    var rowNum = rowHas.length;
    var currentChar = 0;
    var keyboard = document.getElementById("keyboard");
    keyboard.onselectstart = function(){return false};

    for(var i = 0; i < rowNum; i++) {
        for(var j = 0; j < rowHas[i]; j++) {
            var k = object(Key);
            k.init(charkeys[currentChar]);
            k.dom.style.top = i * (keysize.h + margin.top) + "px";
            k.dom.style.left = j * (keysize.w + margin.left) + "px";
            keyboard.appendChild(k.dom);
            currentChar++;
        }
    }
    // テクストエリアオブジェクトの作成
    var ta = object(Textarea);
    ta.init({
        width : (keysize.w + margin.left)*rowHas[0] - margin.left,
        height: 200
    });
    var textarea = document.getElementById("textarea");
    textarea.appendChild(ta.dom);
});

var EventHandler = {
    keyDidMouseDown : function(event,key){
    },
    keyDidMouseUp : function(event,key){
    },
    pieDidMouseOver : function(event,pie){
    },
    pieDisMouseOut : function(event,pie){
    }
}

/*
 * Keyboardのスーパークラス
 */

//ひとつのKeyが持っているべき情報は何か？
//それ自体へのイベントハンドラ→別クラスで実装してaddEventListener
//対応する変換コード→initでCCから取得
//それがメタキーなのか通常キーなのかはinitで設定
//initの引数で判別か、objc的にセッタで判別
//Meta Types
//Command,Shift,Space,Delete,Enter
//
//Property List

//string type = Default (Command,Shift,Space,Delete,Enter)
//string character = null
//array  pieContents = null
//boolean isMetakey = false

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
          //通常キーの場合の処理
          if(_keylen == 1) {
              //インスタンス変数の初期化
              this.isMetakey = false;
              this.key = _key;
              //this.pieContents = dictionary[_key];
              //DOMオブジェクトを生成
              this.dom = document.createElement("div");
              this.dom.className = "key dpshadow grad_gray";
              this.dom.id = "key-" + _key;
              this.dom.dataset.key = _key;
              this.dom.onselectstart = function(){return false};
              this.dom.onmousedown = this.onmousedown;
              this.dom.onmouseup = this.onmouseup;
              //this.dom.key = _key;
              //キャラクターのDOMオブジェクトを生成
              this.chara = document.createElement("div");
              this.chara.className = "char";
              this.chara.innerHTML = _key.toUpperCase();
              this.chara.onselectstart = function(){return false};
              this.dom.appendChild(this.chara);
          } else if(_keylen > 1) {
              this.isMetakey = true;
              this.key = _key;
              // とりあえず未実装
              //メタキーの場合の処理
              switch( _key) {
                  case "Command" :
                      break;
                  case "Shift" :
                      break;
                  case "Space" :
                      break;
                  case "Delete" :
                      break;
                  case "Enter" :
                      break;
                  default :
                      break;
              }
          }
      },
      onmousedown : function(event){
                var _key = this.getAttribute("data-key");
                var p = object(Pie);
                p.init(_key);
                // element.offsetTop, element.offsetLeft を正常に取得するために先に追加しておく
                this.appendChild(p.dom);
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
                },200);
      },
      onmouseup : function(event){
          var p = this.lastChild;
          var _this = this;
          $(p).animate({
              opacity : 0.0
          },200,function(){;
            _this.removeChild(p);
          })
      }
}

/*
 * Pieメニューのオブジェクト。
 * 一度全キーボードに対応するオブジェクトを作ってappendしたらめちゃくちゃ重くなったから
 * Key.onmousedownの度に生成→破棄を繰り返す
 * or
 * 最初に生成＆opacity=0.0でKey.onmousedownでそのKeyにappendしてfadeInさせるか
 * 明らかに↑の方がいい気がする。
 */

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
                 if(_key.length == 1) {
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
                     _center.init({chara : _key.toUpperCase(),type : "center"});
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
          this.dom.appendChild(this.chara);
          switch(_type) {
              case "concent" :
                  this.dom.className = "pieConcents grad_blue inshadow";
                  this.chara.className = "pieConcentsChar";
                  break;
              case "center" :
                  this.dom.className = "pieCenter grad_gray inshadow";
                  this.chara.className = "pieCenterChar";
                  break;
              default :
                  return false;
                  break;
          }
      }
}

var Textarea = {
dom : null,
      init : function(opts) {
          var _w = opts.width;
          var _h = opts.height;
          this.dom = document.createElement("textarea");
          this.dom.style.width = _w + "px";
          this.dom.style.height= _h + "px";
      },
insertChar : function(opts) {
                 var _char = opts.chara || "";
                 var _location = opts.location || 0;
                 //適当
                 this.dom.val += _char;
             }
}
/*
 * Utility functions
 */

/*
 * object - オブジェクトを作る
 * Object object(BaseObj [, mixinObj1 [, mixinObj2...]])
 */
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
    console.log(m);
}
