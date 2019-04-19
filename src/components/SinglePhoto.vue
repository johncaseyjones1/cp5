<template>
<div>
  <div class="image" v-for="phot in photo" v-bind:key="phot._id">
    <img :src="phot.path" />
    <p class="photoTitle">{{phot.title}}</p>
    <p class="photoDate">
      <span v-if="phot.user.name">{{phot.user.name}}, </span>
      {{formatDate(phot.created)}}
    </p>
	<div v-html="phot.description"> </div>
  </div>
  <div class="commentForm">
    <form>
      <input type="text" name="Comment" value="Put your comment here">
    </form>

  </div>

</div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'SinglePhoto',
  data() {
    return {
      id: this.$route.params.id,
      tempComment: ""
    }
  },
  props: {
    photo: Array,
    comments: Array
  },
  methods: {
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    }
  },
  async created() {
    console.log(this.id);
    await this.$store.dispatch("getOnePhoto", {
      hehe: this.id,
    });
    console.log(this.id);
  }
}
</script>

<style scoped>
.photoTitle {
  margin: 0px;
  font-size: 1.2em;
}

.photoDate {
  margin: 0px;
  font-size: 0.9em;
  font-weight: normal;
}

p {
  margin: 0px;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  max-width: 600px;
  max-height: 600px;
  image-orientation: from-image;
}
</style>
