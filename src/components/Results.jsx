import React from "react";

function Results({ correctAnswers, questionsCount, score }) {
  return (
    <>
      <div className="resultsHeader">
        <h2>Results</h2>
        <h3>
          You answered {correctAnswers} out of {questionsCount} questions
          correctly.
        </h3>
        <h3>Score: {score} marks</h3>
      </div>
    </>
  );
}
export default Results;
