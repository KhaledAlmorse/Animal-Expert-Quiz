document.addEventListener("DOMContentLoaded", async () => {
  async function loadJSON(database) {
    if (!localStorage.getItem(database)) {
      const res = await fetch(`../db/${database}.json`);
      const data = await res.json();
      localStorage.setItem(database, JSON.stringify(data));
    }
  }

  function getItems(database) {
    return JSON.parse(localStorage.getItem(database)) || [];
  }

  await loadJSON("students");
  let students = getItems("students");

  const form = document.getElementById("registerForm");
  const fileInput = document.querySelector("input[type=file]");

  if (!form) {
    console.error("Register form not found");
    return;
  }

  let profileBase64 = "";

  if (fileInput) {
    const preview = document.createElement("img");
    preview.style.width = "100px";
    preview.style.height = "100px";
    preview.style.display = "none";
    preview.style.marginTop = "10px";
    fileInput.parentElement.appendChild(preview);

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        profileBase64 = reader.result;
        preview.src = profileBase64;
      };
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.querySelector("input[type=text]").value.trim();
    const email = document.querySelector("input[type=email]").value.trim();
    const password = document
      .querySelector("input[type=password]")
      .value.trim();
    const grade = document.querySelector("select").value;
    const mobile = document.querySelector("input[type=tel]").value.trim();

    if (!username || !email || !password || !grade || !mobile) {
      alert("Please fill all fields!");
      return;
    }

    const newStudent = {
      id: students.length ? students[students.length - 1].id + 1 : 1,
      username,
      email,
      password,
      mobile,
      grade,
      role: "student",
      profileImage: profileBase64,
      assignedExams: [],
      completedExams: [],
    };

    students.push(newStudent);
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("currentStudent", JSON.stringify(newStudent));

    window.location.href = "../student/student-profile.html";
  });
});
