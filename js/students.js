"use strict";

(() => {
  const app = window.StudentApp;
  const form = document.getElementById("student-form");
  const nameInput = document.getElementById("student-name");
  const rollInput = document.getElementById("roll-number");
  const marksInput = document.getElementById("student-marks");
  const message = document.getElementById("form-message");
  const tableBody = document.getElementById("student-table-body");
  const submitButton = document.getElementById("submit-student");
  const cancelButton = document.getElementById("cancel-edit");
  let students = app.getStudents();
  let editingId = null;

  function announce(text, kind = "") {
    message.textContent = text;
    message.className = `form-message ${kind}`.trim();
  }

  function render() {
    document.getElementById("student-count").textContent = `${students.length} ${students.length === 1 ? "student" : "students"}`;
    if (students.length === 0) {
      tableBody.innerHTML = '<tr><td class="empty-cell" colspan="5">Your roster is empty. Add a student or load the sample class.</td></tr>';
      return;
    }
    tableBody.innerHTML = students.map((student) => `
      <tr>
        <td>${app.escapeHTML(student.roll)}</td><td><strong>${app.escapeHTML(student.name)}</strong></td>
        <td><span class="score-pill">${student.marks}</span></td><td class="performance">${app.getPerformance(student.marks)}</td>
        <td><div class="row-actions"><button class="text-action" type="button" data-edit="${app.escapeHTML(student.id)}">Edit</button><button class="text-action delete" type="button" data-delete="${app.escapeHTML(student.id)}">Delete</button></div></td>
      </tr>`).join("");
  }

  function resetEditing() {
    editingId = null;
    form.reset();
    document.getElementById("form-heading").textContent = "Add a student";
    submitButton.textContent = "Add student";
    cancelButton.classList.add("hidden");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();
    const rawMarks = marksInput.value.trim();
    const marks = Number(rawMarks);
    if (!name || !roll || rawMarks === "") return announce("Please complete all fields.", "error");
    if (!Number.isInteger(marks) || marks < 0 || marks > 100) return announce("Marks must be a whole number between 0 and 100.", "error");
    const duplicate = students.some((student) =>
      student.id !== editingId && student.roll.toLocaleLowerCase() === roll.toLocaleLowerCase()
    );
    if (duplicate) return announce("That roll number is already in the class.", "error");

    if (editingId) {
      students = students.map((student) => student.id === editingId
        ? { ...student, name, roll, marks }
        : student);
      announce("Student record updated.", "success");
    } else {
      students.push({ id: app.createId(), name, roll, marks });
      announce("Student added to the class.", "success");
    }
    app.saveStudents(students);
    resetEditing();
    render();
  });

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const editId = button.dataset.edit;
    const deleteId = button.dataset.delete;
    if (editId) {
      const student = students.find((item) => item.id === editId);
      if (!student) return;
      editingId = student.id;
      nameInput.value = student.name;
      rollInput.value = student.roll;
      marksInput.value = student.marks;
      document.getElementById("form-heading").textContent = "Edit student";
      submitButton.textContent = "Save changes";
      cancelButton.classList.remove("hidden");
      announce(`Editing ${student.name}.`);
      nameInput.focus();
    }
    if (deleteId) {
      const student = students.find((item) => item.id === deleteId);
      if (!student) return;
      students = students.filter((item) => item.id !== deleteId);
      if (editingId === deleteId) resetEditing();
      app.saveStudents(students);
      announce(`${student.name} was removed from the class.`, "success");
      render();
    }
  });

  document.getElementById("reset-form").addEventListener("click", () => {
    resetEditing();
    announce("");
  });
  cancelButton.addEventListener("click", () => {
    resetEditing();
    announce("Editing cancelled.");
  });
  document.getElementById("load-sample").addEventListener("click", () => {
    students = app.SAMPLE_STUDENTS.map((student) => ({ ...student }));
    app.saveStudents(students);
    resetEditing();
    announce("Sample class loaded. Existing records were replaced.", "success");
    render();
  });
  render();
})();
