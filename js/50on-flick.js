
var android = false;

var scr;                     // 画面全体のdiv
var textarea;                // テキスト枠
var piemenu;                 // パイメニューキーボード
var keys = [];               // 全体キー
var piekeys = [];            // パイメニューのキー
var deletekey;
var enterkey;
var keycenterx, keycentery;
var PI = 3.141592;

var pat = "";           // 検索パタン
var curKeyStr = "";     // 選択中のキーの文字列
var curword = "";

var candWin;
var candWinTimer;   // 候補選択ウィンドウが出るまでの時間待ち

var mouseClicked = false;

function initialize(){
    var x,y;
    var e;

    android = navigator.userAgent.match(/Android/);
    if(android){
        document.addEventListener("touchstart", mouseDown, false);
        document.addEventListener("touchend", mouseUp, false);
        document.addEventListener("touchmove", mouseMove, false);
    }
    else {
        document.onmousedown = mouseDown;
        document.onmousemove = mouseMove;
        document.onmouseup = mouseUp;
    }

    // 画面全体
    scr = document.createElement('div');
    scr.style.position = "absolute";
    scr.style.width = 800;
    scr.style.height = 480;
    scr.style.left = 0;
    scr.style.top = 0;
    scr.style.backgroundColor = "#eee";
    document.body.appendChild(scr);

    // テキスト枠
    textarea = document.createElement('textarea');
    textarea.style.position = "absolute";
    textarea.style.width = 780;
    textarea.style.height = 60;
    textarea.style.left = 10;
    textarea.style.top = 10;
    textarea.style.fontSize = 16;
    document.body.appendChild(textarea);

    // 基本キーボード
    for(y=0;y<10;y++){
        for(x=0;x<5;x++){
            e = document.createElement('div');
            e.innerHTML = keychars[y][x];
            e.style.position = "absolute";
            e.style.width = 55;
            e.style.height = 55;
            e.style.left = (y < 5 ? x * 55 + 60: x * 55 + 355);
            e.style.top = ((y % 5) * 55 + 150);
            //e.style.backgroundColor = "#ffd";
            e.style.backgroundImage = "URL('keybg.png')";
            e.style.fontSize = '20pt';
            e.style.textAlign = 'center';
            e.style.lineHeight = '48px';
            e.style.color = '#222';
            keys.push(e);
            scr.appendChild(e);
        }
    }

    // Delete
    deletekey = document.createElement('div');
    deletekey.innerHTML = "DEL";
    deletekey.style.position = "absolute";
    deletekey.style.width = 55;
    deletekey.style.height = 55;
    deletekey.style.left = 650;
    deletekey.style.top = 150;
    deletekey.style.backgroundImage = "URL('keybg.png')";
    deletekey.style.fontSize = 20;
    deletekey.style.textAlign = 'center';
    deletekey.style.lineHeight = '48px';
    deletekey.style.color = '#222';
    scr.appendChild(deletekey);

    // パイキーボード
    piemenu = document.createElement('div');
    piemenu.style.position = "absolute";
    piemenu.style.width = 175;
    piemenu.style.height = 175;
    piemenu.style.left = 50;
    piemenu.style.top = 50;
    piemenu.style.border = 'solid';
    piemenu.style.borderWidth = 1;
    piemenu.style.borderColor = "#666";
    piemenu.style.backgroundColor = "#fff";
    document.body.appendChild(piemenu);
    for(y=0;y<3;y++){
        for(x=0;x<3;x++){
            e = document.createElement('div');
            e.style.position = "absolute";
            e.style.width = 55;
            e.style.height = 55;
            e.style.left = x * 55 + 5;
            e.style.top = y * 55 + 5;

            e.style.fontSize = 20;
            e.style.textAlign = 'center';
            e.style.lineHeight = '48px';
            //e.style.backgroundColor = "#ffd";
            if(y == 1 && x == 1){
                e.style.backgroundImage = "URL('keyfg.png')";
            }
            else {
                e.style.backgroundImage = "URL('keybg.png')";
            }
            piekeys.push(e);
            piemenu.appendChild(e);
        }
    }
    piemenu.style.visibility = 'hidden';

    // 候補ウィンドウ
    candWin = document.createElement('div');
    candWin.style.position = "absolute";
    candWin.style.left = 50;
    candWin.style.top = 50;
    candWin.style.backgroundColor = "#555";
    candWin.style.padding = '2pt';
    candWin.style.border = 'solid';
    candWin.style.borderWidth = 1;
    candWin.style.borderColor = '#888';
    candWin.style.visibility = 'hidden';
    document.body.appendChild(candWin);

    //addEventListener('mousedown', mouseDown, false); // こちらだと文字列選択をインヒビットできない...
    //addEventListener('mousemove', mouseMove, false);
    //addEventListener('mouseup', mouseUp, false);
}

