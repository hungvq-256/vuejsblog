<template>
  <div class="comments" ref="commentsRef">
    <div
      class="comments__section"
      v-if="!getCommentsLoading"
      ref="commentssection"
    >
      <comment-tree :comments="comments" v-if="comments" />
      <p v-else>There is no comment in this article</p>
    </div>
    <div class="loadingcomments" v-else><loading class="loading" /></div>
    <form @submit.prevent="handlePublishComment" class="comments__form">
      <textarea
        type="text"
        v-model="commentText"
        placeholder="Enter your comment"
      />
      <p class="errmessage" v-if="errMessage">
        Enter your comment before submit
      </p>
      <button type="submit" v-if="!submitLoading">PUBLISH</button>
      <loading class="loadingbtn" :size="20" v-else />
    </form>
    <users-like
      :usersLike="usersLike"
      :handleHideUsersLike="handleHideUsersLike"
    />
  </div>
</template>

<script>
import firebase from "firebase/app";
import { db } from "../../../../firebase/firebaseInit";
import EventBus from "../../../../EventBus";
import { mapState, mapMutations } from "vuex";
import CommentTree from "./components/CommentTree.vue";
import UsersLike from "./components/UsersLike.vue";
import Loading from "../../../../components/Loading.vue";

export default {
  name: "Comments",
  props: ["commentQuantity", "blog"],
  components: {
    CommentTree,
    Loading,
    UsersLike,
  },
  data() {
    return {
      commentText: "",
      comments: null,
      usersLike: null,
      commentsList: null,
      submitLoading: false,
      getCommentsLoading: true,
      errMessage: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    EventBus.$on("refetchComments", this.fetchComments);
    EventBus.$on("handleShowUsersLike", (usersLike) => {
      this.handleShowUsersLike(usersLike);
    });
    EventBus.$on("likeComment", (payload) => {
      let commentPath = payload.split("/");
      let commentId = commentPath.pop();
      commentPath = commentPath.join("/");
      this.handleLikeComment(commentPath, commentId);
    });
    window.addEventListener("click", () => {
      this.handleChangeBoxState();
    });
    this.fetchComments();
  },
  destroyed() {
    EventBus.$off("refetchComments", this.fetchComments);
    EventBus.$off("likeComment", (payload) => {
      let commentPath = payload.split("/");
      let commentId = commentPath.pop();
      commentPath = commentPath.join("/");
      this.handleLikeComment(commentPath, commentId);
    });
  },
  mounted() {},
  methods: {
    ...mapMutations(["updateCommentsToStore", "handleChangeBoxState"]),
    async handlePublishComment() {
      if (!this.user.userId) {
        this.$router.push({ name: "Login" });
      }
      if (!this.commentText) {
        this.errMessage = true;
        return;
      }
      this.submitLoading = true;
      let blogId = this.$route.params.blogId;
      let commentRef = db.collection(`blogs/${blogId}/comments`).doc();
      let commentObject = {
        commentId: commentRef.id,
        userId: this.user.userId,
        comment: this.commentText,
        likes: 0,
        usersLike: [],
        created: firebase.firestore.FieldValue.serverTimestamp(),
      };
      try {
        await commentRef.set(commentObject);
        this.commentText = "";
        this.fetchComments();
        console.log("publish comment successfully");
        window.scrollTo({
          top: this.$refs.commentsRef.offsetTop - 20,
        });
      } catch (err) {
        console.log(err.message);
      }
      this.submitLoading = false;
    },
    async fetchCommentsByCollection(preCollectionUrl, commentId) {
      let collectionUrl;
      let blogId = this.$route.params.blogId;
      //check use original url or preUrl
      if (preCollectionUrl) {
        collectionUrl = `${preCollectionUrl}/${commentId}/comments`;
      } else {
        collectionUrl = `blogs/${blogId}/comments`;
      }
      let commentsCollectionRef = db.collection(collectionUrl);
      try {
        let getCommentsByCollection = await commentsCollectionRef.get();
        //check check if comments collection is empty then return
        if (!getCommentsByCollection.docs.length) return;
        let commentsPromise = getCommentsByCollection.docs.map(async (doc) => {
          // get user info by comment
          let comment = doc.data();
          try {
            // use recursion to get sub comments and return promise array
            let subCommentsPromise = await this.fetchCommentsByCollection(
              collectionUrl,
              comment.commentId
            );
            let subCommentsSorted;
            //check subComments is exist
            if (Array.isArray(subCommentsPromise)) {
              let subComments = await Promise.all(subCommentsPromise);
              subCommentsSorted = subComments.sort(
                (a, b) => a.created - b.created
              );
            }
            let user = await db.collection("users").doc(comment.userId).get();
            let { userId, imgUrl, userName } = user.data();
            return {
              ...comment,
              userId,
              imgUrl,
              userName,
              subComments: subCommentsSorted,
            };
          } catch (err) {
            console.log(err.message);
          }
        });
        return commentsPromise;
      } catch (err) {
        console.log(err.message);
      }
    },
    async fetchComments() {
      this.getCommentsLoading = true;
      try {
        let commentsPromise = await this.fetchCommentsByCollection();
        if (commentsPromise) {
          let getComments = await Promise.all(commentsPromise);
          let result = getComments.sort((a, b) => b.created - a.created);
          this.comments = result;
          this.updateCommentsToStore(result);
        } else {
          this.comments = null;
        }
      } catch (err) {
        console.log(err);
      }
      this.getCommentsLoading = false;
    },
    getLocalComment(comments, commentId) {
      for (let comment of comments) {
        if (comment.commentId === commentId) {
          return comment;
        }
        let subComments = comment.subComments;
        if (subComments) {
          let result = this.getLocalComment(subComments, commentId);
          if (result) return result;
        }
      }
    },
    async handleLikeComment(commentPath, commentId) {
      let commentRef = db
        .collection(`blogs/${this.blog?.blogId}/${commentPath}`)
        .doc(commentId);
      //get comment from comments
      let getComment = this.getLocalComment(this.comments, commentId);
      try {
        // get likes and usersLike arr from comment
        let { usersLike, commentId } = getComment;
        // check users have already liked comment
        if (!usersLike.includes(this.user.userId)) {
          usersLike.push(this.user.userId);
          await commentRef.update({
            likes: getComment.likes + 1,
            usersLike,
          });
          //update like state in local comment
          this.setLikeStateInLocal(commentId, usersLike, 1);
        } else {
          //remove user unlike comment from the usersLike arr
          let arrWithoutUserUnlike = usersLike.filter(
            (user) => user !== this.user.userId
          );
          await commentRef.update({
            likes: getComment.likes - 1,
            usersLike: arrWithoutUserUnlike,
          });
          // update like state in local comment
          this.setLikeStateInLocal(commentId, arrWithoutUserUnlike, -1);
        }
      } catch (err) {
        console.log(err.message);
      }
    },
    async handleShowUsersLike(usersLike) {
      try {
        let users = usersLike.map(async (user) => {
          try {
            let getUser = await db.collection("users").doc(user).get();
            return getUser.data();
          } catch (err) {
            console.log(err.message);
          }
        });
        let result = await Promise.all(users);
        this.usersLike = result;
      } catch (err) {
        console.log(err.message);
      }
    },
    handleHideUsersLike() {
      this.usersLike = null;
    },
    mapToUpdateLikeState(comments, commentId, usersLike, number) {
      let newComments = comments.map((comment) => {
        if (comment.commentId === commentId) {
          comment.likes = comment.likes + number;
          comment.usersLike = usersLike;
          return comment;
        }
        let subComments = comment.subComments;
        if (Array.isArray(subComments)) {
          this.mapToUpdateLikeState(subComments, commentId, usersLike, number);
        }
        return comment;
      });
      return newComments;
    },
    setLikeStateInLocal(commentId, usersLike, number) {
      let newComments = this.mapToUpdateLikeState(
        this.comments,
        commentId,
        usersLike,
        number
      );
      this.comments = newComments;
    },
    calcTotalComments(comments) {
      return comments?.reduce((acc, comment) => {
        if (comment.subComments) {
          return acc.concat(
            comment,
            this.calcTotalComments(comment.subComments)
          );
        } else {
          return acc.concat(comment);
        }
      }, []);
    },
  },
  watch: {
    commentText() {
      this.errMessage = false;
    },
    $route: "fetchComments",
    comments() {
      let commentsQuantity = this.calcTotalComments(this.comments);
      this.commentQuantity(commentsQuantity ? commentsQuantity.length : 0);
    },
  },
};
</script>
<style lang="scss" scoped>
.comments {
  padding: 15px;
  background: $bgsection-cl;
  margin-bottom: $mgbottom-section;
  border-radius: $border-radius;
  &__section {
    margin: 0 auto 30px;
    @media (min-width: 768px) {
      width: 70%;
    }
    p {
      padding: 30px;
      font-size: 1.5rem;
      color: $text-cl;
      text-align: center;
    }
  }
  &__form {
    text-align: center;
    textarea {
      width: 100%;
      max-width: 350px;
      height: 100px;
      resize: none;
      font-size: 1.5rem;
      display: block;
      margin: 0 auto;
      padding: 5px;
      border-radius: 6px;
      border-color: #ccc;
    }
    .errmessage {
      font-size: 1.3rem;
      color: #e60000;
      margin-top: 10px;
    }
    .loadingbtn {
      margin-top: 15px;
    }
    button {
      width: 100%;
      padding: 5px 0;
      max-width: 350px;
      margin-top: 10px;
      font-size: 1.6rem;
      background: #4c4cb9;
      color: #ffffff;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }
  }
}
.loadingcomments {
  width: 100%;
  height: 300px;
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>