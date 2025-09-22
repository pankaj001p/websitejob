/* ---------- Utility: fetch & render jobs ---------- */
let jobData = [];

fetch('jobs.json')
  .then(r => r.json())
  .then(data => {
      jobData = data;
      renderJobCards(data);
  })
  .catch(err => console.warn('jobs.json not found or invalid – using demo data', err));

/* ---------- Render job cards in .tools-grid ---------- */
function renderJobCards(list) {
    const grid = document.querySelector('.tools-grid');
    if (!grid) return;
    grid.innerHTML = '';               // clear existing
    list.forEach(job => {
        const card = document.createElement('a');
        card.className = 'tool-btn';
        card.href = '#';
        card.dataset.jobId = job.id;
        card.innerHTML = `
            ${job.new ? '<span class="new-badge">NEW</span>' : ''}
            ${job.title}<br><small>(${job.posts} Posts)</small>
        `;
        card.onclick = e => { e.preventDefault(); openJobModal(job); };
        grid.appendChild(card);
    });
}

/* ---------- Modal controls ---------- */
const modal = document.getElementById('job-detail-modal');
const span = document.querySelector('.job-close');

function openJobModal(job) {
    document.getElementById('job-title').textContent = job.title;
    document.getElementById('job-date').textContent = `Post Date: ${job.date}`;
    document.getElementById('job-short-details').textContent = job.details;
    document.getElementById('apply-btn').href = job.apply;
    document.getElementById('notification-btn').href = job.notification;
    modal.style.display = 'block';
}
span.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

/* ---------- Global search ---------- */
function searchJobs() {
    const q = document.getElementById('global-search').value.trim().toLowerCase();
    if (!q) { renderJobCards(jobData); return; }
    const filtered = jobData.filter(j => j.title.toLowerCase().includes(q));
    renderJobCards(filtered);
}
document.getElementById('global-search').addEventListener('keyup', e => {
    if (e.key === 'Enter') searchJobs();
});

/* ---------- Demo data (fallback) ---------- */
if (jobData.length === 0) {
    jobData = [
      {id:'demo1', title:'SSC CGL 2025', posts:'7500', date:'22 Sep 2025', new:true,
       details:'Combined Graduate Level Examination 2025 for various Group B & C posts.',
       apply:'https://ssc.nic.in', notification:'#'},
      {id:'demo2', title:'IBPS RRB XIV', posts:'13217', date:'21 Sep 2025', new:true,
       details:'Regional Rural Banks recruitment for Officers & Office Assistants.',
       apply:'https://ibps.in', notification:'#'}
    ];
    renderJobCards(jobData);
}