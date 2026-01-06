export default class RandomService {
  static shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  static shuffleChoices(question) {
    const choicesWithIndex = question.choices.map((choice, index) => ({
      choice,
      index,
    }));

    const shuffled = RandomService.shuffleArray(choicesWithIndex);

    question.choices = shuffled.map((item) => item.choice);
    question.correctAnswer = shuffled.findIndex(
      (item) => item.index === question.correctAnswer
    );

    return question;
  }

  static shuffleExam(exam) {
    exam.questions = RandomService.shuffleArray(exam.questions).map((q) =>
      RandomService.shuffleChoices(q)
    );

    return exam;
  }
}
