<template>
  <v-card v-if="!loadView" style="background-color: #ffffff;width: 100vw;height: 100vh;">
    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
  </v-card>
  <v-card
      color="grey-lighten-4"
      flat
      style="min-height: 100vh; text-align: -moz-center;"
      rounded="0"
      v-if="loadView"
  >
    <img alt="Vue logo" class="logo bgImage" src="../assets/dlivrdlogo.png"/>
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
          <v-card-actions class="dialogBoxActionButtons">
            <v-spacer></v-spacer>
            <!-- Cancel Button -->
            <v-btn
                v-if="cancelButtonText == 'Cancel'"
                prepend-icon="mdi-close"
                class="dialogBoxGreenColor"
                variant="text"
                @click="dialog = false"
            >
              {{ cancelButtonText }}
            </v-btn>
            <!-- Logout Button -->
            <v-btn
                v-if="agreeButtonText == 'logout'"
                prepend-icon="mdi-logout"
                class="dialogBoxGreenColor"
                variant="text"
                @click="logoutOnboarding"
            >
              Logout
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
          <v-toolbar-title class="toolbarTitleStyle">LLC</v-toolbar-title>
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
              <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>
        <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>
        <v-main>
          <v-col md="5" sm="12" style="padding: 0">
            <v-card-title
                class="heading"
            >
              Registering An LLC
            </v-card-title>
            <v-card-text
            class="noteStyle"
            >
              Please click on the button below to get the basics.
            </v-card-text>
            <v-btn
                class="LLCBtnStyle"
                prepend-icon="mdi-link"
                @click="openLink"
            >
              Link
            </v-btn>
            <v-card-title
                class="heading"
            >
              Note
            </v-card-title>
            <v-card-text
                class="noteStyle"
            >
              We will repay state filing fees once X total deliveries are successfully completed.
              <br>Send us a snippet to ROSE line for confirmation so we can make a note on your profile.
            </v-card-text>
          </v-col>
        </v-main>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { AtomSpinner } from 'epic-spinners'
import NavigationDrawer from "../components/NavigationDrawer.vue";
import axios from "axios";
import englishImg from '../assets/english.png'
import spanishImg from '../assets/spanish.png'
import loader from "../assets/DlivrdLogo.gif";

export default {
  components: {
    AtomSpinner,
    NavigationDrawer
  },
  data () {
    return {
      loader: loader,
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
      drawer: false,
      agreeButtonText: null,
      cancelButtonText: null,
      alert_title: '',
      alert_description: '',
      dialog: false,
      linkToClick:'https://www.legalzoom.com/business/business-formation/llc-overview.html',
      username: "",
      loading: true,
      showMessage: false,
      loadView: false,
      name: "",
      validationFailed: false,
      fleet_id: null
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
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
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
    logout(){
      this.alert_title = "Confirmation";
      this.alert_description = "Are you sure you want to logout? ";
      this.dialog = true;
      this.agreeButtonText = "logout";
      this.cancelButtonText = "Cancel"
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
    logoutOnboarding(){
      var url =this.baseurl + 'onboard_logout'
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
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
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
          "session":localStorage.getItem('session_id')
        }
      }).then((response) => {
        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            this.loadView = true;
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
            if(verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true){
              this.validationFailed = false;
            }
            else{
              this.validationFailed = true;
            }
          }
          else{
            this.clearFields();
            this.$router.push('/');
          }
        }
      }).catch(() => {
        this.$router.push('/');
      })
    },
    openLink(){
      // window.open('https://www.legalzoom.com/business/business-formation/llc-overview.html')
      window.open('https://www.tailorbrands.com/llc-states-aff?transaction_id=102eef66ac8b1c44aa80f1c244e8b2&state=&utm_source=Tune&utm_medium=Tune&utm_campaign=5841&coupon=&utm_content=')
    },
    closeDrawer(){
      this.drawer = false;
    },
  }
}
</script>
<style>
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
.heading{
  color: #0afd01;
  font-weight: bold !important;
}
.noteStyle{
  padding: 0 20px !important;
  font-size: 16px !important;
  font-weight: lighter !important;
  line-height: 1.7 !important;
}
.LLCBtnStyle{
  margin: 50px 0;
  height: 50px !important;
  padding: 0 30px !important;
  background-color: #0AFD01 !important;
}
</style>

