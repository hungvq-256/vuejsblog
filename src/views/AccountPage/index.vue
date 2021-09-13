<template>
  <div class="accountpage">
    <div class="container">
      <div class="category">
        <ul class="category__list" ref="categoryList">
          <li>
            <router-link to="/account">My Account</router-link>
          </li>
          <li>
            <router-link to="/account/blogs">My Blogs</router-link>
          </li>
          <li>
            <router-link to="/account/comments">My Comment</router-link>
          </li>
        </ul>
      </div>
      <div class="mainsection">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountPage",
};
</script>
<style lang="scss" scoped>
.accountpage {
  margin: 20px 0;
  height: calc(100vh - 162px);
  @media (max-width: 767px) {
    height: initial;
  }
  .container {
    max-width: 1100px;
    display: grid;
    grid-template-columns: 1fr 3fr;
    column-gap: 20px;
    height: 100%;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
    }
    .category {
      height: 100%;
      background: $bgsection-cl;
      padding: 15px;
      border-radius: 6px;
      &__list {
        li {
          border-bottom: 0.5px solid $subtext-cl;
          a {
            display: block;
            padding: 12px 0;
            font-size: 1.5rem;
            color: $text-cl;
            &.router-link-exact-active {
              color: $travel-cl;
            }
          }
        }
      }
    }
    .mainsection {
      height: 100%;
      background: $bgsection-cl;
      border-radius: 6px;
      position: relative;
      padding: 15px;
      overflow: auto;
      @media (max-width: 767px) {
        margin-top: 20px;
        height: 62vh;
      }
    }
  }
}
.active {
  color: $travel-cl;
}
</style>