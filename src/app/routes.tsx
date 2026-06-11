import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";
import { Preferences } from "./components/Preferences";
import { Home } from "./components/Home";
import { FreeWalking } from "./components/FreeWalking";
import { SearchPlace } from "./components/SearchPlace";
import { RouteSelection } from "./components/RouteSelection";
import { Navigation } from "./components/Navigation";
import { Summary } from "./components/Summary";
import { IssueReport } from "./components/IssueReport";
import { MyPage } from "./components/MyPage";
import { History } from "./components/History";
import { KakaoCallback } from "./components/KakaoCallback";
import { RequireAuth } from "./components/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/auth/kakao/callback",
    Component: KakaoCallback,
  },
  {
    element: <RequireAuth allowTempUser />,
    children: [
      { path: "/signup", Component: SignUp },
      { path: "/preferences", Component: Preferences },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      { path: "/home", Component: Home },
      { path: "/search", Component: FreeWalking },
      { path: "/search-place", Component: SearchPlace },
      { path: "/routes", Component: RouteSelection },
      { path: "/navigation", Component: Navigation },
      { path: "/summary", Component: Summary },
      { path: "/report", Component: IssueReport },
      { path: "/mypage", Component: MyPage },
      { path: "/history", Component: History },
    ],
  },
]);
