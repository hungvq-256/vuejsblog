<template>
  <div class="advertising">
    <swiper class="swiper" :options="swiperOption">
      <swiper-slide class="swiper__item">
        <div class="advertisingimg">
          <img src="../assets/ads-img1.jpg" alt="" />
        </div>
      </swiper-slide>
      <swiper-slide class="swiper__item">
        <div class="advertisingimg">
          <img src="../assets/ads-img2.jpg" alt="" />
        </div>
      </swiper-slide>
      <swiper-slide class="swiper__item">
        <div class="advertisingimg">
          <img src="../assets/ads-img3.jpg" alt="" />
        </div>
      </swiper-slide>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import SwiperCore, { Autoplay, Navigation } from "swiper/core";
import "swiper/components/navigation/navigation.min.css";
import "swiper/swiper.min.css";
import "swiper/swiper-bundle.css";

SwiperCore.use([Autoplay, Navigation]);

export default {
  name: "AdvertisingSection",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.advertising {
  margin-bottom: $mgbottom-section;
  overflow: hidden;
  width: 100%;
  .swiper {
    width: 100%;
    border-radius: 6px;
    &__item {
      cursor: pointer;
      .advertisingimg {
        width: 100%;
        position: relative;
        height: 400px;
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
    }
  }
  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 20px;
    color: #ffffff;
    font-weight: 600;
  }
}
</style>