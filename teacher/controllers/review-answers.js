const params = new URLSearchParams(window.location.search);
const examId = Number(params.get("examId"));
const studentId = Number(params.get("studentId"));

const exams = JSON.parse(localStorage.getItem("exams")) || [];
const users = JSON.parse(localStorage.getItem("students")) || [];

const exam = exams.find((e) => e.id === examId);
const student = users.find((u) => u.id === studentId);

if (!exam || !student) {
  alert("Invalid review request");
  location.href = "exams.html";
}

const result = exam.results.find((r) => r.studentId === studentId);
const container = document.getElementById("answersContainer");

if (!result || !result.answers) {
  container.innerHTML = `
    <p class="text-gray-500">No answers available for review</p>
  `;
} else {
  result.answers.forEach((answer) => {
    const question = exam.questions.find((q) => q.id === answer.questionId);

    container.innerHTML += `
      <div class="bg-white p-6 rounded shadow">
        <p><strong>Question:</strong> ${question.text}</p>
        <p>
          <strong>Student Answer:</strong>
          ${question.choices[answer.selected]}
        </p>
        <p class="${answer.correct ? "text-green-600" : "text-red-600"}">
          <strong>Correct Answer:</strong>
          ${question.choices[question.correctAnswer]}
        </p>
      </div>
    `;
  });
}
