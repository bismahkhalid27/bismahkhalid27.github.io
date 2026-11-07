(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  var nav=document.getElementById('nav');
  addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>8)},{passive:true});

  /* sprint: a "today" line walks days 1-10 and lights each ceremony */
  var sp=document.getElementById('sprint'),now=document.getElementById('now');
  var trows=[].slice.call(sp.querySelectorAll('.trow')),evs=[].slice.call(sp.querySelectorAll('.ev'));
  function light(day){
    trows.forEach(function(r){var on=day>=+r.dataset.from&&day<=+r.dataset.to;r.classList.toggle('on',on);
      evs.forEach(function(e){if(e.dataset.k===r.dataset.k)e.classList.toggle('on',on)})});
    now.style.setProperty('--d',day);
  }
  var walked=false;
  function walk(){if(walked)return;walked=true;var d=1;light(1);var t=setInterval(function(){d++;light(d);if(d>=10)clearInterval(t)},700)}
  evs.forEach(function(e){e.addEventListener('mouseenter',function(){trows.forEach(function(r){r.classList.toggle('on',r.dataset.k===e.dataset.k)});evs.forEach(function(x){x.classList.toggle('on',x===e)})})});
  /* release notes rail fills as you scroll; each role marker fills when reached */
  var rel=document.getElementById('rel'),fill=document.getElementById('relFill'),rs=[].slice.call(rel.querySelectorAll('.r'));
  function rail(){
    var b=rel.getBoundingClientRect(),mark=innerHeight*.6,h=Math.max(0,Math.min(b.height,mark-b.top));
    fill.style.setProperty('--h',h+'px');
    rs.forEach(function(r){r.classList.toggle('reached',r.querySelector('.mk').getBoundingClientRect().top<mark)});
  }
  if(reduce){fill.style.setProperty('--h','100%');rs.forEach(function(r){r.classList.add('reached')})}
  else{addEventListener('scroll',rail,{passive:true});addEventListener('resize',rail);rail()}

  /* reveal on scroll and count-up */
  var rev=[].slice.call(document.querySelectorAll('.reveal,.watch'));
  function tick(){rev.forEach(function(n){if(!n.classList.contains('seen')&&n.getBoundingClientRect().top<innerHeight*.8){n.classList.add('seen');if(n.id==='sprint'&&!reduce)walk()}})}
  if(reduce){rev.forEach(function(n){n.classList.add('seen')});light(10)}else{addEventListener('scroll',tick,{passive:true});tick()}

  function fmt(n){return n.toLocaleString('en-US')}
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);
      var el=e.target,n=+el.dataset.n,pre=el.dataset.pre||'',suf=el.dataset.suf||'',t0=null;
      function step(t){t0=t0||t;var p=Math.min(1,(t-t0)/1100),v=Math.round(n*(1-Math.pow(1-p,3)));el.textContent=pre+fmt(v)+suf;if(p<1)requestAnimationFrame(step)}
      requestAnimationFrame(step)})},{threshold:.6});
    document.querySelectorAll('[data-n]').forEach(function(el){io.observe(el)});
  }

  document.getElementById('copy').addEventListener('click',function(){
    var b=this,el=document.getElementById('mail');
    function ok(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1600)}
    function sel(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected'}
    try{navigator.clipboard.writeText(el.textContent).then(ok,sel)}catch(e){sel()}
  });
})();
