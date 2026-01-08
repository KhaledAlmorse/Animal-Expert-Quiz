const exams = JSON.parse(localStorage.getItem("exams")) || [];
const tbody = document.getElementById("examsTableBody");

tbody.innerHTML = "";

exams.forEach(exam => {
  const status = exam.results.length ? "solved" : "pending";

  tbody.innerHTML += `
    <tr class="border-t">
      <td class="p-3">${exam.title}</td>
      <td class="p-3 text-center">${exam.questions.length}</td>
      <td class="p-3 text-center">${exam.totalTime / 60} min</td>
      <td class="p-3 text-center ${
        status === "Published" ? "text-green-600" : "text-gray-500"
      }">
        ${status}
      </td>
      <td class="p-3 text-center space-x-2">
        <a href="show-exam.html?id=${exam.id}" class="text-blue-600">View</a>
        <a href="edit-exam.html?id=${exam.id}" class="text-yellow-600">Edit</a>
        <button onclick="deleteExam(${exam.id})" class="text-red-600">Delete</button>
      </td>
    </tr>
  `;
});

function deleteExam(id) {
  if (!confirm("Are you sure you want to delete this exam?")) return;
  exam = exams.find(e => e.id === id);
  if (exam.assignedStudents.length) {
    alert("Cannot delete an exam that has assigned students.");
    return;
  }
  if(exam.results.length) {
    alert("Cannot delete an exam that has results.");
    return;
  }
  const updated = exams.filter(e => e.id !== id);
  localStorage.setItem("exams", JSON.stringify(updated));
  location.reload();
}
