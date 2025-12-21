const params = new URLSearchParams(window.location.search);
const examId = Number(params.get("id"));

const exams = JSON.parse(localStorage.getItem("exams")) || [];
const exam = exams.find(e => e.id === examId);

if (!exam) {
  document.body.innerHTML = "<h1 class='text-center mt-20'>Exam Not Found</h1>";
  throw new Error("Exam not found");
}

document.getElementById("examTitle").textContent = exam.title;
document.getElementById("examDuration").textContent = exam.totalTime / 60;
document.getElementById("examQuestions").textContent = exam.questions.length;
document.getElementById("examGrade").textContent = exam.totalScore;
document.getElementById("resultsBtn").href += exam.id;
document.getElementById("assignBtn").href += exam.id;


const container = document.getElementById("questionsContainer");

exam.questions.forEach((q, index) => {
  const div = document.createElement("div");
  div.className = "bg-white p-5 rounded shadow";

  let choicesHTML = "";
  q.choices.forEach((choice, i) => {
    const isCorrect = i === q.correctAnswer;
    choicesHTML += `
      <li class="${isCorrect ? "text-green-600 font-semibold" : ""}">
        ${choice} ${isCorrect ? "(Correct)" : ""}
      </li>
    `;
  });

  div.innerHTML = `
    <p class="font-semibold">Q${index + 1}: ${q.text}</p>
    <ul class="ml-4 list-disc mt-2">
      ${choicesHTML}
    </ul>
    <div class="mt-2 text-sm text-gray-600">
      Difficulty: ${q.difficulty} | Score: ${q.score}
    </div>
  `;

  container.appendChild(div);
});
