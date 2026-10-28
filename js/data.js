"use strict";

(() => {
  const STORAGE_KEY = "scholarboard.students.v1";
  const SAMPLE_STUDENTS = [
    { id: "sample-001", name: "Aisha Patel", roll: "MCA-001", marks: 92 },
    { id: "sample-002", name: "Rohan Mehta", roll: "MCA-002", marks: 68 },
    { id: "sample-003", name: "Chen Wei", roll: "MCA-003", marks: 85 },
    { id: "sample-004", name: "Priya Sharma", roll: "MCA-004", marks: 54 },
    { id: "sample-005", name: "Kabir Shah", roll: "MCA-005", marks: 78 },
    { id: "sample-006", name: "Meera Iyer", roll: "MCA-006", marks: 85 }
  ];

  function getStudents() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      saveStudents(SAMPLE_STUDENTS);
      return SAMPLE_STUDENTS.map((student) => ({ ...student }));
    }
    const students = JSON.parse(stored);
    if (!Array.isArray(students) || students.some((student) =>
      !student || typeof student.id !== "string" || typeof student.name !== "string" ||
      typeof student.roll !== "string" || !Number.isInteger(student.marks) ||
      student.marks < 0 || student.marks > 100
    )) {
      throw new Error("Saved student data is invalid. Clear this site's browser storage to start over.");
    }
    return students;
  }

  function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  function createId() {
    return globalThis.crypto && typeof globalThis.crypto.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `student-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function bubbleSortDescending(students) {
    const sorted = students.map((student) => ({ ...student }));
    // Swap only out-of-order neighbors; tied marks stay in their roster order.
    for (let pass = 0; pass < sorted.length - 1; pass += 1) {
      let swapped = false;
      for (let index = 0; index < sorted.length - 1 - pass; index += 1) {
        if (sorted[index].marks < sorted[index + 1].marks) {
          [sorted[index], sorted[index + 1]] = [sorted[index + 1], sorted[index]];
          swapped = true;
        }
      }
      if (!swapped) break;
    }
    return sorted;
  }

  function getPerformance(marks) {
    if (marks >= 90) return "Excellent";
    if (marks >= 75) return "Very good";
    if (marks >= 60) return "Good";
    if (marks >= 40) return "Pass";
    return "Needs support";
  }

  function getStatistics(students) {
    if (students.length === 0) return { total: 0, highest: null, lowest: null, average: null };
    const marks = students.map((student) => student.marks);
    return {
      total: students.length,
      highest: Math.max(...marks),
      lowest: Math.min(...marks),
      average: marks.reduce((sum, mark) => sum + mark, 0) / marks.length
    };
  }

  window.StudentApp = {
    STORAGE_KEY,
    SAMPLE_STUDENTS,
    bubbleSortDescending,
    createId,
    escapeHTML,
    getPerformance,
    getStatistics,
    getStudents,
    saveStudents
  };
})();
