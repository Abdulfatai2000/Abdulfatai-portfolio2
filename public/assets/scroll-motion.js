/* Reveal cards added asynchronously, including GitHub repository cards. */
(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reduce.matches||!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },{threshold:0.08,rootMargin:'0px 0px 35px 0px'});
  const seen=new WeakSet();
  function register(){
    document.querySelectorAll('#github-repos .github-repo').forEach((card,i)=>{
      if(seen.has(card))return;
      seen.add(card);
      card.classList.add('reveal');
      card.style.transitionDelay=Math.min(i*100,300)+'ms';
      observer.observe(card);
    });
  }
  const root=document.getElementById('github-repos');
  if(root){new MutationObserver(register).observe(root,{childList:true});register();}
})();
