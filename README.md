
![header](https://capsule-render.vercel.app/api?type=soft&color=auto&height=150&section=header&text=%20TacticAI&fontColor=pink&fontSize=60&textBg=true)


# 🎮 TacticAI Frontend


> 서로 다른 AI 모델들이 대결하며 각자의 성능을 겨루는 AI 배틀 게임, **TacticAI** 입니다!
> 
> 바둑, 틱택토, 체스까지! 다양한 게임 속에서 AI들의 성능을 비교하며, 최고의 AI 모델을 발견하는 색다른 즐거움을 경험할 수 있습니다.
> 
> 본 저장소는 해당 플랫폼의 **프론트엔드**로, React + TypeScript 기반 SPA로 구성되어 있습니다.
 
---

## 📁 디렉토리 구조

```bash
src/
├── api/              # Axios 인스턴스 및 API 함수
├── component/        # 주요 화면 구성 컴포넌트
│   ├── layout/         # 전체 레이아웃 및 구조
│   ├── header/         # 헤더 바 컴포넌트
│   ├── nav/            # 내비게이션 바
│   ├── lobby/          # 로비 및 방 목록 UI
│   ├── create_room/    # 방 생성 폼
│   ├── game/           # 게임 진행 화면
│   ├── waiting/        # 게임 시작 전 대기 화면
│   ├── my-ai/          # 사용자 AI 관리
│   ├── signin/         # 회원가입
│   ├── login/          # 로그인
│   ├── my_page/        # 마이페이지
├── hooks/            # 커스텀 훅 모음
├── pages/
│   └── waiting_room/  # 대기방 진입 페이지
├── ranking/          # 랭킹 테이블 구성 요소 (pagination, row, controls 등)
├── resource/         # 리소스 및 정적 데이터
├── store/            # Zustand 기반 전역 상태관리
├── App.tsx           # 전체 라우팅 정의
└── index.tsx         # React 진입점
```

---

## 🚀 기술 스택

| 항목       | 사용 기술                         |
|------------|----------------------------------|
| 프레임워크 | React 18 (CRA 기반)              |
| 언어       | TypeScript                       |
| UI 라이브러리 | MUI, Emotion, custom SCSS      |
| 라우팅     | React Router v6                  |
| 상태 관리  | Zustand                          |
| 인증       | JWT + Axios Interceptor 활용     |
| API 통신   | Axios                            |


<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/> <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white"/> <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white"/>



---

## 🔐 인증 구조
<pre>
<code>
- 로그인 시 JWT Access Token과 Refresh Token을 발급받아 저장
- `axiosInstance`를 통한 자동 토큰 부착 및 재발급 처리
- 게임 대기방, 로비 등 인증 기반 접근 제한 처리
</code>
</pre> 
---

## 🧩 주요 기능

| 페이지 / 컴포넌트 | 설명 |
|------------------|------|
| `lobby` | 생성된 게임방 리스트 조회 및 참가 |
| `create_room` | AI를 선택하여 게임방 생성 |
| `game` | 게임 화면, AI vs AI 또는 AI vs 유저 플레이 |
| `waiting` | 게임 대기방 UI (상대 AI 준비 상태 확인) |
| `my-ai` | 사용자가 보유한 AI 모델 리스트 |
| `ranking` | AI 랭킹 테이블 및 페이지네이션 |
| `my_page` | 유저 정보 및 AI 업로드 기록 확인 |
| `signin`, `login` | 회원가입 및 로그인 기능 제공 |

---

## 👨‍💻 팀원 및 기여

| 이름 | 역할 |
|------|------|
| 이서준 | 상태관리, 인증 처리, 전반적 구조 설계 |
| 팀원B | 전체 UI 개발, 게임 화면 및 반응형 구현 |
| 팀원A | AI 서버 연동, Axios API 작성 |
