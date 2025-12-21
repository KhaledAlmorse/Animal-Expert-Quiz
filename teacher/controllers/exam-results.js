const params = new URLSearchParams(window.location.search);
const examId = Number(params.get("id"));

const exams = JSON.parse(localStorage.getItem("exams")) || [];
const users = JSON.parse(localStorage.getItem("students")) || [];

const exam = exams.find((e) => e.id === examId);

if (!exam) {
  alert("Exam not found");
  location.href = "exams.html";
}

const tbody = document.getElementById("resultsTable");

if (!exam.results || exam.results.length === 0) {
  tbody.innerHTML = `
    <tr>
      <td colspan="4" class="p-4 text-center text-gray-500">
        No results available yet
      </td>
    </tr>
  `;
} else {
  exam.results.forEach((result) => {
    const student = users.find((u) => u.id === result.studentId);

    const tr = document.createElement("tr");
    tr.className = "border-t";

    tr.innerHTML = `
      <td class="p-3">${student ? student.username : "Unknown Student"}</td>
      <td class="p-3">${exam.title}</td>
      <td class="p-3">${result.score} / ${exam.totalScore}</td>
      <td class="p-3">${result.submittedAt}</td>
      <td class="p-3">
        <a
          href="review-answers.html?examId=${exam.id}&studentId=${student.id}"
          class="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm"
        >
          Review Answers
        </a>
      </td>
    `;

    tbody.appendChild(tr);
  });
}
