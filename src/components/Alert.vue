<template>
  <v-row v-if="showError" style="margin-bottom: 8px;background-color: red; width: 100vw; overflow-x: hidden; z-index: 10; align-items: center">
    <v-card-text class="alertText" v-html="item"></v-card-text>
    <v-icon size="18" class="alertIcon" color="#ffffff" @click="closeWarning">mdi-close</v-icon>
  </v-row>
</template>

<script>
export default {
  name: "Alert",
  data () {
    return {
      showError: true,
    }
  },
  props: {
    item: {
      type: String
    },
    index:{
      type: Number
    }
  },
  mounted() {

  },
  methods: {
    closeWarning(){
      this.showError = false
    }
  }
}
</script>

<style scoped>
.alertText{
  width: 90%;
  color:white;
  padding-top: 10px;
  padding-left: 30px;
  padding-bottom: 8px;
}
.alertIcon{
  width: 10%;
  padding-top: 0;
  cursor: pointer;
  padding-right: 30px;
  justify-content: right;
}
</style>