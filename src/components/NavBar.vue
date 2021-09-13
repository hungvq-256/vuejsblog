<template>
  <nav class="navbarwrap">
    <div class="navbar container-fluid">
      <div class="left">
        <router-link to="/" class="logo"> Glass </router-link>
        <ul class="menulist">
          <li>
            <router-link to="/">home</router-link>
          </li>
          <li>
            <router-link to="/fashion">
              <!-- <i class="menuicon">
                <img src="../assets/menu.png" alt="menu icon" />
              </i> -->
              <p>Fashion</p>
            </router-link>
          </li>
          <li>
            <router-link to="/food">Food</router-link>
          </li>
          <li>
            <router-link to="/sport">Sport</router-link>
          </li>
          <li>
            <router-link to="/technology">Technology</router-link>
          </li>
        </ul>
      </div>
      <div class="right">
        <loading class="loading" v-if="getUserLoading" />
        <div class="userlogin" v-else>
          <router-link
            :to="{ name: 'Login' }"
            class="login-register"
            v-if="!user.userId"
          >
            Login/Register
          </router-link>
          <router-link :to="{ name: 'CreateBlog' }" class="createblog" v-else>
            <i><edit-icon /></i>
          </router-link>
          <div
            class="userIcon"
            v-if="user.userId"
            @click.stop="openAccountDrop"
          >
            <div class="avatartext" v-if="!user.imgUrl">
              <p>{{ capitalLetter }}</p>
            </div>
            <div
              class="avatarimg"
              :style="{ backgroundImage: `url(${user.imgUrl})` }"
              v-else
            ></div>
            <div class="accountdrop" ref="accountdrop">
              <ul>
                <li>Hi, {{ user.userName }}</li>
                <li>
                  <router-link to="/account">My Account</router-link>
                </li>
                <li @click="handleLogout">Logout</li>
              </ul>
            </div>
          </div>
        </div>
        <i class="loupeicon"><loupe-icon /></i>
        <i class="menumobileicon" v-on:click.stop="showMenu = !showMenu">
          <menu-icon />
        </i>
      </div>
    </div>
    <transition name="menumobile">
      <div v-show="showMenu" class="menumobile">
        <p>Menu</p>
        <ul class="menumobile__list">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/fashion">Fashion</router-link>
          </li>
          <li>
            <router-link to="/fashion">Technology</router-link>
          </li>
          <li>
            <router-link to="/food">Food</router-link>
          </li>
          <li>
            <router-link to="/sport">Sport</router-link>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import firebase from "firebase/app";
