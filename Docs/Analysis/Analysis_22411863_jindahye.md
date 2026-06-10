# **MyRoute** Analysis
<br>
<br>

![MyRoute 로고](./images/MyRoute_logo.png)
<br>
<br>

**Student No: 22411863**

**Name: 진다혜**

**E-mail: jindahye0315_@naver.com**

<br>

## [ Revision history ]

Revision date|Version #|Description|Author
---|---|---|---
2026/05/01 | 0.0.1 | 양식 작성  | 진다혜
2026/05/05 | 0.1.0 | Use case analysis 작성 | 진다혜
2026/05/06 | 0.2.0 | Domain Analysis 파트 작성 완료 | 진다혜
2026/05/08 | 1.0.0 | 최종 문서 작성 완료 | 진다혜
2026/06/05 | 2.0.0 | 프로젝트 진행에 따라 use case 및 문서 수정| 진다혜

<br>
<br>

## = Contents =
1. Introduction ........................................................................................................ 

2. Use case analysis .............................................................................................. 

3. Domain analysis ................................................................................................

4. User Interface prototype ............................................................................... 

5. Glossary ................................................................................................................

6. References ........................................................................................................... 

<br>
<br>

## 1. Introduction

### 1.1 Summary
본 문서는 사용자 맞춤형 보행 안전 경로 추천 서비스인 MyRoute의 요구사항 분석 및 시스템 구조를 기술한 상세 보고서이다. MyRoute는 보행 약자의 이동권 증진과 보행자의 안전한 산책 환경을 보장하기 위해 기획된 보행 전용 내비게이션 및 활동 기록 서비스이다.

본 서비스는 사용자의 현재 상황(영유아차, 휠체어 사용 등)이나 보행 선호도(경사도 기피, 바퀴 기구 사용 등)를 입력받아 이를 경로 산출 가중치로 반영한다. 본 보고서는 이러한 기획 의도를 바탕으로 유스케이스 및 도메인을 정밀 분석하고, 실제 컴포넌트와 매핑되는 UI 프로토타입의 상관관계를 명세한다.

### 1.2 프로젝트의 주요 특징 (Prominent Features)

#### 1) 유용성 (Usefulness)
단순 최단 거리 탐색에서 벗어나 사용자의 신체 조건(휠체어, 유아차 등)과 보행 환경 선호도를 결합한 '안전 경로'를 제공함으로써 교통 약자의 실질적인 이동 편의를 증진한다.

#### 2) 의의 (Significance)
공공 데이터와 사용자 제보를 결합하여 사회적 보행 안전망을 구축하고 누구나 제약 없이 이동할 수 있는 배리어 프리 가치를 실현한다.

#### 3) 확장성 (Expandability)
수집된 보행 위험 데이터는 향후 지자체의 도로 정비 우선순위 결정의 기초 자료로 활용될 수 있으며, 러닝/등산 등 다양한 야간 야외 활동 서비스로 모델 확장이 용이하다.
<br>
<br>

## 2. Use case analysis

### 2.1 Use Case Diagram
![UseCase Diagram](./images/MyRoute_UseCaseDiagram.png)
<br>

