<template>
  <div class="blogpage">
    <blog-content
      :sentBlogToParentEle="receiveBlog"
      :commentQuantity="commentQuantity"
    />
    <comments-section
      :commentQuantity="getCommentQuantity"
      :blog="blog"
      ref="commentsection"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import BlogContent from "./components/BlogContent.vue";
import CommentsSection from "./components/CommentsSection/";
export default {
  components: { BlogContent, CommentsSection },
  data() {
    return {
      blog: {},
      commentQuantity: 0,
    };
  },
  mounted() {
    // if (this.isScrollToComment) {
    //   this.$nextTick(() => this.scrollToCommentSection());
    // }
  },
  destroyed() {
    this.setScrollToComment();
  },
  computed: {
    ...mapState(["isScrollToComment"]),
  },
  methods: {
    ...mapMutations(["setScrollToComment"]),
    receiveBlog(blog) {
      this.blog = blog;
    },
    getCommentQuantity(comment) {
      this.commentQuantity = comment;
    },
    scrollToCommentSection() {
      console.log("scroll to comment");
      window.scrollTo({
        top: this.$ref.commentsection?.offsetTop,
      });
    },
  },
};
</script>

<style>
</style>