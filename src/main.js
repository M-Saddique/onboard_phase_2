import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import VueCountdown from '@chenfengyuan/vue-countdown';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import {VDataTableServer} from "vuetify/lib/labs/VDataTable/VDataTableServer.mjs";
// import Notifications from 'vue-notification'

import Mapbox from "mapbox-gl";
import VueGallery from 'vue-gallery'

// global register
import App from './App.vue'
import router from './router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import './assets/main.css'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const app = createApp(App)
const vuetify = createVuetify({
    components: { ...components, VDataTableServer },
    directives,
})
// app.use(Notifications)
app.config.globalProperties.baseurl = 'https://appcore.dlivrd.io/';
// app.config.globalProperties.baseurl = 'http://11.11.12.131:8000/';
// app.config.globalProperties.baseurl = 'http://127.0.0.251:8000/';
app.config.globalProperties.baseImageurl = 'https://dlivrdbucketdriver.s3.us-east-2.amazonaws.com/';
app.config.globalProperties.basesecurityAccess = {withCredentials: false};
app.config.globalProperties.userProfileImage = "../src/assets/user.jpg";

app.use(vuetify)
app.use(VueVideoPlayer)
app.use(createPinia())
app.use(router)
app.component('VGallery', VueGallery)
app.component('vue-phone-number-input', VuePhoneNumberInput);
app.component(VueCountdown.name, VueCountdown);
app.use(VueMapbox, { mapboxgl: Mapbox });
app.mount('#app')