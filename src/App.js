import React from 'react';

export default function App() {
  const amount = 5;
  const category = 9;
  const difficulty = 'medium';
  const apiUrl = 'https://opentdb.com/api.php?'
  const [started, setStarted] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);

  console.log(questions);

  function startQuiz() {
    setStarted(true);
  }

  function getQuestions(num, cat, diff) {
    fetch(
      `${apiUrl}amount=${num}&category=${cat}`
      + `&difficulty=${diff}&type=multiple`
    ).then(
      res => res.json()
    ).then(
      data => setQuestions(data)
    );
  }

  const splashScreen = (
    <div className="splash">
      <h1>Quizzical</h1>
      <p>Questions from the Open Trivia Database</p>
      <button onClick={startQuiz}>Start quiz</button>
    </div>
  );

  React.useEffect(() => {
    console.log('effect ran')
    if (started) {
      getQuestions(amount, category, difficulty);
    }
  }, [started]);
  
  return (
    <div className="container">
      {
        started 
        ? 
        <h1>placeholder</h1>
        : 
        splashScreen
      }
    </div>
  );
};