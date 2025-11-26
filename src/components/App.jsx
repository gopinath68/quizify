import { use, useEffect, useRef, useState } from "react";
import "./App.css";
import questions from "../mocks/questions.json";
import catogerizedQuestions from "../mocks/catogerizedQuestions.json";
import Results from "./Results";
import { useNavigate } from "react-router-dom";

function App({ catogery }) {
  const [visibleAnswers, setVisibleAnswers] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const navigate = useNavigate();
  let [count, setCount] = useState(parseInt(catogery.timeForPerQuestion));
  const timerId = useRef();
  const [shown, setShown] = useState([]);
  const _questions = randomQuestions;
  let slicedQuestions = _questions.slice(
    currentQuestionIndex,
    currentQuestionIndex + 1
  );

  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(parseInt(catogery.noOfQuestions)).fill(undefined)
  );

  slicedQuestions = _questions.slice(
    currentQuestionIndex,
    currentQuestionIndex + 1
  );

  useEffect(() => {
    if (showResult === false && count !== 0) {
      timerId.current = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId.current);
    } else if (count === 0) {
      handleNextQuestionChange();
      setCount(parseInt(catogery.timeForPerQuestion));
    }
    return () => clearInterval(timerId.current);
  }, [count]);

  useEffect(() => {
    randomQuestionsIdx();
  }, []);

  const randomQuestionsIdx = () => {
    setSelectedAnswers(
      new Array(parseInt(catogery.noOfQuestions)).fill(undefined)
    );
    setCount(parseInt(catogery.timeForPerQuestion));
    const randomIdx = [];
    const randomQuestions = [];
    const totalQuestionsCount =
      catogerizedQuestions[catogery.questionsTopic].length - 1;

    while (randomQuestions.length !== selectedAnswers.length) {
      // check idx is unique
      // yes, push that quest to randomQuestions nd idx to rQIdx
      let idx = Math.ceil(Math.random() * totalQuestionsCount);
      if (!randomIdx.includes(idx)) {
        randomIdx.push(idx);
        randomQuestions.push(
          catogerizedQuestions[catogery.questionsTopic][idx]
        );
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
      setResultsVisible(true);
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
        setResultsVisible(true);
        setVisibleAnswers(true);
      } else {
        setVisibleAnswers(false);
        setShowResult(false);
        setResultsVisible(false);
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
    setSelectedAnswers(
      new Array(parseInt(catogery.noOfQuestions)).fill(undefined)
    );
    setCorrectAnswers(0);
    setCount(parseInt(catogery.timeForPerQuestion));
  };

  const handleNavigation = () => {
    navigate("./");
    setResultsVisible(false);
  };

  const handleNextQuestionChange = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < _questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      slicedQuestions = _questions.slice(
        nextQuestionIndex,
        nextQuestionIndex + 1
      );
      setCount(parseInt(catogery.timeForPerQuestion));
    } else {
      // alert("No more questions available.");
      handleCheckAnswers();
    }
  };

  return (
    <>
      <h3 className="heading">Quizify</h3>
      <div id="header">
        {showResult === false && currentQuestionIndex <= 0 && (
          <button className="shuffleQuizBtn" onClick={randomQuestionsIdx}>
            shuffleQuiz
          </button>
        )}
      </div>
      <div className="quizify">
        {showResult && resultsVisible && (
          <div>
            <button className="backHomeBtn" onClick={() => handleNavigation()}>
              back
            </button>
            <Results
              correctAnswers={correctAnswers}
              questionsCount={_questions.length}
              score={
                correctAnswers * catogery.applyWeight -
                catogery.reduceMarkForWrongAnswer
              }
            />
          </div>
        )}
        {resultsVisible === false &&
          slicedQuestions.map((ques, idx) => (
            <div key={ques.id} className="questionBlock">
              <p className="questions">
                {currentQuestionIndex + 1} . {ques.question}
              </p>
              <div className="optionsContainer">
                {ques.options.map((option, i) => (
                  <div key={i} className="options">
                    <label
                      className={`optionField ${
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
                      <input
                        className="inputOption"
                        disabled={showResult === true}
                        type="radio"
                        value={option}
                        checked={
                          selectedAnswers[currentQuestionIndex] === option
                        }
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
        {showResult === false && <div id="count">{count}</div>}
        {resultsVisible === false && (
          <div className="btnFooter">
            {showResult === true && currentQuestionIndex > 0 && (
              <button className="button" onClick={handlePrevQuestions}>
                Previous
              </button>
            )}
            {currentQuestionIndex === _questions.length - 1 &&
              showResult === false && (
                <button className="button" onClick={() => handleCheckAnswers()}>
                  Submit
                </button>
              )}
            {showResult === true &&
              currentQuestionIndex < _questions.length - 1 && (
                <button
                  className="button"
                  onClick={handleNextQuestionChange}
                  disabled={_questions.length === currentQuestionIndex}
                >
                  Next
                </button>
              )}
            {currentQuestionIndex === _questions.length - 1 && (
              <button className="button" onClick={handleReset}>
                Reset
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
