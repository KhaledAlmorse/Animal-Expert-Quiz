import StorageService from "/utils/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  new RegisterController();
});

class StudentService {
  constructor() {
    this.students = StorageService.get("students");
  }

  addStudent(student) {
    student.id = this.generateId();
    this.students.push(student);
    StorageService.set("students", this.students);
    StorageService.set("currentStudent", student);
  }

  generateId() {
    return this.students.length
      ? this.students[this.students.length - 1].id + 1
      : 1;
  }
}

class RegisterController {
  constructor() {
    this.form = document.getElementById("registerForm");
    this.fileInput = document.querySelector("input[type=file]");
    this.profileBase64 = "";

    if (!this.form) {
      console.error("Register form not found");
      return;
    }

    this.init();
  }

  async init() {
    await StorageService.loadJSON("students");
    this.studentService = new StudentService();
    this.setupImagePreview();
    this.bindEvents();
  }

  setupImagePreview() {
    if (!this.fileInput) return;

    this.preview = document.createElement("img");
    this.preview.style.width = "100px";
    this.preview.style.height = "100px";
    this.preview.style.display = "none";
    this.preview.style.marginTop = "10px";

    this.fileInput.parentElement.appendChild(this.preview);

    this.fileInput.addEventListener("change", () => {
      const file = this.fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.profileBase64 = reader.result;
        this.preview.src = this.profileBase64;
      };
      reader.readAsDataURL(file);
    });
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    const student = this.getFormData();
    if (!student) return;

    this.studentService.addStudent(student);
    window.location.href = "../../student/view/student-profile.html";
  }

  getFormData() {
    const username = document.querySelector("input[type=text]").value.trim();
    const email = document.querySelector("input[type=email]").value.trim();
    const password = document
      .querySelector("input[type=password]")
      .value.trim();
    const grade = document.querySelector("select").value;
    const mobile = document.querySelector("input[type=tel]").value.trim();

    if (!username || !email || !password || !grade || !mobile) {
      alert("Please fill all fields!");
      return null;
    }

    return {
      username,
      email,
      password,
      mobile,
      grade,
      role: "student",
      profileImage: this.profileBase64,
      assignedExams: [],
      completedExams: [],
    };
  }
}
