import StorageService from "../../utils/storage.js";
import ExamTimer from "../../utils/timer.js";
import RandomService from "../../utils/random.js";

let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;
let exam;
let timer;

async function initExam() {
  await StorageService.loadJSON("exams");

  const exams = StorageService.get("exams") || [];
  const examId = Number(localStorage.getItem("currentExamId"));

  exam = exams.find((e) => Number(e.id) === examId);
  if (!exam) {
    alert("Exam not found!");
    return;
  }

  exam = RandomService.shuffleExam(exam);
  StorageService.set("currentExam", exam);

  timer = new ExamTimer(exam.totalTime, finishExam);
  timer.start();

  renderQuestion();
}

function renderQuestion() {
  const question = exam.questions[currentQuestionIndex];

  // Counter
  document.getElementById("questionCounter").textContent =
    `Question ${currentQuestionIndex + 1} of ${exam.questions.length}`;

  // Difficulty
  const diffEl = document.getElementById("questionDifficulty");
  if (question.difficulty === "easy") {
    diffEl.textContent = "Difficulty: Easy";
    diffEl.className = "text-sm font-semibold text-green-400";
  } else if (question.difficulty === "medium") {
    diffEl.textContent = "Difficulty: Medium";
    diffEl.className = "text-sm font-semibold text-yellow-400";
  } else if (question.difficulty === "hard") {
    diffEl.textContent = "Difficulty: Hard";
    diffEl.className = "text-sm font-semibold text-red-400";
  } else {
    diffEl.textContent = "";
  }

  // Question text
  document.getElementById("questionText").textContent = question.text;

  
  const imageContainer = document.getElementById("imageContainer");
  const questionImage = document.getElementById("questionImage");

  if (question.image) {
    questionImage.src = question.image;
    imageContainer.classList.remove("hidden");
  } else {
    imageContainer.classList.add("hidden");
  }

  // Options
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  selectedAnswer = null;

  question.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className =
      "w-full flex items-center gap-4 rounded-xl border border-gray-600 bg-gray-800 px-4 py-4 text-left transition hover:bg-gray-700";

    btn.innerHTML = `
      <span class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white font-bold">
        ${String.fromCharCode(65 + index)}
      </span>
      <span>${choice}</span>
    `;

    btn.onclick = () => handleAnswer(btn, index, question);
    optionsDiv.appendChild(btn);
  });

  updateNextButton();
}

function handleAnswer(btn, index, question) {
  if (selectedAnswer !== null) return;

  selectedAnswer = index;
  question.selectedAnswer = index;

  if (index === question.correctAnswer) {
    btn.classList.add("bg-green-600", "border-green-500");
    score += question.score || 1;
  } else {
    btn.classList.add("bg-red-600", "border-red-500");
    const correctBtn =
      document.getElementById("options").children[question.correctAnswer];
    if (correctBtn) {
      correctBtn.classList.add("bg-green-600", "border-green-500");
    }
  }
}

function updateNextButton() {
  const nextBtn = document.getElementById("nextBtn");
  nextBtn.textContent =
    currentQuestionIndex === exam.questions.length - 1
      ? "Finish Exam ✔"
      : "Next Question →";
}

document.getElementById("nextBtn").onclick = () => {
  if (selectedAnswer === null) {
    alert("Choose an answer first");
    return;
  }

  currentQuestionIndex++;
  currentQuestionIndex < exam.questions.length
    ? renderQuestion()
    : finishExam();
};

function finishExam() {
  timer.stop();
  localStorage.removeItem("remainingTime");

  const student = JSON.parse(localStorage.getItem("currentStudent"));
  if (!student) return;


  exam.results = exam.results || [];

  exam.results.push({
    studentId: Number(student.id),
    score,
    total: exam.totalScore,
  });

  localStorage.setItem("currentExam", JSON.stringify(exam));


  student.completedExams = student.completedExams || [];
  student.completedExams.push({
    examId: exam.id,
    examName: exam.title,
    score,
    total: exam.totalScore,
    date: new Date().toLocaleDateString(),
  });

 
  if (student.assignedExams) {
    student.assignedExams = student.assignedExams.filter(
      (id) => Number(id) !== Number(exam.id)
    );
  }

  localStorage.setItem("currentStudent", JSON.stringify(student));

  window.location.href = "../view/result.html";
}


initExam();
