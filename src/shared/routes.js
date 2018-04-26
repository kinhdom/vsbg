import Home from "./components/Home/Home";
import Detail from "./components/Detail/Detail";
const routes = [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: "/detail/:id",
    component: Detail
  }
];

export default routes;
