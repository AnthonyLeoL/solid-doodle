import React, { useState, useEffect } from "react";
import WorldMap from "react-svg-worldmap";

import "./App.css";

const CSV_URL = "/questions.csv";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mapData, setMapData] = useState([]);
  console.log("🚀 ~ App ~ mapData:", mapData);

  useEffect(() => {
    fetch(CSV_URL)
      .then((response) => response.text())
      .then((text) => {
        const parsedQuestions = text
          .split("\n")
          .slice(1)
          .map((line) => {
            const [question, answer, country] = line.split(",");
            return { question, answer, country };
          });
        setQuestions(parsedQuestions);
      });
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleRevealAnswer = () => {
    setShowAnswer(true);
    setMapData([{ country: currentQuestion.country.trim(), value: 1 }]);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : questions.length - 1
    );
    setShowAnswer(false);
    setMapData([]);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    setShowAnswer(false);
    setMapData([]);
  };

  return (
    <div className="app-container">
      <div className="map-container">
        <WorldMap
          color="green"
          size="responsive"
          data={mapData}
          strokeOpacity={0.2}
          borderColor="#000000"
        />
      </div>
      <div className="quiz-container">
        <div className="quiz-card">
          <h2 className="quiz-title">{currentQuestion?.question}</h2>
          {showAnswer && (
            <p className="answer">Answer: {currentQuestion?.answer}</p>
          )}
          <div className="button-container">
            <button
              className="button button-back"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Back
            </button>
            <button
              className="button"
              onClick={handleRevealAnswer}
              disabled={showAnswer}
            >
              Reveal Answer
            </button>
            <button className="button" onClick={handleNextQuestion}>
              Next Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