//
// jQueryから拝借したクロスブラウザ対策。
// どのブラウザでも event.pageX でマウスイベント座標を取得できるようにする
//
function fixEvent(event){
    if ( event.pageX == null && event.clientX != null ) {
        var doc = document.documentElement;
        var body = document.body;
        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
        event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
    }
}

//function inrect(x,y,w,h,rect){
function inrect(x,y,rect){
    // 親要素をたぐって絶対位置を知る
    var p = rect;
    var xx = 0;
    var yy = 0;
    while(p){
        xx += p.offsetLeft;
        yy += p.offsetTop;
        p = p.offsetParent;
    }
    var rectx,recty,rectw,recth;
    rectx = xx;
    recty = yy;
    rectw = rect.offsetWidth;
    recth = rect.offsetHeight;
    return x > rectx && x < rectx+rectw && y > recty && y < recty+recth;
}

function inrectx(x,y,rect){
    var rectx = parseInt(rect.style.left);
    var recty = parseInt(rect.style.top);
    var rectw = parseInt(rect.style.width);
    var recth = parseInt(rect.style.height);
    return x > rectx && x < rectx+rectw && y > recty && y < recty+recth;
}

var startpos, endpos;
function calcSelPos(obj){ // textareaの選択場所を取得
    if(obj.setSelectionRange){ // FF/Mozila
        startpos = obj.selectionStart;
        endpos = obj.selectionEnd;

    }
    else if(document.selection.createRange ){ // IE?
        var sel =document.selection.createRange();
        var r = obj.createTextRange();
        var textlen = r.text.length;
        r.moveToPoint(sel.offsetLeft,sel.offsetTop);
        r.moveEnd("textedit");

        startpos = textlen - r.text.length
            endpos = startpos + sel.text.length;
    }
}

function selectedStr(obj){
    calcSelPos(obj);
    return obj.value.substr(startpos,endpos-startpos);
}

function setSelectionRange(obj,spos,epos){ // textareaのposにカーソル移動
    if(obj.setSelectionRange ){ // FF/Mozila Android
        obj.setSelectionRange(spos,epos);
    }
    else if(document.selection.createRange ){ // IE?
        alert('AAARRGGHH!!');
        var e = obj.createTextRange();
        var tx = obj.value.substr(0,pos);
        var pl = tx.split(/\n/);
        e.collapse(true);
        e.moveStart("character",pos-pl.length+1);
        e.text=e.text+"";
        e.collapse(false);
        e.select();
    }
    else {
        alert("setSelectionRange impossible?");
    }
    obj.focus();
}

function setCaret(obj,pos){ // textareaのposにカーソル移動
    setSelectionRange(obj,pos,pos);
}

function insertPat(obj,replace){
    calcSelPos(obj);

    var text = obj.value;
    var s = text.substr(0,startpos);
    var e = text.substr(endpos,text.length-endpos);
    obj.value = s + replace + e;
    var newpos = (s + replace).length;

    setSelectionRange(obj,startpos,(s+replace).length);
}

function insertText(obj,replace){
    calcSelPos(obj);

    var text = obj.value;
    var s = text.substr(0,startpos);
    var e = text.substr(endpos,text.length-endpos);
    obj.value = s + replace + e;
    var newpos = (s + replace).length;

    setCaret(obj,newpos);
}

