import { use, useEffect, useRef, useState } from "react";
import "./App.css";
import questions from "./mocks/questions.json";

function App() {
  const [visibleAnswers, setVisibleAnswers] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [shown, setShown] = useState([]);
  const _questions = randomQuestions;
  let slicedQuestions = _questions.slice(
    currentQuestionIndex,
    currentQuestionIndex + 1
  );

  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(10).fill(undefined)
  );

  slicedQuestions = _questions.slice(
    currentQuestionIndex,
    currentQuestionIndex + 1
  );

  useEffect(() => {
    randomQuestionsIdx();
  }, []);

  const randomQuestionsIdx = () => {
    const randomIdx = [];
    const randomQuestions = [];
    const totalQuestionsCount = questions.length - 1;

    while (randomQuestions.length !== selectedAnswers.length) {
      // check idx is unique
      // yes, push that quest to randomQuestions nd idx to rQIdx
      let idx = Math.ceil(Math.random() * totalQuestionsCount);
      if (!randomIdx.includes(idx)) {
        randomIdx.push(idx);
        randomQuestions.push(questions[idx]);
      }
    }

    const questionsNotShowned = randomQuestions.filter(
      (quest) => quest.shown !== true
    );
    const newRandomQues = questionsNotShowned.map((ques, idx) =>
      ques.show !== true ? { ...ques, shown: true } : ques
    );
    setRandomQuestions(newRandomQues);
  };

  const handleCheckAnswers = () => {
    const hasUnansweredQuestion = selectedAnswers.every(
      (answer) => answer !== undefined
    );

    if (hasUnansweredQuestion) {
      const wrongAnswers = _questions.filter(
        (ques, idx) => ques.answer !== selectedAnswers[idx]
      );

      const correctAnswers = _questions.length - wrongAnswers.length;
      setVisibleAnswers(true);
      setShowResult(true);
      setCorrectAnswers(correctAnswers);
    } else {
      let unansweredWarningMsg = "one or more questions you doesn't selected";
      if (confirm(unansweredWarningMsg) === true) {
        const wrongAnswers = _questions.filter(
          (ques, idx) => ques.answer !== selectedAnswers[idx]
        );
        const correctAnswers = _questions.length - wrongAnswers.length;

        setShowResult(true);
        setCorrectAnswers(correctAnswers);
        setVisibleAnswers(true);
      } else {
        setVisibleAnswers(false);
        setShowResult(false);
      }
    }
  };

  const handleAnswerSelection = (e, id) => {
    const selectedAnswersCopy = structuredClone(selectedAnswers);
    selectedAnswersCopy[id] = e.target.value;
    setSelectedAnswers(selectedAnswersCopy);
  };

  const handlePrevQuestions = () => {
    const prevQuestionIndex = currentQuestionIndex - 1;
    if (prevQuestionIndex >= 0) {
      setCurrentQuestionIndex(prevQuestionIndex);
      slicedQuestions = _questions.slice(
        prevQuestionIndex,
        prevQuestionIndex + 1
      );
    } else {
      alert("This is the first question.");
    }
  };

  const handleReset = () => {
    setVisibleAnswers(false);
    setShowResult(false);
    setCurrentQuestionIndex(0);
    slicedQuestions = _questions.slice(0, 1);
    setSelectedAnswers(new Array(10).fill(undefined));
    setCorrectAnswers(0);
  };

  const handleNextQuestionChange = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < _questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      slicedQuestions = _questions.slice(
        nextQuestionIndex,
        nextQuestionIndex + 1
      );
    } else {
      alert("No more questions available.");
    }
  };

  return (
    <>
      {" "}
      <h3 className="heading">Quizify</h3>
      <div className="quizify">
        {showResult === false && currentQuestionIndex <= 0 && (
          <button onClick={randomQuestionsIdx}>shuffleQuiz</button>
        )}

        {showResult && selectedAnswers.length > 0 && (
          <>
            <h3 style={{ textAlign: "center", color: "green" }}>
              You answered {correctAnswers} out of {_questions.length} questions
              correctly.{" "}
            </h3>
          </>
        )}
        {slicedQuestions.map((ques, idx) => (
          <div key={ques.id} className="questionBlock">
            <p className="questions">
              {currentQuestionIndex + 1}.{ques.question}
            </p>
            <div className="optionsContainer">
              {ques.options.map((option, i) => (
                <div
                  key={i}
                  className={`options ${
                    showResult
                      ? ques.answer === option
                        ? "correctAnswer"
                        : selectedAnswers[currentQuestionIndex] === option
                        ? "wrongAnswer"
                        : ""
                      : selectedAnswers[currentQuestionIndex] === option
                      ? "selectedOption"
                      : ""
                  }`}
                >
                  <label className="optionField">
                    <input
                      className="inputOption"
                      disabled={showResult === true}
                      type="radio"
                      value={option}
                      checked={selectedAnswers[currentQuestionIndex] === option}
                      onChange={(e) =>
                        handleAnswerSelection(e, currentQuestionIndex)
                      }
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="btnFooter">
          {currentQuestionIndex > 0 && (
            <button className="button" onClick={handlePrevQuestions}>
              Previous
            </button>
          )}
          {currentQuestionIndex === _questions.length - 1 && (
            <button className="button" onClick={() => handleCheckAnswers()}>
              Submit
            </button>
          )}
          {currentQuestionIndex < _questions.length - 1 && (
            <button className="button" onClick={handleNextQuestionChange}>
              Next
            </button>
          )}
          {currentQuestionIndex === _questions.length - 1 && (
            <button className="button" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
