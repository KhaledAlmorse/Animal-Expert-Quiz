import StorageService from "../utils/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  new LoginController();
});

/* ================= Auth Service ================= */
class AuthService {
  async login(role, email, password) {
    await StorageService.loadJSON(role + "s");

    const users = StorageService.get(role + "s");

    return users.find(
      (user) => user.email === email && user.password === password
    );
  }
}

/* ================= Login Controller ================= */
class LoginController {
  constructor() {
    this.form = document.getElementById("loginForm");

    if (!this.form) {
      console.error("Login form not found");
      return;
    }

    this.authService = new AuthService();
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const email = document.querySelector("input[type=email]").value.trim();
    const password = document
      .querySelector("input[type=password]")
      .value.trim();
    const role = document.querySelector("input[name='role']:checked")?.value;

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!role) {
      alert("Please select role");
      return;
    }

    const user = await this.authService.login(role, email, password);

    if (!user) {
      alert("Email or password incorrect ❌");
      return;
    }

    await this.redirectUser(role, user);
  }

  async redirectUser(role, user) {
    if (role === "student") {
      await StorageService.loadJSON("exams");
      StorageService.set("currentStudent", user);
      window.location.href = "../student/student-profile.html";
      return;
    }

    if (role === "teacher") {
      StorageService.set("currentTeacher", user);
      window.location.href = "../teacher/teacher-dashboard.html";
    }
  }
}
