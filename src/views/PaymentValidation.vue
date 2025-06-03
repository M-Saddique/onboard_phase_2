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
          <v-toolbar-title class="toolbarTitleStyle">Payments</v-toolbar-title>
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
        <v-main style="height: 97vh; padding-bottom: 10px; overflow-y: scroll">
          <v-row v-if="processingDetails" style="position: fixed;width: 100vw;background-color: transparent; z-index:10;">
            <v-col style="width: 100vw;text-align: center;">
              <atom-spinner :animation-duration="1000" :size="130" style="top: 225px" color="#000000" class="loading_bar" />
            </v-col>
          </v-row>
          <v-col class="centerAlignContent">
            <v-col>
              <v-card-text>
                Please click the icons below to complete an identity validation, along with entering and validating your banking information. You will not be able to receive delivery offers until this information is validated.
              </v-card-text>
              <v-row style="justify-content: center">
                <v-col>
                  <v-icon
                      size="206"
                      class="bankIcon"
                      @click="initPlaidIV('getLinkTokanPlaidIV')"
                      :disabled="buttonAction"
                  >
                    mdi-account-circle
                  </v-icon>
                  <v-card-text>
                    Identity Validation
                  </v-card-text>
                </v-col>
                <v-col>
                  <v-icon
                      size="206"
                      class="bankIcon"
                      @click="initPlaid('getLinkTokanPlaid')"
                      :disabled="buttonAction"
                  >
                    mdi-bank-circle
                  </v-icon>
                  <v-card-text>
                    Account Validation
                  </v-card-text>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
          <v-snackbar
              v-model="snackbar"
              multi-line
              timeout="200000"
              elevation="24"
              color="#0afd01"
              style="color: black !important"
          >
            <template v-slot:actions>
            <v-card-text class="txtSnackBar" v-html="snackBarText"></v-card-text>
              <v-btn
                  class="btnCloseSnackBar"
                  variant="text"
                  @click="snackbar = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
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
      errorMessage: false,
      showError: false,
      username: "",
      loading: true,
      showMessage: false,
      processingDetails: false,
      buttonAction: false,
      loadView: false,
      name: "",
      verifyIdentity: false,
      verifyAccount: false,
      validationFailed: false,
      snackbar: false,
      snackBarText: "",
      bankingInfoStatus: null,
    }
  },
  beforeMount() {
    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
  },
  mounted() {
    this.userProfileImage = localStorage.getItem('userProfileImage')
    this.sessionValidator();
  },
  methods: {
    // plaid integration
    language(lang){
      if(lang == "English"){

        this.language_code = '';
        this.selectedLanguage = this.english;
      }else if (lang == "Spanish"){
        this.language_code = '_spain';
        this.selectedLanguage = this.spanish;
      }
    },
    initPlaid(url_sub){
      this.loading=false;
      this.processingDetails = true;
      this.buttonAction = true;
      if(this.bankingInfoStatus == "pending_automatic_verification"){
        this.alert_title = "Verification Pending"
        this.alert_description = "Your banking information is under review. Please check back in 1-2 business days.";
        this.agreeButtonText = 'Okay';
        this.dialog = true;
        this.loading = true;
        this.processingDetails = false;
        return;
      }
      var url =this.baseurl + url_sub
      const data = {
        identity: localStorage.getItem('username')
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session": localStorage.getItem('session_id'),
        }
      }).then((response) => {
        if(response.data['Failure']){
          this.loading = true;
          this.processingDetails = false;
          this.alert_title = "Alert";
          this.alert_description = response.data['Failure'];
          this.dialog = true;
          this.agreeButtonText = 'Okay';
        }
        else{
          this.loading = true;
          this.loadPlaid(response['data']['link_token'])
        }
      }).catch(() => {
        this.message = "Not liked!";
      })
    },
    initPlaidIV(url_sub){
      if(this.verifyIdentity == true){
        this.alert_title = "Verified"
        this.alert_description = "Your identity verification process is complete."
        this.dialog = true
        this.agreeButtonText = "Okay";
        return;
      }
      this.loading=false;
      this.processingDetails = true;
      this.buttonAction = true;
      var url =this.baseurl + url_sub
      const data = {
        identity: localStorage.getItem('username')
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session": localStorage.getItem('session_id'),
        }
      }).then((response) => {
        this.loading = true;
        this.loadPlaidIV(response['data']['link_token'])
      }).catch(() => {
        this.message = "Not liked!";
      })
    },
    loadPlaid(link_tokan){
      this.loading = true;
      this.processingDetails = false;
      this.buttonAction = false;
      const handler = Plaid.create({
        token: link_tokan,
        onSuccess: (public_token, metadata) => {
          this.updatepublictookn(public_token,'',metadata['institution']['name'],metadata['account_id'],metadata['account']['verification_status'],'plaidpublictookandetails')
        },
        onLoad: () => {},
        onExit: (err, metadata) => {
          console.log(err)
        },
        onEvent: (eventName, metadata) => {
        },
      });
      handler.open();
    },
    loadPlaidIV(link_tokan){
    this.loading = false
    this.processingDetails = false;
    this.buttonAction = false;
    const handler = Plaid.create({
      token: link_tokan,
      onSuccess: (public_token, metadata) => {
        this.updatepublictookn(public_token,metadata['link_session_id'],'','','','plaidpublictookandetailsIV')
      },
      onLoad: () => {},
      onExit: (err, metadata) => {
        console.log(err)
      },
      onEvent: (eventName, metadata) => {
      },
    });
    handler.open();
  },
    updatepublictookn(public_tokan,link_session_id,bank_name,acc_id,status,plaidpublictookandetails){
      var url =this.baseurl + plaidpublictookandetails
      const data = {
        link_session_id:link_session_id,
        public_tokan: public_tokan,
        bank_name:bank_name,
        account_id: acc_id,
        verification_status:status,
        identity: localStorage.getItem('username')
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session": localStorage.getItem('session_id'),
        }
      }).then((response) => {
        if(response.data['Success']){
          this.validationFailed = false;
          this.snackbar = false;
          this.bankingInfoStatus = response.data['banking_info_verified'];
          if(this.bankingInfoStatus == "pending_manual_verification"){
            this.alert_title = "Validation Pending";
          }
          else if(this.bankingInfoStatus == "pending_automatic_verification"){
            this.alert_title = "Validation Pending";
          }
          else{
            this.alert_title = "Validation Successful";
          }
          this.alert_description = response.data['Success']
          this.dialog = true;
          this.agreeButtonText = "Okay"
        }
        else{
          this.alert_title = "Validation Failed";
          this.alert_description = "Unable to validate your account. Please try again."
          this.dialog = true;
          this.agreeButtonText = "Okay"
        }
        this.loading = true;
        this.processingDetails = false;

      }).catch(() => {
        this.message = "Not liked!";
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
      var url =this.baseurl + 'onboard_logout'
      const data = {
        identity: this.username,
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
          localStorage.setItem('email', '');
          localStorage.setItem('password', '');
          localStorage.setItem('username','')
          localStorage.setItem('stage', '')
          localStorage.setItem('country','')
          localStorage.setItem("currentStage",'')
          this.dialog = false;
          this.$router.push('/');
        }
      }).catch( () => {
        this.$router.push('/');
      })
    },
    sessionValidator(){
      var url = this.baseurl + 'onboard_verifySession'
      const data = {
        identity: this.username,
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
            this.bankingInfoStatus = verifySession['banking_info_verified'];
            if(Object.keys(verifySession['non_verified_values']).length == 0)
            {
              this.validationFailed = false;
              this.snackbar = false;
            }
            else{
              this.validationFailed = true;
              this.snackbar = true;
              if(verifySession['non_verified_values']['name_verified'] == false){
                this.snackBarText = "Name not verified.</br>"
                // errorName += "Name not verified"
                // this.$emit('showErrorMessage', errorName);
              }
              if(verifySession['non_verified_values']['mobile_number_verified'] == false){
                this.snackBarText += "Mobile number not verified.</br>"
              }
              if(verifySession['non_verified_values']['ssn_verified'] == false){
                this.snackBarText += "SSN not verified.</br>"
              }
              if(verifySession['non_verified_values']['dob_verified'] == false){
                this.snackBarText += "Date of Birth not verified.</br>"
              }
              if(verifySession['non_verified_values']['address_verified'] == false){
                this.snackBarText += "Address not verified.</br>"
              }
            }
            if(verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true){
              this.validationFailed = false;
            }
            else{
              this.validationFailed = true;
            }
          }
          else{
            localStorage.setItem('email', '');
            localStorage.setItem('password', '');
            localStorage.setItem('username','')
            localStorage.setItem('stage', '')
            localStorage.setItem('country','')
            localStorage.setItem("currentStage",'')
            this.$router.push('/');
          }
        }
      }).catch(() => {
        this.$router.push('/');
      })
    },
    closeDrawer(){
      this.drawer = false;
    },
  }
}
</script>
<style>
.bankIcon{
  color: #0ADF01;
}
.bankIcon:hover{
  color: #7efb01;
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
.dialogBoxDescription{
  overflow-y: scroll;
  text-align: justify;
}
.dialogBoxActionButtons{
  align-self: end;
  margin-top: 30px;
}
.accountIcon{
  background-color: white;
  border-radius: 50%;
}
.centerAlignContent{
  justify-content: center;
  padding-bottom: 50px !important;
}
.btnCloseSnackBar{
  margin-left: 30px;
  background-color: red !important;
  color: white !important;
  align-self: flex-start !important;
  position: fixed !important;
  right: 0 !important;
}
.txtSnackBar{
  color: black !important;
}
</style>

