import React from 'react';
import Header from '../header/Header';
import NavBar from '../nav/NavBar';
import './Main.css';
import ImageCarousel from './ImageCarousel';

const Main: React.FC = () => {
  return (
      <div className="scale-wrapper">
        <Header />
        <NavBar />
        <main>
          <section className="game-images">
            <div className="game-image">게임 이미지1</div>
            <div className="game-image">게임 이미지2</div>
          </section>
          <section className="play-guide">
            <ImageCarousel />
          </section>
        </main>
      </div>
  );
};

export default Main;
