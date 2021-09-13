<template>
  <div class="mycommentswrapper">
    <div class="mycomments" v-if="blogs" ref="blogstoggle">
      <div class="comments" v-for="(blog, idx) in blogs" :key="blog.blogId">
        <div class="comments__headerbar" @click="handleToggleDisplay(idx)">
          <p class="comments__headerbar-category">{{ blog.category }}</p>
          <p class="comments__headerbar-title">{{ blog.title }}</p>
          <i class="comments__headerbar-icon">
            <down-arrow />
          </i>
        </div>
        <div class="comments__list">
          <router-link
            class="comments__list-item"
            v-for="(comment, idx) in blog.comments"
            :key="comment.commentId"
            :to="`/${blog.category}/${blog.blogId}`"
          >
            <span class="index">{{ idx + 1 }}.</span>
            <span>{{ comment.comment }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="loading" v-else>
      <loading class="loadingicon" />
    </div>
  </div>
</template>

<script>
import { db } from "../../../firebase/firebaseInit";
import DownArrow from "../../../assets/Icons/down-arrow.svg";
import { mapState } from "vuex";
import Loading from "../../../components/Loading.vue";
export default {
  name: "MyComments",
  data() {
    return {
      blogs: null,
    };
  },
  components: {
    DownArrow,
    Loading,
  },
  created() {
    this.getCommentsByBlogs();
  },
  methods: {
    async getCommentsByBlogs() {
      try {
        let getBlogsRequest = await db.collection("blogs").get();
        let getCommentPromise = getBlogsRequest.docs.map(async (doc) => {
          let blog = doc.data();
          try {
            //get comment collection from each blog
            let getCommentsRequest = await db
              .collection(`blogs/${blog.blogId}/comments`)
              .get();
            //check the comment collection is exist
            if (getCommentsRequest.docs.length) {
              let getComments = getCommentsRequest.docs.map((doc) => {
                let comment = doc.data();
                return comment.userId === this.user.userId && doc.data();
              });
              //remove falsy value from comments arr
              let filterComments = getComments.filter(Boolean);
              return (
                //check user has comment in blog
                !!filterComments.length && {
                  blogId: blog.blogId,
                  title: blog.title,
                  category: blog.category,
                  comments: filterComments,
                }
              );
            }
          } catch (err) {
            console.log(err.message);
          }
          return;
        });
        let result = await Promise.all(getCommentPromise);
        this.blogs = [...result.filter(Boolean)];
      } catch (err) {
        console.log(err.message);
      }
    },
    handleToggleDisplay(idx) {
      let blogsToggleRef = this.$refs.blogstoggle;
      blogsToggleRef.children[idx].classList.toggle("toggle");
      blogsToggleRef.children.forEach((blog, index) => {
        if (index !== idx) {
          blog.classList.remove("toggle");
        }
      });
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="scss" scoped>
.mycommentswrapper {
  height: 100%;
  .mycomments {
    .comments {
      &:not(:first-child) {
        margin-top: 10px;
      }
      &__headerbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 0.5px solid #ccc;
        border-radius: 5px;
        padding: 6px;
        cursor: pointer;
        &-category {
          font-size: 1.4rem;
          color: $text-cl;
          flex: 0 0 35px;
          padding: 5px 4px;
          background: coral;
          text-align: center;
          border-radius: 5px;
        }
        &-title {
          font-size: 1.7rem;
          color: $text-cl;
          font-weight: 500;
          flex-grow: 1;
          margin-left: 15px;
        }
        &-icon {
          display: flex;
          width: 10px;
          transform: rotate(0deg);
          transition: 0.2s;
          svg {
            height: 10px;
            fill: $text-cl;
          }
        }
      }
      &.toggle {
        .comments__list {
          display: block;
        }
        .comments__headerbar {
          &-icon {
            transform: rotate(180deg);
            transition: 0.2s;
          }
        }
      }
      &__list {
        padding: 6px;
        border: 0.5px solid #e7e7e7;
        margin-top: 8px;
        border-radius: 5px;
        display: none;
        &-item {
          font-size: 1.5rem;
          padding: 7px 0;
          display: block;
          color: $text-cl;
          cursor: pointer;
          &:not(:first-child) {
            border-top: 0.5px solid #e7e7e7;
          }
          &:hover {
            color: $hover-cl;
          }
          span {
            &.index {
              display: inline-block;
              color: $text-cl;
              width: 17px;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .loading {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>