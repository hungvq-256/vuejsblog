<template>
  <div class="commentwrapper" :commentId="comment.commentId" ref="commentEl">
    <div class="comment" ref="comment">
      <div class="comment__curveline"></div>
      <div class="comment__avatar">
        <div
          class="comment__avatar-img"
          :style="{ backgroundImage: `url(${comment.imgUrl})` }"
          v-if="comment.imgUrl"
        ></div>
        <p class="comment__avatar-text" v-else>
          {{ comment.userName[0].toUpperCase() }}
        </p>
      </div>
      <div class="comment__content">
        <div class="textbox">
          <p class="textbox__name">{{ comment.userName }}</p>
          <p class="textbox__comment">{{ comment.comment }}</p>
        </div>
        <div class="utility">
          <div class="utility__left">
            <span class="utility__left-time">{{
              commentTime(comment.created)
            }}</span>
            <span
              class="utility__left-like"
              @click="likeComment(comment.commentId)"
              :class="changeColorLikeBtn(comment) && 'liked'"
              >Like</span
            >
            <span class="utility__left-reply" @click="handleOpenSubCommentInput"
              >Reply
            </span>
          </div>
          <div class="utility__right">
            <div
              class="utility__right-likenumber"
              v-show="displayLikeNumber"
              @click="handleShowUsersLike(comment.usersLike)"
            >
              <i
                ><img src="../../../../../assets/Icons/thumb-up.png" alt=""
              /></i>
              <p>
                {{ comment.likes }}
              </p>
            </div>
            <div
              class="utility__right-dots"
              @click.stop="handleDisplayBox(comment.commentId)"
              ref="dots"
              v-if="comment.userId === user.userId"
            >
              <dots-icon class="icon" />
              <div
                :class="comment.commentId === boxState ? 'box toggle' : 'box'"
              >
                <p @click="handleDeleteComment">Delete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <form
      @submit.prevent="submitSubComment"
      class="subcommentinput"
      v-show="subInputState"
    >
      <input
        type="text"
        class="subcommentinput__input"
        v-model="commentText"
        ref="subCommentInput"
        placeholder="Write a reply"
      />
      <div class="subcommentinput__btn">
        <button type="submit">Send</button>
        <span @click="handleOpenSubCommentInput">Cancel</span>
      </div>
    </form>
    <div class="comment__alert">
      <p class="errmessage" v-if="errMessage">Enter your reply before submit</p>
      <p class="posting" v-if="posting">Posting...</p>
    </div>
    <comment-tree
      class="commenttree"
      v-if="comment.subComments"
      :comments="comment.subComments"
    />
  </div>
</template>

