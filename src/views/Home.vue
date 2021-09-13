<template>
  <div class="home">
    <video-section />
    <latest-posts />
    <recent-section />
  </div>
</template>

<script>
import RecentSection from "../components/RecentSection.vue";
import LatestPosts from "../components/LatestPosts.vue";
import VideoSection from "../components/VideoSection.vue";

export default {
  name: "Home",
  components: {
    RecentSection,
    LatestPosts,
    VideoSection,
  },
};
</script>
<style lang="scss" scoped>
</style>