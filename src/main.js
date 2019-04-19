import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import App from './App.vue'
import router from './router'
import store from './store'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.use(VueQuillEditor, '#editor', {
  modules: {
    toolbar: '#toolbar'
  },
  theme: 'snow'
})
