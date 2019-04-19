<template>
<transition v-if="show" name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h1 class="modal-title">Upload</h1>
        </div>
        <div class="modal-body">
          <p v-if="error" class="error">{{error}}</p>
          <form @submit.prevent="upload">
            <input v-model="title" placeholder="Title">
            <p></p>
            <editor v-model="description"></editor>
            
<p></p>
            <button type="button" @click="generateWordCloud" class="pure-button">Generate word cloud</button>
            <button type="button" @click="close" class="pure-button">Close</button>
            <button type="submit" class="pure-button pure-button-secondary">Upload</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
var unirest = require('unirest');
var sw = require('stopword');
import axios from 'axios';

var hoojoo = "";

import Editor from '@/components/Editor.vue'


export default {
  name: 'Uploader',
  props: {
    show: Boolean,
  },
components: {

    // eslint-disable-next-line
    Editor
  },
  data() {
    return {
      title: '',
      description: '',
      file: null,
      error: '',
      wordCloudURL: "",
    }
  },
  methods: {
    //fileChanged(event) {
    //  this.file = event.target.files[0]
    //},

    setWordCloudURL(input) {
      this.wordCloudURL = input;
    },

    async generateWordCloud() {
      //removes stop words (and, the, etc.)
      //this.wordCloudURL['url'] = "";
      var tempURL = "";
      var stoppedArray = this.description.split(' ');
      var unstoppedArray = sw.removeStopwords(stoppedArray);
      var unstoppedString = unstoppedArray.toString().replace(u|\/u|h1|h2|h3|h4|\/h1|\/h2|\/h3|\/h4|em|\/em|\/p|p|br|\/br|,|b|\/b|\.|-|;|:|\?|\(|\)|—|"|<|>|“|”|,/g, " ");
      console.log(unstoppedString);
      unirest.post("https://wordcloudservice.p.rapidapi.com/generate_wc")
        .header("X-RapidAPI-Host", "wordcloudservice.p.rapidapi.com")
        .header("X-RapidAPI-Key", "a7c382b0d7msh631b3d424be6a2bp1e2a22jsncfe9ea06463f")
        .header("Content-Type", "application/json")
        .send({
          "f_type": "png",
          "width": 800,
          "height": 500,
          "s_max": "7",
          "s_min": "1",
          "f_min": 4,
          "r_color": "TRUE",
          "r_order": "TRUE",
          "s_fit": "FALSE",
          "fixed_asp": "TRUE",
          "rotate": "TRUE",
          "textblock": unstoppedString
        })
        .end(function(result) {
          //this.wordCloudURL['url'] = "";
          console.log(result.status, result.headers, result.body, result.body.url);
          //this.$data.wordCloudURL.url = result.body.url;
          //setWordCloudURL(result.body.url);
          hoojoo = result.body.url;
          console.log("IN FUNC" + tempURL);
          return tempURL;
        });
      console.log("HEHEHEHE" + this.wordCloudURL);

      this.wordCloudURL = tempURL

    },
    close() {
      console.log("HAHSDAJSDHJASDH");
      this.$emit('escape');
    },
    async upload() {
      try {
        console.log("HOOJOO is " + hoojoo);
        const fDat = new FormData();
        await fDat.append('url', hoojoo);
        await fDat.append('title', this.title);
        await axios.post('/api/photos/hmm', fDat);
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('description', this.description);
        formData.append('url', hoojoo);
        //console.log("hooobly???? " + formData.title);
        this.error = await this.$store.dispatch("upload", formData);
        if (!this.error) {
          this.title = '';
          this.description = '';
          this.file = null;
          this.$emit('uploadFinished');
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>

<style scoped>
input {
  width: 100%;
}

textarea {
  width: 100%;
  height: 100px
}

.pure-button-secondary {
  float: right;
}
</style>
