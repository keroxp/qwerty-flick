(function(){
 var row1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p","delete"];
 var row2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l","enter"];
 var row3 = ["shift", "z", "x", "c", "v", "b", "n", "m", ",", ".","-"];
 var row4 = ["command", "space"];

 var rows = [row1,row2,row3,row4];

 var frag = document.createDocumentFragment();

 var iw = document.createElement("div");
 iw.id = "input-wrapper";

 var cw = document.createElement("div");
 cw.id = "candybox-wrapper";
 var cb = document.createElement("div");
 cb.id = "candybox";
 var ci = document.createElement("div");
 ci.id = "candies";
 ci.className = "clearfix";
 for(var i = 0 ; i < 20 ; i++){
     var c = document.createElement("div");
     c.className = "candy";
     c.innerHTML = "変換候補" + i;
     ci.appendChild(c);
 }
 var op = document.createElement("div");
 op.id = "candybox-openner";
 op.innerHTML = "⇧";
 cb.appendChild(op);
 cb.appendChild(ci);
 cw.appendChild(cb);
 var kw = document.createElement("div");
 kw.id = "keyboard-wrapper";
 kw.className = "gdg";
 var keyboard = document.createElement("div");
 keyboard.id = "keyboard";
 keyboard.className = "clearfix";

 for(var i = 0 , mi = rows.length ; i < mi ; i++){
     var r = document.createElement("div");
     r.id = "row-" + i;
     r.className = "key-row clearfix";
     for(var j = 0 , mj = rows[i].length ; j < mj ; j++){
         var k = document.createElement("div");
         k.dataset.key = rows[i][j];
         k.id = "key-" + rows[i][j];
         //k.style.top = (74 + 1*2 + 12)*i + "px";
         //k.style.left = (80 + 1*2 + 12)*j + "px";
         var c = document.createElement("div");
         switch(rows[i][j]){
             case "command" : 
                 c.innerHTML = "⌘";
                 break;
             case "shift" : 
                 c.innerHTML = "⇧";
                 break;
             case "delete" :
                 c.innerHTML = "⌫";
                 break;
             default :
                 c.innerHTML = rows[i][j].toUpperCase();
         }
         c.className = "key-char";
         k.className = "key gg ds";
         if(rows[i][j].length > 1){
             k.className += " key-meta gg key-" + rows[i][j];
         }
         k.appendChild(c);
         r.appendChild(k);
     }
     keyboard.appendChild(r);
 }
 kw.appendChild(keyboard);
 iw.appendChild(cw);
 iw.appendChild(kw);
 frag.appendChild(iw);
 document.body.appendChild(frag);

 var classes = {
top : "flick flick-v flick-top gbv",
      bottom : "flick flick-v flick-bottom gbvr",
      left : "flick flick-h flick-left gbh",
      right : "flick flick-h flick-right gbhr"
 }

 var se;
 var sk;
 var cf;
 var cfc;
 var PI = 3.14159265;

 var w = document.getElementById("key-w");

 var iPad = (navigator.userAgent.indexOf("iPad") > 0 ) ? true : false;

 var onmousedown = function(e){
     e.preventDefault();
     se = e;
     sk = this;
     var f = document.createElement("div");
     var fc = document.createElement("div");
     fc.className = "flick-char" 
         f.appendChild(fc);
     this.appendChild(f);
     cf = f;
     cfc = fc
 }
 var onmousemove = function(e){
     if(se){
         var _this = sk;
         var dx = e.pageX - (se.pageX);
         var dy = -(e.pageY - (se.pageY));
         var angle  = Math.atan2(dy,dx);
         if(angle < 0){
             angle += 2*PI;
         }
         console.log(angle*180/PI);
         if(angle < PI/4){
             cf.className = classes.right;
             cfc.innerHTML = "うぇ"
                 console.log("r");
         }else if(PI/4 <= angle && angle < PI*3/4){
             cf.className = classes.top;
             cfc.innerHTML = "わ";
             console.log("t");
         }else if(PI*3/4 <= angle && angle < PI*5/4){
             cf.className = classes.left;
             cfc.innerHTML = "うぃ";
             console.log("l");
         }else if(PI*5/4 <= angle && angle < PI*7/4){
             cf.className = classes.bottom;
             cfc.innerHTML = "うぉ";
             console.log("b");
         }else if(PI*7/4 <= angle){
             cf.className = classes.right;
             console.log("r");
             cfc.innerHTML = "うぇ";
         }
     }     
 }
 var onmouseup = function(e){
     e.preventDefault();
     se = null;
     sk.removeChild(sk.lastChild);
 }
 if(iPad){
     w.ontouchstart = onmousedown;
     window.ontouchmove = onmousemove;
     window.ontouchend = onmouseup;
 }else{
     w.onmousedown = onmousedown;
     window.onmousemove = onmousemove;
     window.onmouseup = onmouseup;
 }


}());

