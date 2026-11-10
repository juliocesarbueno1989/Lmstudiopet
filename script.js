var INTRO_SEG=3;        // tempo do logo antes de seguir (segundos)
var TOPICO_SEG=4.5;     // tempo em cada tópico (segundos)
var timer=null,idx=0,parado=false;
function parar(){parado=true;clearTimeout(timer)}
// LM Studio Pet – bolhas, brilhos, navegação e avanço automático da tela inicial
var secs=[].slice.call(document.querySelectorAll("section")),nav=document.getElementById("nav"),bg=document.getElementById("bg");
var QTD_BOLHAS=18, SEGUNDOS_INTRO=3.5;
for(var i=0;i<QTD_BOLHAS;i++){var b=document.createElement("div");b.className="b";var s=30+Math.random()*90;
b.style.cssText="width:"+s+"px;height:"+s+"px;left:"+Math.random()*94+"%;animation-duration:"+(16+Math.random()*18)+"s;animation-delay:-"+Math.random()*30+"s";bg.appendChild(b)}
var cols=["#5DC0A6","#3F8F8D","#8CCBF5","#C9A85C"];
function spark(){var e=document.createElement("div");e.className="sp";var s=14+Math.random()*16;
e.style.cssText="--s:"+s+"px;--c:"+cols[Math.floor(Math.random()*cols.length)]+";left:"+Math.random()*94+"%;top:"+(6+Math.random()*84)+"%";
bg.appendChild(e);setTimeout(function(){e.remove()},2700)}
setInterval(function(){if(Math.random()<.7)spark()},1100);
var dots=secs.map(function(s){var a=document.createElement("a");a.href="#";a.onclick=function(e){e.preventDefault();parar();s.scrollIntoView()};nav.appendChild(a);return a});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");dots.forEach(function(d,i){d.classList.toggle("on",secs[i]===e.target)})}else{e.target.classList.remove("in")}})},{threshold:.6});
secs.forEach(function(s){io.observe(s)});
["wheel","touchstart","keydown","mousedown"].forEach(function(ev){window.addEventListener(ev,parar,{passive:true})});
// avança sozinho até o último tópico (agendamento/pedido) e PARA ali; rolar ou tocar na tela também interrompe
function avancar(){if(parado)return;idx++;if(idx>=secs.length)return;secs[idx].scrollIntoView({behavior:"smooth"});if(idx<secs.length-1)timer=setTimeout(avancar,(+secs[idx].dataset.seg||TOPICO_SEG)*1000)}
timer=setTimeout(avancar,INTRO_SEG*1000);
// depoimentos: cartões empilhados (toque = próximo, arrastar = anterior/próximo, bolinhas = escolher)
(function(){var deck=document.getElementById("deck"),cs=[].slice.call(deck.querySelectorAll(".c")),N=cs.length,cur=0,dt=document.getElementById("dots"),auto=null,sx=null;
var ds=cs.map(function(_,i){var d=document.createElement("button");d.setAttribute("aria-label","Depoimento "+(i+1));d.onclick=function(e){e.stopPropagation();go(i,1)};dt.appendChild(d);return d});
function show(){cs.forEach(function(c,i){var d=(i-cur+N)%N;c.dataset.p=d===0?"0":d===1?"1":d===2?"2":d===N-1?"x":"h"});ds.forEach(function(d,i){d.className=i===cur?"on":""})}
function go(i,stop){cur=(i+N)%N;show();if(stop)clearInterval(auto)}
show();
deck.addEventListener("pointerdown",function(e){sx=e.clientX});
deck.addEventListener("pointerup",function(e){if(sx===null)return;var dx=e.clientX-sx;sx=null;go(cur+(dx>40?-1:1),1)});
deck.addEventListener("pointercancel",function(){sx=null});
deck.addEventListener("wheel",function(e){if(Math.abs(e.deltaX)>30)go(cur+(e.deltaX>0?1:-1),1)},{passive:true});
new IntersectionObserver(function(es){clearInterval(auto);if(es[0].isIntersecting)auto=setInterval(function(){go(cur+1)},2800)},{threshold:.6}).observe(deck.closest("section"));})();
