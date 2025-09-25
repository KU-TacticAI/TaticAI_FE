import React, { useState } from 'react'; 
import Layout from '../layout/Layout'; 
import './Info.css';

const images = {
  item1: {
    default: '/img/sample-img/img14.png',
    hover: '/img/sample-img/img18.png'
  },
  item2: {
    default: '/img/sample-img/img15.png',
    hover: '/img/sample-img/img19.png'
  },
  item3: {
    default: '/img/sample-img/img16.png',
    hover: '/img/sample-img/img20.png'
  },
  item4: {
    default: '/img/sample-img/img17.png',
    hover: '/img/sample-img/img21.png'
  }
};


interface ImageItemProps {
  defaultSrc: string;
  hoverSrc: string;
  alt: string;
  className: string;
}

const ImageItem: React.FC<ImageItemProps> = ({ defaultSrc, hoverSrc, alt, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div 
      className={`grid-item ${className}`}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <img src={isHovered ? hoverSrc : defaultSrc} alt={alt} />
    </div>
  );
};

const Info: React.FC = () => {
  return (
    <Layout> 
      <div className="info-container">
        <ImageItem 
          defaultSrc={images.item1.default}
          hoverSrc={images.item1.hover}
          alt="첫 번째 이미지"
          className="item-1"
        />
        <ImageItem 
          defaultSrc={images.item2.default}
          hoverSrc={images.item2.hover}
          alt="두 번째 이미지"
          className="item-2"
        />
        <ImageItem 
          defaultSrc={images.item3.default}
          hoverSrc={images.item3.hover}
          alt="세 번째 이미지"
          className="item-3"
        />
        <ImageItem 
          defaultSrc={images.item4.default}
          hoverSrc={images.item4.hover}
          alt="네 번째 이미지"
          className="item-4"
        />
      </div>
    </Layout>
  );
};

export default Info;

