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
	key : null,
	pieContents : null,
	isMetakey : false,
	init : function(key) {
		// キーの文字と長さを取得。keyがマルチバイト文字だった場合は知らん
		var _key = key;
		var _keylen = key.length;
		if(_keylen == 1) {
			//通常キーの場合の処理
			this.isMetakey = false;
			this.key = _key;
			this.pieContents = dictionary[_key];
			//DOMオブジェクトを生成
			var _elem = document.createElement("div");
			_elem.className = "key dpshadow grad";
			_elem.id = "key-" + _key;
			var _char = document.createElement("div");
			_char.className = "char";			
			_char.innerHTML = _key.toUpperCase();
			_elem.appendChild(_char);
			var keyboard = document.getElementById("keyboard");
			keyboard.appendChild(_elem);
		} else if(_keylen > 1) {
			this.isMetakey = true;
			this.key = _key;
			this.pieContents = null;
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
	setPosition : function(pos) {
		var _top = pos.top || "";
		var _right = pos.right || "";
		var _bottom = pos.bottom || "";
		var _left = pos.left || "";
		var _this = document.getElementById("key-" + this.key);
		_this.style.top = _top;
		_this.style.right = _right;
		_this.style.left = _left;
		_this.style.bottom = _bottom;
	}
}

var Initializer = {
	charkeys : function() {
		var rowHas = [10, 9, 9];
		var keysize = {
			"w" : 45,
			"h" : 45
		};
		var margin = {
			"top" : 10,
			"left" : 10
		};
		var rowNum = rowHas.length;
		var currentChar = 0;
		for(var i = 0; i < rowNum; i++) {
			for(var j = 0; j < rowHas[i]; j++) {
				var k = object(Key);
				k.init(charkeys[currentChar]);
				k.setPosition({
					top : i * (keysize.h + margin.top) + "px",
					left : j * (keysize.w + margin.left) + "px"
				});
				currentChar++;
			}
		}
	},
	metakeys : function() {
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