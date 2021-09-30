<template>
  <div class="register">
    <h2 class="register__title">Register</h2>
    <form
      @submit.prevent="handleRegister"
      class="register__form"
      ref="registerForm"
    >
      <div class="formgroup">
        <label for="" class="email">User Name</label>
        <input
          name="username"
          type="text"
          v-model="userName"
          placeholder="Enter your name"
        />
        <span class="errmessage"></span>
      </div>
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
      <div class="formgroup">
        <label for="" class="email">Confirm Password</label>
        <input
          name="password"
          type="password"
          v-model="confirmPassword"
          placeholder="Retype your password"
        />
        <span class="errmessage"></span>
      </div>
      <button class="btnsubmit" type="submit" v-if="!loading">REGISTER</button>
      <loading v-else />
    </form>
    <div class="login">
      <p>Already have an account ?</p>
      <router-link :to="{ name: 'Login' }">Login Now</router-link>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { db } from "../firebase/firebaseInit";
import Loading from "../components/Loading.vue";
import validation from "../validation";
export default {
  name: "Register",
  components: {
    Loading,
  },
  data() {
    return {
      email: null,
      userName: null,
      password: null,
      confirmPassword: null,
      loading: false,
    };
  },
  methods: {
    async handleRegister() {
      let isValid = validation(
        this.$refs.registerForm,
        [
          validation.isRequired(),
          validation.isEmail(),
          validation.isPassword(6),
          validation.isConfirmPassword(() => {
            let childrenEl = this.$refs.registerForm.children;
            let inputEl = childrenEl[2].children[1];
            return inputEl.value;
          }),
        ],
        true
      );
      if (isValid) {
        this.loading = true;
        try {
          let register = await firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password);
          let userId = register.user.uid;
          let userRef = db.collection("users").doc(userId);
          await userRef.set({
            userId: userId,
            userName: this.userName,
            email: this.email,
          });
          this.$store.dispatch("getUserInfo", userId);
          this.$router.push({ name: "Home" });
        } catch (error) {
          alert(error);
        }
        this.loading = false;
      }
    },
  },
  mounted() {
    validation(this.$refs.registerForm, [
      validation.isRequired(),
      validation.isEmail(),
      validation.isPassword(6),
      validation.isConfirmPassword(() => {
        let childrenEl = this.$refs.registerForm.children;
        let inputEl = childrenEl[2].children[1];
        return inputEl.value;
      }),
    ]);
  },
};
</script>
<style lang="scss" scoped>
.register {
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
        padding: 0 5px;
        font-size: 15px;
      }
      .errmessage {
        display: inline-block;
        margin-top: 3px;
        font-size: 12px;
        color: rgb(221, 15, 15);
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
    }
  }
  .login {
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