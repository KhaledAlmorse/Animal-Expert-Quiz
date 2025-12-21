export default class ExamTimer {
  constructor(totalTime, onFinish) {
    this.totalTime = totalTime;
    this.onFinish = onFinish;
    this.remainingTime =
      Number(localStorage.getItem("remainingTime")) || totalTime;
    this.interval = null;
  }

  start() {
    this.updateUI();

    this.interval = setInterval(() => {
      this.remainingTime--;
      localStorage.setItem("remainingTime", this.remainingTime);
      this.updateUI();

      if (this.remainingTime <= 0) {
        this.stop();
        this.onFinish();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }

  updateUI() {
    const min = Math.floor(this.remainingTime / 60);
    const sec = this.remainingTime % 60;

    document.getElementById("timer").textContent = `${min}:${sec
      .toString()
      .padStart(2, "0")}`;

    const percent = (this.remainingTime / this.totalTime) * 100;

    document.getElementById("timeProgress").style.width = `${percent}%`;
  }
}
