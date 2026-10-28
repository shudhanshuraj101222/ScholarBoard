# Student Marks Sorting System Using Bubble Sort

ScholarBoard is a responsive, four-page student marks management and ranking
project designed for a college DAA presentation. It runs entirely in the
browser: there is no server, backend, database, build step, or package install.
Student records are saved in the browser's `localStorage` and are not uploaded.

## Pages

- **Dashboard (`index.html`)** — class totals, score summary, an overview of
  Bubble Sort, and a preview of the highest-ranked students.
- **Students (`students.html`)** — add, edit, and delete records; validate names,
  unique roll numbers, and integer marks from 0 to 100; load the sample class.
- **Sorting Lab (`sorting.html`)** — sort from highest to lowest and step through
  adjacent comparisons and swaps.
- **Results (`results.html`)** — top-three cards, leaderboard, statistics, score
  distribution, CSV export, and print-ready results.

## Run the project

1. Keep the `css` and `js` folders beside the four HTML files.
2. Open `index.html` in a modern web browser.
3. Use **Students** to manage the roster, **Sorting Lab** to rank the class, and
   **Results** to review, export, or print the report.

On the first visit, a small sample class is loaded automatically. Select
**Load sample class** to restore those demonstration records later. Data is
shared across pages in the same browser profile. Clearing the browser's site
data removes the saved roster.

## Features

- Premium maroon and off-white visual theme with responsive layouts.
- Persistent student data using browser `localStorage`.
- Form validation, duplicate roll-number detection, and accessible status
  messages.
- Stable descending Bubble Sort with an interactive comparison walkthrough.
- Automatically calculated total, highest, lowest, and average marks.
- Score distribution visualization, CSV download, and print stylesheet.
- Realistic sample student records for demonstration.

## Technologies

- HTML5 for page structure and accessible forms/tables.
- CSS3 for responsive layouts, visual design, animation, and print styles.
- Vanilla JavaScript for data management, statistics, CSV export, and sorting.
- Browser `localStorage` for persistence; no Python runtime or backend is
  required for the web application. The optional console version remains in
  `student_marks_sorting.py`.

## Bubble Sort

The app copies the roster and repeatedly compares neighboring students. If the
left student's marks are lower than the right student's marks, it swaps the
pair. After each pass, the remaining lowest score moves toward the end. Sorting
stops when a full pass has no swaps or all required passes are complete.

Equal marks are not swapped, preserving the original roster order among tied
students. Rankings are assigned after sorting, with the highest score at Rank
1.

- Best-case time: **O(n)** when a pass confirms the list is already ordered.
- Average- and worst-case time: **O(n²)**.
- Extra sorting space: **O(n)** in this implementation because the roster is
  copied before sorting so the original student order remains available.
