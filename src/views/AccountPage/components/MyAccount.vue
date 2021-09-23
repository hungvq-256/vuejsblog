<template>
  <div class="myaccount">
    <div class="myaccount__avatar">
      <div class="avatartext" v-if="!user.imgUrl">{{ capitalLetter }}</div>
      <div
        class="avatarimg"
        v-else
        :style="{ backgroundImage: `url(${user.imgUrl})` }"
      ></div>
      <div class="uploadavatar">
        <label for="avatar">
          <image-icon />
        </label>
        <input
          type="file"
          id="avatar"
          hidden
          @change.prevent="handleUploadAvatar"
        />
      </div>
      <div class="loading" v-if="loadingImg">
        <loading class="loadingicon" />
      </div>
    </div>
    <div class="myaccount__info">
      <form
        class="form"
        @submit.prevent="handleUpdateUserInfo"
        ref="accountform"
      >
        <div class="form__group">
          <label>User Name</label>
          <input type="text" v-model="user.userName" />
          <span></span>
        </div>
        <div class="form__group">
          <label>Email</label>
          <input type="text" v-model="user.email" />
          <span></span>
        </div>
        <div class="btnsubmit">
          <loading class="loading" v-if="loading" />
          <button v-else type="submit">{{ btnState }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { db } from "../../../firebase/firebaseInit";
import Loading from "../../../components/Loading.vue";
import ImageIcon from "../../../assets/Icons/image-regular.svg";
import firebase from "firebase/app";
export default {
  name: "MyAccount",
  data() {
    return {
      loading: false,
      loadingImg: false,
      submitbtn: false,
    };
  },
  components: {
    Loading,
    ImageIcon,
  },
  mounted() {
    this.setInputState("disabled");
  },
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["capitalLetter"]),
    btnState() {
      return this.submitbtn ? "Save" : "Edit info";
    },
  },
  methods: {
    ...mapMutations(["setAvatarUrlToStore"]),
    handleUpdateUserInfo() {
      if (this.submitbtn) {
        this.loading = true;
        let userRef = db.collection("users").doc(this.user.userId);
        userRef
          .update(this.user)
          .then(() => {
            this.setInputState("disabled");
            this.submitbtn = false;
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log(error.message);
          });
      } else {
        this.setInputState("enabled");
        this.submitbtn = true;
      }
    },
    setInputState(state) {
      let formRef = this.$refs.accountform;
      let formGroup = formRef.children;
      formGroup.forEach((ele) => {
        let inputEle = ele.children[1];
        if (inputEle) {
          if (state === "disabled") {
            inputEle.disabled = true;
            inputEle.classList.remove("editstate");
          } else {
            inputEle.disabled = false;
            inputEle.classList.add("editstate");
          }
        }
      });
    },
    handleUploadAvatar(e) {
      let imgFile = e.target.files[0];
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var metadata = {
        contentType: "image/jpeg",
      };
      var uploadTask = storageRef
        .child(`avatars/${this.user.userId}`)
        .put(imgFile, metadata);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: {
              console.log("Upload is paused");
              break;
            } // or 'paused'
            case firebase.storage.TaskState.RUNNING: {
              this.loadingImg = true;
              console.log("Upload is running");
              break;
            } // or 'running'
            default: {
              return;
            }
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized": {
              // User doesn't have permission to access the object
              console.error(error.code);
              break;
            }
            case "storage/canceled": {
              // User canceled the upload
              console.error(error.code);
              break;
            }
            case "storage/unknown": {
              // Unknown error occurred, inspect error.serverResponse
              console.error(error.code);
              break;
            }
            default: {
              return;
            }
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((avatarUrl) => {
            let userRef = db.collection("users").doc(this.user.userId);
            userRef
              .update({ imgUrl: avatarUrl })
              .then(() => {
                this.setAvatarUrlToStore(avatarUrl);
                console.log("upload avatar successfully");
              })
              .catch((error) => {
                console.log(error.message);
              });
          });
          this.loadingImg = false;
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.myaccount {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  width: 100%;
  padding: 0 15px;
  &__avatar {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: $bg-cl;
    margin: 0 auto;
    overflow: hidden;
    &:hover {
      .uploadavatar {
        display: block;
      }
    }
    .avatartext {
      color: $food-cl;
      font-size: 6rem;
      font-weight: 600;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .avatarimg {
      padding-top: 100%;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .uploadavatar {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      display: none;
      label {
        display: block;
        width: 25px;
        position: absolute;
        top: 90%;
        left: 50%;
        transform: translate(-50%, -90%);
        z-index: 10;
        svg {
          color: #ffffff;
          cursor: pointer;
        }
      }
    }
    .loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: $bgloading-cl;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  &__info {
    margin-top: 30px;
    .form {
      &__group {
        width: 100%;
        &:not(:last-child) {
          margin-bottom: 15px;
        }
        label {
          font-size: 1.5rem;
          color: $text-cl;
          display: block;
          margin-bottom: 5px;
        }
        input {
          font-size: 1.6rem !important;
          color: $text-cl;
          border: none;
          border-bottom: 1px solid #ccc;
          border-radius: 5px;
          width: 100%;
          background: transparent;
          &.editstate {
            border: 1px solid #ccc;
          }
        }
      }
      .btnsubmit {
        display: inline-block;
        width: 84px;
        .loading {
          margin: 0 auto;
        }
        button {
          width: 100%;
          padding: 2px 8px;
          font-size: 1.6rem;
          border-radius: 5px;
          color: $text-cl;
          border: 0.5px solid #ccc;
          background: transparent;
          cursor: pointer;
        }
      }
    }
  }
}
</style>