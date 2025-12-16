document.addEventListener("DOMContentLoaded", () => {
  // Load JSON once
  async function loadJSON(database) {
    const res = await fetch(`../db/${database}.json`);
    const data = await res.json();
    localStorage.setItem(database, JSON.stringify(data));
  }

  loadJSON();

  function getItems(database) {
    return JSON.parse(localStorage.getItem(database)) || [];
  }

  const form = document.getElementById("loginForm");

  if (!form) {
    console.error("Login form not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("input[type=email]").value.trim();
    const password = document
      .querySelector("input[type=password]")
      .value.trim();
    const role = document.querySelector("input[name='role']:checked")?.value;

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

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

      if (!student) {
        alert("Email or password incorrect ❌");
        return;
      }

      localStorage.setItem("currentStudent", JSON.stringify(student));
      window.location.href = "../student/student-profile.html";
    }

    if (role === "teacher") {
      await loadJSON("teachers");
      const teachers = getItems("teachers");

      const teacher = teachers.find(
        (t) => t.email === email && t.password === password
      );

      if (!teacher) {
        alert("Email or password incorrect ❌");
        return;
      }

      localStorage.setItem("currentTeacher", JSON.stringify(teacher));
      window.location.href = "../teacher/teacher-dashboard.html";
    }
  });
});
