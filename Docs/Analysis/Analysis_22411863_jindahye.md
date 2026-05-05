
# **MyRoute** 
Analysis
<br>
<br>

![MyRoute 로고](./MyRoute_logo.png)
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

<br>
<br>

## 2. Use case analysis

### 2.1 Use Case Diagram
![UseCase Diagram](./MyRoute_UseCaseDiagram.png)
*[그림 2-1] Use Case Diagram*
<br>

### 2.2 Use Case Description
<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #1 : 로그인 (Login)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자가 SNS 계정으로 MyRoute에 인증한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-05-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">Auth Service</td></tr>
    <tr><td>Preconditions</td><td colspan="2">앱이 설치되어 있고 인터넷 연결이 가능해야 한다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">메인 화면에서 "SNS 로그인"을 선택한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">사용자가 인증된 상태로 메인 화면에 진입한다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">로그인 화면에 머물고 오류 메시지가 표시된다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 앱을 실행한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">사용자가 "SNS 로그인"을 선택한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">System이 Auth Service에 인증을 요청한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">사용자가 SNS 계정 정보를 입력하고 동의한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">Auth Service가 액세스 토큰을 반환한다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">System이 토큰을 저장하고 메인 화면을 표시한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">4</td><td colspan="2">4a. 사용자가 인증을 거부한 경우</td></tr>
    <tr><td colspan="2">4a.1. System이 로그인 화면으로 복귀한다.</td></tr>
    <tr><td rowspan="3" style="text-align:center;">5</td><td colspan="2">5a. Auth Service 응답이 실패한 경우</td></tr>
    <tr><td colspan="2">5a.1. 네트워크 오류 메시지를 출력한다.</td></tr>
    <tr><td colspan="2">5a.2. 재시도 버튼을 제공한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">High</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #2 : 회원가입 (Sign Up)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">신규 사용자가 SNS 계정으로 MyRoute에 회원으로 등록한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-05-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">Auth Service</td></tr>
    <tr><td>Preconditions</td><td colspan="2">SNS 계정을 보유하고 있고 MyRoute에 미가입 상태이다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">최초 SNS 로그인 시 시스템이 미등록 사용자임을 감지한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">사용자 정보가 시스템에 저장되고 로그인 상태로 진입한다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">회원가입이 취소되고 초기 화면으로 복귀한다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 SNS 인증을 시도한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">System이 미등록 사용자임을 확인한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">System이 약관 동의 화면을 표시한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">사용자가 약관에 동의한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">System이 기본 프로필을 생성하여 DB에 저장한다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">System이 메인 화면을 표시한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">4</td><td colspan="2">4a. 사용자가 약관에 동의하지 않은 경우</td></tr>
    <tr><td colspan="2">4a.1. System이 가입 절차를 중단하고 초기 화면으로 복귀한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">5</td><td colspan="2">5a. DB 저장에 실패한 경우</td></tr>
    <tr><td colspan="2">5a.1. System이 오류 메시지를 출력하고 재시도 버튼을 제공한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">Low</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #3 : 프로필 관리 (Manage Profile)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자가 보행 선호도와 이동 제약 사항을 등록·수정한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-05-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">없음</td></tr>
    <tr><td>Preconditions</td><td colspan="2">사용자가 로그인 상태이다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">마이페이지에서 "프로필 수정"을 선택한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">변경된 프로필 정보가 DB에 저장된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">변경 사항이 저장되지 않고 이전 상태가 유지된다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 마이페이지에서 프로필 수정을 선택한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">System이 현재 프로필 정보를 표시한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">사용자가 항목(휠체어/유아차/반려동물 동반 등)을 선택 또는 해제한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">사용자가 저장을 요청한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">System이 변경 사항을 DB에 저장한다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">System이 저장 완료 메시지를 표시한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">5</td><td colspan="2">5a. DB 저장에 실패한 경우</td></tr>
    <tr><td colspan="2">5a.1. System이 오류 메시지를 출력하고 변경 사항을 화면에 유지한 채 재시도 버튼을 제공한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">Low</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #4 : 시설 탐색 (Browse Facilities)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자가 현재 위치 주변의 편의 시설을 지도에서 확인한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-05-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">External Map API, Public Data</td></tr>
    <tr><td>Preconditions</td><td colspan="2">사용자가 로그인 상태이고 위치 권한이 허용되어 있다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">사용자가 지도 화면에 진입한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">지도 위에 주변 시설 아이콘이 표시된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">지도 또는 시설 정보가 표시되지 않고 오류 메시지가 출력된다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 지도 화면에 진입한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">System이 사용자의 현재 위치를 획득한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">System이 External Map API에 지도 타일을 요청한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">System이 Public Data에서 주변 시설 좌표를 조회한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">System이 지도 위에 시설 아이콘을 렌더링한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">2</td><td colspan="2">2a. 위치 권한이 거부된 경우</td></tr>
    <tr><td colspan="2">2a.1. System이 권한 요청 안내를 표시하고 기본 위치(예: 서울 시청)를 기준으로 지도를 표시한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">3</td><td colspan="2">3a. External Map API 응답이 실패한 경우</td></tr>
    <tr><td colspan="2">3a.1. System이 네트워크 오류 메시지와 재시도 버튼을 표시한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">4</td><td colspan="2">4a. Public Data 응답이 없는 경우</td></tr>
    <tr><td colspan="2">4a.1. System이 시설 아이콘을 생략하고 지도만 표시한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">High</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #5 : 안전 경로 추천 (Recommend Safe Route)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자가 입력한 목적지까지 안전 정보가 반영된 보행 경로를 추천받는다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-05-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">External Map API, Public Data</td></tr>
    <tr><td>Preconditions</td><td colspan="2">사용자가 로그인 상태이고 출발지·목적지가 지정되어 있다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">사용자가 "경로 검색"을 선택한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">위험 구간이 시각적으로 표시된 추천 경로가 사용자에게 제시된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">추천 경로가 표시되지 않고 오류 메시지가 출력된다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 출발지와 목적지를 입력한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">사용자가 "경로 검색"을 선택한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">System이 External Map API에 경로 데이터를 요청한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">External Map API가 후보 경로를 반환한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">System이 안전 필터 적용(UC #6)을 호출한다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">System이 위험 구간이 표시된 경로를 사용자에게 제시한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="3" style="text-align:center;">4</td><td colspan="2">4a. API가 경로를 찾지 못한 경우</td></tr>
    <tr><td colspan="2">4a.1. System이 "경로를 찾을 수 없음" 메시지를 표시한다.</td></tr>
    <tr><td colspan="2">4b. API 응답이 실패한 경우 → System이 네트워크 오류 메시지와 재시도 버튼을 표시한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">5</td><td colspan="2">5a. 안전 데이터가 부재한 경우</td></tr>
    <tr><td colspan="2">5a.1. System이 기본 경로만 표시하고 "안전 정보 없음" 알림을 표시한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">High</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #6 : 안전 필터 적용 (Apply Safety Filter)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">System이 외부 API로부터 받은 경로 위에 안전 정보를 매핑한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute</td></tr>
    <tr><td>Level</td><td colspan="2">Subfunction Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-05-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">System</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">Public Data</td></tr>
    <tr><td>Preconditions</td><td colspan="2">외부 API로부터 수신된 경로 데이터가 시스템에 존재한다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">UC #5(안전 경로 추천)에서 &lt;&lt;include&gt;&gt; 관계로 호출된다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">각 구간에 안전 점수가 부여된 경로가 반환된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">안전 점수가 매핑되지 않은 원본 경로가 반환된다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">System이 경로의 좌표 시퀀스를 추출한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">System이 Public Data에서 해당 구간의 안전 데이터(경사도, 노면 상태 등)를 조회한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">System이 각 구간에 안전 점수를 산출한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">System이 위험 구간을 마킹한 경로 객체를 반환한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">2</td><td colspan="2">2a. Public Data 응답이 없는 경우</td></tr>
    <tr><td colspan="2">2a.1. System이 안전 점수를 부여하지 않고 원본 경로를 그대로 반환한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">High</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #7 : 실시간 안내 및 로깅 (Walk & Log)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자가 보행하는 동안 System이 길을 안내하고 이동 경로를 기록한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-05-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">External Map API</td></tr>
    <tr><td>Preconditions</td><td colspan="2">사용자가 로그인 상태이고 위치 권한이 허용되어 있다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">사용자가 "보행 시작"을 선택한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">보행 로그가 DB에 저장되고 종료 요약 화면이 표시된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">보행 로그가 저장되지 않거나 안내가 중단된다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 "보행 시작"을 선택한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">System이 GPS 추적을 시작한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">System이 현재 위치를 지도에 실시간 표시한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">System이 일정 주기로 GPS 좌표를 로그에 누적한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">사용자가 "보행 종료"를 선택한다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">System이 누적 거리·시간·칼로리를 계산한다.</td></tr>
    <tr><td style="text-align:center;">7</td><td colspan="2">System이 종료 요약 화면을 표시하고 로그를 DB에 저장한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">2</td><td colspan="2">2a. 위치 권한이 거부된 경우</td></tr>
    <tr><td colspan="2">2a.1. System이 보행 시작을 중단하고 권한 요청 안내를 표시한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">3</td><td colspan="2">3a. GPS 신호가 약한 경우</td></tr>
    <tr><td colspan="2">3a.1. System이 "신호 약함" 알림을 표시하고 마지막 유효 좌표를 유지한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">4</td><td colspan="2">4a. 사용자가 추천 경로를 이탈한 경우</td></tr>
    <tr><td colspan="2">4a.1. System이 이탈 알림을 표시하고 자유 산책 모드로 전환하며 로깅은 계속한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">7</td><td colspan="2">7a. DB 저장에 실패한 경우</td></tr>
    <tr><td colspan="2">7a.1. System이 로그를 로컬에 임시 저장하고 네트워크 복구 시 자동 재전송한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">High</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #8 : 변경사항 제보 (Report Change)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자가 지도 정보와 다른 실제 도로 상황을 시스템에 제보한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-05-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">Public Data</td></tr>
    <tr><td>Preconditions</td><td colspan="2">사용자가 로그인 상태이고 위치 권한이 허용되어 있다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">사용자가 "제보하기"를 선택한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">제보 내용이 DB에 저장되고 접수 완료 메시지가 표시된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">제보가 저장되지 않고 오류 메시지가 표시된다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 "제보하기"를 선택한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">System이 제보 양식을 표시한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">사용자가 제보 유형(공사/장애물/시설 변경 등)과 설명을 입력한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">System이 사용자의 현재 위치를 자동 첨부한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">사용자가 제보를 제출한다.</td></tr>
    <tr><td style="text-align:center;">6</td><td colspan="2">System이 제보 데이터를 DB에 저장한다.</td></tr>
    <tr><td style="text-align:center;">7</td><td colspan="2">System이 접수 완료 메시지를 표시한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="2" style="text-align:center;">4</td><td colspan="2">4a. 위치 권한이 거부된 경우</td></tr>
    <tr><td colspan="2">4a.1. System이 사용자에게 위치를 직접 지정하도록 요청한다.</td></tr>
    <tr><td rowspan="2" style="text-align:center;">6</td><td colspan="2">6a. DB 저장에 실패한 경우</td></tr>
    <tr><td colspan="2">6a.1. System이 오류 메시지를 출력하고 입력 내용을 유지한 채 재시도 버튼을 제공한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">Low</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>
