const exam = JSON.parse(localStorage.getItem("currentExam"));
const student = JSON.parse(localStorage.getItem("currentStudent"));

if (exam && student) {
  const result = exam.results.find((r) => r.studentId === student.id);

  if (!result) {
    console.log("No results found for this student.");
  } else {
    document.getElementById("score").textContent = result.score;
    document.getElementById(
      "total"
    ).textContent = `out of ${exam.totalScore} points`;

    let correct = 0;
    let incorrect = 0;

    result.answers.forEach((ans) => {
      if (ans.correct) correct++;
      else incorrect++;
    });

    document.getElementById("correctCount").textContent = `${correct} Correct`;
    document.getElementById(
      "incorrectCount"
    ).textContent = `${incorrect} Incorrect`;

    const percent = (result.score / exam.totalScore) * 100;
    const message =
      percent >= 80
        ? "Excellent Work 🎉"
        : percent >= 50
        ? "Good Job 👍"
        : "Keep Trying 💪";
    document.getElementById("resultMessage").textContent = message;

    // عرض كل سؤال وإجاباته
    const tbody = document.getElementById("answersTableBody");
    exam.questions.forEach((q) => {
      const studentAnswer = result.answers.find((a) => a.questionId === q.id);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-6 py-2">${q.text}</td>
        <td class="px-6 py-2">${q.choices[q.correctAnswer]}</td>
        <td class="px-6 py-2">${
          studentAnswer ? q.choices[studentAnswer.selected] : "Not Answered"
        }</td>
        <td class="px-6 py-2">${
          studentAnswer ? (studentAnswer.correct ? "✔" : "✖") : "-"
        }</td>
      `;
      tbody.appendChild(row);
    });
  }
} else {
  console.log("Exam or student data not found in localStorage.");
}
