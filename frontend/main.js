const apiBase = 'http://localhost:4000/api/v1';

async function render(){
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="card">
      <h2>Upload a file (demo)</h2>
      <form id="uploadForm">
        <input type="file" id="file" name="files" multiple><br><br>
        <button>Upload</button>
      </form>
    </div>
    <div class="card"><h2>Jobs</h2><ul id="jobs"></ul></div>
  `;
  document.getElementById('uploadForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const f = document.getElementById('file').files;
    if(!f.length) return alert('choose file');
    const fd = new FormData();
    for(const file of f) fd.append('files', file);
    fd.append('settings', JSON.stringify({ color:'bw' }));
    const res = await fetch(apiBase + '/jobs', { method:'POST', body:fd });
    const j = await res.json();
    alert('uploaded: ' + JSON.stringify(j));
    loadJobs();
  });
  window.loadJobs = async function(){
    const res = await fetch(apiBase + '/jobs');
    if(res.status!==200) return;
    const jobs = await res.json();
    const ul = document.getElementById('jobs'); ul.innerHTML='';
    for(const job of jobs) ul.innerHTML += `<li>${job._id} — ${job.status}</li>`;
  }
  loadJobs();
}
render();
