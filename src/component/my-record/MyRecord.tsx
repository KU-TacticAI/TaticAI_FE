import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import './MyRecord.css';
import { getAiResult } from '../../api/Api';
import { Link } from "react-router-dom";

export interface AiStatisticsDto {
  aiId: number;
  gameCount: number;
  avg_turns: number;
  avgResponseTimeMs: number;
  winRate: number; // 0~1 범위인지 0~100 범위인지 확인 필요
}

const MyRecord = () => {
  const [aiStats, setAiStats] = useState<AiStatisticsDto[]>([]);
  const [selectedId, setSelectedId] = useState(1);

  // API 호출
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAiResult()
        setAiStats(response.data);
        if (response.data.length > 0) {
          setSelectedId(response.data[0].aiId); // 첫 번째 aiId 선택
        }
      } catch (error) {
        console.error('AI 통계 불러오기 실패:', error);
      }
    };

    fetchStats();
  }, []);

  const selectedData = aiStats.find((data) => data.aiId === selectedId);

  return (
    <Layout>
      <div className="record-page-container">
        <h1 className="page-title">내 기록 보기</h1>
        <div className="content-wrapper">

          <div className="left-panel">
            <div className="main-image-placeholder">티어img 추가 예정</div>
            <div className="selector-circles">
              {aiStats.map((item) => (
                <div
                  key={item.aiId}
                  className={`circle ${selectedId === item.aiId ? 'active' : ''}`}
                  onClick={() => setSelectedId(item.aiId)}
                >
                  {item.aiId}
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
                  <p>{selectedData.gameCount}</p>
                </div>
                <div className="info-box">
                  <h3>평균 응답시간</h3>
                  <p>{selectedData.avgResponseTimeMs}</p>
                </div>
                <div className="info-box">
                  <h3>평균 턴수</h3>
                  <p>{selectedData.avg_turns}</p>
                </div>
              </>
            )}
          </div>
        </div>
       <Link to="/my-record/detail" className="submit-button">
           상세기록 보기
       </Link>
      </div>
    </Layout>
  );
};

export default MyRecord;