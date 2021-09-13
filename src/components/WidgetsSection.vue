<template>
  <div class="widget">
    <div class="widget__pattern --categories">
      <div class="title">CATEGORIES</div>
      <ul class="list">
        <li v-for="(category, index) in categories" :key="index">
          <router-link
            :to="{
              name: 'CategoryPage',
              params: {
                category: category,
              },
            }"
            >{{ category }}</router-link
          >
        </li>
      </ul>
    </div>
    <div class="widget__follow">
      <div class="title">FOLLOW US</div>
      <ul class="list">
        <li>
          <i class="iconwrapper">
            <img src="../assets/subscribe.png" alt="subscriber icon" />
          </i>
          <p>20k Subcribers</p>
        </li>
        <li>
          <i class="iconwrapper">
            <img src="../assets/instagram.png" alt="ins icon" />
          </i>
          <p>500k followers</p>
        </li>
        <li>
          <i class="iconwrapper">
            <img src="../assets/youtube.png" alt="youtube icon" />
          </i>
          <p>500k Subcribers</p>
        </li>
        <li>
          <i class="iconwrapper">
            <img src="../assets/twitter.png" alt="twitter icon" />
          </i>
          <p>128k followers</p>
        </li>
      </ul>
    </div>
    <div class="widget__pattern --pages">
      <div class="title">PAGES</div>
      <ul class="list">
        <li>
          <router-link to="#">Contact us</router-link>
        </li>
        <li>
          <router-link to="#">Short codes</router-link>
        </li>
        <li>
          <router-link to="#">Tipography</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "WidgetsSection",
  data() {
    return {
      categories: ["fashion", "food", "sport", "technology"],
    };
  },
};
</script>
<style lang="scss" scoped>
.widget {
  @media (max-width: 1199px) and (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-column-gap: 20px;
  }
  &__pattern {
    background: $bgsection-cl;
    padding: $pd-section;
    margin-bottom: $mgbottom-section;
    border-radius: $border-radius;
    .title {
      margin: 15.6px 0;
      font-size: 1.6rem;
      font-weight: 500;
      color: $text-cl;
    }
    .list {
      li {
        margin-bottom: 10px;
        a {
          font-size: 1.3rem;
          color: $subtext-cl;
        }
      }
    }
  }
  &__follow {
    background: $bgsection-cl;
    padding: $pd-section;
    margin-bottom: $mgbottom-section;
    border-radius: $border-radius;
    .title {
      margin: 15.6px 0;
      font-size: 1.6rem;
      font-weight: 500;
      color: $text-cl;
    }
    .list {
      li {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        color: $subtext-cl;
        .iconwrapper {
          width: 20px;
          height: 20px;
          display: flex;
          margin-right: 10px;
          padding: 3px;
          background: #00000017;
          border-radius: 4px;
        }
        p {
          font-size: 1.04rem;
        }
      }
    }
  }
}
</style>