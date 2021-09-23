<template>
  <div class="app lightmode" ref="app">
    <header v-show="!isHidden">
      <nav-bar />
    </header>
    <main>
      <router-view></router-view>
    </main>
    <footer v-show="!isHidden">
      <p>All Rights Reserved by Glass © 2021</p>
    </footer>
    <div :class="handleShowBtn('btn')">
      <div
        :class="handleShowBtn('btn__scrolltotop')"
        @click="handleScrollToTop"
      >
        <div class="btn__scrolltotop-upicon"></div>
      </div>
      <div class="btn__changemode" @click="handleChangeMode">
        <i class="btn__changemode-sun" v-if="darkMode">
          <sun-icon />
        </i>
        <i class="btn__changemode-moon" v-else>
          <moon-icon />
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import firebase from "firebase/app";
import SunIcon from "./assets/Icons/sun.svg";
import MoonIcon from "./assets/Icons/moon.svg";
// import UpArrow from "./assets/Icons/up-arrow.svg";
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  name: "app",
  components: {
    NavBar,
    SunIcon,
    MoonIcon,
    // UpArrow,
  },
  data() {
    return {
      hasUserInfo: false,
      isHidden: false,
      darkMode: false,
      showBtn: false,
    };
  },
  created() {
    this.scrollToTop();
    window.addEventListener("scroll", this.handleShowBtnScrollToTop);
    firebase.auth().onAuthStateChanged((user) => {
      if (user && !this.hasUserInfo) {
        if (this.$route.name === "Login" || this.$route.name === "Register") {
          this.$router.push({ name: "Home" });
        }
        this.$store.dispatch("getUserInfo", user.uid);
        // run once in the initial
        this.hasUserInfo = true;
      } else {
        this.$store.commit("cancelGetUser");
        this.hasUserInfo = true;
      }
      if (
        !user &&
        ["CreateBlog", "Account", "MyBlogs", "MyComments"].includes(
          this.$route.name
        )
      ) {
        this.$router.push({ name: "Home" });
      }
    });
    if (!this.blogList.length) {
      this.fetchBlogsFromFirebase();
    }
  },
  methods: {
    ...mapMutations(["updateBlogsToStore"]),
    ...mapActions(["fetchBlogsFromFirebase"]),
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    hidden() {
      let { name } = this.$route;
      if (name === "Login" || name === "Register") {
        this.isHidden = true;
      } else {
        this.isHidden = false;
      }
    },
    handleChangeMode() {
      this.darkMode = !this.darkMode;
      let app = this.$refs.app;
      if (this.darkMode) {
        app.classList.replace("lightmode", "darkmode");
      } else {
        app.classList.replace("darkmode", "lightmode");
      }
    },
    handleShowBtnScrollToTop() {
      let currentValue = window.pageYOffset;
      if (currentValue > 100) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
    },
    handleShowBtn(value) {
      return this.showBtn ? `${value} show` : `${value}`;
    },
    handleScrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
  computed: {
    ...mapState(["user", "blogList"]),
  },
  watch: {
    $route: ["scrollToTop", "hidden"],
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;500;600&display=swap");
@import "./scss/style.scss";
@import "~vue2-editor/dist/vue2-editor.css";
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif !important;
}
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $bg-cl;
  main {
    margin-bottom: 52px;
  }
  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background: $bgsection-cl;
    height: 52px;
    padding: 0 15px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    p {
      font-size: 1.5rem;
      color: $text-cl;
    }
  }
  .btn {
    position: fixed;
    z-index: 100;
    bottom: 20px;
    right: 15px;
    cursor: pointer;
    background: $btnMode-cl;
    border-radius: 6px;
    overflow: hidden;
    height: 32px;
    width: 32px;
    transition: 0.2s linear;
    &.show {
      transition: 0.2s linear;
      height: 64px;
    }
    &__scrolltotop {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      width: 32px;
      height: 32px;
      opacity: 0;
      pointer-events: none;
      transition: 0.2s ease-in-out;
      &.show {
        opacity: 1;
        pointer-events: initial;
        transition: 0.2s ease-in-out;
      }
      &-upicon {
        position: absolute;
        top: 50%;
        left: 3px;
        width: 15px;
        height: 15px;
        border: 2px solid;
        border-color: $btnTop-cl transparent transparent $btnTop-cl;
        transform: rotate(45deg) translateY(-50%);
      }
    }
    &__changemode {
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      width: 32px;
      height: 32px;
      &-sun {
        display: block;
        width: 18px;
        height: 18px;
      }
      &-moon {
        display: block;
        width: 18px;
        height: 18px;
        svg {
          fill: #ffffff;
        }
      }
    }
  }
}

.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}

.link-light {
  color: #fff;
}
strong {
  font-weight: bold;
}
em {
  font-style: italic;
}
u {
  text-decoration: underline;
}
s {
  text-decoration: line-through;
}
.blogpage__content {
  padding: 15px;
  .ql-snow {
    .ql-editor {
      font-size: 1.5rem;
      line-height: 22px;
      padding: 0;
      color: $text-cl;
      img {
        border-radius: 6px;
        min-width: 100%;
        min-height: 100%;
      }
    }
  }
}
</style>
