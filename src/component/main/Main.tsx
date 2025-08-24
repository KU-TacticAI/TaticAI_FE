import React from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
import ImageCarousel from './ImageCarousel';
import Layout from "../layout/Layout";

const Main: React.FC = () => {
  return (
      <Layout>
        <div className="scale-wrapper">

          <main id="main-home" className="main-screen active">
            <section className="game-images">
              <Link to="/lobby/all" className="game-image">
                <img src="/img/sample-img/img6.jpg" alt="전체"/>
                <span className="game-title">전체</span>
              </Link>
              <Link to="/lobby/baduk" className="game-image">
                <img src="/img/sample-img/img6.jpg" alt="바둑"/>
                <span className="game-title">바둑</span>
              </Link>
              <Link to="/lobby/chess" className="game-image">
                <img src="/img/sample-img/img7.jpg" alt="체스"/>
                <span className="game-title">체스</span>
              </Link>
              <Link to="/lobby/othello" className="game-image">
                <img src="/img/sample-img/img7.jpg" alt="오셀로"/>
                <span className="game-title">오셀로</span>
              </Link>
              <Link to="/lobby/tictactoe" className="game-image">
                <img src="/img/sample-img/img7.jpg" alt="틱텍토"/>
                <span className="game-title">틱텍토</span>
              </Link>
            </section>

            <section className="play-guide">
              <div className="swiper mySwiper">
                <ImageCarousel/>
              </div>
            </section>
          </main>

          <main id="main-records" className="main-screen">
            <div className="records-box">
              1
            </div>
          </main>

          <main id="main-ranking" className="main-screen">
            <div className="ranking-box">
              2
            </div>
          </main>

          <main id="main-info" className="main-screen">
            <h2>게임 소개</h2>
            <p>게임에 대한 설명이 여기에 표시됩니다.</p>
          </main>

          <main id="main-login" className="main-screen">
            <h2>로그인</h2>
          </main>
        </div>
      </Layout>
  );
};

export default Main;
