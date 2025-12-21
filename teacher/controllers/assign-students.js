
const params = new URLSearchParams(window.location.search);
const examId = Number(params.get("id"));

const exams = JSON.parse(localStorage.getItem("exams")) || [];
const users = JSON.parse(localStorage.getItem("students")) || [];
const exam = exams.find((e) => e.id === examId);
if (!exam) {
  alert("Exam not found");
  location.href = "exams.html";
}

const students = users.filter((u) => u.role === "student");

const tbody = document.getElementById("studentsTable");

function renderStudents() {
  tbody.innerHTML = "";

  students.forEach((student) => {
    const isAssigned = exam.assignedStudents.includes(student.id);

    const tr = document.createElement("tr");
    tr.className = "border-t";

    tr.innerHTML = `
      <td class="p-3 flex items-center gap-2">
        <img src="${student.profileImage}" class="w-8 h-8 rounded-full" />
        ${student.username}
      </td>
      <td class="p-3">${student.email}</td>
      <td class="p-3 text-center">
        <input 
          type="checkbox" 
          data-id="${student.id}"
          ${isAssigned ? "checked" : ""}
        />
      </td>
    `;

    tbody.appendChild(tr);
  });
}

renderStudents();

document.getElementById("saveAssign").addEventListener("click", () => {
  const checked = document.querySelectorAll('input[type="checkbox"]:checked');

  const assignedIds = [...checked].map((cb) => Number(cb.dataset.id));

  exam.assignedStudents = assignedIds;

  students.forEach((student) => {
    student.assignedExams = student.assignedExams || [];

    if (assignedIds.includes(student.id)) {
      if (!student.assignedExams.includes(exam.id)) {
        student.assignedExams.push(exam.id);
      }
    } else {
      student.assignedExams = student.assignedExams.filter(
        (id) => id !== exam.id
      );
    }
  });

  localStorage.setItem("exams", JSON.stringify(exams));
  localStorage.setItem("students", JSON.stringify(users));

  alert("Students assigned successfully!");
});
