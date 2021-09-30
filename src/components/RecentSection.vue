<template>
  <div class="recentsection">
    <h2 class="recentsection__title">RECENT POSTS</h2>
    <div class="recentsection__gridwrapper" v-if="recentBlogs.length">
      <router-link
        class="griditem"
        :to="{
          name: 'BlogPage',
          params: {
            category: blog.category,
            blogId: blog.blogId,
          },
        }"
        v-for="blog in recentBlogs"
        :key="blog.blogId"
      >
        <div class="griditem__img">
          <!-- <div :style="{ backgroundImage: `url(${blog.thumbnailImg})` }"></div> -->
          <img :src="blog.thumbnailImg" alt="thumbnail image" />
        </div>
        <div class="griditem__textbox">
          <div
            class="griditem__textbox-categories"
            :style="{ background: categoriesColor(blog.category) }"
          >
            {{
              blog.category.replace(
                blog.category[0],
                blog.category[0].toUpperCase()
              )
            }}
          </div>
          <div class="griditem__textbox-title">
            <h2>{{ blog.title }}</h2>
          </div>
          <div class="griditem__textbox-created">
            <clock-icon />
            <span>{{ blog.created.toDate().toDateString() }}</span>
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
import Loading from "./Loading.vue";
import { mapState } from "vuex";
export default {
  name: "RecentSection",
  components: {
    ClockIcon,
    Loading,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["blogList"]),
    recentBlogs() {
      return this.blogList.slice(0, 9);
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
.recentsection {
  padding: $pd-section;
  background: $bgsection-cl;
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
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-gap: 20px;
    .griditem {
      grid-column: auto / span 3;
      display: flex;
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        display: initial;
        .griditem__img {
          margin-bottom: 10px;
          margin-right: 0;
          overflow: hidden;
          height: 160px;
          // @media (max-width: 991px) {
          //   height: 200px;
          // }
        }
      }
      @media (max-width: 1199px) {
        display: initial;
      }
      @media (max-width: 767px) {
        display: flex;
        grid-column: auto / span 6;
      }
      &__img {
        flex: 0 0 34%;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 15px;
        height: 116px;
        @media (max-width: 1199px) {
          height: 180px;
          margin-bottom: 10px;
          margin-right: initial;
        }
        @media (max-width: 991px) {
          height: 200px;
        }
        @media (max-width: 767px) {
          height: 90px;
          margin-right: 15px;
        }
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
        // img {
        //   position: absolute;
        //   top: 50%;
        //   left: 50%;
        //   transform: translate(-50%, -50%);
        //   min-width: 100%;
        //   min-height: 100%;
        //   object-fit: cover;
        // }
      }
      &__textbox {
        flex: 0 0 63%;
        &-categories {
          display: inline-block;
          padding: 3px;
          border-radius: 3px;
          color: #ffffff;
          font-size: 1.1rem;
        }
        &-title {
          h2 {
            color: $text-cl;
            font-size: 1.368rem;
            font-weight: 500;
            line-height: 16px;
            margin: 5px 0;
            display: -webkit-inline-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
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
      &:first-child {
        grid-area: 1/1/3/3;
        @media (max-width: 991px) {
          grid-area: 1/1/3/4;
        }
        @media (max-width: 767px) {
          grid-area: 1/1/3/7;
        }
      }
      &:nth-child(2) {
        grid-area: 1/3/3/5;
        @media (max-width: 991px) {
          grid-area: 1/4/3/7;
        }
        @media (max-width: 767px) {
          grid-area: 3/1/5/7;
        }
      }
      &:nth-child(3) {
        grid-area: 1/5/3/7;
        @media (max-width: 991px) {
          grid-area: 3/1/4/7;
        }
        @media (max-width: 767px) {
          grid-area: 5/1/7/7;
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