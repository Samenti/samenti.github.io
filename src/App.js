import React from 'react';
import Item from './components/Item';
import {nanoid} from 'nanoid';
import Loading from './components/Loading';

export default function App() {
  const amount = 5;
  const category = null;
  const difficulty = null;
  const type = null;
  const apiUrl =  `https://opentdb.com/api.php?amount=${amount}`.concat(
    category ? `&category=${category}` : ``
  ).concat(
    difficulty ? `&difficulty=${difficulty}` : ``
  ).concat(
    type ? `&type=${type}` : ``
  );
  const [started, setStarted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [questionsData, setQuestionsData] = React.useState([]);
  const [finished, setFinished] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [gameRestarts, setGameRestarts] = React.useState(0);


  /* Helper function; Fisher-Yates (aka Knuth) Shuffle algorithm */
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  function startQuiz() {
    setStarted(true);
  }

  function getQuestionsData() {
    fetch(apiUrl).then(setLoading(true)).then(
      res => {
        if (!res.ok) {
          throw new Error('Response not OK');
        }
        return res.json();
      }
    ).then(data => setQuestionsData(extractQuiz(data.results))
    ).catch(error => {
      console.error('Fetch request error:', error);
    });
  }

  function extractQuiz(dbdata) {
    const quiz = new Array();
    for (const dataObj of dbdata) {
      const answersArray = new Array();
      for (const ans of dataObj.incorrect_answers) {
        answersArray.push({
          id: nanoid(),
          text: ans,
          isCorrect: false,
          isSelected: false
        });
      }
      answersArray.push({
        id: nanoid(),
        text: dataObj.correct_answer,
        isCorrect: true,
        isSelected: false
      });
      const quizItem = {
        id: nanoid(),
        question: dataObj.question,
        answers: shuffle(answersArray)
      }
      quiz.push(quizItem);
    }
    setLoading(false);
    return quiz;
  }

  function selectAnswer(questionId, answerId) {
    setQuestionsData((prevItems) => {
      const newItems = new Array();
      for (const item of prevItems) {
        if (item.id != questionId) {
          newItems.push(item);
        } else if (item.id === questionId) {
          const newAnswers = new Array();
          for (const answer of item.answers) {
            newAnswers.push({
              ...answer,
              isSelected: answer.id === answerId ? true : false
            });
          }
          newItems.push({...item, answers: newAnswers});
        }
      }
      return newItems;
    });
  }

  function checkAnswers() {
    setFinished(true);
    for (const item of questionsData) {
      for (const answer of item.answers) {
        if (answer.isCorrect && answer.isSelected) {
          setScore(prevScore => prevScore + 1);
        }
      }
    }
  }

  function restartGame() {
    setGameRestarts(prevValue => prevValue + 1);
    setFinished(false);
    setScore(0);
  }

  React.useEffect(() => {
    if (started) {
      getQuestionsData();
    }
  }, [started, gameRestarts]);

  const itemElems = questionsData.map(questionData => {
    return (
      <Item 
        key={questionData.id}
        id={questionData.id}
        question={questionData.question}
        answers={questionData.answers}
        handleClick={selectAnswer}
        finished={finished}
      />
    );
  });

  const quizElems = new Array();
  for (const item of itemElems) {
    quizElems.push(item);
    quizElems.push(<hr key={nanoid()}></hr>);
  }
  if (!finished) {
    quizElems.push(
      <button
        className="check-button"
        key={nanoid()}
        onClick={checkAnswers}
      >
        Check answers
      </button>
    );
  } else {
    quizElems.push(
      <div key={nanoid()} className="bottombar">
        <h3>
          {`You scored ${score}/${questionsData.length} correct answers`}
        </h3>
        <button 
          className="restart-button"
          onClick={restartGame}
        >
          Play again
        </button>
      </div>
    );
  }
  
  
  const splashScreen = (
    <div className="splash">
      <h1>Quizzical</h1>
      <p>Questions from the Open Trivia Database</p>
      <button onClick={startQuiz}>Start quiz</button>
    </div>
  );

  return (
    loading
    ?
    <Loading />
    :
    <div className={
      started ? "container quiz-container" : "container splash-container"
    }>
      {
        started 
        ? 
        quizElems
        : 
        splashScreen
      }
    </div>
  );
};