<script>
import firebase from "firebase/app";
import { db } from "../../../../../firebase/firebaseInit";
import EventBus from "../../../../../EventBus";
import { mapMutations, mapState } from "vuex";
import DotsIcon from "../../../../../assets/Icons/dots.svg";
import { calcTime } from "./calcTime";
export default {
  name: "Comment",
  components: {
    DotsIcon,
    "comment-tree": () => import("./CommentTree.vue"),
  },
  props: ["comment", "boxId"],
  data() {
    return {
      subInputState: false,
      commentText: "",
      posting: null,
      likeLoading: false,
      errMessage: false,
      checkDom: true,
    };
  },
  updated() {
    if (this.checkDom) {
      this.$nextTick(() => this.addClassToComment());
      this.checkDom = false;
    }
  },
  computed: {
    ...mapState(["user", "commentsList", "boxState"]),
    blogId() {
      return this.$route.params.blogId;
    },
    displayLikeNumber() {
      return this.comment.likes > 0 ? true : false;
    },
  },
  methods: {
    ...mapMutations(["handleChangeBoxState"]),
    getPathComment() {
      let commentId = this.$refs.commentEl;
      let subCommentParams = [];
      while (commentId.attributes.commentId) {
        let param = commentId.attributes.commentId.nodeValue;
        subCommentParams.unshift(param);
        commentId = commentId.parentElement;
      }
      return subCommentParams.join("/");
    },
    checkNestedComment() {
      let newPath;
      let pathCommentCollection = this.getPathComment();
      let arrPathComment = pathCommentCollection.split("/");
      let filterCommentsOut = arrPathComment.filter(
        (ele) => ele !== "comments"
      );
      let reverseArrCommentId = filterCommentsOut.reverse();
      if (filterCommentsOut.length === 1) {
        return pathCommentCollection;
      } else if (filterCommentsOut.length === 2) {
        //get comment will has been replied to check id user
        let getCommentById = this.getLocalComment(
          this.commentsList,
          reverseArrCommentId[0]
        );
        if (getCommentById.userId === this.user.userId) {
          newPath = arrPathComment.slice(0, 2);
          return newPath.join("/");
        } else {
          return pathCommentCollection;
        }
      } else {
        newPath = arrPathComment.slice(0, 4);
        return newPath.join("/");
      }
    },
    getLocalComment(comments, commentId) {
      for (let comment of comments) {
        if (comment.commentId === commentId) {
          return comment;
        }
        let subComments = comment.subComments;
        if (Array.isArray(subComments)) {
          let result = this.getLocalComment(subComments, commentId);
          if (result) return result;
        }
      }
    },
    async submitSubComment() {
      if (!this.commentText) {
        this.errMessage = true;
        return;
      }
      if (this.user.userId) {
        this.errMessage = false;
        let pathSubComment = this.checkNestedComment();
        let pathCommentCollection = `blogs/${this.blogId}/${pathSubComment}/comments`;
        let commentCollectionRef = db.collection(pathCommentCollection).doc();
        let commentObject = {
          commentId: commentCollectionRef.id,
          userId: this.user.userId,
          comment: this.commentText,
          likes: 0,
          usersLike: [],
          created: firebase.firestore.FieldValue.serverTimestamp(),
        };
        try {
          await commentCollectionRef.set(commentObject);
          this.subInputState = false;
          this.posting = true;
          this.commentText = "";
          //use EventBus to emit event refetch comments to global
          EventBus.$emit("refetchComments");
          console.log("publish sub comment successfully");
        } catch (err) {
          console.log(err.message);
        }
      } else {
        this.$router.push({ name: "Login" });
      }
    },
    async handleDeleteComment() {
      if (confirm("Do you want to delete this comment?")) {
        let pathComment = this.getPathComment();
        let blogId = this.$route.params.blogId;
        let commentCollectionRef = db.doc(`blogs/${blogId}/${pathComment}`);
        try {
          await commentCollectionRef.delete();
          EventBus.$emit("refetchComments");
        } catch (err) {
          console.log(err.message);
        }
      }
    },
    likeComment() {
      if (!this.user.userId) {
        this.$router.push({ name: "Login" });
        return;
      }
      EventBus.$emit("likeComment", this.getPathComment());
    },
    changeColorLikeBtn(comment) {
      return comment.usersLike.includes(this.user.userId);
    },
    handleDisplayBox(commentId) {
      this.handleChangeBoxState(commentId);
    },
    handleOpenSubCommentInput() {
      this.errMessage = false;
      this.commentText = "";
      this.subInputState = !this.subInputState;
      if (this.subInputState) {
        this.$nextTick(() => this.$refs.subCommentInput.focus());
      }
    },
    handleShowUsersLike() {
      EventBus.$emit("handleShowUsersLike", this.comment.usersLike);
    },
    addClassToComment() {
      let commentWrapperChildren = this.$refs.commentEl.children;
      let comment = commentWrapperChildren[0];
      let commentsTree = commentWrapperChildren[3];
      if (commentsTree && commentsTree.children.length > 0) {
        comment.classList.add("addline");
      } else {
        comment.classList.remove("addline");
      }
    },
    commentTime(created) {
      return calcTime(
        new Date(
          Date.now() - (Date.parse(new Date()) + 1000 - created.seconds * 1000)
        )
      );
    },
  },
  watch: {
    comment() {
      this.posting = null;
      this.$nextTick(() => this.addClassToComment());
    },
    commentText() {
      if (this.commentText) {
        this.errMessage = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.commentwrapper {
  &:not(:last-of-type) {
    padding-bottom: 15px;
  }
  //scss for sub comment tree
  .commenttree {
    margin-left: 40px;
    margin-top: 10px;
    position: relative;
    .commentwrapper {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -26px;
        width: 2px;
        height: 100%;
        background: #ccc;
        display: block;
      }
      &:last-child {
        &::before {
          width: initial;
          height: initial;
        }
      }
      &:first-child {
        .comment {
          &__curveline {
            position: absolute;
            top: -77px;
            left: -26px;
            width: 23px;
            height: 94px;
          }
        }
      }
      .comment {
        position: relative;
        &__curveline {
          position: absolute;
          top: -82px;
          left: -26px;
          width: 23px;
          height: 100px;
          margin-right: 5px;
          border: 2px solid #ccc;
          border-top: 0;
          border-color: transparent transparent #ccc #ccc;
          border-bottom-left-radius: 15px;
        }
        &__avatar {
          &-img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding-top: 78%;
            width: 78%;
          }
          &-text {
            font-size: 1.8rem;
            font-weight: 500;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 78%;
            width: 78%;
          }
        }
        &__content {
          margin: 4px 0 0 6px;
        }
      }
    }
  }
  .comment {
    display: flex;
    align-items: flex-start;
    width: 100%;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 0px;
      left: 14px;
      width: 2px;
      height: 100%;
      background: #ccc;
      display: none;
    }
    &.addline {
      &:before {
        display: block;
      }
    }
    &__avatar {
      position: relative;
      z-index: 10;
      width: 32px;
      height: 32px;
      background: $bgsection-cl;
      flex-shrink: 0;
      display: inline-flex;
      align-items: flex-start;
      &-img {
        padding-top: 100%;
        width: 100%;
        border-radius: 50px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }
      &-text {
        font-size: 1.8rem;
        color: #ffffff;
        background-color: cornflowerblue;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        border-radius: 50px;
      }
    }
    &__content {
      position: relative;
      margin-left: 10px;
      width: 100%;
      .textbox {
        background: #f0f2f5;
        padding: 7px;
        border-radius: 8px;
        margin-bottom: 5px;
        word-break: break-word;
        display: inline-block;
        width: 100%;
        &__name {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 5px;
        }
        &__comment {
          font-size: 1.4rem;
          line-height: 16px;
        }
      }
      .utility {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 15px;
        &__left {
          &-time {
            font-size: 1.1rem;
            color: $text-cl;
          }
          &-like {
            font-size: 1.2rem;
            color: $text-cl;
            margin-left: 8px;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
            &.liked {
              color: #0277bd;
            }
          }
          &-reply {
            font-size: 1.2rem;
            color: $text-cl;
            margin-left: 8px;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
          }
        }
        &__right {
          display: flex;
          align-items: center;
          &-likenumber {
            display: flex;
            align-items: center;
            cursor: pointer;
            i {
              width: 15px;
              height: 15px;
              display: block;
              img {
                width: 100%;
                height: 100%;
                display: flex;
              }
            }
            p {
              font-size: 1.2rem;
              color: $text-cl;
              margin: auto 0;
              width: 15px;
              text-align: center;
            }
          }
          &-dots {
            position: absolute;
            top: 0px;
            right: 7px;
            .icon {
              width: 18px;
              color: #ccc;
              cursor: pointer;
            }
            .box {
              position: absolute;
              right: -2px;
              top: -27px;
              padding: 5px;
              border: 0.8px solid #e7e7e7;
              border-radius: 4px;
              background: #ffffff;
              transform: translateY(-10px);
              opacity: 0;
              pointer-events: none;
              transition: 0.3s;
              &.toggle {
                transform: translateY(0);
                opacity: 1;
                pointer-events: auto;
                transition: 0.3s;
              }
              p {
                font-size: 1.3rem;
                color: #000000;
                cursor: pointer;
              }
            }
          }
          .likeloading {
            margin-right: 5px;
          }
        }
      }
    }
  }
  .comment__alert {
    .errmessage {
      font-size: 1.2rem;
      color: #e60000;
      margin: 5px 0 0 40px;
    }
    .posting {
      font-size: 1.2rem;
      font-weight: 500;
      margin: 5px 0 0 40px;
    }
  }
  .subcommentinput {
    margin-left: 40px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__input {
      font-size: 1.3rem;
      flex-grow: 1;
      height: 30px;
      width: 100%;
      border: 0.5px solid #e7e7e7;
      border-radius: 18px;
      outline: none;
      padding: 0 5px;
    }
    &__btn {
      display: flex;
      align-items: center;
      button {
        border: none;
        background: initial;
        font-size: 1.2rem;
        color: $text-cl;
        margin-left: 7px;
        cursor: pointer;
      }
      span {
        font-size: 1.2rem;
        color: $text-cl;
        margin-left: 7px;
        cursor: pointer;
      }
    }
  }
}
</style>