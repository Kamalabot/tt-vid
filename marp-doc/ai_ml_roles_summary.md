---
marp: true
theme: default
paginate: true
style: |
  section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto 1fr;
    gap: 20px;
    padding: 30px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  h1 {
    grid-column: 1 / span 3;
    text-align: center;
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 15px;
    border-bottom: 3px solid #3498db;
    padding-bottom: 5px;
  }
  h2 {
    color: #3498db;
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 10px;
  }
  .role-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.18);
    transition: transform 0.3s ease;
  }
  .role-card:hover {
    transform: translateY(-5px);
  }
  ul {
    list-style-type: '👉 ';
    padding-left: 15px;
    margin: 0;
  }
  li {
    margin-bottom: 8px;
    line-height: 1.4;
    font-size: 1rem;
  }
  strong {
    color: #e74c3c;
  }
---

# AI/ML Roles: Key Distinctions

<div class="role-card">

## Data Scientist (DS)
* Research-level model designer.
* Primary focus: Model performance & requirements.
* **Costly to engage in coding (SWE) tasks.**

</div>

<div class="role-card">

## ML Engineer (MLE)
* Backend engineer for deployment & serving.
* Ensures models handle requests efficiently.
* Deep awareness of hardware & software.
* **Costly for basic CRUD operations.**

</div>

<div class="role-card">
  
## AI Engineer
* Orchestrator & specialist in problem-solving.
* Generalist tech stack user (diverse tools).
* Focuses on customer-facing ML solutions.
* Proficient in Open Source & fine-tuning.
* **Key:** Knowledge of both DS + ML is essential.

</div>