<br>

<table>
  <thead><tr><th colspan="3" style="text-align:center;">Use case #9 : 과거 이력 조회 (View Activity History)</th></tr></thead>
  <tbody>
    <tr><td colspan="3"><b>GENERAL CHARACTERISTICS</b></td></tr>
    <tr><td width="25%">Summary</td><td colspan="2">사용자가 과거 보행 활동 기록을 조회한다.</td></tr>
    <tr><td>Scope</td><td colspan="2">MyRoute</td></tr>
    <tr><td>Level</td><td colspan="2">User Level</td></tr>
    <tr><td>Author</td><td colspan="2">진다혜</td></tr>
    <tr><td>Last Update</td><td colspan="2">2026-05-05</td></tr>
    <tr><td>Status</td><td colspan="2">Analysis</td></tr>
    <tr><td>Primary Actor</td><td colspan="2">User</td></tr>
    <tr><td>Secondary Actor</td><td colspan="2">없음</td></tr>
    <tr><td>Preconditions</td><td colspan="2">사용자가 로그인 상태이고 저장된 보행 로그가 1개 이상 존재한다.</td></tr>
    <tr><td>Trigger</td><td colspan="2">사용자가 마이페이지에서 "활동 이력"을 선택한다.</td></tr>
    <tr><td>Success Post Condition</td><td colspan="2">사용자가 선택한 보행 기록의 상세 정보가 표시된다.</td></tr>
    <tr><td>Failed Post Condition</td><td colspan="2">이력 목록이 표시되지 않고 오류 또는 안내 메시지가 출력된다.</td></tr>
    <tr><td colspan="3"><b>MAIN SUCCESS SCENARIO</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Action</td></tr>
    <tr><td style="text-align:center;">1</td><td colspan="2">사용자가 "활동 이력"을 선택한다.</td></tr>
    <tr><td style="text-align:center;">2</td><td colspan="2">System이 DB에서 사용자의 보행 로그 목록을 조회한다.</td></tr>
    <tr><td style="text-align:center;">3</td><td colspan="2">System이 날짜순으로 정렬된 목록을 표시한다.</td></tr>
    <tr><td style="text-align:center;">4</td><td colspan="2">사용자가 특정 항목을 선택한다.</td></tr>
    <tr><td style="text-align:center;">5</td><td colspan="2">System이 해당 보행의 상세 정보(경로·거리·시간)를 표시한다.</td></tr>
    <tr><td colspan="3"><b>EXTENSION SCENARIOS</b></td></tr>
    <tr><td style="text-align:center;">Step</td><td colspan="2">Branching Action</td></tr>
    <tr><td rowspan="3" style="text-align:center;">2</td><td colspan="2">2a. 저장된 로그가 없는 경우</td></tr>
    <tr><td colspan="2">2a.1. System이 "기록이 없습니다" 메시지를 표시한다.</td></tr>
    <tr><td colspan="2">2b. DB 조회에 실패한 경우 → System이 오류 메시지와 재시도 버튼을 표시한다.</td></tr>
    <tr><td colspan="3"><b>RELATED INFORMATION</b></td></tr>
    <tr><td>Performance</td><td colspan="2">≤ 3 Seconds</td></tr>
    <tr><td>Frequency</td><td colspan="2">Medium</td></tr>
    <tr><td>Concurrency</td><td colspan="2">Multiple</td></tr>
    <tr><td>Due Date</td><td colspan="2">2026-05-30</td></tr>
  </tbody>
