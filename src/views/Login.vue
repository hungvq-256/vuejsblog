<template>
  <div class="login">
    <h2 class="login__title">Login</h2>
    <form @submit="handleLogin" class="login__form" ref="loginform">
      <div class="formgroup">
        <label for="" class="email">Email</label>
        <input
          name="email"
          type="text"
          v-model="email"
          placeholder="Enter your email"
        />
        <span class="errmessage"></span>
      </div>
      <div class="formgroup">
        <label for="" class="password">Password</label>
        <input
          name="password"
          type="password"
          v-model="password"
          placeholder="Enter your password"
        />
        <span class="errmessage"></span>
      </div>
      <button class="btnsubmit" type="submit" v-if="!loading">LOGIN</button>
      <loading v-else />
    </form>
    <div class="register">
      <p>Don't have an account ?</p>
      <router-link :to="{ name: 'Register' }">Register Now</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import firebase from "firebase/app";
import Loading from "../components/Loading.vue";
import validation from "../validation";
export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      loading: false,
    };
  },
  components: {
    Loading,
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    async handleLogin(e) {
      e.preventDefault();
      let isValid = validation(
        this.$refs.loginform,
        [validation.isEmail(), validation.isRequired()],
        true
      );
      if (isValid) {
        this.loading = true;
        try {
          await firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.SESSION);
          let loginState = await firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password);
          let userId = loginState.user.uid;
          this.getUserInfo(userId);
        } catch (error) {
          alert(error.message);
        }
        this.loading = false;
      }
    },
  },
  mounted() {
    validation(this.$refs.loginform, [
      validation.isEmail(),
      validation.isRequired(),
    ]);
  },
};
</script>
<style lang="scss" scoped>
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 300px;
  background: $bgsection-cl;
  padding: 20px;
  border-radius: $border-radius;
  &__title {
    font-size: 25px;
    font-weight: 600;
    color: $text-cl;
    text-align: center;
    margin: 30px 0 30px;
  }
  &__form {
    margin: 0 auto;
    .formgroup {
      margin-bottom: 15px;
      label {
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
        color: $text-cl;
      }
      input {
        width: 100%;
        border: none;
        border-radius: 6px;
        border-bottom: 1px solid $subtext-cl;
        font-size: 15px;
        padding: 0 5px;
      }
      .errmessage {
        display: inline-block;
        font-size: 12px;
        color: $text-cl;
        color: rgb(221, 15, 15);
        margin-top: 3px;
      }
      .inputerrstate {
        border-bottom-color: rgb(221, 15, 15);
      }
    }
    .btnsubmit {
      width: 100%;
      padding: 5px;
      border: none;
      border-radius: 5px;
      background: $hover-cl;
      color: #ffffff;
      font-size: 12px;
      cursor: pointer;
      margin-top: 10px;
    }
  }
  .register {
    display: flex;
    justify-content: center;
    margin: 30px 0 10px;
    p {
      font-size: 12px;
      color: $text-cl;
      margin-right: 5px;
    }
    a {
      font-size: 12px;
      color: $text-cl;
    }
  }
}
</style>