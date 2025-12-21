const profileImage = document.getElementById("profileImage");
const studentName = document.getElementById("studentName");
const gradeInfo = document.getElementById("gradeInfo");
const roleInfo = document.getElementById("roleInfo");
const personalDetails = document.getElementById("personalDetails");
const logoutBtn = document.getElementById("logoutBtn");
const upcomingExamsDiv = document.getElementById("upcomingExams");
const completedExamsDiv = document.getElementById("completedExams");

const student = JSON.parse(localStorage.getItem("currentStudent") || "null");
const exams = JSON.parse(localStorage.getItem("exams") || "[]");

if (!student) {
  alert("Please login first!");
  window.location.href = "login.html";
}

function renderStudentInfo() {
  profileImage.src =
    student.profileImage || "../../assets/images/Khaled Elmorse Manea.jpg";
  studentName.textContent = student.username;
  gradeInfo.textContent = `Grade: ${student.grade}`;
  roleInfo.textContent = `Role: ${student.role}`;

  personalDetails.innerHTML = `
    <p><span class="text-gray-400">Email:</span> ${student.email}</p>
    <p><span class="text-gray-400">Mobile:</span> ${student.mobile}</p>
  `;
}

function renderUpcomingExams() {
  upcomingExamsDiv.innerHTML = "";
  if (student.assignedExams?.length > 0) {
    student.assignedExams.forEach((examId) => {
      const examData = exams.find((e) => e.id == examId);
      if (!examData) return;

      const card = document.createElement("div");
      card.className =
        "bg-indigo-500/10 p-4 rounded-xl flex justify-between items-center mb-4";
      card.innerHTML = `
        <div>
          <h4 class="font-semibold text-indigo-300">${examData.title}</h4>
          <p class="text-sm text-gray-400">
            ${Math.floor(examData.totalTime / 60)} minutes •
            ${examData.questions.length} questions •
            Score: ${examData.totalScore}
          </p>
        </div>
        <button class="start-exam-btn rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 transition" 
          data-exam-id="${examData.id}">
          Start
        </button>
      `;
      upcomingExamsDiv.appendChild(card);
    });
  } else {
    upcomingExamsDiv.innerHTML = `<p class='text-gray-400 p-4'>No upcoming exams assigned</p>`;
  }
}

function renderCompletedExams() {
  completedExamsDiv.innerHTML = "";

  if (student.completedExams?.length > 0) {
    const title = document.createElement("h3");
    title.className = "text-green-300 font-semibold mb-3";
    completedExamsDiv.appendChild(title);

    const viewBtn = document.createElement("button");
    viewBtn.className =
      "view-result-btn w-full rounded-md border border-green-500 text-green-400 px-4 py-2 font-semibold hover:bg-green-500 hover:text-white transition";
    viewBtn.textContent = "View Result";

    completedExamsDiv.appendChild(viewBtn);
  } else {
    completedExamsDiv.innerHTML = `<p class='text-gray-400 p-4'>No completed exams yet</p>`;
  }
}

renderStudentInfo();
renderUpcomingExams();
renderCompletedExams();

upcomingExamsDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("start-exam-btn")) {
    localStorage.setItem("currentExamId", e.target.dataset.examId);
    window.location.href = "../view/take-exam.html";
  }
});

completedExamsDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-result-btn")) {
    const examResult = student.completedExams[e.target.dataset.examIndex];
    localStorage.setItem("examResult", JSON.stringify(examResult));
    window.location.href = "../view/completed-exams.html";
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentStudent");
  window.location.href = "../../auth/view/login.html";
});
