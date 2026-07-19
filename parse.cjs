const fs = require('fs');
const data = JSON.parse(fs.readFileSync('github_repos.json'));
data.forEach(r => {
  console.log('Project: ' + r.name);
  console.log('Desc: ' + r.description);
  console.log('---');
});
