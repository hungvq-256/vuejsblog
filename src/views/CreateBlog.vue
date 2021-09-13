<template>
  <div class="blogcreate">
    <div class="blogcreate__form">
      <form ref="formheader">
        <div class="formgroup">
          <label>Title</label>
          <input type="text" v-model="title" />
          <span class="errmessage"></span>
        </div>
        <div class="formgroup">
          <label>Description</label>
          <input type="text" v-model="description" />
          <span class="errmessage"></span>
        </div>
      </form>
      <div class="categories-selected">
        <span>Categories </span>
        <div class="categories-option">
          <select name="categories" v-model="category">
            <option value="technology">Technology</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="fashion">Fashion</option>
          </select>
        </div>
      </div>
      <div class="thumbnailimg">
        <label for="thumbnailfile" class="thumbnailimg__file"
          >Thumbnail Image</label
        >
        <input
          type="file"
          id="thumbnailfile"
          hidden
          @change="setThumbnailImg"
        />
        <span class="errmessage" v-if="thumbnailImgState">
          Insert your blog's thumbnail image
        </span>
        <div class="thumnailimgdemo" v-if="thumbnailImage">
          <!-- <div :style="{ backgroundImage: `url(${thumbnailImage})` }"></div> -->
          <img :src="thumbnailImage" alt="thumbnailImage" />
        </div>
      </div>
    </div>
    <div class="blogcreate__texteditor">
      <vue-editor
        useCustomImageHandler
        @image-added="handleImageAdded"
        v-model="blogHtml"
        id="editor"
      ></vue-editor>
    </div>
    <div class="btngroup">
      <button class="btngroup__submit" @click="handleSubmitBlog">
        {{ handleTextBtn }}
      </button>
      <!-- <button class="btngrop__preview">Preview</button> -->
    </div>
  </div>
  <!-- <div class="container">
      <p v-html="blog.contentHtml" class="text"></p>
    </div> -->
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import { VueEditor } from "vue2-editor";
import { mapState, mapMutations, mapActions } from "vuex";
import validation from "../validation";
import { db } from "../firebase/firebaseInit";
export default {
  name: "CreateBlog",
  components: { VueEditor },
  data: () => ({
    content: "",
    thumbnailImgState: false,
  }),
  methods: {
    ...mapMutations(["handleSetBlog", "handleClearBlog"]),
    ...mapActions(["fetchBlogsFromFirebase"]),
    handleImageAdded(file, Editor, cursorLocation) {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var metadata = {
        contentType: file.type,
      };
      var uploadTask = storageRef
        .child(`images/${file.name}`)
        .put(file, metadata);
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
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            Editor.insertEmbed(cursorLocation, "image", downloadURL);
          });
        }
      );
    },
    async handleSubmitBlog() {
      let { blogId, contentHtml, title, description, category, thumbnailImg } =
        this.blog;
      if (blogId) {
        let blogRef = db.collection("blogs").doc(blogId);
        try {
          await blogRef.update({
            contentHtml,
            title,
            description,
            category,
            thumbnailImg,
          });
          this.fetchBlogsFromFirebase(this.blog);
        } catch (error) {
          console.log(error.message);
        }
      } else {
        let isValid = validation(
          this.$refs.formheader,
          [validation.isRequired(), validation.isRequired()],
          true
        );
        if (!isValid || !this.thumbnailImage) {
          if (!this.thumbnailImage) {
            this.thumbnailImgState = true;
            return;
          }
          return;
        }
        try {
          let blogRef = db.collection("blogs").doc();
          await blogRef.set({
            userId: this.user.userId,
            userName: this.user.userName,
            blogId: blogRef.id,
            ...this.blog,
            created: firebase.firestore.FieldValue.serverTimestamp(),
          });
          this.fetchBlogsFromFirebase({
            category: this.category,
            blogId: blogRef.id,
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    },
    setThumbnailImg(e) {
      let imgFile = e.target.files[0];
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var metadata = {
        contentType: imgFile.type,
      };
      var uploadTask = storageRef
        .child(`images/thumbnailImg/${imgFile.name}`)
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
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.thumbnailImage = downloadURL;
          });
        }
      );
      this.thumbnailImgState = false;
    },
  },
  computed: {
    ...mapState(["blog", "user"]),
    blogHtml: {
      get() {
        return this.blog.contentHtml;
      },
      set(value) {
        this.handleSetBlog({
          value,
          property: "contentHtml",
        });
      },
    },
    title: {
      get() {
        return this.blog.title;
      },
      set(value) {
        this.handleSetBlog({
          value,
          property: "title",
        });
      },
    },
    description: {
      get() {
        return this.blog.description;
      },
      set(value) {
        this.handleSetBlog({
          value,
          property: "description",
        });
      },
    },
    category: {
      get() {
        return this.blog.category;
      },
      set(value) {
        this.handleSetBlog({
          value,
          property: "category",
        });
      },
    },
    thumbnailImage: {
      get() {
        return this.blog.thumbnailImg;
      },
      set(value) {
        this.handleSetBlog({
          value,
          property: "thumbnailImg",
        });
      },
    },
    handleTextBtn() {
      return this.blog.blogId ? "Update" : "Create Blog";
    },
  },
  mounted() {
    let formHeader = this.$refs.formheader;
    this.$nextTick(() => {
      validation(formHeader, [
        validation.isRequired(),
        validation.isRequired(),
      ]);
    });
  },
  destroyed() {
    if (this.blog.blogId) {
      this.handleClearBlog();
    }
  },
};
</script>
<style lang="scss" scoped>
.blogcreate {
  &__form {
    background: $bgsection-cl;
    padding: 15px;
    margin-top: 20px;
    .formgroup {
      margin-bottom: 15px;
      label {
        display: block;
        font-size: 1.4rem;
        font-weight: 500;
        margin-bottom: 5px;
        color: $text-cl;
      }
      input {
        width: 100%;
        font-size: 1.5rem;
        border-radius: 5px;
        margin-bottom: 5px;
        border-color: transparent;
        border-bottom: 1px solid #ccc;
      }
      .inputerrstate {
        border-bottom-color: rgb(221, 15, 15);
      }
      span {
        display: inline-block;
        margin-top: 3px;
        font-size: 12px;
        color: rgb(221, 15, 15);
      }
    }
    .categories-selected {
      span {
        font-size: 1.5rem;
        font-weight: 500;
        margin-right: 5px;
        color: $text-cl;
      }
      .categories-option {
        display: inline-block;
        width: 100%;
        max-width: 150px;
        position: relative;
        select {
          width: 100%;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 2px 5px;
          border-radius: 4px;
          option {
            cursor: pointer;
            font-size: 1.5rem;
          }
        }
        &:before {
          content: "";
          position: absolute;
          top: 75%;
          right: 5px;
          transform: translateY(-75%);
          border-width: 6px 6px;
          border-style: solid;
          border-color: transparent;
          border-top-color: #000000;
          pointer-events: none;
        }
      }
    }
    .thumbnailimg {
      margin-top: 10px;
      &__file {
        padding: 5px 6px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 1.4rem;
        display: inline-block;
        cursor: pointer;
        color: $text-cl;
        &:hover {
          color: $travel-cl;
        }
      }
      .errmessage {
        display: block;
        margin-top: 3px;
        font-size: 12px;
        color: rgb(221, 15, 15);
      }
      .thumnailimgdemo {
        margin: 8px 0;
        width: 200px;
        height: 133px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  &__texteditor {
    background: #fff;
  }
  .btngroup {
    margin: 15px 0 15px 15px;
    button {
      padding: 5px 10px;
      font-size: 15px;
      border: none;
      border-radius: 5px;
      background: #1061cc;
      color: #fff;
      cursor: pointer;
      &.btngroup__submit {
        margin-right: 15px;
      }
    }
  }
}
</style>