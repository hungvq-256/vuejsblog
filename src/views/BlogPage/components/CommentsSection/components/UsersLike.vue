<template>
  <div class="usersLikeModal" v-if="usersLike">
    <p class="close" @click="handleCloseModal">&#10006;</p>
    <ul class="usersLikeModal__list">
      <li v-for="user in usersLike" :key="user.userId">
        <div class="avatar">
          <div
            class="avatar__img"
            :style="{ backgroundImage: `url(${user.imgUrl})` }"
            v-if="user.imgUrl"
          ></div>
          <p class="avatar__text" v-else>
            {{ user.userName[0].toUpperCase() }}
          </p>
          <i><img src="../../../../../assets/Icons/like.png" alt="" /></i>
        </div>
        <p class="name">{{ user.userName }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // name: "UsersLikeModal",
  props: ["usersLike", "handleHideUsersLike"],
  methods: {
    handleCloseModal() {
      this.handleHideUsersLike();
    },
  },
};
</script>
<style lang="scss" scoped>
.usersLikeModal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 240px;
  background: #e7e7ec;
  border-radius: 5px;
  padding: 6px;
  z-index: 10;
  .close {
    position: absolute;
    right: 6px;
    top: 6px;
    font-size: 17px;
    cursor: pointer;
  }
  &__list {
    margin-top: 20px;
    height: 200px;
    overflow: auto;
    li {
      display: flex;
      align-items: center;
      &:not(:first-child) {
        & > .name {
          border-top: 0.6px solid #ccc;
        }
      }
      .avatar {
        position: relative;
        width: 25px;
        height: 25px;
        background: cornflowerblue;
        border-radius: 50%;
        flex-shrink: 0;
        &__img {
          padding-top: 100%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: 50%;
        }
        &__text {
          font-size: 1.2rem;
          color: #ffffff;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        i {
          width: 13px;
          position: absolute;
          bottom: -4px;
          right: -3px;
          img {
            display: flex;
          }
        }
      }
      .name {
        font-size: 1.4rem;
        margin-left: 10px;
        width: 100%;
        padding: 10px 0;
      }
    }
  }
}
</style>