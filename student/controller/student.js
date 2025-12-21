import StorageService from "../../utils/storage.js";

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
  window.location.href = "../auth/view/login.html";
}

function renderStudentInfo() {
  profileImage.src = student.profileImage || "../assets/images/placeholder.png";
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
    student.completedExams.forEach((examResult, index) => {
      const examData = exams.find((e) => e.id == examResult.examId);
      if (!examData) return;

      const card = document.createElement("div");
      card.className =
        "bg-green-500/10 p-4 rounded-xl flex justify-between items-center mb-2";
      card.innerHTML = `
        <div>
          <h4 class="font-semibold text-green-300">${examData.title}</h4>
          <p class="text-sm text-gray-400">
            Score: ${examResult.score} / ${examData.totalScore} • Submitted: ${examResult.submittedAt}
          </p>
        </div>
        <button class="view-result-btn rounded-lg border border-green-500 px-4 py-2 text-sm font-semibold text-green-400 hover:bg-green-500 hover:text-white transition"
          data-exam-id="${examData.id}">
          View Result
        </button>
      `;
      completedExamsDiv.appendChild(card);
    });
  } else {
    completedExamsDiv.innerHTML = `<p class='text-gray-400 p-4'>No completed exams yet</p>`;
  }
}

upcomingExamsDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("start-exam-btn")) {
    localStorage.setItem("currentExamId", e.target.dataset.examId);
    window.location.href = "../view/take-exam.html";
  }
});

completedExamsDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-result-btn")) {
    const examId = parseInt(e.target.dataset.examId);
    const examData = exams.find((e) => e.id === examId);
    const result = examData.results?.find((r) => r.studentId === student.id);

    if (!result) {
      alert("No result found for this exam.");
      return;
    }

    localStorage.setItem("currentExam", JSON.stringify(examData));
    localStorage.setItem("examResult", JSON.stringify(result));
    window.location.href = "../view/result.html";
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentStudent");
  window.location.href = "../auth/view/login.html";
});

renderStudentInfo();
renderUpcomingExams();
renderCompletedExams();