function displayPieMenu(newcenterx,newcentery,keystr){
    keycenterx = newcenterx;
    keycentery = newcentery;
    piemenu.style.left = keycenterx - 60 - 25;
    piemenu.style.top = keycentery - 60 - 25;
    var i,j;
    for(j=0;j<9;j++){
        piekeys[j].innerHTML = "";
    }
    for(i=0;i<piemenukeys.length;i++){
        var keys = piemenukeys[i];
        if(keys[4].length == keystr.length && keys[4] == keystr){
            for(j=0;j<9;j++){
                piekeys[j].innerHTML = keys[j];
                if(keys[j].length == 1){
                    piekeys[j].style.fontSize = '20pt';
                }
                else if(keys[j].length == 2){
                    piekeys[j].style.fontSize = '16pt';
                }
                else if(keys[j].length == 3){
                    piekeys[j].style.fontSize = '12pt';
                }
            }
            break;
        }
    }
    if(i == piemenukeys.length){
        for(j=0;j<9;j++){
            //piekeys[j].style.backgroundColor = "#ffd";
            piekeys[j].innerHTML = "";
        }
        piekeys[4].innerHTML = keystr;
    }
    piemenu.style.visibility = 'visible';
}

function hidePieMenu(){
    piemenu.style.visibility = 'hidden';
}

function dispCand(floating){
    while(candWin.childNodes[0]){
        candWin.removeChild(candWin.childNodes[0]);
    }
    if(floating){
        candWin.style.height = '';
        if(candWords.length < 5){
            candWin.style.width = '';
        }
        else {
            candWin.style.width = 300;
        }
        candWin.style.top = keycentery-25+60-20-5;
        candWin.style.left = keycenterx+25-5-5;
    }
    else {
        candWin.style.top = 75;
        candWin.style.left = 10;
        candWin.style.width = 770;
        candWin.style.height = 64;
    }
    var i;
    for(i=0;i<candWords.length;i++){
        var cand;
        cand = document.createElement('span');
        cand.style.padding = "2pt";
        cand.style.margin = "2pt";
        cand.style.backgroundColor = "#eee";
        cand.style.fontSize = "16pt";
        cand.innerHTML = candWords[i];
        candWin.appendChild(cand);
    }
    candWin.style.visibility = 'visible';
}

function searchAndDispCand(){
    connectionSearch(pat+curKeyStr);
    dispCand(true);
}

function hideCandWin(){
    candWin.style.visibility = 'hidden';
}

function deleteKey(){
    var s,e;
    s = selectedStr(textarea);
    if(s.length > 0){
        s = s.substr(0,s.length-1);
        insertPat(textarea,s);
    }
    else {
        calcSelPos(textarea);
        if(startpos > 0){
            var data = textarea.value;
            s = data.substr(0,startpos-1);
            e = data.substr(endpos,data.length-endpos);
            textarea.value = s + e;
            setCaret(textarea,s.length);
        }
    }
}

function selectCandElement(event){
    var x,y,w,h;
    var selected = false;
    var candwinx = parseInt(candWin.style.left);
    var candwiny = parseInt(candWin.style.top);
    w = parseInt(candWin.style.width);
    for(i=0;i<candWords.length;i++){
        if(inrect(event.pageX,event.pageY,candWin.childNodes[i])){
            candWin.childNodes[i].style.backgroundColor = "#888";
            candWin.childNodes[i].style.color = "#fff";
            curword = candWords[i];
            selected = true;
        }
        else {
            candWin.childNodes[i].style.backgroundColor = "#eee";
            candWin.childNodes[i].style.color = "#000";
        }
    }
    return selected;
}

