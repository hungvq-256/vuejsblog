<template>
  <div class="latestposts">
    <h2 class="latestposts__title">LATEST POSTS</h2>
    <div class="latestposts__gridwrapper" v-if="latestBlogs.length">
      <router-link
        class="latestblog"
        :to="{
          name: 'BlogPage',
          params: {
            category: blog.category,
            blogId: blog.blogId,
          },
        }"
        v-for="blog in latestBlogs"
        :key="blog.blogId"
      >
        <div class="latestblog__img">
          <img :src="blog.thumbnailImg" alt="thumbnail img" />
        </div>
        <div class="latestblog__textbox">
          <div
            class="latestblog__textbox-categories"
            :style="{ background: categoriesColor(blog.category) }"
          >
            {{
              blog.category.replace(
                blog.category[0],
                blog.category[0].toUpperCase()
              )
            }}
          </div>
          <div class="latestblog__textbox-title">
            <h2>
              {{ blog.title }}
            </h2>
          </div>
          <div class="latestblog__textbox-created">
            <clock-icon />
            <span>{{ blog.created.toDate().toDateString() }}</span>
          </div>
          <div class="latestblog__textbox-description">
            <p>{{ blog.description }}</p>
          </div>
        </div>
      </router-link>
    </div>
    <div class="loading" v-else>
      <loading class="loadingicon" />
    </div>
  </div>
</template>

<script>
import ClockIcon from "../assets/Icons/clock-regular.svg";
import { mapState } from "vuex";
import Loading from "./Loading.vue";
export default {
  name: "LatestPosts",
  components: {
    ClockIcon,
    Loading,
  },
  data() {
    return {
      listItem: [...Array(6)],
    };
  },
  computed: {
    ...mapState(["blogList"]),
    latestBlogs() {
      return this.blogList.filter((blog, index) => index % 2 === 0);
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
.latestposts {
  background: $bgsection-cl;
  padding: $pd-section;
  border-radius: $border-radius;
  margin-bottom: $mgbottom-section;
  &__title {
    margin: 15.6px 0;
    font-size: 1.6rem;
    font-weight: 600;
    color: $text-cl;
  }
  &__gridwrapper {
    display: grid;
    grid-template-columns: auto;
    grid-row-gap: 25px;
    .latestblog {
      display: flex;
      justify-content: space-between;
      @media (max-width: 767px) {
        display: initial;
      }
      &__img {
        flex: 0 0 44%;
        position: relative;
        height: 205px;
        border-radius: 6px;
        overflow: hidden;
        @media (max-width: 767px) {
          height: 240px;
          margin-bottom: 10px;
        }
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
        flex: 0 0 53%;
        &-categories {
          display: inline-block;
          padding: 3px;
          border-radius: 3px;
          background: $food-cl;
          color: #ffffff;
          font-size: 1.1rem;
        }
        &-title {
          h2 {
            color: $text-cl;
            font-size: 1.82rem;
            font-weight: 500;
            line-height: 20px;
            margin: 6px 0;
            transition: all 0.2s;
            cursor: pointer;
            display: -webkit-inline-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
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
        &-description {
          margin-top: 6px;
          p {
            font-size: 1.3rem;
            line-height: 16px;
            color: $subtext-cl;
            display: -webkit-inline-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
  .loading {
    height: 610px;
    position: relative;
    .loadingicon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: initial;
    }
  }
}
</style>