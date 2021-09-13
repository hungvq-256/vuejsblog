<template>
  <div class="followus">
    <h2 class="followus__title">FOLLOW US</h2>
    <ul class="followus__list">
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
</template>

<script>
export default {
  name: "FollowUs",
};
</script>
<style lang="scss" scoped>
.followus {
  padding: $pd-section;
  background: $bgsection-cl;
  border-radius: $border-radius;
  margin-bottom: $mgbottom-section;
  &__title {
    margin: 15.6px 0;
    font-size: 1.6rem;
    font-weight: 500;
    color: $text-cl;
  }
  &__list {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 10px;
    li {
      display: flex;
      align-items: center;
      background: #00000017;
      border-radius: 4px;
      padding: 8px;
      font-size: 1.04rem;
      .iconwrapper {
        width: 18px;
        height: 18px;
        display: flex;
        margin-right: 10px;
      }
      p {
        color: $subtext-cl;
      }
    }
  }
}
</style>