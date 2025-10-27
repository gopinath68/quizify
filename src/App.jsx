import { use, useRef, useState } from "react";
import "./App.css";
import questions from "./mocks/questions.json";

function App() {
  const [visibleAnswers, setVisibleAnswers] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(2).fill(undefined)
  );
  const [correctAnswers, setCorrectAnswers] = useState();

  const slicedQuestionsRef = useRef(questions.slice(0, 2));

  const handleCheckAnswers = () => {
    console.log(selectedAnswers);
    const hasUnansweredQuestion = selectedAnswers.every(
      (answer) => answer !== undefined
    );

    console.log("hasUnansweredQuestion::", hasUnansweredQuestion);
    if (hasUnansweredQuestion) {
      const wrongAnswers = slicedQuestionsRef.current.filter(
        (ques, idx) => ques.answer !== selectedAnswers[idx]
      );
      const correctAnswers = selectedAnswers.length - wrongAnswers.length;
      setVisibleAnswers(true);
      setCorrectAnswers(correctAnswers);
      console.log("wrongAnswers", wrongAnswers);
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    } else {
      let unansweredWarningMsg = "one or more questions you doesn't selected";
      if (confirm(unansweredWarningMsg) === true) {
        const wrongAnswers = slicedQuestionsRef.current.filter(
          (ques, idx) => ques.answer !== selectedAnswers[idx]
        );
        const correctAnswers = selectedAnswers.length - wrongAnswers.length;
        setShowResult(true);
        setCorrectAnswers(correctAnswers);
        setVisibleAnswers(true);
      } else {
        setVisibleAnswers(false);
        setShowResult(false);
      }
    }
  };

  const handleAnswerSelection = (e, idx) => {
    const selectedAnswersCopy = structuredClone(selectedAnswers);
    selectedAnswersCopy[idx] = e.target.value;
    setSelectedAnswers(selectedAnswersCopy);
    console.log(selectedAnswers);
  };

  return (
    <>
      <div className="quizify">
        {showResult && (
          <>
            <h3 style={{ textAlign: "center", color: "green" }}>
              You answered {correctAnswers} out of{" "}
              {slicedQuestionsRef.current.length} questions correctly.{" "}
            </h3>
          </>
        )}
        {slicedQuestionsRef.current.map((ques, idx) => (
          <div key={idx}>
            <p className="questions">
              {idx + 1}.{ques.question}
            </p>
            {ques.options.map((option, i) => (
              <div
                key={i}
                className={`options ${
                  visibleAnswers &&
                  option === selectedAnswers[idx] &&
                  selectedAnswers[idx] === ques.answer
                    ? "correctAnswer"
                    : "" ||
                      (visibleAnswers &&
                        option === selectedAnswers[idx] &&
                        selectedAnswers[idx] !== ques.answer)
                    ? "wrongAnwer"
                    : "" ||
                      (visibleAnswers &&
                        selectedAnswers[idx] !== ques.answer &&
                        option === ques.answer)
                    ? "correctAnswer"
                    : ""
                }`}
              >
                <input
                  className="option"
                  type="radio"
                  value={option}
                  checked={selectedAnswers[idx] === option}
                  onChange={(e) => handleAnswerSelection(e, idx)}
                />
                {option}
              </div>
            ))}
          </div>
        ))}
        <div className="btnFooter">
          <button className="button" onClick={() => handleCheckAnswers()}>
            submit
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
