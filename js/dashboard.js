"use strict";

(() => {
  const app = window.StudentApp;
  const students = app.getStudents();
  const sorted = app.bubbleSortDescending(students);
  const page = document.body.dataset.page;

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function renderDashboard() {
    const stats = app.getStatistics(students);
    setText("stat-total", stats.total);
    setText("stat-highest", stats.highest === null ? "—" : stats.highest);
    setText("stat-average", stats.average === null ? "—" : stats.average.toFixed(1));
    setText("stat-lowest", stats.lowest === null ? "—" : stats.lowest);
    if (sorted[0]) {
      setText("hero-leader", sorted[0].name);
      setText("hero-leader-marks", `${sorted[0].marks} marks · ${sorted[0].roll}`);
    } else {
      setText("hero-leader", "No students yet");
      setText("hero-leader-marks", "Add your class to begin");
    }
    const preview = document.getElementById("dashboard-preview");
    if (!preview) return;
    if (sorted.length === 0) {
      preview.innerHTML = '<p class="empty-cell">No students yet. Add a class roster to see rankings here.</p>';
      return;
    }
    preview.innerHTML = sorted.slice(0, 4).map((student, index) => `
      <div class="preview-row">
        <span class="rank-chip ${index === 0 ? "gold" : ""}">${index + 1}</span>
        <span class="preview-name">${app.escapeHTML(student.name)}<span class="preview-roll">${app.escapeHTML(student.roll)}</span></span>
        <span class="preview-score">${student.marks}</span>
      </div>`).join("");
  }

  function renderResults() {
    const stats = app.getStatistics(students);
    setText("result-total", stats.total);
    setText("result-highest", stats.highest === null ? "—" : stats.highest);
    setText("result-average", stats.average === null ? "—" : stats.average.toFixed(1));
    setText("result-lowest", stats.lowest === null ? "—" : stats.lowest);

    const podium = document.getElementById("podium-grid");
    podium.innerHTML = sorted.length === 0
      ? '<div class="empty-cell">No class results yet. Add students to create a leaderboard.</div>'
      : sorted.slice(0, 3).map((student, index) => `
        <article class="podium-card ${index === 0 ? "first" : ""}">
          <span class="podium-rank">${index + 1}</span>${index === 0 ? '<span class="podium-medal" aria-label="Top student">✦</span>' : ""}
          <h3>${app.escapeHTML(student.name)}</h3><p>${app.escapeHTML(student.roll)}</p>
          <div class="podium-score">${student.marks}<small> / 100 marks</small></div>
        </article>`).join("");

    const tbody = document.getElementById("results-table-body");
    tbody.innerHTML = sorted.length === 0
      ? '<tr><td class="empty-cell" colspan="4">No results to display. Add students from the Students page.</td></tr>'
      : sorted.map((student, index) => `
        <tr class="${index === 0 ? "rank-first" : ""}">
          <td><strong>${index + 1}</strong></td><td>${app.escapeHTML(student.roll)}</td>
          <td><strong>${app.escapeHTML(student.name)}</strong></td><td><span class="score-pill">${student.marks}</span></td>
        </tr>`).join("");
    renderDistribution();
  }

  function renderDistribution() {
    const groups = [
      { label: "90–100", min: 90, max: 100 },
      { label: "75–89", min: 75, max: 89 },
      { label: "60–74", min: 60, max: 74 },
      { label: "40–59", min: 40, max: 59 },
      { label: "0–39", min: 0, max: 39 }
    ];
    const chart = document.getElementById("distribution-chart");
    const maxCount = Math.max(1, ...groups.map((group) =>
      students.filter((student) => student.marks >= group.min && student.marks <= group.max).length
    ));
    chart.innerHTML = groups.map((group) => {
      const count = students.filter((student) => student.marks >= group.min && student.marks <= group.max).length;
      const width = count === 0 ? 0 : Math.max(7, (count / maxCount) * 100);
      return `<div class="distribution-row"><span class="distribution-label">${group.label}</span>
        <div class="distribution-track"><div class="distribution-fill" style="width:${width}%"></div></div>
        <span class="distribution-value">${count}</span></div>`;
    }).join("");
  }

  function exportCSV() {
    const rows = [["Rank", "Roll number", "Student name", "Marks"], ...sorted.map((student, index) =>
      [index + 1, student.roll, student.name, student.marks]
    )];
    const csv = rows.map((row) => row.map((value) => {
      const escaped = String(value).replace(/"/g, '""');
      return /[",\r\n]/.test(escaped) ? `"${escaped}"` : escaped;
    }).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-marks-results.csv";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (page === "dashboard") renderDashboard();
  if (page === "results") {
    renderResults();
    document.getElementById("export-csv").addEventListener("click", exportCSV);
    document.getElementById("print-results").addEventListener("click", () => window.print());
  }
})();
