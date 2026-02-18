// Test Generator Application
class TestGenerator {
    constructor() {
        this.questions = [];
    }

    addQuestion(question, options, answer) {
        this.questions.push({ question, options, answer });
    }

    generateTest() {
        let test = '';
        this.questions.forEach((q, index) => {
            test += `Q${index + 1}: ${q.question}\n`;
            q.options.forEach((option, i) => {
                test += `   ${String.fromCharCode(65 + i)}. ${option}\n`; // A, B, C, ...
            });
        });
        return test;
    }

    checkAnswer(questionIndex, selectedOption) {
        const correctAnswer = this.questions[questionIndex].answer;
        return selectedOption === correctAnswer;
    }
}

// Example of using the TestGenerator
const testGen = new TestGenerator();

testGen.addQuestion("What is the capital of France?", ["Berlin", "Madrid", "Paris", "Lisbon"], "C");
testGen.addQuestion("Which planet is known as the Red Planet?", ["Earth", "Mars", "Jupiter", "Saturn"], "B");

console.log(testGen.generateTest());