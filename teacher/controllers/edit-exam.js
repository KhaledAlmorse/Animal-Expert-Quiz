
class Question {
  constructor(id, text, image_url, difficulty, score, choices, correctAnswer) {
    this.id = id;
    this.text = text;
    this.image = image_url;
    this.difficulty = difficulty;
    this.score = score;
    this.choices = choices;
    this.correctAnswer = correctAnswer;
  }
}


function getValue(id) {
  return document.getElementById(id).value.trim();
}

function showError(message) {
  alert(message);
}

function updateSummary() {
  document.getElementById("questionsCountLabel").textContent = questions.length;
  document.getElementById("totalScoreLabel").textContent = totalScore;
}

function clearQuestionForm() {
  ["questionText", "a", "b", "c", "d", "questionScore"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("correctAnswer").value = "";
  document.getElementById("difficulty").value = "";
}


const params = new URLSearchParams(window.location.search);
const examId = Number(params.get("id"));

const exams = JSON.parse(localStorage.getItem("exams")) || [];
const exam = exams.find(e => e.id === examId);

if (!exam) {
  alert("Exam not found");
  location.href = "exams.html";
}

document.getElementById("examTitle").value = exam.title;
document.getElementById("examDuration").value = exam.totalTime / 60;

let questions = [...exam.questions];
let totalScore = questions.reduce((sum, q) => sum + q.score, 0);

renderQuestions();
updateSummary();


let editingIndex = null;
const addBtn = document.querySelector("button[type='button']");

addBtn.addEventListener("click", async () => {
  const text = getValue("questionText");
  const score = Number(getValue("questionScore"));
  const difficulty = getValue("difficulty");
  const correctAnswer = Number(getValue("correctAnswer"));

  const choices = [
    getValue("a"),
    getValue("b"),
    getValue("c"),
    getValue("d"),
  ];

  if (!text) return showError("Question text is required");
  if (choices.some(c => !c)) return showError("All answers are required");
  if (!difficulty) return showError("Select difficulty");
  if (isNaN(correctAnswer)) return showError("Select correct answer");
  if (score <= 0) return showError("Score must be greater than 0");

    let imageUrl = null;
    const imageInput = document.getElementById("questionImage");

    if (imageInput.files.length > 0) {
      try {
        imageUrl = await uploadImageToCloudinary(imageInput.files[0]);
      } catch (err) {
        return showError("Failed to upload image");
      }
    }

  if (editingIndex !== null) {
    totalScore -= questions[editingIndex].score;

    if (totalScore + score > 100) {
      totalScore += questions[editingIndex].score;
      return showError("Total score cannot exceed 100");
    }

    questions[editingIndex] = {
      ...questions[editingIndex],
      text,
      image: imageUrl,
      difficulty,
      score,
      choices,
      correctAnswer,
    };

    totalScore += score;
    editingIndex = null;
    addBtn.textContent = "Add Question";
  }
  else {
    if (totalScore + score > 100)
      return showError("Total score cannot exceed 100");

    questions.push(
      new Question(
        questions.length + 1,
        text,
        imageUrl,
        difficulty,
        score,
        choices,
        correctAnswer
      )
    );

    totalScore += score;
  }

  clearQuestionForm();
  renderQuestions();
  updateSummary();
});


function renderQuestions() {
  const container = document.getElementById("questionsList");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    container.innerHTML += `
      <div class="bg-white border p-4 rounded flex justify-between">
        <div>
          <p class="font-semibold">Q${index + 1}: ${q.text}</p>
          <p class="text-sm text-gray-600">
            Difficulty: ${q.difficulty} | Score: ${q.score}
          </p>
        </div>
        <div>
          <button onclick="editQuestion(${index})" class="text-blue-600 text-sm">
            Edit
          </button>
          <button onclick="removeQuestion(${index})" class="text-red-600 text-sm ml-2">
            Remove
          </button>
        </div>
      </div>
    `;
  });
}

function editQuestion(index) {
  const q = questions[index];
  editingIndex = index;

  document.getElementById("questionText").value = q.text;
  document.getElementById("a").value = q.choices[0];
  document.getElementById("b").value = q.choices[1];
  document.getElementById("c").value = q.choices[2];
  document.getElementById("d").value = q.choices[3];
  document.getElementById("questionScore").value = q.score;
  document.getElementById("correctAnswer").value = q.correctAnswer;
  document.getElementById("difficulty").value = q.difficulty;

  addBtn.textContent = "Update Question";
}

function removeQuestion(index) {
  totalScore -= questions[index].score;
  questions.splice(index, 1);

  questions.forEach((q, i) => (q.id = i + 1));

  renderQuestions();
  updateSummary();
}


document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();

  if (questions.length === 0)
    return showError("Add at least one question");

  if (totalScore !== 100)
    return showError("Total score must equal 100");

  exam.title = getValue("examTitle");
  exam.totalTime = Number(getValue("examDuration")) * 60;
  exam.questions = questions;
  exam.totalScore = totalScore;
  exam.questionTime = exam.totalTime / questions.length;

  localStorage.setItem("exams", JSON.stringify(exams));

  alert("Exam Updated Successfully!");
  location.href = "exams.html";
});
