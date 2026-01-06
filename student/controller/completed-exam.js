const student = JSON.parse(localStorage.getItem("currentStudent") || "null");
const tbody = document.getElementById("examTableBody");

if (
  !student ||
  !student.completedExams ||
  student.completedExams.length === 0
) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td colspan="4" class="px-6 py-4 text-center text-gray-400">
      No exams completed yet.
    </td>
  `;
  tbody.appendChild(row);
} else {
  student.completedExams.forEach((exam) => {
    const row = document.createElement("tr");

    // تحديد لون الدرجة
    const scoreClass =
      exam.score < 50 ? "text-red-400" : "text-green-400";

    row.innerHTML = `
      <td class="px-6 py-4">${exam.examId}</td>
      <td class="px-6 py-4">${exam.examName}</td>
      <td class="px-6 py-4 font-semibold ${scoreClass}">
        ${exam.score} / ${exam.total}
      </td>
      <td class="px-6 py-4">${exam.date}</td>
    `;

    tbody.appendChild(row);
  });
}
