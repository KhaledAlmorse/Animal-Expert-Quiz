async function loadExams() {
  if (localStorage.getItem("exams")) return;

  try {
    const response = await fetch("../../db/exams.json");
    const data = await response.json();

    localStorage.setItem("exams", JSON.stringify(data));
    console.log("Exams stored in localStorage");
  } catch (error) {
    console.error("Error loading exams.json", error);
  }
}

loadExams();

async function loadStudents() {
  if (localStorage.getItem("students")) return;
  try {
    const response = await fetch("../../db/students.json");
    const data = await response.json();

    localStorage.setItem("students", JSON.stringify(data));
    console.log("students stored in localStorage");
  } catch (error) {
    console.error("Error loading students.json", error);
  }
}

loadStudents();

const exams = JSON.parse(localStorage.getItem("exams")) || [];
const users = JSON.parse(localStorage.getItem("users")) || [];

document.getElementById("totalExams").textContent = exams.length;

const students = users.filter((u) => u.role === "student");
document.getElementById("totalStudents").textContent = students.length;

const completedExams = exams.filter(
  (exam) => exam.results && exam.results.length > 0
);

document.getElementById("completedExams").textContent = completedExams.length;

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentTeacherId");
  window.location.href = "../../auth/view/login.html";
});
