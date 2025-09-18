import React, { useState } from 'react';
import Layout from '../layout/Layout';
import './MyRecord.css';

// ai 버튼에 연결할 임시 데이터
const mockData = [
  {
    id: 1,
    winRate: '58.3%',
    gamesPlayed: '120판',
    stat1: '111',
    stat2: '222',
  },
  {
    id: 2,
    winRate: '72.1%',
    gamesPlayed: '86판',
    stat1: '333',
    stat2: '444',
  },
  {
    id: 3,
    winRate: '45.0%',
    gamesPlayed: '210판',
    stat1: '555',
    stat2: '666',
  },
];

const MyRecord = () => {

  const [selectedId, setSelectedId] = useState(1);
  const selectedData = mockData.find(data => data.id === selectedId);

  return (
    <Layout>
      <div className="record-page-container">
        <h1 className="page-title">내 기록 보기</h1>
        <div className="content-wrapper">

          <div className="left-panel">
            <div className="main-image-placeholder">티어img 추가 예정</div>
            <div className="selector-circles">
              {mockData.map((item) => (
                <div
                  key={item.id}
                  className={`circle ${selectedId === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  {item.id}
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽 패널: 데이터 표시 박스 */}
          <div className="right-panel">
            {selectedData && (
              <>
                <div className="info-box">
                  <h3>승률</h3>
                  <p>{selectedData.winRate}</p>
                </div>
                <div className="info-box">
                  <h3>게임 판수</h3>
                  <p>{selectedData.gamesPlayed}</p>
                </div>
                <div className="info-box">
                  <h3>글자1</h3>
                  <p>{selectedData.stat1}</p>
                </div>
                <div className="info-box">
                  <h3>글자2</h3>
                  <p>{selectedData.stat2}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyRecord;