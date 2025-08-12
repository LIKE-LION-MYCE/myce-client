### 서비스 폴더링 규칙
프론트엔드의 외부 api 호출은 위 폴더에서 인스턴스화하여 화면 컴포넌트에 추가합니다.
### 폴더 구조
├── lib  <br>
│   └── axios.js : axios instance  <br>
└── service  <br>
&nbsp;&nbsp;&nbsp;&nbsp;├── auth : 로그인, 회원가입 기능  <br>
&nbsp;&nbsp;&nbsp;&nbsp;├── guest : 비회원 활동 기능  <br>
&nbsp;&nbsp;&nbsp;&nbsp;├── user : 회원 활동 기능  <br>
&nbsp;&nbsp;&nbsp;&nbsp;├── expo-admin : 박람회 관리자 페이지 기능  <br>
&nbsp;&nbsp;&nbsp;&nbsp;└── platform-admin : 플랫폼 관리자 페이지 기능
&nbsp;&nbsp;&nbsp;&nbsp;└── system : 시스템 기능


* 세부 기능은 해당 도메인 폴더에서 폴더로 구분해주세요.
