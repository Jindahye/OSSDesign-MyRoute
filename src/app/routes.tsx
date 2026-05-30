import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { Preferences } from "./components/Preferences";
import { Home } from "./components/Home";
import { SearchMap } from "./components/SearchMap";
import { RouteSelection } from "./components/RouteSelection";
import { Navigation } from "./components/Navigation";
import { Summary } from "./components/Summary";
import { IssueReport } from "./components/IssueReport";
import { MyPage } from "./components/MyPage";
import { History } from "./components/History"; 
import { KakaoCallback } from "./components/KakaoCallback";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/preferences",
    Component: Preferences,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/search",
    Component: SearchMap,
  },
  {
    path: "/routes",
    Component: RouteSelection,
  },
  {
    path: "/navigation",
    Component: Navigation,
  },
  {
    path: "/summary",
    Component: Summary,
  },
  {
    path: "/report", // 상황 제보 버튼(+ 버튼)과 연결되는 주소
    Component: IssueReport,
  },
  {
    path: "/mypage", // 마이페이지 버튼과 연결되는 주소
    Component: MyPage,
  },
  {
    path: "/history", // 기록 버튼과 연결되는 주소
    Component: History,
  },

  {
    path: "/auth/kakao/callback",
    Component: KakaoCallback,
  },
]);
