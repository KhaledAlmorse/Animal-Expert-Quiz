import StorageService from "../../utils/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  new RegisterController();
});


class StudentService {
  constructor() {
    this.students = StorageService.get("students") || [];
  }

  emailExists(email) {
    return this.students.some(
      (student) => student.email.toLowerCase() === email.toLowerCase()
    );
  }

  addStudent(student) {
    student.id = Date.now();
    this.students.push(student);

    StorageService.set("students", this.students);
    StorageService.set("currentStudent", student);
  }
}


class RegisterController {
  constructor() {
    this.form = document.getElementById("registerForm");
    this.fileInput = document.getElementById("profileImage");
    this.profileBase64 = "";

    if (!this.form) {
      console.error("Register form not found");
      return;
    }

    this.init();
  }

  async init() {
    await StorageService.loadJSON("students").catch(() => {});
    this.studentService = new StudentService();

    this.setupImagePreview();
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    const student = this.getFormData();
    if (!student) return;

    if (this.studentService.emailExists(student.email)) {
      alert("This email is already registered.");
      return;
    }

    this.studentService.addStudent(student);

    window.location.href = "/student/view/student-profile.html";
  }

  setupImagePreview() {
    if (!this.fileInput) return;

    this.preview = document.createElement("img");
    this.preview.className = "mt-3 rounded-full";
    this.preview.style.width = "100px";
    this.preview.style.height = "100px";
    this.preview.style.display = "none";

    this.fileInput.parentElement.appendChild(this.preview);

    this.fileInput.addEventListener("change", () => {
      const file = this.fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.profileBase64 = reader.result;
        this.preview.src = reader.result;
        this.preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }


  getFormData() {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const grade = document.getElementById("grade").value;
    const mobile = document.getElementById("mobile").value.trim();

    if (!username || !email || !password || !grade || !mobile) {
      alert("Please fill in all fields.");
      return null;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return null;
    }

    if (!/^\d{11}$/.test(mobile)) {
      alert("Mobile number must be 11 digits.");
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
