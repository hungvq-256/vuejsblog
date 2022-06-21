<template>
  <div class="calculator">
    <form @submit.prevent="handleCalculatePrice">
      <div class="input-element">
        <label for="">Item price</label>
        <input type="number" v-model="inputData.priceItem" />
      </div>
      <div class="input-element">
        <label for="">Original total bill</label>
        <input type="number" v-model="inputData.initialTotalBill" />
      </div>
      <div class="input-element">
        <label for="">Total bill after applying voucher</label>
        <input
          type="number"
          v-model="inputData.totalBillAfterApplyingVoucher"
        />
      </div>
      <div class="helper-text">{{ errorText }}</div>
      <button
        :class="['calculate-button', { disabled: !activeButton }]"
        :disabled="!activeButton"
        type="submit"
      >
        Calculate
      </button>
    </form>
    <div class="result">Result: {{ result }}</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { db } from "../../../firebase/firebaseInit";
// import Loading from "../../../components/Loading.vue";
// import ImageIcon from "../../../assets/Icons/image-regular.svg";
import firebase from "firebase/app";
export default {
  name: "MyAccount",
  data() {
    return {
      loading: false,
      loadingImg: false,
      submitbtn: false,
      inputData: {
        priceItem: "",
        initialTotalBill: "",
        totalBillAfterApplyingVoucher: "",
      },
      result: 0,
      errorText: "",
    };
  },
  components: {
    // Loading,
    // ImageIcon,
  },
  // mounted() {
  //   this.setInputState("disabled");
  // },
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["capitalLetter"]),
    btnState() {
      return this.submitbtn ? "Save" : "Edit info";
    },
    activeButton() {
      return Object.keys(this.inputData).every(
        (el) =>
          typeof Number(this.inputData[el]) === "number" &&
          Number(this.inputData[el]) > 0
      );
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
    handleCalculatePrice() {
      const {
        priceItem,
        initialTotalBill,
        totalBillAfterApplyingVoucher,
      } = this.inputData;
      if (this.result) return;
      if (
        Number(priceItem) > Number(initialTotalBill) ||
        Number(priceItem) > Number(totalBillAfterApplyingVoucher)
      ) {
        initialTotalBill;
        return (this.errorText =
          "The item price cannot be greater than the original price");
      } else if (
        Number(totalBillAfterApplyingVoucher) > Number(initialTotalBill)
      ) {
        return (this.errorText =
          "The total bill after applying voucher cannot be greater than the original bill");
      }
      this.result = Math.ceil(
        (Number(priceItem) / Number(initialTotalBill)).toFixed(3) *
          Number(totalBillAfterApplyingVoucher)
      );
    },
  },
  watch: {
    inputData: {
      handler() {
        this.result = 0;
        this.errorText = "";
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.calculator {
  .input-element {
    margin-bottom: 10px;
    label {
      font-size: 1.6rem;
      display: block;
    }
    input {
      width: 100%;
      max-width: 200px;
      margin-top: 5px;
      height: 25px;
      border-radius: 5px;
      border: 1px solid #cccccc;
      font-size: 1.6rem;
      outline: none;
      padding: 4px;
    }
  }
  .calculate-button {
    border: 1px solid #4997bb;
    font-size: 1.4rem;
    padding: 4px;
    border-radius: 5px;
    background-color: #ffffff;
    cursor: pointer;
    &.disabled {
      cursor: unset;
      border-color: #cccccc;
    }
  }
  .helper-text {
    font-size: 1.6rem;
    color: red;
    margin-bottom: 5px;
  }
  .result {
    font-size: 1.6rem;
    margin-top: 5px;
    color: #dd4f4f;
  }
}
</style>
