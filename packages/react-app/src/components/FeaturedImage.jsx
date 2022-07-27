import { Carousel } from 'antd';
import React from 'react';

const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

export default function FeaturedImage(props) {
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };

  const { image } = props

  return (
    <Carousel afterChange={onChange}>
      <div>
        <img src={image} />
        <h3 style={contentStyle}>1</h3>
      </div>
      <div>
        <h3 style={contentStyle}>2</h3>
      </div>
    </Carousel>
  );
};