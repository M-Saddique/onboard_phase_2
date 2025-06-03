<script setup>
import HelloWorld from './HelloWorld.vue'
</script>
<style scoped>

header {
  line-height: 1.5;
  max-height: 100vh;
  text-align: -moz-center;
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
    place-items: center;
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

input#input-0{
  font-size: 20px !important;
}
.generic_tx {
  -webkit-text-fill-color: #4b4b4b;
  font-size: 20px !important;
}
.menu_option{
  color: #ffffff;
}
.menu_option:hover{
  color: #7efb01;
}
.menu_option:active{
  color: #7efb01;
}
#no-background-hover::before {
  background-color: transparent !important;
}
.v-label{
  opacity: 1 !important;
}
</style>
<template>

  <header>
    <div class="wrapper" style="text-align: -webkit-center">
      <img alt="Vue logo" class="logo" style="  object-fit: contain;width: 250px" src="../assets/dlivrdlogo.png" width="125" height="125" />
      <HelloWorld msg="Dlivrd" />
            <nav style="margin-left: 0px; padding-bottom: 20px">
              <v-label class="menu_option" onclick="window.parent.location.href= 'https://driver.dlivrd.io'">Sign In</v-label>
              <v-label class="menu_option" style="margin-left: 20px"  onclick="window.parent.location.href= 'https://www.dlivrd.io/drive'">Sign Up</v-label>
            </nav>
    </div>
  </header>

</template>
<script>

</script>
