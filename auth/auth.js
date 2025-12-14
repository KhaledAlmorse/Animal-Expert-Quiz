//*Fetch Data
async function loadJSON() {
  const res = await fetch("../db/students.json");
  const data = await res.json();

  localStorage.setItem("students", JSON.stringify(data));
}

loadJSON();

//* Get Data
function getItems() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

const form = document.querySelector("#loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.querySelector("input[type=email]").value.trim();
  const password = document.querySelector("input[type=password]").value.trim();
  const role = document.querySelector("input[name='role']:checked")?.value;

  const students = getItems();

  const student = students.find(
    (s) => s.email === email && s.password === password && s.role === role
  );

  if (student) {
    localStorage.setItem("currentStudent", JSON.stringify(student));

    window.location.href = "../student/student-profile.html";
  } else {
    alert("Email or password or Role is incorrect ❌");
  }
});
