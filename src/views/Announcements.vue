<template>
<!--  <v-card v-if="!loadView" style="background-color: #ffffff;width: 100vw;height: 100vh;">-->
<!--    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>-->
<!--  </v-card>-->

  <v-card
      color="grey-lighten-4"
      flat
      style="min-height: 100vh"
      rounded="0"
      v-if="loadView"
  >
    <img  alt="Vue logo" class="logo bgImage" src="../assets/dlivrdlogo.png"  />
    <!--dialog box-->
    <v-row justify="center">
      <v-dialog
          id="dialogBox"
          v-model="dialog"
          transition="dialog-top-transition"
          max-width="600px"
          persistent
      >
        <v-card>
          <v-overlay :model-value="!loading">
            <v-card style="background-color: transparent;width: 100vw;height: 100vh;">
              <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
            </v-card>
          </v-overlay>
<!--          <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#0AFD01" class="loading_bar" />-->
          <v-card-title class="text-h5 dialogBoxGreenColor">
            {{alert_title}}
          </v-card-title>
          <v-card-text id="dialogDescription" class="dialogBoxDescription" v-html="alert_description"></v-card-text>
          <v-card-text v-if="showError" class="dialogBoxError" v-html="errorMessage"></v-card-text>
          <v-card-actions class="dialogBoxActionButtons">
            <v-spacer></v-spacer>
            <v-btn
                v-if="cancelButtonText == 'Cancel'"
                prepend-icon="mdi-close"
                class="dialogBoxGreenColor"
                variant="text"
                @click="dialog = false"
            >
              {{ cancelButtonText }}
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'logout'"
                prepend-icon="mdi-logout"
                class="dialogBoxGreenColor"
                variant="text"
                @click="logoutOnboarding"
            >
              Logout
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Okay'"
                prepend-icon="mdi-check"
                class="dialogBoxGreenColor"
                variant="text"
                @click="dialog = false"
            >
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-container style="padding: 0" fluid class="mainContainerView">
      <v-layout id="dashboardView">
        <v-app-bar
            color="#0AFD01"
            class="top_bar_title"
            prominent
        >
          <v-app-bar-nav-icon variant="text" @click="drawer=!drawer"></v-app-bar-nav-icon>
          <v-toolbar-title class="toolbarTitleStyle">Announcements</v-toolbar-title>
          <v-menu width="180px">
            <template v-slot:activator="{ props }">
              <v-btn
                  icon
                  :ripple="false"
                  v-bind="props">
                <!--            <v-icon style="background-color: white; border-radius: 50%" size="32">mdi-flag</v-icon>-->
                <v-img :src=selectedLanguage width="38" height="38"></v-img>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :prepend-avatar="english" title="English" value="English" @click="language('English')"></v-list-item>
              <v-list-item :prepend-avatar="spanish" title="Español" value="Spanish" @click="language('Spanish')"></v-list-item>
            </v-list>
          </v-menu>
          <v-menu width="220px">
            <template v-slot:activator="{ props }">
              <v-btn
                  icon
                  v-bind="props">
                <v-avatar class="accountIcon" size="38"><v-img :src=userProfileImage cover></v-img></v-avatar>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-layout style="justify-content: center">
                  <v-avatar
                      size="100px"
                      style="background-color: #0AFD01"
                  >
                    <v-img :src=userProfileImage cover></v-img>
                  </v-avatar>
                </v-layout>
                <v-card-title style="text-align: center">{{name}}</v-card-title>
              </v-list-item>
<!--              <v-list-item prepend-icon="mdi-account-cog-outline" title="Settings" value="settings" @click="openSettings"></v-list-item>-->
              <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>

        <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>
<!--        <v-navigation-drawer>-->
<!--        </v-navigation-drawer>-->
          <v-row style="margin: 0" class="mainBlockAnnouncements alignRowContent">
            <v-col md="4" v-for="item in announcement" style="padding:0; min-height: 81vh;">
              <NotificationCard :key="item" :announcementTitle="item['title']" :announcementdescription = "item['body']" ></NotificationCard>
            </v-col>
          </v-row>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import NavigationDrawer from "../components/NavigationDrawer.vue";
import { AtomSpinner } from 'epic-spinners'
import axios from "axios";
import NotificationCard from "../components/NotificationCard.vue";
import englishImg from '../assets/english.png'
import spanishImg from '../assets/spanish.png'
import loader from "../assets/DlivrdLogo.gif";
import Api from '../config/index'


export default {
  name: "Announcements",
  components:{
    NavigationDrawer,
    AtomSpinner,
    NotificationCard
  },
  data () {
    return {
      fleet_id: null,
      loader: loader,
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
      announcement:[],
      drawer: false,
      agreeButtonText: null,
      cancelButtonText: null,
      alert_title: '',
      alert_description: '',
      dialog: false,
      loading: true,
      errorMessage: false,
      showError: false,
      username: "",
      loadView: false,
      validationFailed: false,
    }
  },
  beforeMount() {
    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
  },
  mounted() {
    if(localStorage.getItem('is_dlivrd_driver') == 'false'){
      this.$router.push('/checklist')
      return;
    }
    this.userProfileImage = localStorage.getItem('userProfileImage')
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
    this.sessionValidator()
  },
  methods: {
    pullAnnouncements(){
      var data = {
        identity: this.username,
        timezone_: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('get_announcements', data).then((response) => {
        var announcements_data = response.data;
        if(announcements_data['Success']|| announcements_data['Failure']){
          this.announcement = announcements_data['announcements']
        }
      }).catch( () => {
        this.$router.push('/');
        this.clearFields();
      })
    },
    logout(){
      this.alert_title = "Confirmation";
      this.alert_description = "Are you sure you want to logout? ";
      this.dialog = true;
      this.agreeButtonText = "logout";
      this.cancelButtonText = "Cancel"
    },
    logoutOnboarding(){
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('onboard_logout', data).then((response) => {
        var logoutResponse = response.data;
        if(logoutResponse['Success'] || logoutResponse['Failure']){
          this.clearFields();
          this.dialog = false;
          this.$router.push('/');
        }
      }).catch( () => {
        this.$router.push('/');
      })
    },
    sessionValidator(){
      console.log("Announcments Session")
      this.uploadingData = true
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('onboard_verifySession', data).then((response) => {
        this.uploadingData = false
        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            if(verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true){
              this.validationFailed = false;
            }
            else{
              this.validationFailed = true;
            }
            this.loadView = true;
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
            this.pullAnnouncements()
          }
          else{
            console.log("Session not validated")
            this.clearFields();
            this.$router.push('/');
          }
        }
      }).catch(() => {
        console.log("Session not validated")
        this.$router.push('/');
      })
    },
    closeDrawer(){
      this.drawer = false;
    },
    language(lang){
      if(lang == "English"){

        this.language_code = '';
        this.selectedLanguage = this.english;
      }else if (lang == "Spanish"){
        this.language_code = '_spain';
        this.selectedLanguage = this.spanish;
      }
    },
    clearFields(){
      localStorage.setItem('email', '');
      localStorage.setItem('password', '');
      localStorage.setItem('username','')
      localStorage.setItem('stage', '')
      localStorage.setItem('country','')
      localStorage.setItem('currentStage','')
      localStorage.setItem('name','')
      localStorage.setItem('mobile','')
      localStorage.setItem('phoneverified','')
      localStorage.setItem('session_id','')
    },
  }
}
</script>

<style scoped>
.alignRowContent{
  justify-content: center;
}
.mainBlockAnnouncements{
  width: 100%;
  height: 100%;
  margin-top: 100px !important;
  margin-bottom: 40px !important;
}
</style>
