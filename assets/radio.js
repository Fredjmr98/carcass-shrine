(function(){
var H=document.documentElement,B=H.dataset.base||'',D=document.getElementById('doc'),$=function(i){return document.getElementById(i)};
var R={files:[],cfg:{}},st=+localStorage.getItem('st')||0,vol=+(localStorage.getItem('vol')||.6),playing=false,started=false,ducked=false,G=0,live=[],timers=[],bags={},rec=null;
$('vol').value=vol;
fetch(B+'/assets/radio.json').then(function(r){return r.json()}).then(function(j){R=j;label()}).catch(function(){});
function C(){return R.cfg||{}}
function S(){return C().stations||[]}
function pick(n){var b=bags[n];if(!b||!b.length){var p='/assets/audio/'+n+'/';b=bags[n]=R.files.filter(function(f){return f.indexOf(p)===0&&/\.(mp3|ogg|wav|m4a)$/i.test(f)}).sort(function(){return Math.random()-.5})}return b.pop()}
function av(a){return Math.min(1,a._v*vol*(ducked?.15:1))}
function mk(f,v){var a=new Audio(B+encodeURI(f));a._v=v;a.volume=av(a);return a}
function layer(L,g){var gp=L.gap||[3,15];
 function wait(first){if(g!==G)return;timers.push(setTimeout(go,1000*(first?Math.random()*gp[0]:gp[0]+Math.random()*(gp[1]-gp[0]))))}
 function go(){if(g!==G)return;var f=pick(L.pool);if(!f)return;var a=mk(f,L.volume||.8);
  if(L.seek)a.onloadedmetadata=function(){if(a.duration>40)a.currentTime=Math.random()*a.duration*.7};
  a.onended=function(){live=live.filter(function(x){return x!==a});wait()};
  live.push(a);if(playing)a.play().catch(function(){})}
 wait(true)}
function stop(){timers.forEach(clearTimeout);timers=[];live.forEach(function(a){a.onended=null;a.pause()});live=[]}
function tune(d){G++;stop();var n=S().length;st=n?(st+(d||0)+n)%n:0;localStorage.setItem('st',st);
 var s=C().static_pool;
 if(s&&playing){var f=pick(s);if(f){var b=mk(f,.6);b.play().catch(function(){});setTimeout(function(){b.pause()},1500)}}
 var X=S()[st];
 if(X)(X.layers||[]).concat(s?[{pool:s,gap:C().static_gap||[25,70],volume:.5,seek:true}]:[]).forEach(function(L){layer(L,G)});
 label()}
function label(){var X=S()[st];$('rl').textContent=R.files.length?(X?X.name:'—'):'sin señal';$('pp').textContent=playing?'❚❚':'▶';$('lamp').className=playing?'on':''}
$('pp').onclick=function(){
 if(playing){playing=false;live.forEach(function(a){a.pause()})}
 else if(!started){started=playing=true;tune(0)}
 else{playing=true;live.forEach(function(a){a.play().catch(function(){})})}
 label()};
$('pv').onclick=function(){started=playing=true;tune(-1)};
$('nx').onclick=function(){started=playing=true;tune(1)};
$('vol').oninput=function(){vol=+this.value;localStorage.setItem('vol',vol);live.forEach(function(a){a.volume=av(a)})};
function duck(x){ducked=x;live.forEach(function(a){a.volume=av(a)})}
/* grabaciones: la radio baja de volumen mientras suena el registro */
document.addEventListener('click',function(e){var b=e.target.closest('.play');if(!b)return;
 if(rec){rec.pause();rec=null;b.textContent=b.dataset.t;duck(false);return}
 b.dataset.t=b.textContent;rec=new Audio(encodeURI(b.dataset.src));
 rec.onended=function(){rec=null;b.textContent=b.dataset.t;duck(false)};
 rec.play();b.textContent='[ detener ]';duck(true)});
/* navegación sin recargar: la radio sigue sonando entre documentos */
function go(u,push){fetch(u).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
 var d=new DOMParser().parseFromString(t,'text/html'),n=d.getElementById('doc');if(!n)throw 0;
 if(rec){rec.pause();rec=null;duck(false)}
 D.innerHTML=n.innerHTML;document.body.className=d.body.className;document.title=d.title;
 if(push)history.pushState(0,'',u);scrollTo(0,0)}).catch(function(){location.href=u})}
document.addEventListener('click',function(e){var a=e.target.closest('a');
 if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target||a.origin!==location.origin||(a.hash&&a.pathname===location.pathname))return;
 e.preventDefault();go(a.href,true)});
window.onpopstate=function(){go(location.href,false)};
})();
