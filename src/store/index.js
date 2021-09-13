import Vue from 'vue';
import Vuex from 'vuex';
import { db } from '../firebase/firebaseInit';
import router from '../router';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      userId: "",
      userName: "",
      email: "",
      imgUrl: "",
    },
    blog: {
      contentHtml: "",
      title: "",
      description: "",
      category: "technology",
      thumbnailImg: "",
    },
    blogList: [],
    commentsList: [],
    getUserLoading: true,
    boxState: null,
    previousPath: "",
  },
  getters: {
    capitalLetter(state) {
      let firstLetter = state.user.userName[0]?.toUpperCase();
      return firstLetter;
    },
    getBlogsByCategory(state) {
      return (category) => {
        return state.blogList.filter(blog => blog.category === category);
      }
    },
    getBlog(state) {
      return async (blogId) => {
        let findBlog = state.blogList.find(blog => blog.blogId === blogId);
        if (findBlog) {
          try {
            let user = await db
              .collection("users")
              .doc(findBlog.userId)
              .get();
            let { userName, imgUrl } = user.data();
            return {
              ...findBlog,
              userName,
              imgUrl
            }
          } catch (error) {
            console.log(error.message)
          }
        }
      }
    }
  },
  mutations: {
    updateUserInfo(state, payload) {
      state.user = payload;
      if (state.previousPath) {
        router.push(state.previousPath);
      }
    },
    accoutLogout(state) {
      state.user = {
        userId: "",
        userName: "",
        email: ""
      }
    },
    cancelGetUser(state) {
      state.getUserLoading = false;
    },
    handleSetBlog(state, payload) {
      let { property, value } = payload;
      state.blog = {
        ...state.blog,
        [property]: value
      }
    },
    handleEditBlog(state, blogId) {
      let BlogEdited = state.blogList.find(blog => blog.blogId === blogId);
      state.blog = BlogEdited;
    },
    handleClearBlog(state) {
      state.blog = {
        contentHtml: "",
        title: "",
        description: "",
        category: "technology",
      }
    },
    setAvatarUrlToStore(state, imgUrl) {
      state.user.imgUrl = imgUrl;
    },
    updateCommentsToStore(state, comments) {
      state.commentsList = comments
    },
    handleChangeBoxState(state, commentId = undefined) {
      if (commentId) {
        if (state.boxState !== commentId) {
          state.boxState = commentId
        } else {
          state.boxState = null;
        }
      } else {
        state.boxState = null;
      }
    },
    setPreviousUrlToRedirect(state, path) {
      if (path !== "/login" && path !== "/register") {
        state.previousPath = path;
      }
    }
  },
  actions: {
    async getUserInfo({ commit, state }, userId) {
      state.getUserLoading = true;
      try {
        let userInfo = await db.collection("users").doc(userId).get();
        commit("updateUserInfo", userInfo.data());
      } catch (error) {
        console.error(error);
      }
      state.getUserLoading = false;
    },
    async fetchBlogsFromFirebase({ commit, state }, blogInfo) {
      try {
        let blogsRequest = await db.collection("blogs").get();
        let blogs = blogsRequest.docs.map(doc => doc.data());
        let sortBlogs = blogs.sort((a, b) => b.created - a.created);
        state.blogList = sortBlogs;
        commit("handleClearBlog");
        if (blogInfo) {
          router.push({
            name: "BlogPage",
            params: {
              category: blogInfo.category,
              blogId: blogInfo.blogId,
            },
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async handleDeleteBlogInStore({ state }, blogId) {
      state.blogList = state.blogList.filter(blog => blog.blogId !== blogId);
      try {
        await db.collection("blogs").doc(blogId).delete();
        console.log("delete successfully");
      } catch (err) {
        console.log(err.message);
      }
    }
  },
  modules: {
  }
})
