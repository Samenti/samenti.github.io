import React from 'react';
import {nanoid} from 'nanoid';

export default function Item(props) {

  /* Helper function to convert escaped characters in strings from DB */
  function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  const answerElems = props.answers.map(answer => {
    let classes = 'answer noselect ';
    if (!props.finished) {
      classes += answer.isSelected ? 'selected' : '';
    } else if (answer.isCorrect) {
      classes += 'correct';
    } else {
      classes += answer.isSelected ? 'incorrect' : 'unchosen';
    }
    const clickFunction = (
      props.finished
      ?
      () => {}
      :
      () => {props.handleClick(props.id, answer.id)}
    );
    return (
      <div 
        key={answer.id} 
        className={classes}
        onClick={clickFunction}
      >
        {htmlDecode(answer.text)}
      </div>
    );
  });
  
  return (
    <div className="item">
      <h2>{htmlDecode(props.question)}</h2>
      <div className="answers">
        {answerElems}
      </div>
    </div>
  );
}