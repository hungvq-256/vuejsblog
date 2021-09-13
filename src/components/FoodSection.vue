<template>
  <div class="foodsection">
    <h2 class="foodsection__title">{{ titleSection }}</h2>
    <div class="foodsection__loading" v-if="!blogs">
      <loading class="loadingicon" />
    </div>
    <div class="foodsection__list" v-else>
      <div
        class="foodsection__item"
        v-for="(item, index) in blogs"
        v-bind:key="index"
      >
        <blog-item :blog="item" />
      </div>
    </div>
  </div>
</template>

<script>
import BlogItem from "./BlogItem.vue";
import { mapGetters, mapState } from "vuex";
import Loading from "../components/Loading.vue";
export default {
  name: "FoodSection",
  components: {
    BlogItem,
    Loading,
  },
  data() {
    return {
      blogs: null,
    };
  },
  methods: {
    getBlogs() {
      let { category, blogId } = this.$route.params;
      if (this.blogList.length) {
        if (category) {
          let blogs = this.getBlogsByCategory(category);
          let blogsWithoutCurrentBlog = blogs.filter(
            (blog) => blog.blogId !== blogId
          );
          this.blogs = blogsWithoutCurrentBlog;
        } else {
          this.blogs = this.getBlogsByCategory("food");
        }
      }
    },
  },
  computed: {
    ...mapGetters(["getBlogsByCategory"]),
    ...mapState(["blogList"]),
    titleSection() {
      let category = this.$route.params.category;
      return category ? "RELATED BLOGS" : "FOOD";
    },
    // blogsChange() {
    //   return this.blogList.length;
    // },
  },
  created() {
    this.getBlogs();
  },
  watch: {
    $route: "getBlogs",
    blogList() {
      this.getBlogs();
    },
  },
};
</script>
<style lang="scss" scoped>
.foodsection {
  padding: $pd-section;
  background: $bgsection-cl;
  border-radius: $border-radius;
  margin-bottom: $mgbottom-section;
  &__title {
    margin: 15.6px 0;
    font-size: 1.6rem;
    font-weight: 500;
    color: $text-cl;
  }
  &__list {
    display: grid;
    grid-row-gap: 15px;
    @media (max-width: 991px) and (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 15px;
    }
  }
  &__loading {
    height: 350px;
    position: relative;
    .loadingicon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>