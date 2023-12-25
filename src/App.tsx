import { useState, useEffect, useCallback } from "react";
import CountdownTimer from "./Components/CountdownTimer";
import axios from "axios";

function App() {
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameOver, setGameOver] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showHint, setshowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(false);

  const TIME_PER_QUESTION = 10;

  interface QuizQuestion {
    category: string;
    difficulty: string;
    correct_answer: string;
    incorrect_answers: string[];
    answers: string[];
    question: string;
    type: string;
  }

  const getQuiz = useCallback(async () => {
    setIsLoading(true);
    await axios
      .get("https://opentdb.com/api.php?amount=10")
      .then((response) => {
        const quizQuestionsWithAnswers = response.data.results.map(
          (question: QuizQuestion) => ({
            ...question,
            answers: shuffleArray([
              question.correct_answer,
              ...question.incorrect_answers,
            ]),
          })
        );
        setQuizData(quizQuestionsWithAnswers);
        console.log(quizQuestionsWithAnswers);
      })
      .catch((error) => {
        setError(true);
        console.log(error.message);
      })
      .finally(() => {
        setScore(0);
        setQuestionIndex(0);
        setIsLoading(false);
        setGameOver(false);
      });
  }, []);

  const nextQuestion = () => {
    setQuestionIndex((prev) => {
      if (prev < quizData.length - 1) {
        prev = prev + 1;
        setshowHint(false);
      } else {
        setGameOver(true);
        setQuizData([]);
      }
      return prev;
    });
  };

  const gameStart = () => {
    getQuiz();
  };

  const checkScore = (userAnswer: string) => {
    if (userAnswer === quizData[questionIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }
    nextQuestion();
  };

  //Function to shuffle an array using Fisher-Yates algorithm
  function shuffleArray(array: string[]): string[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12-lg  d-flex flex-column align-items-center">
            <h1>Trivia game App</h1>
            {isLoading && <p>Loading quiz questions...</p>}
            {gameOver && (
              <img src="src\assets\splash_logo.png" className="img-fluid"></img>
            )}
          </div>

          {quizData.length > 0 && (
            <>
              <div>
                <div>
                  <div className="col-lg-12  d-flex flex-column align-items-center">
                    <h2>{`Question: ${questionIndex}/${quizData.length}`}</h2>
                    <h3>{`score:${score}`}</h3>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: `Category: ${quizData[questionIndex].category}`,
                      }}
                    />
                    <p>Difficulty: {quizData[questionIndex].difficulty}</p>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: `Question: ${quizData[questionIndex].question}`,
                      }}
                    />
                  </div>

                  {quizData[questionIndex].answers.map((answer, index) => (
                    <div
                      className="col-lg-12  d-flex flex-column align-items-center"
                      key={index}
                    >
                      <button
                        onClick={() => checkScore(answer)}
                        type="button"
                        className="btn btn-dark"
                        dangerouslySetInnerHTML={{
                          __html: `${answer}`,
                        }}
                      />
                    </div>
                  ))}

                  <hr />
                  {showHint && (
                    <div className="col-lg-12  d-flex flex-column align-items-center">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: `Correct Answer: ${quizData[questionIndex].correct_answer}`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="col-12-lg  d-flex flex-column align-items-center">
            <div className="col-lg-6 d-flex flex-column align-items-center">
              {!gameOver && !error ? (
                <>
                  <div className="col-lg-12 d-flex flex-column align-items-center">
                    <button
                      type="button"
                      className="btn btn-info btn-lg"
                      onClick={() => setshowHint(true)}
                    >
                      Show answer
                    </button>
                  </div>
                  <div className="col-lg-12 d-flex flex-column align-items-center">
                    <CountdownTimer
                      timeInterval={quizData.length * TIME_PER_QUESTION}
                    />
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-info btn-lg"
                  onClick={gameStart}
                >
                  Start new game
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
