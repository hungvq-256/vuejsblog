<template>
  <div class="blogwrapper">
    <div class="blogwrapper__loading" v-if="!blog">
      <loading class="loadingicon" />
    </div>
    <div class="blogpage" v-else>
      <div class="blogpage__header">
        <h1 class="title">{{ blog.title }}</h1>
        <div class="bloginfo">
          <div class="left">
            <div
              class="category"
              :style="{ background: categoriesColor(blog.category) }"
            >
              <span>{{ category }}</span>
            </div>
            <div class="author">
              <div class="author__avatar">
                <div
                  class="avatarimg"
                  :style="{ backgroundImage: `url(${blog.imgUrl})` }"
                  v-if="blog.imgUrl"
                ></div>
                <p class="avatartext" v-else>{{ capitalLetter }}</p>
              </div>
              <span class="author__name">{{ blog.userName }}</span>
            </div>
            <div class="created">
              <clock-icon class="created__icon" />
              <span class="created__date">{{ dateCreated }}</span>
            </div>
          </div>
          <div class="right">
            <comment-icon class="right__commenticon" />
            <span class="right__commentquantity">{{ commentQuantity }}</span>
          </div>
        </div>
      </div>
      <div class="blogpage__content" ref="blogContent">
        <div class="socialbarwrapper">
          <div class="socialsharebar" ref="socialBar">
            <div
              class="socialitem"
              v-for="(item, index) in social"
              :key="index"
            >
              <i class="socialitem__img">
                <img :src="socialImg(item)" :alt="item" />
              </i>
            </div>
            <div class="socialitem">
              <i class="socialitem__img">
                <email-icon />
              </i>
            </div>
            <div class="socialitem">
              <i class="socialitem__img">
                <printer-icon />
              </i>
            </div>
          </div>
        </div>
        <div class="ql-snow">
          <div class="ql-editor" v-html="blog.contentHtml"></div>
        </div>
      </div>
      <div class="socialbarwrapper-mobile">
        <div class="socialsharebar">
          <div class="socialitem" v-for="(item, index) in social" :key="index">
            <i class="socialitem__img">
              <img :src="socialImg(item)" :alt="item" />
            </i>
          </div>
          <div class="socialitem">
            <i class="socialitem__img">
              <email-icon />
            </i>
          </div>
          <div class="socialitem">
            <i class="socialitem__img">
              <printer-icon />
            </i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClockIcon from "../../../assets/Icons/clock-regular.svg";
