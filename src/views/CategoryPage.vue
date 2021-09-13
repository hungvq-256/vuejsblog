<template>
  <div class="categorypagewrapper">
    <div class="categorypage">
      <h2 class="categorypage__title">
        {{ $route.params.category.toUpperCase() }}
      </h2>
      <div class="categorypage__blog" v-if="blogs.length">
        <blog-item v-for="blog in blogs" :key="blog.blogId" :blog="blog" />
      </div>
      <p class="emptyblogtext" v-else>
        {{ `There is no blog in this ${$route.params.category} category` }}
      </p>
    </div>
    <!-- <div class="loading" v-else>
      <loading />
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BlogItem from "../components/BlogItem.vue";
// import Loading from "../components/Loading.vue";
export default {
  name: "CategoryPage",
  components: {
    BlogItem,
    // Loading,
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapGetters(["getBlogsByCategory"]),
    blogs() {
      let { category } = this.$route.params;
      let blogs = this.getBlogsByCategory(category);
      return blogs;
    },
  },
  watch: {
    blogs() {
      this.loading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.categorypage {
  padding: $pd-section;
  background: $bgsection-cl;
  border-radius: $border-radius;
  margin-bottom: $mgbottom-section;
  min-height: 100vh;
  position: relative;
  &__title {
    margin: 15.6px 0;
    font-size: 1.6rem;
    font-weight: 600;
    color: $text-cl;
  }
  &__blog {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 15px;
    column-gap: 15px;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
  }
  .emptyblogtext {
    font-size: 1.5rem;
    color: $text-cl;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.loading {
  height: calc(100vh - 95px);
  border-radius: $border-radius;
  background: $bgsection-cl;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>