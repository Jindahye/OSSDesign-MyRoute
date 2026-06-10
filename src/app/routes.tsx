import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { Preferences } from "./components/Preferences";
import { Home } from "./components/Home";
import { FreeWalking } from "./components/FreeWalking";
import { SearchPlace } from "./components/SearchPlace"; // SearchPlace 컴포넌트 import 추가
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
    Component: FreeWalking,
  },
  {
    path: "/search-place", // 목적지 검색 및 리스트 화면 라우트 추가
    Component: SearchPlace,
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
    path: "/report",
    Component: IssueReport,
  },
  {
    path: "/mypage",
    Component: MyPage,
  },
  {
    path: "/history",
    Component: History,
  },
  {
    path: "/auth/kakao/callback",
    Component: KakaoCallback,
  },
]);