import CommentIcon from "../../../assets/Icons/comment-regular.svg";
import EmailIcon from "../../../assets/social-icon/email.svg";
import PrinterIcon from "../../../assets/social-icon/printer.svg";
import { mapState, mapGetters } from "vuex";
import Loading from "../../../components/Loading.vue";
export default {
  name: "BlogContent",
  components: {
    ClockIcon,
    CommentIcon,
    Loading,
    EmailIcon,
    PrinterIcon,
  },
  props: {
    sentBlogToParentEle: {
      type: Function,
    },
    commentQuantity: {
      type: Number,
    },
  },
  data() {
    return {
      blog: null,
      relatedBlogs: null,
      social: [
        "facebook",
        "twitter",
        "whatsapp",
        "pinterest",
        "reddit",
        "linkedin",
        "tumblr",
      ],
      preValue: 0,
      scrollUp: false,
    };
  },
  created() {
    this.getBlogFromStore();
    window.addEventListener("scroll", this.stickySocialBar);
  },
  mounted() {},
  computed: {
    ...mapState(["blogList"]),
    ...mapGetters(["getBlog"]),
    category() {
      return this.blog.category.replace(
        this.blog.category[0],
        this.blog.category[0].toUpperCase()
      );
    },
    capitalLetter() {
      return this.blog?.userName[0].toUpperCase();
    },
    dateCreated() {
      //toLocaleTimeString('en-US')
      return this.blog?.created.toDate().toDateString();
    },
  },
  methods: {
    async getBlogFromStore() {
      this.blog = null; //set loading
      if (this.blogList) {
        let { blogId } = this.$route.params;
        this.getBlog(blogId)
          .then((res) => {
            this.blog = res;
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    },
    categoriesColor(categories) {
      let colorObject = {
        fashion: "#ff0000",
        travel: "#9848f6",
        food: "#0000ff",
        technology: "#ffa500",
      };
      return colorObject[categories];
    },
    socialImg(iconname) {
      return require(`../../../assets/social-icon/${iconname}.png`);
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
    stickySocialBar() {
      //  let pageHeight = document.body.scrollHeight;
      let currentValue = window.pageYOffset;

      let blogContent = this.$refs.blogContent;
      let topBlogContent = blogContent?.offsetTop;
      let heightBlogContent = blogContent?.clientHeight;
      let bottomBlogContent = topBlogContent + heightBlogContent;
      // console.log(topBlogContent, heightBlogContent, bottomBlogContent);
      let socialBar = this.$refs.socialBar;
      let socialBarHeight = socialBar?.clientHeight;
      let socialBarTop = socialBar?.offsetTop;
      //if scroll down
      if (this.scrollDirection() && blogContent) {
        if (currentValue > topBlogContent) {
          let styles = `position:fixed; top:0;`;
          socialBar.style = styles;
        }
        if (currentValue + socialBarHeight > bottomBlogContent - 15) {
          let styles = `position:absolute; top:${
            bottomBlogContent - socialBarHeight - 15
          }px`;
          socialBar.style = styles;
        }
      } else if (blogContent) {
        if (currentValue < socialBarTop) {
          let styles = `position:fixed; top:0;`;
          socialBar.style = styles;
        }
        if (currentValue < topBlogContent + 20) {
          let styles = `position:initial; top:initial;`;
          socialBar.style = styles;
        }
      }
    },
  },
  watch: {
    $route: "getBlogFromStore",
    blogList() {
      this.getBlogFromStore();
    },
    blog() {
      this.sentBlogToParentEle(this.blog);
    },
  },
};
</script>
<style lang="scss" scoped>
.blogwrapper {
  &__loading {
    height: calc(100vh - 70px);
    position: relative;
    background: $bgsection-cl;
    margin-bottom: $mgbottom-section;
    .loadingicon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .blogpage {
    background: $bgsection-cl;
    border-radius: $border-radius;
    margin-bottom: $mgbottom-section;
    word-break: break-word;
    &__header {
      padding: 15px;
      border-bottom: 1px solid $borderbt-cl;
      .title {
        font-size: 2.2rem;
        color: $text-cl;
        font-weight: 600;
        margin: 18px 0;
      }
      .bloginfo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          .category {
            padding: 3px;
            border-radius: 3px;
            background: $food-cl;
            margin-right: 15px;
            span {
              font-size: 11px;
              font-weight: 600;
              color: #ffffff;
              height: 100%;
              display: flex;
              align-items: center;
            }
          }
          .author {
            display: flex;
            align-items: center;
            margin-right: 10px;
            &__avatar {
              width: 20px;
              height: 20px;
              background: coral;
              border-radius: 50%;
              margin-right: 5px;
              overflow: hidden;
              .avatarimg {
                padding-top: 100%;
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
              }
              .avatartext {
                font-size: 1.2rem;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
              }
            }
            &__name {
              font-size: 1.105rem;
              color: $text-cl;
              display: block;
              max-width: 80px;
            }
          }
          .created {
            display: flex;
            align-items: center;
            &__icon {
              width: 15px;
              margin-right: 4px;
              color: $subtext-cl;
            }
            &__date {
              font-size: 1.104rem;
              color: $subtext-cl;
            }
          }
        }
        .right {
          display: flex;
          align-items: center;
          &__commenticon {
            width: 15px;
            color: $subtext-cl;
            margin-right: 4px;
          }
          &__commentquantity {
            font-size: 1.104rem;
            color: $subtext-cl;
          }
        }
      }
    }
    &__content {
      display: flex;
      gap: 20px;
      .socialbarwrapper {
        flex-shrink: 0;
        flex: 0 0 35px;
        @media (max-width: 767px) {
          flex: initial;
          display: none;
        }
        .socialsharebar {
          .socialitem {
            position: relative;
            width: 35px;
            height: 35px;
            border: 1px solid $socialIconBorder-cl;
            border-radius: 4px;
            cursor: pointer;
            &:not(:last-child) {
              margin-bottom: 10px;
            }
            &__img {
              width: 12px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              svg {
                width: 100%;
                height: 100%;
                fill: $text-cl;
                display: flex;
              }
            }
          }
        }
        &.mobile {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          @media (max-width: 767px) {
            flex: initial;
            display: flex;
          }
        }
      }
    }
  }
  .socialbarwrapper-mobile {
    padding: 15px;
    @media (min-width: 768px) {
      flex: initial;
      display: none;
    }
    .socialsharebar {
      display: flex;
      flex-wrap: wrap;
      column-gap: 12px;
      row-gap: 12px;
      .socialitem {
        position: relative;
        width: 35px;
        height: 35px;
        border: 1px solid $socialIconBorder-cl;
        border-radius: 4px;
        cursor: pointer;
        &__img {
          width: 12px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          svg {
            width: 100%;
            height: 100%;
            fill: $text-cl;
            display: flex;
          }
        }
      }
    }
  }
}
</style>