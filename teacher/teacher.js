async function loadExams() {

  if (localStorage.getItem("exams")) return;

  try {
    const response = await fetch("../db/exams.json");
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
    const response = await fetch("../db/students.json");
    const data = await response.json();

    localStorage.setItem("students", JSON.stringify(data));
    console.log("students stored in localStorage");
  } catch (error) {
    console.error("Error loading students.json", error);
  }
}

loadStudents();