<template>
<div class="home">
  <SinglePhoto :photo="photo" />
</div>
</template>

<script>
// @ is an alias to /src
import SinglePhoto from '@/components/SinglePhoto.vue'

export default {
  name: 'home',
  components: {
    SinglePhoto
  },
  computed: {
    photo() {
      return this.$store.state.photo;
    }
  },
  async created() {
    console.log("HOASIHDOAISHDOIASHD");
  },
}
</script>
