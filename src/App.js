import React from 'react';

export default function App() {
  const [started, setStarted] = React.useState(false);
  
  function startQuiz() {
    setStarted(true);
  }

  const splashScreen = (
    <div className="splash">
      <h1>Quizzical</h1>
      <p>Questions from the Open Trivia Database</p>
      <button onClick={startQuiz}>Start quiz</button>
    </div>
  );
  
  return (
    <div className="container">
      {!started && splashScreen}
    </div>
  );
};