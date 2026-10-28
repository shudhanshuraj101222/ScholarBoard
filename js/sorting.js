"use strict";

(() => {
  const app = window.StudentApp;
  const original = app.getStudents();
  let displayed = original.map((student) => ({ ...student }));
  let walk = null;
  let isSorted = false;
  let lastPair = [];
  let lastSwap = false;
  const tbody = document.getElementById("sorting-table-body");
  const status = document.getElementById("sort-status");
  const stepsPanel = document.getElementById("steps-panel");
  const stepExplanation = document.getElementById("step-explanation");
  const stepLog = document.getElementById("step-log");

  function render() {
    document.getElementById("sort-count").textContent = `${displayed.length} ${displayed.length === 1 ? "student" : "students"}`;
    document.getElementById("rank-heading").textContent = isSorted ? "Rank" : "Position";
    if (displayed.length === 0) {
      tbody.innerHTML = '<tr><td class="empty-cell" colspan="4">No students yet. Add student records before sorting.</td></tr>';
      return;
    }
    tbody.innerHTML = displayed.map((student, index) => `
      <tr class="${lastPair.includes(index) ? (lastSwap ? "swapped" : "comparing") : ""} ${index === 0 && !walk ? "rank-first" : ""}">
        <td>${index + 1}</td><td>${app.escapeHTML(student.roll)}</td>
        <td>${app.escapeHTML(student.name)}</td><td><strong>${student.marks}</strong></td>
      </tr>`).join("");
  }

  function setStatus(text, kind = "") {
    status.textContent = text;
    status.className = `sort-status ${kind}`.trim();
  }

  function finishWalk() {
    walk.done = true;
    isSorted = true;
    lastPair = [];
    render();
    stepExplanation.textContent = "Sorting complete. The list is now in descending order; equal marks kept their original relative order.";
    setStatus("Sorting complete — highest marks are ranked first.", "success");
    const nextButton = document.getElementById("next-step");
    nextButton.disabled = true;
    nextButton.textContent = "Walkthrough complete";
    document.getElementById("step-progress-label").textContent = `${walk.comparisons} comparisons · complete`;
    document.getElementById("step-progress-bar").style.width = "100%";
  }

  function updateProgress() {
    const percent = walk.totalComparisons === 0 ? 100 : Math.min(100, (walk.comparisons / walk.totalComparisons) * 100);
    document.getElementById("step-progress-label").textContent = `${walk.comparisons} / ${walk.totalComparisons} comparisons`;
    document.getElementById("step-progress-bar").style.width = `${percent}%`;
  }

  function nextComparison() {
    if (!walk) {
      walk = {
        items: original.map((student) => ({ ...student })),
        pass: 0,
        index: 0,
        swapped: false,
        comparisons: 0,
        totalComparisons: original.length < 2 ? 0 : (original.length * (original.length - 1)) / 2,
        done: false
      };
      isSorted = false;
      document.getElementById("next-step").disabled = false;
      stepLog.innerHTML = "";
      document.getElementById("next-step").textContent = "Next comparison →";
      displayed = walk.items;
      updateProgress();
      render();
      if (walk.items.length < 2) {
        finishWalk();
        return;
      }
    }
    if (walk.done) return;
    if (walk.index >= walk.items.length - 1 - walk.pass) {
      if (!walk.swapped || walk.pass >= walk.items.length - 2) {
        finishWalk();
        return;
      }
      walk.pass += 1;
      walk.index = 0;
      walk.swapped = false;
    }
    const left = walk.items[walk.index];
    const right = walk.items[walk.index + 1];
    lastPair = [walk.index, walk.index + 1];
    lastSwap = left.marks < right.marks;
    walk.comparisons += 1;
    if (lastSwap) {
      [walk.items[walk.index], walk.items[walk.index + 1]] = [right, left];
      walk.swapped = true;
      stepExplanation.textContent = `${left.name} (${left.marks}) is below ${right.name} (${right.marks}), so swap the adjacent students.`;
      stepLog.insertAdjacentHTML("afterbegin", `<div class="step-item"><b>Swap:</b> ${app.escapeHTML(left.name)} (${left.marks}) ↔ ${app.escapeHTML(right.name)} (${right.marks})</div>`);
    } else {
      stepExplanation.textContent = `${left.name} (${left.marks}) is not lower than ${right.name} (${right.marks}), so keep their order.`;
      stepLog.insertAdjacentHTML("afterbegin", `<div class="step-item"><b>Compare:</b> ${app.escapeHTML(left.name)} (${left.marks}) and ${app.escapeHTML(right.name)} (${right.marks}) — no swap</div>`);
    }
    walk.index += 1;
    displayed = walk.items;
    updateProgress();
    render();
    setStatus(`Pass ${walk.pass + 1} · comparison ${walk.comparisons}`, "active");
    if (walk.index >= walk.items.length - 1 - walk.pass && (!walk.swapped || walk.pass >= walk.items.length - 2)) {
      document.getElementById("next-step").textContent = "Finish walkthrough";
    }
  }

  document.getElementById("sort-now").addEventListener("click", () => {
    displayed = app.bubbleSortDescending(original);
    walk = null;
    isSorted = true;
    lastPair = [];
    render();
    setStatus(`Sorting complete — ${displayed.length} ${displayed.length === 1 ? "student" : "students"} ranked from highest to lowest.`, "success");
    const nextButton = document.getElementById("next-step");
    nextButton.disabled = false;
    nextButton.textContent = "Start next step →";
    if (!stepsPanel.classList.contains("hidden")) {
      stepExplanation.textContent = "The complete Bubble Sort pass sequence produced this stable, descending ranking.";
    }
  });
  document.getElementById("reset-sort").addEventListener("click", () => {
    displayed = original.map((student) => ({ ...student }));
    walk = null;
    isSorted = false;
    lastPair = [];
    render();
    setStatus("Sorting reset. Showing students in their original roster order.");
    stepLog.innerHTML = "";
    stepExplanation.textContent = "Start the walkthrough to inspect each adjacent comparison.";
    document.getElementById("next-step").disabled = false;
    document.getElementById("next-step").textContent = "Start next step →";
    updateProgressForReset();
  });
  document.getElementById("show-steps").addEventListener("click", () => {
    stepsPanel.classList.toggle("hidden");
    const showing = !stepsPanel.classList.contains("hidden");
    document.getElementById("show-steps").textContent = showing ? "Hide sorting steps" : "Show sorting steps";
    if (showing && (!walk || walk.done)) {
      walk = null;
      nextComparison();
    }
  });
  document.getElementById("next-step").addEventListener("click", nextComparison);

  function updateProgressForReset() {
    document.getElementById("step-progress-label").textContent = "0 comparisons";
    document.getElementById("step-progress-bar").style.width = "0%";
  }

  render();
})();
