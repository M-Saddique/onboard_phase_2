<template>
  <v-card
      color="#f7f7f7"
      rounded="5"
      min-height="100"
      style="padding:20px; margin:20px"
  >
    <v-row class="notificationPanelRow">
      <v-col md="2" sm="2" xs="1" class="notificationCardHeader">
        <v-avatar color="grey darken-1" size="50">
          <img src='../assets/dlivrdicon.png' width="45" height="55"/>
        </v-avatar>
      </v-col>
      <v-col md="10" sm="10" xs="11">
        <v-card-text class="cardTitleStyle">{{ announcementTitle }}</v-card-text>
      </v-col>
    </v-row>

    <v-row class="imageAndContentBlock">
      <!--      <img src='../assets/announcements.jpg' width="400" height="300" class="imageStyle"/>-->
      <v-card-text class="cardTextStyle">{{
          announcementdescription
        }}</v-card-text>
    </v-row>
    <!--    <v-btn-->
    <!--        @click="readMore"-->
    <!--        append-icon="mdi-arrow-right-thin"-->
    <!--        variant="text"-->
    <!--        style="margin-top:15px; background-color: #0AFD01;"-->
    <!--    >-->
    <!--      Read More-->
    <!--    </v-btn>-->
  </v-card>
</template>

<script>
export default {
  name: "NotificationCard",
  props: {
    announcementTitle: String,
    announcementdescription: String,
  },
  data () {
    return {

    }
  },
  methods: {
    readMore(){
      this.$router.push('/blog')
    }
  },
}
</script>

<style scoped>
.cardTitleStyle{
  padding-top: 5px;
  padding-left: 0;
  font-weight: bold;
  text-align:start;
}
.cardTextStyle{
  text-align:start;
}
.imageStyle{
  margin-top: 20px;
  margin-bottom: 15px;
}
.notificationPanelRow{
  padding-top: 15px;
  padding-left: 15px;
  align-items: center !important;
}
.imageAndContentBlock{
  justify-content: center !important;
}
@media (max-width:700px){
  .notificationCardHeader{
    max-width: min-content !important;
  }
}
</style>
