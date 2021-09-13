<template>
  <div class="blogpage">
    <blog-content
      :sentBlogToParentEle="receiveBlog"
      :commentQuantity="commentQuantity"
    />
    <comments-section :commentQuantity="getCommentQuantity" :blog="blog" />
  </div>
</template>

<script>
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
  methods: {
    receiveBlog(blog) {
      this.blog = blog;
    },
    getCommentQuantity(comment) {
      this.commentQuantity = comment;
    },
  },
};
</script>

<style>
</style>