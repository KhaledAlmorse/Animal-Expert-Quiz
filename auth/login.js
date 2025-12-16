//* Login

//* Fetch Data
async function loadJSON(database) {
  if (!localStorage.getItem(database)) {
    const res = await fetch(`../db/${database}.json`);
    const data = await res.json();
    localStorage.setItem(database, JSON.stringify(data));
  }
}

//* Get Data
function getItems(database) {
  return JSON.parse(localStorage.getItem(database)) || [];
}

const form = document.querySelector("#loginForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.querySelector("input[type=email]").value.trim();
  const password = document.querySelector("input[type=password]").value.trim();
  const role = document.querySelector("input[name='role']:checked")?.value;

  if (!role) {
    alert("Please select role");
    return;
  }

  if (role === "student") {
    await loadJSON("students");

    const students = getItems("students");

    const student = students.find(
      (s) => s.email === email && s.password === password
    );

    if (student) {
      localStorage.setItem("currentStudent", JSON.stringify(student));
      window.location.href = "../student/student-profile.html";
    } else {
      alert("Email or password incorrect ❌");
    }
  }

  if (role === "teacher") {
    await loadJSON("teachers");

    const teachers = getItems("teachers");

    const teacher = teachers.find(
      (s) => s.email === email && s.password === password
    );

    if (teacher) {
      localStorage.setItem("currentTeacher", JSON.stringify(teacher));
      window.location.href = "../teacher/teacher-dashboard.html";
    } else {
      alert("Email or password incorrect ❌");
    }
  }
});
