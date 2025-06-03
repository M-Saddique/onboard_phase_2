<script>
export default {
  components: {

  },
  data () {
    return {
      checkMessage:false,
      warningString: "",
      errorMessages: [],
      distanceCovered: 0,
    }
  },
  beforeMount() {

  },
  mounted() {

  },
  methods:{
    message(warn){
      if(warn != ""){
        this.checkMessage = true
        this.warningString = warn
        this.errorMessages.push(this.warningString)
      }
    }
  }
}
</script>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Alert from './components/Alert.vue'

const appConfig = {
  accountSid:"AC4ccca83cec05e9642dffab547274c9ec",
  flexFlowSid:"FO1301cf4cafc4dbde58289b1ff4fa52d9",
  showTrayOnInactive: true,
  colorTheme: {
    overrides: {
      EntryPoint:{
        Container: {
          background: "#0AFD01",
          color:'#000000'
        }
      }}
  },
  componentProps:{
    MainHeader:{
      titleText: 'Welcome To dlivrd Help',
      showTitle:true,
      imageUrl: 'https://dlivrd-auto-driver-onboard.herokuapp.com/fav_logo_dlivrd.png'
    },
    EntryPoint:{
      tagline:'Chat With Dlivrd'
    },
    MessagingCanvas: {
      showTypingIndicator:true,
      showReadStatus:true,
      showWelcomeMessage:false,
    },
  },
  startEngagementOnInit: false,
};
Twilio.FlexWebChat.MessagingCanvas.defaultProps.predefinedMessage = { body:'Welcome to Expedite, How can I help you ?', authorName :'Agent'}
Twilio.FlexWebChat.renderWebChat(appConfig);
</script>

<template>
  <RouterView style="width: 100vw"/>
</template>
<style>
.jss24 {
  border: 1px solid grey !important;
  border-radius: 2px !important;
}
.v-col::-webkit-scrollbar {
  width: 0px !important;
  display: none !important;
  background: transparent; /* make scrollbar transparent */
}
</style>
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.logo {
  display: block;
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}
nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
nav a:first-of-type {
  border: 0;
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
  .logo {
    display: block;
  }
  header .wrapper {
    flex-wrap: wrap;
    text-align-last: center;
    text-align: -webkit-center;
  }
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
