import React from 'react';
import {nanoid} from 'nanoid';

export default function Item(props) {

  /* Helper function to convert escaped characters in strings from DB */
  function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  
  const answerElems = props.answers.map(answer => {
    return (
      <div 
        key={answer.id} 
        className={answer.isSelected ? "answer selected" : "answer"}
        onClick={() => {props.handleClick(props.id, answer.id)}}
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