import React from 'react';
import {nanoid} from 'nanoid';
import ContentLoader from 'react-content-loader';

export default function Loading() {
  const rowOffset = 46;
  const columnOffset = 118;
  const itemOffset = 117;
  const hrOffset = 95;
  const rectangles = new Array();
  for (let i=0; i<5; i++) {
    rectangles.push(<rect 
      key={nanoid()}
      x="0" y={(i * itemOffset).toString()}
      rx="5" ry="5" width="550" height="28"
    />);
    for (let j=0; j<4; j++) {
      rectangles.push(<rect 
        key={nanoid()}
        x={(j * columnOffset).toString()}
        y={(i * itemOffset + rowOffset).toString()}
        rx="10" ry="10" width="100" height="30"
      />);
    }
    rectangles.push(<rect
      key={nanoid()}
      x="0" y={(i * itemOffset + hrOffset).toString()}
      rx="0" ry="0" width="580" height="1"
    />);
  }
  rectangles.push(<rect
    key={nanoid()}
    x="210" y="600" rx="16" ry="16" width="180" height="50"  
  />);
  
  return (
    <div className="container quiz-container">
      <ContentLoader 
        viewBox="0 0 600 680"
        backgroundColor="#dde0ee"
        foregroundColor="#eef0f6"
      >
        {rectangles}
      </ContentLoader>
    </div>
  );
};