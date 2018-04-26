import News from "./news/News";
import Home from "../../home/Home"
const routes = [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: "/",
    component: News
  }
];

export default routes;