</table>

<br>
<br>

## 3. Domain Analysis
Class|Description
---|---
User | 서비스에 가입한 사용자이다. 카카오 OAuth 등의 SNS 인증을 통해 식별되며 자신의 프로필, 보행 로그, 제보 내역 등을 관리한다.
UserPreference|사용자의 보행 특성 및 이동 제약 사항 등을 관리한다. 계단, 경사로 등이 포함되며 안전 경로 추천 시 가중치로 활용된다.
Route|목적지까지의 이동 경로 정보를 담는다. 지도의 데이터와 시스템의 안전 필터가 결합된 최종 결과물이다. 실제 이동 경로가 아닌 추천 경로이다.
RouteSegment|전체 경로를 구성하는 단위 도로 구간이다. 각 구간의 경사도나 노면 상태 등 물리적 데이터를 안전 필터 로직과 대조하는 최소 단위가 된다.
SafetyData|공공 데이터로부터 수집한 도로의 객관적인 환경 정보이다. 특정 구간의 경사도, 장애물 유무 등 UserPreference와 비교될 데이터이다.
WalkingLog|보행 완료 후 생성되는 활동 통계이다. 이동 거리와 소요 시간 등을 계산하여 사용자의 과거 이력으로 저장하며 실제 이동 궤적을 기록한다.
GPSPoint|보행 중 실시간으로 수집되는 위도와 경도 데이터이다. 시간 순으로 연결되어 WalkingLog의 구체적인 이동 궤적을 형성한다.
Facility|지도상에 표시되는 편의 시설 정보이다. 보행 약자에게 필요한 시설의 카테고리와 위치를 분류하여 제공한다.
Report|사용자가 직접 제보한 도로 현황 데이터이다. 실제 도로 상황과 시스템 데이터 간의 차이를 보완하는 역할을 수행한다.
Location|시스템 전반에서 재사용되는 위치 정보 클래스이다. 좌표값 처리 기능을 캡슐화하여 위경도 정보를 일관되게 관리한다.

<br>
<br>

## 4. User Interface prototype

<br>
<br>

## 5. Glossary

<br>
<br>

## 6. References