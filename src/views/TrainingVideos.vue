<template>
  <v-card v-if="!loadView" style="background-color: #ffffff;width: 100vw;height: 100vh;">
    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
  </v-card>
  <v-card
      color="grey-lighten-4"
      flat
      style="min-height: 100vh; text-align: -moz-center"
      rounded="0"
      v-if="loadView"
  >
    <img  alt="Vue logo" class="logo bgImage" src="../assets/dlivrdlogo.png"  />
    <v-row justify="center">
      <v-dialog
          id="dialogBox"
          v-model="dialog"
          transition="dialog-top-transition"
          max-width="600px"
          persistent
      >
        <v-card>
          <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#0AFD01" class="loading_bar" />
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

    <v-container fluid class="mainContainerView">
      <v-layout id="dashboardView">
        <v-app-bar
            color="#0AFD01"
            class="top_bar_title"
            prominent
        >
          <v-app-bar-nav-icon variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title class="toolbarTitleStyle">Training Videos</v-toolbar-title>
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
        <v-col cols="12" md="10">
          <!-- Training Videos-->
          <v-expansion-panels
              variant="popout"
              v-model="panel"
          >
            <!-- Video 1 -->
            <v-expansion-panel value="video 1" bg-color="#eeeeee95">
              <v-expansion-panel-title>
                <template v-slot:default="{ expanded }">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      General Overview
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <video-player
                    :src= "video_src_1"
                    :poster="imageThumb_1"
                    controls
                    :volume="0.6"
                    v-model:width="width"
                    style="border: 1px solid #0AFD01"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <!-- Video 2 -->
            <v-expansion-panel value="video 2" bg-color="#eeeeee95">
              <v-expansion-panel-title v-slot="{ open }">
                <v-row no-gutters>
                  <v-col cols="4" class="d-flex justify-start">
                    Connecting with Earning Opportunities
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <video-player
                    :src= "video_src_2"
                    :poster="imageThumb_2"
                    controls
                    :volume="0.6"
                    v-model:width="width"
                    style="border: 1px solid #0AFD01"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <!-- Video 3 -->
            <v-expansion-panel value="video 3" bg-color="#eeeeee95">
              <v-expansion-panel-title v-slot="{ open }">
                <v-row no-gutters>
                  <v-col cols="4" class="d-flex justify-start">
                    Communication
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <video-player
                    :src= "video_src_3"
                    :poster="imageThumb_3"
                    controls
                    :volume="0.6"
                    v-model:width="width"
                    style="border: 1px solid #0AFD01"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <!-- Video 4 -->
            <v-expansion-panel value="video 4" bg-color="#eeeeee95">
              <v-expansion-panel-title v-slot="{ open }">
                <v-row no-gutters>
                  <v-col cols="4" class="d-flex justify-start">
                    Payments & Customer Expectations
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <video-player
                    :src= "video_src_4"
                    :poster="imageThumb_4"
                    controls
                    :volume="0.6"
                    v-model:width="width"
                    style="border: 1px solid #0AFD01"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { AtomSpinner } from 'epic-spinners';
import module_1_thumb from "../assets/thumbs/Module_1.png";
import module_2_thumb from "../assets/thumbs/Module_2.png";
import module_3_thumb from "../assets/thumbs/Module_3.png";
import module_4_thumb from "../assets/thumbs/Module_4.png";
import NavigationDrawer from "../components/NavigationDrawer.vue";
import axios from "axios";
import englishImg from "../assets/english.png"
import spanishImg from "../assets/spanish.png"
import loader from "../assets/DlivrdLogo.gif";

export default {
  components: {
    AtomSpinner,
    NavigationDrawer
  },
  name: "TrainingVideos",
  data: () => ({
    loader: loader,
    languages: ['English', 'Spanish'],
    selectedLanguage: englishImg,
    english: englishImg,
    spanish: spanishImg,
    video_src_1:'https://www.dlivrd.io/wp-content/uploads/2023/04/Module_1.mp4',
    video_src_2:'https://www.dlivrd.io/wp-content/uploads/2023/04/Module_2.mp4',
    video_src_3:'https://www.dlivrd.io/wp-content/uploads/2023/04/Module_3.mp4',
    video_src_4:'https://www.dlivrd.io/wp-content/uploads/2023/04/Module_4.mp4',
    imageThumb_1: module_1_thumb,
    imageThumb_2: module_2_thumb,
    imageThumb_3: module_3_thumb,
    imageThumb_4: module_4_thumb,
    width:window.innerWidth * 0.50,
    alert_title: '',
    alert_description: '',
    dialog: false,
    errorMessage: false,
    showError: false,
    agreeButtonText: null,
    cancelButtonText: null,
    drawer: false,
    username: "",
    loading: true,
    loadView: false,
    name: "",
    panel: ['video 1'],
    validationFailed: false,
    fleet_id: null,
  }),
  beforeMount() {
    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
    if(window.innerWidth < 1000){
      this.width = window.innerWidth * 0.80;
    }
  },
  mounted() {
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
    if(localStorage.getItem('is_dlivrd_driver') == 'false'){
      this.$router.push('/checklist')
      return;
    }
    this.userProfileImage = localStorage.getItem('userProfileImage')
    this.sessionValidator();
  },
  methods: {
    language(lang){
      if(lang == "English"){

        this.language_code = '';
        this.selectedLanguage = this.english;
      }else if (lang == "Spanish"){
        this.language_code = '_spain';
        this.selectedLanguage = this.spanish;
      }
    },
    logout() {
      this.alert_title = "Confirmation";
      this.alert_description = "Are you sure you want to logout? ";
      this.dialog = true;
      this.agreeButtonText = "logout";
      this.cancelButtonText = "Cancel"
    },
    logoutOnboarding() {
      var url = this.baseurl + 'onboard_logout'
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          "session": localStorage.getItem('session_id')
        }
      }).then(response => {
        var logoutResponse = response.data;
        if (logoutResponse['Success'] || logoutResponse['Failure']) {
          this.clearFields();
          this.dialog = false;
          this.$router.push('/');
        }
      }).catch(() => {
        this.$router.push('/');
      })
    },
    sessionValidator() {
      var url = this.baseurl + 'onboard_verifySession'
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session": localStorage.getItem('session_id')
        }
      }).then((response) => {
        if (response.status == 200) {
          var verifySession = response.data;
          if (verifySession['Success']) {
            if(verifySession['non_verified_values']){
              this.validationFailed = true;
            }
            this.loadView = true;
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
          }
          else {
            this.clearFields();
            this.$router.push('/');
          }
        }
      }).catch(() => {
        this.clearFields();
        this.$router.push('/');
      })
    },
    closeDrawer(){
      this.drawer = false;
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
#dashboardView{
  justify-content: center;
  padding-top: 100px;
}
.bgImage{
  object-fit: contain;
  width: 80vw;
  position: fixed;
  top:40%;
  left: 7%;
  opacity: 0.1;
}
.mainContainerView{
  text-align:-webkit-center;
}
.accountIcon{
  background-color: white;
  border-radius: 50%;
}
button{
  background-color: transparent;
  color: black;
}
</style>