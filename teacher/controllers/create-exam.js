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

class Exam {
  constructor(id, title, teacherId, totalTime) {
    this.id = id;
    this.title = title;
    this.teacherId = teacherId;
    this.totalTime = totalTime;
    this.questionTime = 0;
    this.totalScore = 0;
    this.questions = [];
    this.assignedStudents = [];
    this.results = [];
  }

  addQuestion(question) {
    this.questions.push(question);
    this.totalScore += question.score;
    console.log(this.totalScore);
  }

  isValid(minQuestions = 15) {
    if (!this.title) return "Exam title is required";
    if (this.totalTime <= 0) return "Duration must be greater than 0";
    if (this.questions.length < minQuestions)
      return `Exam must have at least ${minQuestions} questions`;
    if (this.totalScore !== 100) return "Total score of exam must equal 100";
    return null;
  }
}

function showError(message) {
  alert(message);
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function updateSummary() {
  document.getElementById("questionsCountLabel").textContent = questions.length;
  document.getElementById("totalScoreLabel").textContent = totalScore;
}

async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "exam_images"); 
  formData.append("folder", "exam_questions");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dzpcxko3l/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Image upload failed");

  const data = await res.json();
  return data.secure_url;
}



let questions = [];
let totalScore = 0;

document.querySelector("button[type='button']").addEventListener(
  "click",
  async () => {
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

    if (!text || choices.some(c => !c))
      return showError("Question text and all answers are required");

    if (isNaN(correctAnswer))
      return showError("Select correct answer");

    if (score <= 0)
      return showError("Score must be greater than 0");

    if (totalScore + score > 100)
      return showError("Total exam score cannot exceed 100");

    let imageUrl = null;
    const imageInput = document.getElementById("questionImage");

    if (imageInput.files.length > 0) {
      try {
        imageUrl = await uploadImageToCloudinary(imageInput.files[0]);
      } catch (err) {
        return showError("Failed to upload image");
      }
    }

    const question = new Question(
      questions.length + 1,
      text,
      imageUrl, 
      difficulty,
      score,
      choices,
      correctAnswer
    );

    questions.push(question);
    totalScore += score;

    renderQuestions();
    updateSummary();
    clearQuestionForm();
  }
);



document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = getValue("examTitle");
  const duration = Number(getValue("examDuration")) * 60;
  const questionsCount = Number(getValue("questionsCount"));

  const exams = JSON.parse(localStorage.getItem("exams")) || [];

  const exam = new Exam(
    exams.length + 1,
    title,
    1, 
    duration
  );

  questions.forEach((q) => exam.addQuestion(q));

  exam.questionTime = duration / exam.questions.length;

  const error = exam.isValid(questionsCount);
  if (error) return showError(error);

  exams.push(exam);
  localStorage.setItem("exams", JSON.stringify(exams));

  alert("Exam Saved Successfully!");
  window.location.href = "exams.html";
});

function renderQuestions() {
  const container = document.getElementById("questionsList");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "bg-white border p-4 rounded flex justify-between items-start";

    div.innerHTML = `
      <div>
        <p class="font-semibold">Q${index + 1}: ${q.text}</p>
        <p class="text-sm text-gray-600">
          Difficulty: ${q.difficulty} | Score: ${q.score}
        </p>
      </div>
      <button 
        onclick="removeQuestion(${index})"
        class="text-red-600 text-sm"
      >
        Remove
      </button>
    `;

    container.appendChild(div);
  });
}

function removeQuestion(index) {
  totalScore -= questions[index].score;
  questions.splice(index, 1);

  questions.forEach((q, i) => (q.id = i + 1));

  renderQuestions();
  updateSummary();
}

function clearQuestionForm() {
  ["questionText", "a", "b", "c", "d", "questionScore"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("correctAnswer").value = "";
}
