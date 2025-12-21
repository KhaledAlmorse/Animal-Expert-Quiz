const result = JSON.parse(localStorage.getItem("examResult"));
const exam = JSON.parse(localStorage.getItem("currentExam"));

if (result && exam) {
  document.getElementById("score").textContent = result.score;
  document.getElementById(
    "total"
  ).textContent = `out of ${result.total} points`;

  let correct = 0;
  let incorrect = 0;

  exam.questions.forEach((q, i) => {
    if (q.correctAnswer === q.selectedAnswer) correct++;
    else incorrect++;
  });

  correct = Math.round(
    (result.score / exam.totalScore) * exam.questions.length
  );
  incorrect = exam.questions.length - correct;

  document.getElementById("correctCount").textContent = `${correct} Correct`;
  document.getElementById(
    "incorrectCount"
  ).textContent = `${incorrect} Incorrect`;

  const percent = (result.score / result.total) * 100;
  const message =
    percent >= 80
      ? "Excellent Work 🎉"
      : percent >= 50
      ? "Good Job 👍"
      : "Keep Trying 💪";
  document.getElementById("resultMessage").textContent = message;
}
