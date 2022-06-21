import Vue from "vue";
import VueRouter from "vue-router";
import MainLayout from "../views/MainLayout.vue";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import CreateBlog from "../views/CreateBlog.vue";
import BlogPage from "../views/BlogPage";
import Slider from "../components/Slider.vue";
import Account from "../views/AccountPage";
import MyAccount from "../views/AccountPage/components/MyAccount.vue";
import MyBlogs from "../views/AccountPage/components/MyBlogs.vue";
import MyComments from "../views/AccountPage/components/MyComments.vue";
import Calculator from "../views/AccountPage/components/Calculator.vue";
import CategoryPage from "../views/CategoryPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/account",
    component: Account,
    children: [
      {
        path: "blogs",
        name: "MyBlogs",
        component: MyBlogs,
      },
      {
        path: "comments",
        name: "MyComments",
        component: MyComments,
      },
      {
        path: "",
        name: "Account",
        component: MyAccount,
      },
      {
        path: "calculator",
        name: "Calculator",
        component: Calculator,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/create",
    name: "CreateBlog",
    component: CreateBlog,
  },
  {
    path: "/edit",
    name: "Edit",
    component: CreateBlog,
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "Home",
        components: {
          slider: Slider,
          default: Home,
        },
      },
      {
        path: ":category",
        name: "CategoryPage",
        component: CategoryPage,
      },
      {
        path: ":category/:blogId",
        name: "BlogPage",
        component: BlogPage,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
