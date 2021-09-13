<template>
  <div>
    <router-link
      class="blogitem"
      :to="{
        name: 'BlogPage',
        params: { category: blog.category, blogId: blog.blogId },
      }"
    >
      <div class="blogitem__img">
        <img :src="blog.thumbnailImg" alt="thumbnail img" />
      </div>
      <div class="blogitem__textbox">
        <div
          class="blogitem__textbox-categories"
          :style="{ background: categoriesColor(blog.category) }"
        >
          {{ capitalLetter || "Food" }}
        </div>
        <div class="blogitem__textbox-title">
          <h2>{{ blog.title }}</h2>
        </div>
        <div class="blogitem__textbox-created">
          <clock-icon />
          <span>{{ blog.created.toDate().toDateString() }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import ClockIcon from "../assets/Icons/clock-regular.svg";
import { mapState } from "vuex";
export default {
  name: "BlogItem",
  components: {
    ClockIcon,
  },
  props: {
    blog: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      classCategories: null,
    };
  },
  computed: {
    ...mapState(["blogList"]),
    capitalLetter() {
      let category = this.blog.category;
      return category?.replace(category[0], category[0].toUpperCase());
    },
  },
  methods: {
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
};
</script>
<style lang="scss" scoped>
.blogitem {
  display: flex;
  justify-content: space-between;
  &__img {
    flex: 0 0 34%;
    position: relative;
    height: $blogimg-height;
    border-radius: 6px;
    overflow: hidden;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }
  &__textbox {
    flex: 0 0 63%;
    &-categories {
      display: inline-block;
      padding: 3px;
      border-radius: 3px;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
    }
    &-title {
      h2 {
        color: $text-cl;
        font-size: 1.368rem;
        font-weight: 500;
        line-height: 16px;
        display: -webkit-inline-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 5px 0;
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
          color: $hover-cl;
        }
      }
    }
    &-created {
      display: flex;
      align-items: center;
      span {
        font-size: 1.105rem;
        color: $subtext-cl;
      }
      svg {
        width: 14px;
        color: $subtext-cl;
        margin-right: 4px;
      }
    }
  }
}
</style>