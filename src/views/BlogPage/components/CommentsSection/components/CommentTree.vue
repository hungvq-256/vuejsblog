<template>
  <div
    class="commenttree"
    ref="commenttree"
    commentId="comments"
    v-if="comments"
  >
    <comment
      v-for="comment in comments"
      :key="comment.commentId"
      :comment="comment"
      :boxId="boxId"
    />
  </div>
</template>

<script>
import Comment from "./Comment.vue";
export default {
  name: "comment-tree",
  props: ["comments", "refetchComments"],
  components: {
    Comment,
  },
  data() {
    return {
      boxId: null,
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
// .commenttree {
//   position: relative;
//   .commentwrapper {
//     position: relative;
//     &::before {
//       content: "";
//       position: absolute;
//       top: 0;
//       left: -27px;
//       width: 2px;
//       height: 100%;
//       background: #ccc;
//       display: block;
//     }
//     &:last-child {
//       &::before {
//         width: initial;
//         height: initial;
//       }
//     }
//     &:first-child {
//       .comment {
//         &__curveline {
//           position: absolute;
//           top: -66%;
//           left: -27px;
//           width: 23px;
//           height: 92%;
//         }
//       }
//     }
//   }
// }
</style>