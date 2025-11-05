import React from "react";

function Results({ correctAnswers, questionsCount }) {
  return (
    <>
      <div className="resultsHeader">
        <h2>Results</h2>
        <h3>
          You answered {correctAnswers} out of {questionsCount} questions
          correctly.
        </h3>
      </div>
    </>
  );
}
export default Results;
