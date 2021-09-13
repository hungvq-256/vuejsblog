<template>
  <div class="myblogs">
    <ul class="bloglist">
      <li v-for="(blog, index) in myBlogs" :key="index" class="bloglist__item">
        <div class="bloglist__item-text">
          <span class="bloglist__item-order">{{ index + 1 }}.</span>
          <router-link
            :to="{
              name: 'BlogPage',
              params: {
                category: blog.category,
                blogId: blog.blogId,
              },
            }"
            class="bloglist__item-title"
            >{{ blog.title }}</router-link
          >
        </div>
        <div class="bloglist__item-tools">
          <edit-icon @click="handleEdit(blog.blogId)" />
          <trash-icon @click="handleDeleteBlog(blog.blogId)" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import TrashIcon from "../../../assets/Icons/trash-regular.svg";
import EditIcon from "../../../assets/Icons/edit-regular.svg";
export default {
  name: "MyBlogs",
  components: {
    TrashIcon,
    EditIcon,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["blogList", "user"]),
    myBlogs() {
      return this.blogList.filter((blog) => blog.userId === this.user.userId);
    },
  },
  methods: {
    ...mapActions(["handleDeleteBlogInStore"]),
    ...mapMutations(["handleEditBlog"]),
    handleDeleteBlog(index) {
      if (confirm("Do you want to delete this blog?"))
        this.handleDeleteBlogInStore(index);
    },
    handleEdit(blogId) {
      this.handleEditBlog(blogId);
      this.$router.push("/edit");
    },
  },
};
</script>
<style lang="scss" scoped>
.myblogs {
  .bloglist {
    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 0;
      &:not(:first-child) {
        border-top: 1px solid #ccc;
      }
      &-text {
        span {
          font-size: 1.6rem;
          display: inline-block;
          width: 15px;
          color: $text-cl;
        }
        a {
          font-size: 1.6rem;
          margin-left: 5px;
          color: $text-cl;
          word-break: break-word;
          &:hover {
            color: $travel-cl;
          }
        }
      }
      &-tools {
        display: flex;
        align-items: center;
        svg {
          width: 16px;
          cursor: pointer;
          color: rgb(216, 48, 36);
          &:first-child {
            color: rgb(35, 99, 218);
            margin: 0 10px;
          }
        }
      }
    }
  }
}
</style>