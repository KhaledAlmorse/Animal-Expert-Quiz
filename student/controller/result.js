const exam = JSON.parse(localStorage.getItem("currentExam"));
const student = JSON.parse(localStorage.getItem("currentStudent"));

const resultMessage = document.getElementById("resultMessage");
const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const correctEl = document.getElementById("correctCount");
const incorrectEl = document.getElementById("incorrectCount");


if (!exam || !student) {
  resultMessage.textContent = "No exam data found ❌";
  throw new Error("Missing data");
}

if (!exam.results || !Array.isArray(exam.results)) {
  resultMessage.textContent = "No results available ❌";
  throw new Error("No results");
}


const result = exam.results.find(
  (r) => Number(r.studentId) === Number(student.id)
);

if (!result) {
  resultMessage.textContent = "Result not found ❌";
  throw new Error("Result not found");
}


let correct = 0;
let incorrect = 0;

exam.questions.forEach((q) => {
  if (q.selectedAnswer === q.correctAnswer) {
    correct++;
  } else {
    incorrect++;
  }
});


scoreEl.textContent = result.score;
totalEl.textContent = `out of ${exam.totalScore} points`;

correctEl.textContent = `${correct} Correct`;
incorrectEl.textContent = `${incorrect} Incorrect`;


const percent = (result.score / exam.totalScore) * 100;

if (percent >= 80) {
  resultMessage.textContent = "Excellent Work 🎉";
} else if (percent >= 50) {
  resultMessage.textContent = "Good Job 👍";
} else {
  resultMessage.textContent = "Keep Trying 💪";
}
