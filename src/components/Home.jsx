import React, { useState } from "react";
import catogerizedQuestions from "../mocks/catogerizedQuestions.json";
import App from "./App";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useForm } from "react-hook-form";

function Home() {
  const [quesVisible, setQuesVisible] = useState(false);
  const navigate = useNavigate();
  const [quesLength, setQuesLength] = useState(0);
  const [selectedCatogeries, setSelectedCatogeries] = useState();
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
    setSelectedCatogeries(data);
    setQuesVisible(true);
    reset();
  };
  return (
    <>
      {quesVisible === false && (
        <>
          <form id="selectionForm" action="" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="noOfQuestions"> </label>
            NO OF QUESTIONS
            <input
              type="number"
              min="1"
              max="30"
              name="noOfQuestions"
              className="inputForm"
              {...register("noOfQuestions", {
                required: {
                  value: true,
                  message:
                    " Number of questions is required. Please fill in this field !",
                },
              })}
            />
            <p className="error">{errors.noOfQuestions?.message}</p>
            <label htmlFor="quesionsRelated"> </label>
            QUESTIONS TOPIC
            <select name="questionsTopic" {...register("questionsTopic")}>
              {Object.keys(catogerizedQuestions).map((catogerie, idx) => (
                <option key={idx} value={catogerie} className="options">
                  {catogerie}
                </option>
              ))}
            </select>
            <label htmlFor="quizTime"> </label>
            TIME FOR PER QUESTION
            <input
              type="number"
              name="timeForPerQuestion"
              min="15"
              max="30"
              {...register("timeForPerQuestion", {
                required: {
                  value: true,
                  message:
                    "Time per question is required. Please fill in this field",
                },
              })}
            />
            <p className="error">{errors.timeForPerQuestion?.message}</p>
            <label htmlFor="applyWeight"> </label>
            APPLY WEIGHT
            <input
              type="number"
              name="applyWeight"
              min="1"
              max="30"
              {...register("applyWeight", {
                required: {
                  value: true,
                  message:
                    "Apply weight is required. Please fill in this field!",
                },
              })}
            />
            <p className="error">{errors.applyWeight?.message}</p>
            <label htmlFor="reduceMarkForWrongAnswer"></label>
            REDUCE MARK FOR WRONG ANSWERS
            <input
              type="number"
              name="reduceMarkForWrongAnswer"
              min="0"
              max="30"
              {...register("reduceMarkForWrongAnswer", {
                required: {
                  value: true,
                  message:
                    "Reduce Mark For Wrong Answers is required. Please fill in this field!",
                },
              })}
            />
            <p className="error">{errors.reduceMarkForWrongAnswer?.message}</p>
            <input type="submit" value="SUMBIT" />
          </form>
        </>
      )}
      {quesVisible && <App catogery={selectedCatogeries} />}
    </>
  );
}

export default Home;
