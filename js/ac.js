
var str = $("textarea") || "";
var buff = [];
var len = buff.length;

// 平仮名かどうかの判定
function isKana(val, i){
	if(val[i] == "") return false;
	if(val.charCodeAt(i) >= 0x3041 && val.charCodeAt(i) <= 0x3093){
		return true;
	}
	return false;
}

//挟み撃ち
function betweenCheck(){
	//確認用の配列
	buff = new Array();
	for(var i=0; i<str.length; i++){
		buff[i] = str[i];
	}
	//配列の最後のポインタ
	len = buff.length-1;

	var count = 0;
	if(isKana(str, len) && !isKana(str, len-1)){
		
		 if(str[len-1] == "n"){
			count = charContinue();
			if(isKana(str, len-count-1)){
				replace("ん", count);
				console.log(buff + count);
				if(count!=1)	buff.splice(len-1);
				str = buff.join("");
				$("textarea").val(str);
			}
		}else{
			count = charContinue();
			if(isKana(str, len-count-1)){
				replace("っ", count);
				str = buff.join("");
				$("textarea").val(str);
			}
		}
	}
}

//文字の置換
function replace(c, num){
	for(var i=1; i<num+1; i++){
		buff[len-i] = c;
	}
}
	
//子音が何回繰り返されているか
function charContinue(){
	var count=0;
	var pointer = len-1;
	for(var i=0; i<pointer; i++){
		if(buff[pointer-i] != buff[pointer]){
			break;
		}else{
			count++;
		}
	}
	return count;
}

function checkDo(){
	$(document).bind("keydown keyup keypress change", function(){
		str = $("textarea").val();
		betweenCheck();
		//str = buff.join("");
		//$("textarea").val(str);
		//console.log(str);
	});
}

checkDo();
