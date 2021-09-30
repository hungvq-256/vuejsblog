<template>
  <div class="mainlayout">
    <router-view name="slider"></router-view>
    <div class="container">
      <div class="content">
        <div class="sidebarleft" ref="sideLeftRef">
          <widgets-section />
        </div>
        <div class="main" ref="mainSectionRef">
          <router-view></router-view>
        </div>
        <div class="sidebarright">
          <div ref="sideRightRef">
            <food-section />
            <follow-us />
            <advertising-section />
          </div>
        </div>
      </div>
      <div class="displayonmobile" v-if="isMiniTablet">
        <food-section />
        <advertising-section v-if="isMiniTablet" />
        <follow-us />
        <widgets-section />
      </div>
    </div>
  </div>
</template>

<script>
import WidgetsSection from "../components/WidgetsSection.vue";
import FoodSection from "../components/FoodSection.vue";
import FollowUs from "../components/FollowUs.vue";
import AdvertisingSection from "../components/AdvertisingSection.vue";
import { mapMutations, mapState } from "vuex";

export default {
  name: "MainLayout",
  components: {
    WidgetsSection,
    FoodSection,
    FollowUs,
    AdvertisingSection,
  },
  data() {
    return {
      isTablet: null,
      isMiniTablet: null,
      preValue: 0,
      changeDirection: false,
    };
  },
  created() {
    // window.addEventListener("scroll", this.fixedSideBar);
    window.addEventListener("resize", this.identifyWidth);
    this.identifyWidth();
  },
  computed: {
    ...mapState(["blog"]),
  },
  methods: {
    ...mapMutations(["setPreviousUrlToRedirect"]),
    identifyWidth() {
      let widthDevice = window.innerWidth;
      if (widthDevice <= 1199) {
        if (widthDevice <= 991) {
          this.isMiniTablet = true;
        } else {
          this.isMiniTablet = false;
        }
        this.isTablet = true;
        return;
      }
      this.isTablet = false;
      this.isMiniTablet = false;
      return;
    },
    scrollDirection() {
      let currentValue = window.pageYOffset;
      if (currentValue > this.preValue) {
        this.preValue = currentValue;
        return true;
      } else {
        this.preValue = currentValue;
        return false;
      }
    },
    fixedSideBar() {
      // console.log(window.pageYOffset);
      // let { mainSectionRef, sideLeftRef, sideRightRef } = this.$refs;
      let pageHeight = document.body.scrollHeight;
      let currentValue = window.pageYOffset;
      let windowHeight = window.innerHeight;
      // let windowScrollBottom = currentValue + window.innerWidth;

      let mainSection = this.$refs.mainSectionRef;
      let mainSectionHeight = mainSection?.clientHeight;
      let mainSectionTop = mainSection?.offsetTop;
      let mainSectionBottom = mainSectionHeight + mainSectionTop;
      // let sideLeft = this.$refs.sideLeftRef;
      let sideRight = this.$refs.sideRightRef;
      let sideRightHeight = sideRight?.clientHeight;
      let sideRightTop = sideRight?.offsetTop;
      let sideRightBottom = sideRightHeight + sideRightTop;
      let sideRightHeightScroll = currentValue + windowHeight - 20;
      console.log(sideRightBottom);
      //if scroll down
      if (this.scrollDirection()) {
        if (this.changeDirection && sideRightHeightScroll < sideRightBottom) {
          let styles = `position:absolute; top:${sideRightTop}px;bottom:initial`;
          sideRight.style = styles;
          this.changeDirection = !this.changeDirection;
          console.log("sroll down");
        }
        if (sideRightHeightScroll > sideRightBottom) {
          console.log(sideRightHeightScroll);
          console.log(sideRightBottom);
          let styles = `position:fixed; bottom:0;`;
          sideRight.style = styles;
        }
        if (sideRightHeightScroll >= mainSectionBottom) {
          sideRight.style.position = "absolute";
          sideRight.style.bottom = `${pageHeight - mainSectionBottom}px`;
        }
      } else {
        if (
          !this.changeDirection &&
          currentValue > sideRightTop &&
          sideRightHeightScroll < sideRightBottom
        ) {
          let styles = `position:absolute; top:${sideRightTop}px;bottom:initial`;
          sideRight.style = styles;
          this.changeDirection = !this.changeDirection;
          console.log("sroll up");
        }
        if (currentValue < sideRightTop) {
          sideRight.style.bottom = "initial";
          sideRight.style.position = "fixed";
          sideRight.style.top = "20px";
        }
        if (currentValue < mainSectionTop) {
          sideRight.style.position = "initial";
          sideRight.style.top = "initial";
        }
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === "/login") {
      this.setPreviousUrlToRedirect(from.path);
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
.mainlayout {
  .container {
    @media (max-width: 991px) {
      padding: 0;
    }
    @media (max-width: 767px) {
      padding: 0 10px;
    }
    .content {
      display: flex;
      margin-top: 25px;
      .sidebarleft {
        flex: 0 0 14%;
        margin-right: auto;
        @media (max-width: 1199px) {
          display: none;
        }
      }
      .main {
        flex: 0 0 58%;
        @media (max-width: 1199px) {
          flex: 0 0 66%;
        }
        @media (max-width: 991px) {
          flex: 0 0 100%;
        }
      }
      .sidebarright {
        flex: 0 0 25%;
        margin-left: auto;
        overflow: hidden;
        & > div {
          overflow: hidden;
        }
        @media (max-width: 1199px) {
          flex: 0 0 32%;
        }
        @media (max-width: 991px) {
          display: none;
        }
      }
    }
  }
  .fixedbottom {
    position: fixed;
    bottom: 0;
  }
  .fixedTop {
    position: fixed;
    top: 20px;
  }
}
</style>
