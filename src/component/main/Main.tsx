import React from 'react';
import './Main.css';
import ImageCarousel from './ImageCarousel';
import Layout from "../layout/Layout";

const Main: React.FC = () => {
  return (
      <Layout>
        <div className="scale-wrapper">
          <main>
            <section className="game-images">
              <div className="game-image">게임 이미지1</div>
              <div className="game-image">게임 이미지2</div>
            </section>
            <section className="play-guide">
              <ImageCarousel/>
            </section>
          </main>
        </div>
      </Layout>
  );
};

export default Main;
