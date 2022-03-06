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
    ).then(data => setQuestionsData(data.results)
    ).catch(error => {
      console.error('Fetch request error:', error);
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
        key={nanoid()}
        question={questionData.question}
        correct={questionData.correct_answer}
        incorrects={questionData.incorrect_answers}
      />
    );
  });

  const quizElems = new Array;
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