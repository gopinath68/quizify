import React, { useState } from "react";
import catogerizedQuestions from "../mocks/catogerizedQuestions.json";
import App from "./App";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const allTypeOfQuestions = catogerizedQuestions;
  const [quesVisible, setQuesVisible] = useState(false);
  const [selectedCatogery, setSelectedCatogery] = useState([]);
  const navigate = useNavigate();

  const handleCatogeries = (catogery) => {
    setSelectedCatogery(catogery);
    setQuesVisible(true);
  };

  return (
    <>
      {quesVisible === false && (
        <>
          <h1 id="homeHeader">Question Catogeries</h1>

          <div id="homePage">
            {Object.keys(catogerizedQuestions).map((catogery, idx) => (
              <div key={idx}>
                <button
                  className="catogeryBtn"
                  onClick={() => handleCatogeries(catogery)}
                >
                  {catogery}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {quesVisible && <App catogery={selectedCatogery} />}
    </>
  );
}

export default Home;
