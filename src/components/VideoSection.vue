<template>
  <div class="videosection">
    <h2 class="videosection__title">POPULAR POSTS</h2>
    <div class="videosection__gridwrapper" v-if="blogList.length">
      <div class="videoitem" v-for="blog in blogTop" :key="blog.blogId">
        <router-link
          :to="{
            name: 'BlogPage',
            params: {
              category: blog.category,
              blogId: blog.blogId,
            },
          }"
        >
          <div class="videoimg">
            <img :src="blog.thumbnailImg" alt="thumbnail image" />
          </div>
          <div class="textbox">
            <div
              class="textbox__categoriestag"
              :style="{ background: categoriesColor(blog.category) }"
            >
              {{
                blog.category.replace(
                  blog.category[0],
                  blog.category[0].toUpperCase()
                )
              }}
            </div>
            <div class="textbox__title">
              <h2>{{ blog.title }}</h2>
            </div>
            <div class="textbox__created">
              <!-- <i><img src="../assets/clock.png" alt="" /></i> -->
              <span>{{ blog.created.toDate().toDateString() }}</span>
            </div>
          </div>
        </router-link>
      </div>
      <blog-item v-for="blog in restBlog" :key="blog.blogId" :blog="blog" />
    </div>
    <div class="loading" v-else>
      <loading class="loadingicon" />
    </div>
  </div>
</template>

<script>
import BlogItem from "../components/BlogItem.vue";
import { mapState } from "vuex";
import Loading from "./Loading.vue";
export default {
  name: "VideoSection",
  components: {
    BlogItem,
    Loading,
  },
  computed: {
    ...mapState(["blogList"]),
    blogTop() {
      return this.blogList.slice(0, 2);
    },
    restBlog() {
      return this.blogList.slice(2, 6);
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
.videosection {
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
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px 20px;
    @media (max-width: 767px) {
      grid-template-columns: auto;
    }
    .videoitem {
      position: relative;
      a {
        display: block;
        position: relative;
        height: 100%;
        .videoimg {
          padding-top: 70%;
          position: relative;
          height: 100%;
          overflow: hidden;
          border-radius: 6px;
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
        .textbox {
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 0 10px 10px;
          z-index: 2;
          &__categoriestag {
            display: inline;
            padding: 1px 3px;
            border-radius: 3px;
            color: #ffffff;
            font-size: 11px;
            font-weight: 600;
          }
          &__title {
            h2 {
              color: #ffffff;
              font-size: 1.521rem;
              font-weight: 500;
              margin: 5px 0;
              display: -webkit-inline-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
          &__created {
            font-size: 1.105rem;
            color: #ffffff;
            i {
              width: 10px;
              height: 10px;
              display: flex;
            }
          }
        }
        &:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: black;
          z-index: 1;
          opacity: 0.3;
          border-radius: 6px;
        }
      }
      &:first-child {
        grid-area: 1/1/4/2;
        @media (max-width: 991px) {
          grid-area: initial;
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