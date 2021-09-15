<template>
  <div class="mycommentswrapper">
    <div class="mycomments" v-if="blogs" ref="blogstoggle">
      <div class="comments" v-for="(blog, idx) in blogs" :key="blog.blogId">
        <div class="comments__headerbar" @click.stop="handleToggleDisplay(idx)">
          <p
            class="comments__headerbar-category"
            :style="{ background: categoriesColor(blog.category) }"
          >
            {{
              blog.category.replace(
                blog.category[0],
                blog.category[0].toUpperCase()
              )
            }}
          </p>
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
      <div class="emptycomment" v-if="!blogs.length">
        <p>You don't have any comments</p>
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
import { mapMutations, mapState } from "vuex";
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
    window.addEventListener("click", () => {
      let blogsToggleRef = this.$refs.blogstoggle;
      blogsToggleRef?.children.forEach((blog) => {
        blog.classList.remove("toggle");
      });
    });
  },
  methods: {
    ...mapMutations(["setScrollToComment"]),
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
              let subCommentsPromise = await this.fetchCommentsByCollection(
                null,
                null,
                blog.blogId
              );
              if (Array.isArray(subCommentsPromise)) {
                let result = await Promise.all(subCommentsPromise);
                let flattenResult = this.flattenArr(result);
                let filterCommentsByUserId = flattenResult.filter(
                  (comment) => comment.userId === this.user.userId
                );
                if (filterCommentsByUserId.length) {
                  return {
                    blogId: blog.blogId,
                    title: blog.title,
                    category: blog.category,
                    comments: filterCommentsByUserId,
                  };
                }
              }
            }
          } catch (err) {
            console.log(err.message);
          }
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
    async fetchCommentsByCollection() {
      let [preCollectionUrl, commentId, blogId] = arguments;
      let collectionUrl;
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
          let comment = doc.data();
          try {
            let result = [];
            // use recursion to get sub comments and return promise array
            let subCommentsPromise = await this.fetchCommentsByCollection(
              collectionUrl,
              comment.commentId
            );
            if (comment.userId === this.user.userId) {
              result = result.concat(comment);
            }
            //check subComments is exist
            if (Array.isArray(subCommentsPromise)) {
              let subComments = await Promise.all(subCommentsPromise);
              let subCommentsSorted = subComments.sort(
                (a, b) => a.created - b.created
              );
              result = result.concat(subCommentsSorted);
            }
            return result;
          } catch (err) {
            console.log(err.message);
          }
        });
        return commentsPromise;
      } catch (err) {
        console.log(err.message);
      }
    },
    flattenArr(arr) {
      return arr.reduce((acc, comment) => {
        if (Array.isArray(comment)) {
          return acc.concat(this.flattenArr(comment));
        } else {
          return acc.concat(comment);
        }
      }, []);
    },
    categoriesColor(categories) {
      let colorObject = {
        fashion: "#ff0000",
        travel: "#9848f6",
        food: "#0000ff",
        technology: "#ffa500",
      };
      return colorObject[categories];
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "BlogPage" && from.name === "MyComments") {
      this.setScrollToComment();
    }
    next();
  },
};
</script>

<style lang="scss" scoped>
.mycommentswrapper {
  height: 100%;
  .mycomments {
    height: 100%;
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
          color: #ffffff;
          flex: 0 0 35px;
          padding: 5px 4px;
          background: coral;
          text-align: center;
          border-radius: 5px;
        }
        &-title {
          font-size: 1.5rem;
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
    .emptycomment {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      p {
        font-size: 1.5rem;
        color: $text-cl;
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