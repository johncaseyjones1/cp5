<template>
<div class="home">
  <image-gallery :photos="photos" />
  <div class="footer">
    <a href="https://github.com/johncaseyjones1/cp5">My github</a>
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import ImageGallery from '@/components/ImageGallery.vue'

export default {
  name: 'home',
  components: {
    ImageGallery
  },
  computed: {
    photos() {
      return this.$store.state.photos;
    }
  },
  async created() {
    await this.$store.dispatch("getAllPhotos");
  },
}
</script>

<style>
.footer {
  text-align: center;
  text-decoration: none;
  width: 100%;
  height: 100%;
}
</style>
