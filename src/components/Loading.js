import React from 'react';
import {nanoid} from 'nanoid';
import ContentLoader from 'react-content-loader';

export default function Loading() {
  const isSmall = window.matchMedia('(max-width: 575px)').matches;
  const isMedium = window.matchMedia(
    '(min-width: 576px) and (max-width: 767px)'
  ).matches;
  const smallContainerWidth = window.innerWidth - 56;
  const largeOffsets = {
    line: 28.8, row: 46.8, column: 118, item: 116.6, hr: 96.6, 
    option: 100, width: 550
  };
  const smallOffsets = {
    line: 46, row: 64, column: 50, item: 133.8, hr: 113.8,
    option: 40, width: smallContainerWidth-30
  };
  const offsets = isSmall ? smallOffsets : largeOffsets;
  const rectangles = new Array();
  for (let i=0; i<5; i++) {
    rectangles.push(<rect 
      key={nanoid()}
      x="0" y={(i * offsets.item).toString()}
      rx="5" ry="5" 
      width={offsets.width.toString()} 
      height={offsets.line.toString()}
    />);
    for (let j=0; j<4; j++) {
      rectangles.push(<rect 
        key={nanoid()}
        x={(j * offsets.column).toString()}
        y={(i * offsets.item + offsets.row).toString()}
        rx="10" ry="10" 
        width={offsets.option.toString()} height="28.8"
      />);
    }
    rectangles.push(<rect
      key={nanoid()}
      x="0" y={(i * offsets.item + offsets.hr).toString()}
      rx="0" ry="0" 
      width={(offsets.width+30).toString()} height="1"
    />);
  }
  rectangles.push(<rect
    key={nanoid()}
    x="200" y={(offsets.item*5+10).toString()} 
    rx="16" ry="16" width="200" height="60"  
  />);
  
  return (
    <div className="container quiz-container">
      <ContentLoader 
        viewBox={
          `0 0 ${isSmall || isMedium ? smallContainerWidth : 600} 680`
        }
        backgroundColor="#dde0ee"
        foregroundColor="#eef0f6"
      >
        {rectangles}
      </ContentLoader>
    </div>
  );
};