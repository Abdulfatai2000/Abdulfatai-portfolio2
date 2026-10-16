/* Public GitHub repository data; no token or private information required. */
(function(){
  const root=document.getElementById('github-repos');
  if(!root)return;
  const username='Abdulfatai2000';
  const profile='https://github.com/'+username;
  const fallback='<p class="github-fallback">Recent repositories are temporarily unavailable. <a class="github-link" href="'+profile+'" target="_blank" rel="noopener noreferrer">Browse projects on GitHub ↗</a></p>';
  function card(repo){
    const a=document.createElement('a');
    a.className='github-repo';
    a.href=repo.html_url;
    a.target='_blank';
    a.rel='noopener noreferrer';
    const title=document.createElement('h4');title.textContent=repo.name;
    const description=document.createElement('p');description.textContent=repo.description||'Explore the source code and development history.';
    const meta=document.createElement('span');meta.className='github-repo-meta';
    meta.textContent=(repo.language||'Repository')+' · ★ '+repo.stargazers_count;
    a.append(title,description,meta);
    return a;
  }
  fetch('https://api.github.com/users/'+username+'/repos?per_page=100&sort=updated',{headers:{Accept:'application/vnd.github+json'}})
    .then(r=>{if(!r.ok)throw new Error('GitHub API unavailable');return r.json()})
    .then(data=>{
      if(!Array.isArray(data))throw new Error('Unexpected response');
      const repos=data.filter(r=>!r.fork&&!r.archived).sort((a,b)=>new Date(b.pushed_at||0)-new Date(a.pushed_at||0)).slice(0,3);
      if(!repos.length){root.innerHTML=fallback;return;}
      root.replaceChildren(...repos.map(card));
    })
    .catch(()=>{root.innerHTML=fallback;});
})();
