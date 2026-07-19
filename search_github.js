fetch('https://api.github.com/search/code?q=brain+extension:glb', {
  headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'Antigravity' }
}).then(r => r.json()).then(data => {
  if(data.items) {
    console.log(data.items.slice(0,10).map(i => i.html_url));
  } else {
    console.log(data);
  }
})