### 2.2 Use Case Description

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #1 : 로그인 (Login)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자가 외부 카카오 계정 인증 시스템을 통해 시스템에 인증을 수행하고 권한을 획득한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute System (Login, KakaoCallback)</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-06-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis Completed</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">Kakao Auth API (Auth Service), SQLite Database</td></tr>
    <tr><td>Preconditions</td><td colspan="2">어플리케이션이 구동되어야 하며 네트워크 통신이 가능한 상태여야 한다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">사용자가 로그인 화면에서 '카카오 로그인' 버튼을 선택한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">사용자 식별 세션 정보가 LocalStorage에 연동되며 메인 Home 화면으로 진입한다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">로그인 상태 진입에 실패하고, 안내 팝업 출력 후 Login 대기 화면을 유지한다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 Login 컴포넌트에서 카카오 로그인 버튼을 선택한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">System이 외부 Kakao Auth API 서버로 리다이렉트하여 사용자 인증을 위임한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">인증 완료 후 인가 코드를 확보한 KakaoCallback 컴포넌트가 백엔드 AuthRouter로 검증을 요청한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">백엔드 AuthRouter가 SQLite Database의 users 테이블을 조회하여 기존 회원 등록 여부를 판별한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">기존 유저임이 확인되면 회원 프로필 객체를 반환하고, 클라이언트는 이를 LocalStorage에 적재한 뒤 Home 화면으로 진입한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">4</td><td colspan="2">4a. 데이터베이스 조회 결과 미등록 신규 회원(`isNewUser == true`)으로 식별된 경우</td></tr>
    <tr><td colspan="2">4a.1. System이 로그인 절차를 유예하고 회원가입(UC #2) 시퀀스로 화면 전환을 강제한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">5</td><td colspan="2">5a. 외부 API 인증 네트워크 타임아웃 발생 시</td></tr>
    <tr><td colspan="2">5a.1. "인증 서버와의 통신이 원활하지 않습니다" 경고 팝업을 출력하고 초기 화면을 유지한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">High (매 앱 첫 구동 시)</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #2 : 회원가입 (Sign Up)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">최초 인증을 수행한 신규 사용자에게 고유 닉네임과 개인화 보행 취향을 입력받아 회원으로 등록한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute System (SignUp, Preferences)</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-06-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis Completed</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">SQLite Database</td></tr>
    <tr><td>Preconditions</td><td colspan="2">UC #1(로그인) 과정을 통해 카카오 인증 토큰 정보를 중계받은 미등록 신규 유저 상태여야 한다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">로그인 시 백엔드로부터 신규 회원 식별 플래그를 수신하여 가입 온보딩 화면이 트리거된다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">신규 회원 레코드가 DB users 테이블에 INSERT 처리를 완료하고 정식 세션이 수립된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">회원가입 트랜잭션이 취소되거나 롤백되어 초기 로그인 화면으로 튕겨 나간다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">SignUp 컴포넌트가 활성화되고 사용자는 서비스 내부에서 사용할 닉네임을 타이핑한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">사용자가 '다음' 버튼을 누르면 Preferences 컴포넌트로 전이되어 산책 취향 필터 옵션을 선택한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">사용자가 경사로 회피, 계단 이용 가능 여부, 바퀴 기구 사용(휠체어/유모차) 등의 물리 플래그를 마킹한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">사용자가 '완료'를 트리거하면 클라이언트가 입력 데이터를 조합하여 백엔드 AuthRouter로 가입 요청을 송신한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">AuthRouter가 SQLite Database의 users 테이블에 새로운 유저 레코드를 영구 저장(INSERT)한다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">가입 완료 신호와 함께 사용자 세션을 로컬에 동기화하고 메인 Home 화면으로 라우팅을 수행한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">1</td><td colspan="2">1a. 입력된 닉네임이 공백이거나 유효성 규격(특수문자 등)에 어긋나는 경우</td></tr>
    <tr><td colspan="2">1a.1. 에러 텍스트를 인라인으로 렌더링하고 '다음' 단계로의 전이를 불허한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">5</td><td colspan="2">5a. 데이터베이스 제약 조건 위배 또는 파일 쓰기 에러 발생 시</td></tr>
    <tr><td colspan="2">5a.1. "서버 오류로 인해 회원 등록에 실패했습니다" 문구 스낵바를 노출하고 기존 입력값을 유지한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">Low (사용자당 최초 1회 생성)</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #3 : 안전 경로 추천 및 가이드 (Recommend Route & Navigate)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자의 개인 맞춤형 보행 선호 취향과 공공데이터 인프라 정보를 융합 계산하여 최적 경로를 도출하고, 실시간 주행 트래킹을 수행하여 최종 요약 로그를 적재한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute System (RouteSelection, Navigation, Summary)</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-06-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis Completed</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">Kakao Map API, 공공데이터포털 Open API, SQLite Database</td></tr>
    <tr><td>Preconditions</td><td colspan="2">로그인 상태가 유효해야 하며, 디바이스의 하드웨어 GPS 위치 권한 승인이 완료되어야 한다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">메인 화면 목적지 입력창에서 유효한 POI를 지정 후 '추천 경로 찾기' 액션을 트리거한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">산책 활동이 정상 수렴되어 walk_histories 테이블에 주행 로그 인서트를 완료하고 요약 화면을 표출한다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">경로 수립 실패 또는 트래킹 비정상 중단 시 데이터 커밋 없이 이전 허브 상태로 롤백된다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 메인 대시보드 상단에서 목적지를 검색하여 지정을 완료한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">RouteSelection 컴포넌트가 사용자의 취향 필터 정보와 출발/목적지 좌표를 백엔드 RouteRouter로 전송한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">RouteRouter가 Kakao Map API의 기하 경로 구조 위에 정부 공공데이터 Open API로부터 수집된 구간별 경사도 및 무장애 인프라 지표를 병합 계산하여 가중치 필터 연산을 수행한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">산출된 추천 안전 경로 후보군 배열이 화면에 표출되면 사용자가 최적 경로를 픽스한 뒤 '산책 시작'을 클릭한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">Navigation 컴포넌트로 전이되면서 내부 타이머 틱 루프가 기동하고, 디바이스 GPS와 동기화되어 실시간 이동 거리, 시간, 속도를 계량 트래킹한다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">사용자가 보행을 종료하면 Summary 컴포넌트가 활성화되어 최종 축적된 활동 로그 명세를 서버로 커밋한다.</td></tr>
    <tr><td style="text-align:center;">7</td><td colspan="2">RouteRouter가 SQLite Database의 walk_histories 테이블에 주행 로그 레코드를 안전하게 적재(INSERT)한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">3</td><td colspan="2">3a. 정부 공공데이터 오픈 API 서버 다운으로 인해 실시간 가중치 인프라 조회가 차단된 경우</td></tr>
    <tr><td colspan="2">3a.1. 백엔드 시스템이 예외 트랩을 발동하여 위험 정보를 배제한 카카오 일반 표준 경로를 제공하되, 화면에 "안전 필터 미작동" 마커 알림을 렌더링한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">5</td><td colspan="2">5a. 터널, 빌딩 음영 지역 진입으로 인해 GPS 위경도 좌표 인입이 일시 차단되거나 깨지는 경우</td></tr>
    <tr><td colspan="2">5a.1. Navigation 상태 머신이 신호 약함 플래그를 켜고, 튕기기 전 마지막 유효 공간 데드 레코닝 좌표를 홀딩하여 오차를 필터링한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">가중치 경로 연산 및 지도 렌더링 총합 ≤ 3 Seconds 이내</td></tr>
    <tr><td>Frequency</td><td colspan="2">High (서비스 가치의 주 정량적 이용 경로)</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #4 : 자유 산책 및 위험 제보 (Free Walking & Issue Report)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">목적지 없는 완전 자율 보행 트래킹을 지원하는 도중 사용자가 현장에서 목격한 공사, 도로 파손 등 돌발 리스크를 데이터베이스에 즉각 제보하여 등록한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute System (FreeWalking, IssueReport)</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-06-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis Completed</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">Kakao Map API (지도 렌더링용), SQLite Database</td></tr>
    <tr><td>Preconditions</td><td colspan="2">로그인 인증 상태 세션이 온전해야 하며 백엔드 포트 개방 상태가 정상이어야 한다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">메인 홈 화면에서 '자유 산책 시작' 레이블 컴포넌트를 직접 트리거한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">현장 크라우드소싱 민원 원천 명세가 DB issue_reports 테이블에 완벽히 적재(INSERT)된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">제보 트랜잭션이 비정상 차단될 경우, 기존 데이터 손실을 막기 위해 입력 폼 버퍼 상태를 백업 유지한다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 메인 화면 하단 대시보드 구역에서 '자유 산책 시작' 단추를 선택한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">FreeWalking 컴포넌트가 활성화되며, 목적지 유무와 관계없이 디바이스 하드웨어 위경도 공간 데이터를 취합해 이동 실적을 실시간 화면에 표출한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">사용자가 보행 중 도로 싱크홀, 노면 공사 등의 위험 상황을 발견하고 우측 하단 제보 버튼(+)을 터치한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">IssueReport 컴포넌트로 화면이 전이되며, 시스템은 현재 조작 시점의 실시간 GPS 좌표를 제보 메타데이터에 자동 하드코딩 바인딩한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">사용자가 직관적인 UI 폼을 통해 위험 종류(공사중/파손/장애물)를 선택하고 상세 텍스트 설명을 기입한 뒤 '제보 제출'을 누른다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">백엔드 RouteRouter가 제보 페이로드를 가로채 안전 검증 필터를 거친 뒤 SQLite Database의 issue_reports 테이블에 커밋(INSERT) 처리를 완료한다.</td></tr>
    <tr><td style="text-align:center;">7</td><td colspan="2">성공 접수 알림 스낵바를 표출하고 직전의 지도 화면 상태로 자연스럽게 복귀시킨다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">4</td><td colspan="2">4a. GPS 음영으로 인해 제보 지점 공간 좌표 파싱이 비정상적으로 누락된 경우</td></tr>
    <tr><td colspan="2">4a.1. 화면 상에 지도 중심 크로스헤어 핀 드롭 인터페이스를 제공하여, 사용자가 직접 수동으로 지도상의 위험 지점을 터치 매핑하도록 보정 절차를 수행한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">제보 트랜잭션 DB 커밋 시간 ≤ 1 Second 이내</td></tr>
    <tr><td>Frequency</td><td colspan="2">Medium (도로 환경 특이사항 조우 시 수시 작동)</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #5 : 과거 이력 조회 (View Activity History)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자가 데이터베이스 영속성 공간에 세션별로 안전하게 적재된 본인의 과거 누적 보행 이력 리스트 데이터를 역순으로 호출하여 인터랙티브 카드 뷰 형태로 열람한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute System (History)</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-06-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis Completed</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">SQLite Database</td></tr>
    <tr><td>Preconditions</td><td colspan="2">사용자 세션 인증 상태가 로컬 브라우저 상에 보존되어 있어야 한다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">하단 고정 글로벌 내비게이션 탭바에서 '기록' 아이콘을 명확하게 탭한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">과거 총 보행 거리, 시간 소요 지표가 포함된 배열이 클라이언트 컴포넌트에 누수 없이 매핑 바인딩된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">조회 처리 에러 시, 데이터 무인식 빈 리스트 컴포넌트 처리와 함께 예외 안내문을 렌더링한다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 앱 내부 하단 글로벌 고정 탭바 구역에서 '기록' 아이콘을 터치한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">History 컴포넌트가 활성화되며 생명주기 훅(`useEffect`)을 발동해 백엔드 API 라우터인 RouteRouter로 이력 요청 객체를 찌른다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">RouteRouter가 SQLite Database를 개방하고 walk_histories 테이블에서 현재 로그인 세션 소유자의 외래키 ID 조건과 부합하는 레코드들을 최신 날짜 역순(DESC)으로 셀렉트 질의를 수행한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">조회 결과물 데이터셋이 정상 인입되면 JSON 직렬화 어레이 객체 형태로 프론트엔드로 안전하게 반환한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">History 화면이 로딩 인디케이터를 끄고 반환된 데이터 배열을 순회하며 일자별 산책 결과 카드 리스트 목록을 렌더링 표출한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">3</td><td colspan="2">3a. 데이터베이스 매핑 쿼리 수행 결과 기존 누적 로그가 완전히 전무한 제로 데이터 상태일 경우</td></tr>
    <tr><td colspan="2">3a.1. "아직 산책 기록이 없습니다. 첫 산책을 시작해 보세요!" 화면 정중앙 안내 대체 플레이스홀더 UI를 스위칭 렌더링한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">단일 세션 인덱스 쿼리 조회 통신 총합 ≤ 1.5 Seconds 이내 완료</td></tr>
    <tr><td>Frequency</td><td colspan="2">Medium (활동 이력 추적 및 분석 열람 시)</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #6 : 프로필 및 취향 수정 (Manage Profile & Preferences)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">마이페이지 관리 공간을 경유하여 저장되어 있던 유저의 고유 정보 및 보행 안전 가중치 필터 값을 실시간으로 정밀 수정하여 반영 동기화한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute System (MyPage, Preferences)</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-06-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis Completed</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">SQLite Database</td></tr>
    <tr><td>Preconditions</td><td colspan="2">LocalStorage 내부에 정식 발급된 유저 식별 토큰 컨텍스트 상태가 홀딩되어 있어야 한다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">하단 고정 글로벌 내비게이션 탭바에서 '마이' 메뉴를 선택 후 '산책 취향 수정' 로직을 터치한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">DB의 users 테이블 행 데이터가 영구 수정(UPDATE) 처리를 마감하고 화면 상태가 리로드 동기화된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">수정 무산 시 트랜잭션 취소 처리를 전개하고, 기존에 적재되어 있던 오리지널 안전 가중치 스냅샷 상태를 온전히 원복한다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 글로벌 내비게이션 바 메뉴 영역에서 '마이' 메뉴 탭을 선택한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">MyPage 컴포넌트가 로드되면서 보관 중인 닉네임 상태를 바인딩하고, 유저가 '산책 취향 수정' 하위 메뉴 진입을 전개한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">가입 당시 사용되었던 Preferences 다중 폼 컴포넌트가 수정 모드로 재활용되어 화면에 바인딩 팝업된다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">유저가 변동된 신체 요건이나 선호 조건(경사도 필터 해제, 바퀴 모드 활성화 등)을 수정 세팅 후 '저장 완료'를 선택한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">클라이언트 폼 데이터가 백엔드 AuthRouter로 갱신 요청 페이로드를 전달하며 데이터 세대교체를 선언한다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">AuthRouter가 SQLite Database를 제어하여 users 테이블의 해당 유저 프라이머리 키 행 데이터 레코드에 대해 정밀한 수정을 반영(UPDATE) 처리한다.</td></tr>
    <tr><td style="text-align:center;">7</td><td colspan="2">정상 반영 응답 확인과 함께 로컬 컨텍스트 상태 변수를 최신 동기화 리로드하며 마이페이지 메인 레이아웃으로 화면 복귀를 완료한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">UPDATE 갱신 연산 트랜잭션 시간 ≤ 2 Seconds 이내 수렴</td></tr>
    <tr><td>Frequency</td><td colspan="2">Low (신체 조건, 환경적 선호 조건이 변동할 때마다 제한적 발생)</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>

<br>
<br>

## 3. Domain Analysis

개념화 및 상세 설계 단계의 데이터베이스 객체 릴레이션 및 데이터 구조 명세서와 완벽히 동치되도록 도메인 구조를 구조화 및 정형화하였다.

Class|Description|Mapping Class / DB Component
---|---|---
**User** | 서비스 이용 권한이 부여된 코어 주체 마스터 객체이다. 카카오 소셜 계정의 유일한 해시 ID 키값을 바탕으로 식별 및 격리가 전개된다. | Class `Login`, `SignUp`, Table `users`
**UserPreference** | 복합 안전 보행 경로 추천 로직 연산 시 가중치 상수로 개입하는 다중 선택형 필터 데이터이다. 경사로 우회 조건, 계단 기피 지표, 영유아차 및 휠체어 등 바퀴 이동 수단 활성화 플래그 등으로 구조화된다. | Class `Preferences`, Field `users.preferences` (JSON/TEXT)
**Route** | 출발 노드부터 목적지 노드까지 안전하게 연결하기 위해 도출된 공간 선형 기하 데이터 배열이다. Kakao Map 기하 구간 위에 공공데이터 인프라 연산 스코어가 수립 완료된 정형화 데이터 객체이다. | Class `RouteSelection`, Endpoint `GET /api/routes/search`
**RouteSegment** | 전체 경로를 구성하는 가변적 길이의 최소 단위 도로 구간 아키텍처 노드이다. 특정 공간 위경도 범위 내에 존재하는 경사율, 장애물 인프라 밀집도를 보유하여 시스템 내부 가중치 스코어 연산의 기본 피연산 객체로 활용된다. | System Logic Internal Data Type
**SafetyData** | 국가 공공데이터포털 시스템을 통해 유입된 보행 안전 표준 물리 인프라 정보이다. 고정밀 등고선 지형 경사 정보, 배리어프리 엘리베이터 위치, 보도블록 파손 지수 등의 원천 정량 소스를 내포한다. | Public Data API Object Context
**WalkingLog** | 산책 활동이 무사히 종료(수렴)되는 타이밍에 Navigation 트레커의 누적 버퍼 값들을 집계하여 생산하는 통계 데이터 레코드 객체이다. | Class `Summary`, Table `walk_histories`
**GPSPoint** | 실시간 보행 안내 및 자율 주행 시 모바일 디바이스 하드웨어 가속기로부터 가변 주기로 인입되는 공간 위치 좌표(Latitude, Longitude) 원천 쌍 구조체이다. | Class `Navigation`, `FreeWalking`, DataType `GPSPoint`
**Report** | 지도 백로그 사양서에 잡히지 않는 돌발적인 도로의 공사 유무, 불법 주정차 장애물, 노면 균열 등의 상황을 집단 지성 기반 크라우드소싱 기법으로 수집한 돌발 위험 요소 인스턴스이다. | Class `IssueReport`, Table `issue_reports`

<br>
<br>

## 4. User Interface prototype

본 절에서는 실제 프론트엔드 환경에 배포된 마이루트(MyRoute) 시스템의 UI 프로토타입 결과물들을 명세한다. 각 인터페이스 상태는 2장의 6대 통합 요구사항 유즈케이스 명세와 유기적으로 매핑되어 동작한다.

### 4.1 Login (로그인)
![4.1 로그인 화면](./images/Login.png) <br>
서비스 실행 시 최초로 점유하는 인증 진입점 레이아웃 화면이다. 단일 목적의 카카오 소셜 간편 연동 컴포넌트가 배치되어 있으며 외부 소셜 인증 핸들러 기능을 통합 수행한다 **(Use Case #1 매핑)**.

### 4.2 Sign Up (회원가입)
![4.2 회원가입 화면](./images/SignUp.png)<br>
신규 진입 사용자 감지 시 강제 락(Lock) 조건으로 기동되는 온보딩 가입 화면이다. 사용자가 중복 없는 유일한 텍스트 식별 문자인 닉네임을 선언하여 제출하도록 입력 버퍼를 제공한다 **(Use Case #2 매핑)**.

### 4.3 Preferences (산책 취향 설정)
![4.3 취향 설정 화면](./images/Preferences.png)<br>
닉네임 입력 이후 혹은 마이페이지 수정을 통해 진입하는 옵션 제어 화면이다. 경사로 회피, 유모차/휠체어 바퀴 기구 사용 등 보행 연산 엔진에 인입될 다중 토글 옵션 필터를 설정한다 **(Use Case #2, #6 매핑)**.

### 4.4 Home (메인 대시보드)
![4.4 메인 화면](./images/Home.png)<br>
인증이 통과된 모든 정상적인 유저가 안착하는 허브 화면이다. 목적지를 입력할 수 있는 공간 검색 폼 바가 상단에 배치되어 있으며 추천 경로 진입과 자율 이동 기능의 분기 경로를 제안한다 **(Use Case #3, #4 매핑의 중심점)**.

### 4.5 Route Selection (추천 경로 선택)
![4.5 경로 선택 화면](./images/RouteSelection.png)<br>
백엔드 가중치 엔진이 연산해 낸 보행 약자 안전 최적화 추천 경로 후보군 어레이를 시각적인 카드로 나열한 화면이다. 예상 소요 시간, 완만한 평지 가이드 등의 식별 태그 메타 정보를 확인하고 최종 주행 선로를 선택한다 **(Use Case #3 매핑)**.

### 4.6 Navigation (실시간 산책 안내)
![4.6 내비게이션 화면](./images/Navigation.png)<br>
선택 경로의 폴리라인 선형 데이터 위에 사용자의 GPS 위치 마커를 올려 실시간 가이드를 진행하는 상태 화면이다. 하단부 계량 컴포넌트가 인터벌 루프를 통해 이동 거리(Float), 경과 시간(Integer) 사양을 실시간 드라이브한다 **(Use Case #3 매핑)**.

### 4.7 FreeWalking (자유 산책 시작)
![4.7 자유 산책 화면](./images/FreeWalking.png)<br>
목적지 속박 없이 자율적으로 보행하며 활동 실적을 트래킹하는 화면이다. Kakao Map 컴포넌트가 화면 전체에 표출되며, 보행 중 돌발 위험 요소를 인지했을 때 즉각 제보 폼으로 전이 가능한 퀵 액션 버튼(+)을 지원한다 **(Use Case #4 매핑)**.

### 4.8 Issue Report (상황 제보)
![4.8 상황 제보 화면](./images/IssueReport.png)<br>
현장에서 취합된 공간 위경도 정보 위에 돌발적 위험 요소 카테고리(공사/파손/장애물) 및 직접 타이핑한 구체 명세를 결합하여 데이터베이스 테이블에 업로드 요청을 날리는 양식 제출 인터페이스 화면이다 **(Use Case #4 매핑)**.

### 4.9 Summary (산책 종료 요약)
![4.9 종료 요약 화면](./images/Summary.png)<br>
모든 형태의 보행 활동이 클로징되는 순간 최종 요약 정보를 인덱싱하여 연산 표출하는 영수증 형태의 데이터 리포트 화면이다. 본 확인 액션을 통해 최종 영속성 데이터베이스 로그 적재 트랜잭션이 완료된다 **(Use Case #3 매핑)**.

### 4.10 History (활동 이력 조회)
![4.10 활동 이력 화면](./images/History.png)<br>
하단 고정 글로벌 내비바의 중앙 '기록' 아이콘을 터치하면 진단되는 과거 로그 데이터 스크롤 리스트 공간이다. SQLite 데이터베이스에 연결하여 과거의 기록을 리스트 카드로 예쁘게 정렬하여 표시한다 **(Use Case #5 매핑)**.

### 4.11 My Page (마이페이지)
![4.11 마이페이지 화면](./images/MyPage.png)<br>
계정 정보 확인 및 앱 설정을 통합 제어하는 유저 환경 설정 데스크 공간이다. '산책 취향 수정' 메뉴 링크 단추가 결합되어 있어, 언제든 신체 조건 변경에 따른 다중 토글 옵션의 핫 리로드 업데이트를 유도한다 **(Use Case #6 매핑)**.

<br>
<br>

## 5. Glossary

* **UML (Unified Modeling Language)** : 소프트웨어 시스템의 구조와 동작을 시각적으로 모델링하고 문서화하기 위해 사용하는 표준 다이어그램 표기법 규격.
* **추적성 (Traceability)** : 초기 개념 기획(Conceptualization)서의 아이디어가 분석(Analysis) 기능 요구사항을 거쳐 상세 설계(Design) 파트의 실제 파일 컴포넌트 구조까지 깨짐이나 모순 없이 1:1 논리적 연결을 유지하는 무결성 지표.
* **SQLite3** : 외부 서버 연동 비용 없이 독립된 단일 로컬 바이너리 파일(`myroute.db`) 시스템에 영속 데이터를 적재하고 제어하는 초경량 관계형 데이터베이스 임베디드 엔진.
* **Kakao Map API** : 웹 브라우저 캔버스 위에 고정밀 수치 지형 지도를 렌더링하고 경로 폴리라인 및 공간 제보 포인트 마커를 오버레이하기 위한 위치 공간 정보 외부 연동 오픈 웹 인터페이스.
* **공공데이터포털 Open API** : 행정안전부 및 국토교통부 등 국가 기관이 개방형으로 전송하는 전국 무장애 보행 인프라 및 종단 경사도 수치 원천 데이터셋 수집 인터페이스 소스.
* **LocalStorage** : 사용자의 OAuth 간편 로그인이 성립된 후 전달받은 유저 세션 식별 고유 토큰 및 기본 상태를 영구 보존하기 위한 브라우저 단의 저장 공간.

<br>
<br>

## 6. References

* NIKE RUN, 삼성 헬스