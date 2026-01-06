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
  const examId = parseInt(localStorage.getItem("currentExamId"));

  exam = exams.find((e) => e.id === examId);

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

  document.getElementById("questionText").textContent = question.text;

  const imageContainer = document.getElementById("imageContainer");
  const questionImage = document.getElementById("questionImage");

  if (question.image) {
    questionImage.src = question.image;
    imageContainer.classList.remove("hidden");
  } else {
    imageContainer.classList.add("hidden");
  }

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  selectedAnswer = null;

  const choices = question.choices || [];

  if (choices.length === 0) {
    optionsDiv.innerHTML =
      "<p class='text-gray-400'>No choices available for this question</p>";
    document.getElementById("nextBtn").disabled = true;
    return;
  } else {
    document.getElementById("nextBtn").disabled = false;
  }

  choices.forEach((choice, index) => {
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

  const questionScore = question.score || 1;

  if (index === question.correctAnswer) {
    btn.classList.add("bg-green-600", "border-green-500");
    score += questionScore;
  } else {
    btn.classList.add("bg-red-600", "border-red-500");
    const correctBtn =
      document.getElementById("options").children[question.correctAnswer];
    if (correctBtn)
      correctBtn.classList.add("bg-green-600", "border-green-500");
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

  if (currentQuestionIndex < exam.questions.length) {
    renderQuestion();
  } else {
    finishExam();
  }
};

function finishExam() {
  timer.stop();
  localStorage.removeItem("remainingTime");

  const student = JSON.parse(localStorage.getItem("currentStudent"));
  const studentId = student?.id || null;

  const answers = exam.questions.map((q) => ({
    questionId: q.id,
    selected: q.selectedAnswer ?? null,
    correct: q.selectedAnswer === q.correctAnswer,
  }));

  const examResult = {
    studentId,
    score,
    submittedAt: new Date().toLocaleDateString(),
    answers,
  };

  exam.results = exam.results || [];
  exam.results.push(examResult);

  let exams = StorageService.get("exams") || [];
  const examIndex = exams.findIndex((e) => e.id === exam.id);
  if (examIndex !== -1) {
    exams[examIndex] = exam;
    StorageService.set("exams", exams);
  }

  localStorage.setItem("currentExam", JSON.stringify(exam));

  if (student) {
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
        (id) => id !== exam.id
      );
    }

    localStorage.setItem("currentStudent", JSON.stringify(student));
  }

  console.log("Exams with results:", JSON.parse(localStorage.getItem("exams")));

  window.location.href = "../view/result.html";
}

initExam();