function mouseDown(event){
    if(android){
        event.preventDefault();
        event.pageX = event.touches[0].pageX;
        event.pageY = event.touches[0].pageY;
    }
    else {
        fixEvent(event);
    }
    if(event.pageY < 80) return true;

    mouseClicked = true;
    curword = "";
    curKeyStr = "";

    if(inrect(event.pageX,event.pageY,deletekey)){
        deleteKey();
        return false;
    }

    pat = selectedStr(textarea);

    var i;
    var keyx,keyy,keystr;
    keystr = "";
    for(i=0;i<keys.length;i++){
        var key = keys[i];
        if(inrect(event.pageX,event.pageY,key)){
            keyx = parseInt(key.style.left);
            keyy = parseInt(key.style.top);
            keystr = key.innerHTML;
            break;
        }
    }
    if(keyx){
        displayPieMenu(keyx+25,keyy+25,keystr);
    }
    curword = ""
        curKeyStr = keystr;

    if(event.pageY > 150){
        candWin.style.visibility = 'hidden';
        clearTimeout(candWinTimer);
        candWinTimer = setTimeout(searchAndDispCand,400); 
    }
    else {
        selectCandElement(event);
    }

    return false;
}

function mouseUp(event){
    if(android){
        //event.preventDefault();
        event.pageX = event.touches[0].pageX;
        event.pageY = event.touches[0].pageY;
    }
    else {
        fixEvent(event);
    }
    if(!mouseClicked) return true;

    clearTimeout(candWinTimer);
    candWinTimer = null;
    hidePieMenu();
    hideCandWin();

    if(curword != ""){ // 候補が選択された場合
        insertText(textarea,curword);
        // ゼロ入力でも新しい候補を計算するべきだろう
    }
    else if(curKeyStr != ""){ // キーが選択されたが候補は選択されなかった場合
        pat += curKeyStr;
        insertPat(textarea,pat);

        connectionSearch(pat); //二度手間は省くべき

        dispCand(false);
    }

    mouseClicked = false;

    if(android){
        event.preventDefault();
    }
    return false;
}

function mouseMove(event){
    if(android){
        event.preventDefault();
        event.pageX = event.touches[0].pageX;
        event.pageY = event.touches[0].pageY;
    }
    else {
        fixEvent(event);
    }
    if(!mouseClicked) return true;

    if(candWinTimer && candWin.style.visibility == 'hidden'){
        clearTimeout(candWinTimer);
        candWinTimer = setTimeout(searchAndDispCand,400);
    }

    var dx, dy;
    var angle;
    var ind;
    var i;
    var candSelected = false;
    var inCandRect = false;
    dx = event.pageX - keycenterx;
    dy = -event.pageY + keycentery;
    if(candWin.style.visibility != 'hidden'){ // 候補選択
        candSelected = selectCandElement(event);
        inCandRect = inrect(event.pageX,event.pageY,candWin);
    }
    //  else if(piemenu.style.visibility != 'hidden'){
    //  if(piemenu.style.visibility != 'hidden' && !candSelected){
    if(piemenu.style.visibility != 'hidden' && !inCandRect){
        // メニュー選択判定
        if(dx * dx + dy * dy > 27 * 27 * 2){
            var nx, ny;
            angle = Math.atan2(dy,dx);
            if(angle < 0) angle += (2 * PI);
            if(angle < PI * 1 / 8){ ind = 5; nx = 55; ny = 0;}
            else if(angle < PI * 3 / 8){ ind = 2; nx = 55; ny = -55;}
            else if(angle < PI * 5 / 8){ ind = 1; nx = 0; ny = -55;}
            else if(angle < PI * 7 / 8){ ind = 0; nx = -55; ny = -55;}
            else if(angle < PI * 9 / 8){ ind = 3; nx = -55; ny = 0;}
            else if(angle < PI * 11 / 8){ ind = 6; nx = -55; ny = 55;}
            else if(angle < PI * 13 / 8){ ind = 7; nx = 0; ny = 55;}
            else if(angle < PI * 15 / 8){ ind = 8; nx = 55; ny = 55;}
            else { ind = 5; nx = 55; ny = 0; }
            curKeyStr = piekeys[ind].innerHTML;
            if(curKeyStr == ""){
                hidePieMenu();
            }
            else {
                hideCandWin();
                displayPieMenu(keycenterx+nx,keycentery+ny,piekeys[ind].innerHTML);
            }
        }
    }
    return false;
}

window.onload = initialize;

