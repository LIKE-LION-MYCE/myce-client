import { BrowserRouter } from "react-router-dom";
import AppRouteBody from "./AppRouteBody";
import ScrollToTop from "../common/ScrollToTop";

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <AppRouteBody/>
    </BrowserRouter>
  );
}

export default AppRouter;