import Loading from "./Loading.vue";
import EditIcon from "../assets/Icons/edit.svg";
import MenuIcon from "../assets/Icons/menu.svg";
import LoupeIcon from "../assets/Icons/loupe.svg";
export default {
  name: "NavBar",
  data() {
    return {
      showMenu: false,
    };
  },
  components: {
    Loading,
    EditIcon,
    MenuIcon,
    LoupeIcon,
  },
  mounted() {
    window.addEventListener("click", this.closeAccountDrop);
    window.addEventListener("click", () => {
      this.showMenu = false;
    });
  },
  computed: {
    ...mapState(["user", "getUserLoading"]),
    ...mapGetters(["capitalLetter"]),
  },
  methods: {
    ...mapMutations(["accoutLogout"]),
    async handleLogout() {
      try {
        await firebase.auth().signOut();
        this.accoutLogout();
      } catch (error) {
        console.error(error.message);
      }
    },
    openAccountDrop() {
      let accountRef = this.$refs.accountdrop;
      accountRef?.classList.toggle("open");
    },
    closeAccountDrop() {
      let accountRef = this.$refs.accountdrop;
      accountRef?.classList.remove("open");
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $hd-height;
  background: $bgsection-cl;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.05);
  .left {
    display: flex;
    .logo {
      padding-right: 20px;
      font-size: 30px;
      color: $text-cl;
    }
    .menulist {
      display: flex;
      li {
        list-style-type: none;
        padding: 0 12px;
        display: flex;
        a {
          display: flex;
          align-items: center;
          color: $text-cl;
          font-size: 1.6rem;
          &:hover {
            color: $hover-cl;
          }
        }
        .menuicon {
          width: 15px;
          display: flex;
          margin-right: 6px;
        }
        .dropdownicon {
          width: 8px;
          display: flex;
          margin-left: 6px;
        }
      }
      @media (max-width: 991px) {
        display: none;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .loading {
      margin-right: 20px;
    }
    .userlogin {
      display: flex;
      align-items: center;
      .login-register {
        margin-right: 10px;
        cursor: pointer;
        color: $text-cl;
        font-size: 1.6rem;
        &:hover {
          color: $hover-cl;
        }
      }
      .createblog {
        margin-right: 12px;
        &:hover {
          i {
            svg {
              fill: $hover-cl;
            }
          }
        }
        i {
          display: block;
          width: 27px;
          svg {
            fill: var(--text-cl);
            height: 27px;
            width: 27px;
          }
        }
      }
      .userIcon {
        width: 32px;
        height: 32px;
        position: relative;
        margin-right: 10px;
        cursor: pointer;
        .avatartext {
          height: 100%;
          border-radius: 50px;
          background: #3b74ac;
          border: 0.5px solid rgba(155, 155, 155, 0.5);
          p {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 17px;
            color: #ffffff;
          }
        }
        .avatarimg {
          padding-top: 100%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: 50px;
          border: 0.5px solid rgba(155, 155, 155, 0.5);
        }
        .accountdrop {
          position: absolute;
          top: 43px;
          right: 0;
          background: #d6d5d5;
          z-index: 10;
          border-radius: 5px;
          display: none;
          ul {
            padding: 10px;
            min-width: 120px;
            li {
              font-size: 1.5rem;
              color: #000000;
              text-align: center;
              &:first-child {
                line-height: 20px;
                padding-bottom: 8px;
              }
              &:not(:first-child) {
                padding: 8px 0;
                &:hover {
                  color: $hover-cl;
                }
                border-top: 1px solid rgb(226, 226, 226);
              }
              &:last-child {
                padding-bottom: 0;
              }
              a {
                color: #000000;
                &:hover {
                  color: $hover-cl;
                }
              }
            }
          }
          &:after {
            content: "";
            border-width: 16px 16px;
            border-style: solid;
            border-color: transparent transparent #d6d5d5 transparent;
            position: absolute;
            top: -24px;
            right: 1px;
            cursor: pointer;
          }
          &.open {
            display: block;
          }
        }
      }
    }
    .menumobileicon {
      width: 20px;
      display: none;
      @media (max-width: 991px) {
        display: flex;
      }
      svg {
        height: 20px;
        fill: $text-cl;
      }
    }
    .loupeicon {
      width: 20px;
      display: flex;
      margin-right: 10px;
      cursor: pointer;
      svg {
        height: 20px;
        fill: $text-cl;
      }
      &:hover {
        svg {
          fill: $hover-cl;
        }
      }
    }
  }
}
.menumobile {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  padding: 0 15px;
  height: 100vh;
  background: #ffffff;
  width: 50%;
  display: none;
  p {
    font-size: 1.7rem;
    margin: 15px 0;
  }
  &__list {
    li {
      border-bottom: 0.3px solid rgba(0, 0, 0, 0.3);
      a {
        display: block;
        padding: 12px 0;
        font-size: 1.6rem;
        color: #000000;
      }
    }
  }
  @media (max-width: 991px) {
    display: block;
  }
}
.menumobile-enter-active,
.menumobile-leave-active {
  transition: all 0.5s ease;
}
.menumobile-enter {
  transform: translateX(-100%);
}
.menumobile-enter-to {
  transform: translateX(0);
}
.menumobile-leave-to {
  transform: translateX(-100%);
}
</style>