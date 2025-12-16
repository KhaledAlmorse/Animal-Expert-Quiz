// عناصر الصفحة
const profileImage = document.getElementById("profileImage");
const studentName = document.getElementById("studentName");
const gradeInfo = document.getElementById("gradeInfo");
const roleInfo = document.getElementById("roleInfo");
const personalDetails = document.getElementById("personalDetails");

const logoutBtn = document.getElementById("logoutBtn");

const student = JSON.parse(localStorage.getItem("currentStudent"));

if (!student) {
  alert("Please login first!");
  window.location.href = "login.html";
} else {
  profileImage.src = student.profileImage || "../assets/images/placeholder.png";

  studentName.textContent = student.username;
  gradeInfo.textContent = `Grade: ${student.grade}`;
  roleInfo.textContent = `Role: ${student.role}`;

  personalDetails.innerHTML = `
    <p><span class="text-gray-400">Email:</span> ${student.email}</p>
    <p><span class="text-gray-400">Mobile:</span> ${student.mobile}</p>
  `;
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentStudent");
  window.location.href = "../auth/login.html";
});
