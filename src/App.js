import React from 'react';
import Item from './components/Item';
import {nanoid} from 'nanoid';

export default function App() {
  const category = 9;
  const difficulty = 'medium';
  const apiUrl = 'https://opentdb.com/api.php?'
  const [started, setStarted] = React.useState(false);
  const [questionsData, setQuestionsData] = React.useState([]);

  console.log(questionsData);

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

  function getQuestionsData(cat, diff) {
    fetch(
      `${apiUrl}amount=5&category=${cat}`
      + `&difficulty=${diff}&type=multiple`
    ).then(res => {
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

  React.useEffect(() => {
    if (started) {
      getQuestionsData(category, difficulty);
    }
  }, [started]);

  const itemElems = questionsData.map(questionData => {
    return (
      <Item 
        key={questionData.id}
        id={questionData.id}
        question={questionData.question}
        answers={questionData.answers}
        handleClick={selectAnswer}
      />
    );
  });

  const quizElems = new Array();
  for (const item of itemElems) {
    quizElems.push(item);
    quizElems.push(<hr key={nanoid()}></hr>);
  }
  quizElems.push(<button key={nanoid()}>Check answers</button>);
  
  const splashScreen = (
    <div className="splash">
      <h1>Quizzical</h1>
      <p>Questions from the Open Trivia Database</p>
      <button onClick={startQuiz}>Start quiz</button>
    </div>
  );

  return (
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