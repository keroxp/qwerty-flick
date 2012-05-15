/*
 * Keyboardのスーパークラス
 */

var PC  = {
    "q" : ["q","くぁ","くぃ","く","くぇ","くぉ"]
}
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
type : null,
       key : null,
       pieContents : null,
       isMetakey : false,
       init :function(key){
           // キーの文字と長さを取得。keyがマルチバイト文字だった場合は知らん
           var _key = key;
           var _keylen = key.length;
           if(_keylen == 1){
               //通常キーの場合の処理
               this.isMetakey = false;
               this.type = "Default";
               this.key = _key;
               //this.pieContents = PC[_key];
               //DOMオブジェクトを生成
               var _elem = document.createElement("div");
               _elem.className = "key dpshadow grad";
               _elem.id = "key-" + _key;
               _elem.innerHTML = _key;
               var keyboard = document.getElementById("keyboard");
               keyboard.appendChild(_elem);
           }else if (_keylen > 1){
               this.isMetakey = true;
               this.type = _key;
               this.key = _key;
               this.pieContents = null; // とりあえず未実装
               //メタキーの場合の処理
               switch( _key){
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
setPosition : function(pos){
                  var _top = pos.top || "";
                  var _right = pos.right || "";
                  var _bottom = pos.bottom || "";
                  var _left = pos.left || "";
                  var _this = document.getElementById("key-"+this.key);
                  _this.style.top = _top;
                  _this.style.right = _right;
                  _this.style.left = _left;
                  _this.style.bottom = _bottom;
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
    for (i=1, len=arguments.length; i<len; ++i)
        for (prop in arguments[i])
            n[prop] = arguments[i][prop];
    return n;
}
object.f = function(){};

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

var log = function(m){
    var _m = m;
    console.log(m);
}


