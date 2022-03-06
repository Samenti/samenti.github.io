import React from 'react';
import {nanoid} from 'nanoid';

export default function Item(props) {
  /* Fisher-Yates (aka Knuth) Shuffle algorithm */
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

  /* Helper function to convert escaped characters in strings from DB */
  function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  
  function generateAnswers(correct, incorrects) {
    const answers = new Array();
    for (const ans of incorrects) {
      answers.push({text: ans, isCorrect: false})
    }
    answers.push({text: correct, isCorrect: true});
    const shuffledAnswers = shuffle(answers);
    const answerElems = shuffledAnswers.map(answer => {
      return (
        <div 
          key={nanoid()} 
          className="answer"
        >
          {htmlDecode(answer.text)}
        </div>
      );
    });
    return answerElems;
  }
  
  return (
    <div className="item">
      <h2>{htmlDecode(props.question)}</h2>
      <div className="answers">
        {generateAnswers(props.correct, props.incorrects)}
      </div>
    </div>
  );
}