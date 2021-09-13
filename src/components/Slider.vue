<template>
  <div class="sliderwrapper">
    <swiper class="slider" :options="swiperOption" v-if="modifiedBlogs.length">
      <swiper-slide
        class="slider__item"
        v-for="blog in modifiedBlogs"
        :key="blog.blogId"
      >
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
            <img :src="blog.thumbnailImg" alt="cake img" />
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
      </swiper-slide>
    </swiper>
    <div class="loading" v-else>
      <loading class="loadingicon" />
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";
import SwiperCore, { Autoplay } from "swiper/core";
import "swiper/swiper-bundle.css";
import Loading from "./Loading.vue";
import { mapState } from "vuex";
SwiperCore.use([Autoplay]);
export default {
  name: "Slider",
  components: {
    Swiper,
    SwiperSlide,
    Loading,
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      widthDevice: null,
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        // autoplay: {
        //   delay: 2500,
        //   // disableOnInteraction: false,
        // },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1366: {
            slidesPerView: 4,
          },
          1680: {
            slidesPerView: 5,
          },
        },
      },
    };
  },
  computed: {
    ...mapState(["blogList"]),
    modifiedBlogs() {
      return this.blogList.filter((blog, index) => index % 2 !== 0);
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
.slider {
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.25);
  &__item {
    height: 430px;
    a {
      display: block;
      position: relative;
      height: 100%;
      .videoimg {
        position: relative;
        height: 100%;
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
      .textbox {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 0 15px 15px;
        z-index: 2;
        &__categoriestag {
          display: inline;
          padding: 1px 3px;
          border-radius: 3px;
          background: $food-cl;
          color: #ffffff;
          font-size: 11px;
        }
        &__title {
          height: 40px;
          margin: 5px 0;
          h2 {
            color: #ffffff;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            display: -webkit-inline-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        &__created {
          font-size: 12px;
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
        background: rgba(0, 0, 0, 0.25);
        z-index: 1;
      }
    }
  }
}
.loading {
  height: 430px;
  background: $bgsection-cl;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>