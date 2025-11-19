// src/constants/tierConfig.ts

export interface TierInfo {
  name: string;
  minWinRate: number; // 최소 승률 (0~1 범위)
  maxWinRate: number; // 최대 승률 (0~1 범위)
  imagePath: string;
  color: string; // 선택사항: 티어별 색상
}

export const TIER_CONFIG: TierInfo[] = [
  {
    name: 'Bronze',
    minWinRate: 0,
    maxWinRate: 0.5,
    imagePath: '/img/sample-img/img13.png',
    color: '#CD7F32'
  },
  {
    name: 'Silver',
    minWinRate: 0.5,
    maxWinRate: 0.7,
    imagePath: '/img/sample-img/img12.png',
    color: '#C0C0C0'
  },
  {
    name: 'Gold',
    minWinRate: 0.7,
    maxWinRate: 0.9,
    imagePath: '/img/sample-img/img11.png',
    color: '#FFD700'
  },
  {
    name: 'Platinum',
    minWinRate: 0.9,
    maxWinRate: 1.0,
    imagePath: '/img/sample-img/img10.png',
    color: '#E5E4E2'
  }
];

// 승률에 따른 티어 정보 반환 함수
export const getTierByWinRate = (winRate: number): TierInfo => {
  const tier = TIER_CONFIG.find(
      (tier) => winRate >= tier.minWinRate && winRate <= tier.maxWinRate
  );

  // 기본값: 가장 낮은 티어
  return tier || TIER_CONFIG[0];
};