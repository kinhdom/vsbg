import NewPost from "./components/NewPost/NewPost";
import Detail from "./components/Detail/Detail";
import TopPost from "./components/TopPost/TopPost";
import listGroup from "./components/Group/listGroup";
const routes = [
  {
    path: "/",
    exact: true,
    component: listGroup
  },
  {
    path: "/group/:group_id",
    component: NewPost
  },
  {
    path: "/detail/:id",
    component: Detail
  },
  {
    path: "/top/:group_id",
    component: TopPost
  }
];

export default routes;
