<template>
  <div id="app">
    <div
        id="iframe-wrapper"
        :style="iframe.wrapperStyle"
    >
      <iframe
          v-if="loaded"
          :src="iframe.src"
          :style="iframe.style"
          height="1080"
          width="1080"
          type="application/pdf"
          frameborder="0"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loaded: false,
      iframe: {
        src: 'https://www.dlivrd.io/educate',
        style: null,
        wrapperStyle: null,
      }
    }
  },
  mounted() {
    this.iframe.style = {
      position: 'absolute',
      width: "100%",
      height: "100vh",
    }
    this.iframe.wrapperStyle = {
      overflow: 'scroll',
      width: "100%",
      height: "95vh",
    }
    this.loaded = true;
    console.log(this.iframe)
  }
}
</script>