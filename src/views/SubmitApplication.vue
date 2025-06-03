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


          <!-- Password -->
          <v-text-field
              v-if="newLogin"
              style="margin-left: 20px; margin-right: 20px"
              v-model="password"
              label="Enter New Password"
              hide-details
              :valuePassword="password"
              :append-icon="valuePassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="() => (valuePassword = !valuePassword)"
              :type="valuePassword ? 'password' : 'text'"
              @keyup.enter="updatePassword"
          ></v-text-field>
          <!-- Confirm Password -->
          <v-text-field
              v-if="newLogin"
              style="margin-left: 20px; margin-right: 20px"
              v-model="confirmPassword"
              label="Confirm Password"
              hide-details
              :value="confirmPassword"
              :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              @keyup.enter="updatePassword"
          ></v-text-field>
          <!-- Reffered by -->
          <v-text-field
              v-if="count == 3"
              style="margin-left: 20px; margin-right: 20px"
              v-model="referral"
              label="Reffered by:">
          </v-text-field>

          <!-- Username -->
          <v-text-field
              v-if="username_tf"
              style="margin-left: 20px; margin-right: 20px"
              v-model="desiredUsername"
              label="Enter Username"
              hide-details
          >
          </v-text-field>
          <v-card-text v-if="showError" class="dialogBoxError" v-html="errorMessage"></v-card-text>
          <v-card-actions class="dialogBoxActionButtons" v-if="!askCriminalBackgroundCheck">
            <v-spacer></v-spacer>
            <v-btn
                v-if="cancelButtonText == 'Previous' && agreeButtonText != 'logout' "
                prepend-icon="mdi-arrow-left"
                style="background-color: #7efb01"
                variant="text"
                @click="previousDialog"
            >
              {{ cancelButtonText }}
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Next'"
                prepend-icon="mdi-arrow-right"
                style="background-color: #7efb01"
                variant="text"
                @click="nextDialog"
            >
              {{ agreeButtonText }}
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Get Started'"
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="gettingStarted"
            >
              {{agreeButtonText}}
            </v-btn>
            <!-- Update Password-->
            <v-btn
                v-if="agreeButtonText == 'Save'"
                prepend-icon="mdi-upload"
                style="background-color: #7efb01"
                variant="text"
                @click="updatePassword"
            >
              {{ agreeButtonText }}
            </v-btn>
            <!-- Cancel Button -->
            <v-btn
                v-if="cancelButtonText == 'Cancel'"
                prepend-icon="mdi-close"
                class="dialogBoxGreenColor"
                variant="text"
                @click="closeDialog"
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
            <!-- Submit on checklist Button -->
            <v-btn
                v-if="agreeButtonText == 'Submit'"
                prepend-icon="mdi-check"
                class="dialogBoxGreenColor"
                variant="text"
                @click="submitFormConfirmation"
            >
              Submit
            </v-btn>
            <!-- Submit checklist popup -->
            <v-btn
                v-if="agreeButtonText == 'Process'"
                prepend-icon="mdi-check"
                class="dialogBoxGreenColor"
                variant="text"
                @click="enterUsername"
            >
              Submit
            </v-btn>
            <!-- Save username -->
            <v-btn
                v-if="agreeButtonText == 'SaveUsername'"
                prepend-icon="mdi-check"
                class="dialogBoxGreenColor"
                variant="text"
                @click="checkUsernameAvailability"
            >
              Save
            </v-btn>
            <!-- Process Complete -->
            <v-btn
                v-if="agreeButtonText == 'Ok'"
                prepend-icon="mdi-check"
                class="dialogBoxGreenColor"
                variant="text"
                @click="updateStatus"
            >
              OK
            </v-btn>
          </v-card-actions>
          <!-- Criminal Check -->
          <v-card-actions v-if="askCriminalBackgroundCheck" style="align-self: end; margin-top: 30px">
            <v-btn
                v-if="cancelButtonText == 'Criminal' "
                :class="{ 'selected_criminal_selection' : criminal_selection === 'n' }"
                style="background-color: #7efb0166"
                variant="text"
                :disabled="btnDisable"
                @click="criminalCheck('n')"
            >
              No
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Criminal' "
                :class="{ 'selected_criminal_selection' : criminal_selection === 'y' }"
                style="background-color: #7efb0166"
                variant="text"
                :disabled="btnDisable"
                @click="criminalCheck('y')"
            >
              Yes
            </v-btn>
          </v-card-actions>
          <v-textarea
              v-if="criminal_description"
              style="margin-left: 20px; margin-right: 20px;margin-bottom: 30px"
              variant="outlined"
              v-model="criminal_description_detail"
              :label=criminal_description_detail_help
              hide-details
          >
          </v-textarea>
          <v-btn
              v-if="((criminal_description == true && criminal_description_detail_char_count >= 50) || this.criminal_selection == 'n') && agreeButtonText == 'Criminal' && cancelButtonText == 'Criminal'"
              prepend-icon="mdi-check-underline"
              style="background-color: #7efb01;"
              variant="text"
              :disabled="btnDisable"
              @click="criminalCheckUpdate()"
          >
            Next
          </v-btn>
        </v-card>
      </v-dialog>
    </v-row>
    <v-container v-if="displayContent" fluid class="mainContainerView">
      <v-layout id="dashboardView">
        <v-app-bar
            color="#0AFD01"
            class="top_bar_title"
            prominent
        >
          <v-col>
            <v-app-bar-nav-icon v-if="is_dlivrd_driver" variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          </v-col>
          <v-col>
            <v-toolbar-title class="toolbarTitleStyle">Application Checklist</v-toolbar-title>
          </v-col>
          <v-col style="display: flex; justify-content: right">
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
                  <v-card-title style="text-align:center">{{name}}</v-card-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-app-bar>
        <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>
        <v-main>
          <v-col md="4" sm="12" style="padding: 0">
            <v-card
                color="grey-lighten-4"
                flat
                class="checklistCardStyle"
                rounded="0"
            >
              <v-card-title  style="font-weight: bold; font-size: 24px">Registration Checklist</v-card-title>
              <!-- Questionnaire -->
              <v-row v-bind:class = "(questionnaireInfo)?'approved_block':'unapproved_block'" class="checklistElementRow" @click="routeToPage(1)">
                <v-card-title class="checklistTitleStyle">Questionnaire</v-card-title>
                <v-icon class="checklistIconStyle" color="#0afd01" size="34" v-if="questionnaireInfo && showStatus">mdi-check-circle-outline</v-icon>
                <v-icon class="checklistIconStyle" color="#FF0000" size="34" v-else-if="showStatus">mdi-close-circle-outline</v-icon>
                <v-tooltip
                    v-if="!questionnaireInfo"
                    activator="parent"
                    location="bottom"
                    width="300px"
                ><span v-html="questionnaireInfoTooltip"></span></v-tooltip>
              </v-row>
              <!-- Personal Information -->
<!--              <v-row v-bind:class = "(personalInfo)?'':'unapproved_block'" class="checklistElementRow" @click="routeToPage(1)">-->
              <v-row v-bind:class = "(personalInfo)?'approved_block':'unapproved_block'" class="checklistElementRow" @click="routeToPage(2)">
                <v-card-title class="checklistTitleStyle">Personal Information</v-card-title>
                <v-icon class="checklistIconStyle" color="#0afd01" size="34" v-if="personalInfo && showStatus">mdi-check-circle-outline</v-icon>
                <v-icon class="checklistIconStyle" color="#FF0000" size="34" v-else-if="showStatus">mdi-close-circle-outline</v-icon>
                <v-tooltip
                    style="font-size: 32px"
                    v-if="!personalInfo"
                    activator="parent"
                    location="bottom"
                    width="300px"
                ><span v-html="personalInfoTooltip"></span></v-tooltip>
              </v-row>
              <!-- Document Information -->
              <v-row v-bind:class = "(documentsInfo)?'approved_block':'unapproved_block'" class="checklistElementRow " @click="routeToPage(3)">
                <v-card-title class="checklistTitleStyle">Documents</v-card-title>
                <v-icon class="checklistIconStyle" color="#0afd01" size="34" v-if="documentsInfo && showStatus">mdi-check-circle-outline</v-icon>
                <v-icon class="checklistIconStyle" color="#FF0000" size="34" v-else-if="showStatus">mdi-close-circle-outline</v-icon>
                <v-tooltip
                    v-if="!documentsInfo"
                    activator="parent"
                    location="bottom"
                    width="300px"
                ><span v-html="documentsInfoTooltip"></span></v-tooltip>
              </v-row>
              <!-- Banking Information -->
              <v-row v-if="false" v-bind:class = "(bankingInfo)?'approved_block':'unapproved_block'" class="checklistElementRow" @click="routeToPage(4)">
                <v-card-title class="checklistTitleStyle">Banking Information</v-card-title>
                <v-icon class="checklistIconStyle" color="#0afd01" size="34" v-if="bankingInfo && showStatus">mdi-check-circle-outline</v-icon>
                <v-icon class="checklistIconStyle" color="#FF0000" size="34" v-else-if="showStatus">mdi-close-circle-outline</v-icon>
                <v-tooltip
                    v-if="!bankingInfo"
                    activator="parent"
                    location="bottom"
                    width="300px"
                ><span v-html="bankingInfoTooltip"></span></v-tooltip>
              </v-row>
              <!-- Delivery Location -->
              <v-row v-bind:class = "(deliveryInfo)?'approved_block':'unapproved_block'" class="checklistElementRow" @click="routeToPage(5)">
                <v-card-title class="checklistTitleStyle">Delivery Location</v-card-title>
                <v-icon class="checklistIconStyle" color="#0afd01" size="34" v-if="deliveryInfo && showStatus">mdi-check-circle-outline</v-icon>
                <v-icon class="checklistIconStyle" color="#FF0000" size="34" v-else-if="showStatus">mdi-close-circle-outline</v-icon>
                <v-tooltip
                    v-if="!deliveryInfo"
                    activator="parent"
                    location="bottom"
                    width="300px"
                ><span v-html="deliveryInfoTooltip"></span></v-tooltip>
              </v-row>
              <!-- Preferred Availability -->
              <v-row v-bind:class = "(availabilityInfo)?'approved_block':'unapproved_block'" class="checklistElementRow" @click="routeToPage(6)">
                <v-card-title class="checklistTitleStyle">Preferred Availability</v-card-title>
                <v-icon class="checklistIconStyle" color="#0afd01" size="34" v-if="availabilityInfo && showStatus">mdi-check-circle-outline</v-icon>
                <v-icon class="checklistIconStyle" color="#FF0000" size="34" v-else-if="showStatus">mdi-close-circle-outline</v-icon>
                <v-tooltip
                    v-if="!availabilityInfo"
                    activator="parent"
                    location="bottom"
                    width="300px"
                ><span v-html="availabilityInfoTooltip"></span></v-tooltip>
              </v-row>
              <!-- Vehicle & Bag Details -->
              <v-row v-bind:class = "(vehicleInfo)?'approved_block':'unapproved_block'" class="checklistElementRow" @click="routeToPage(7)">
                <v-card-title class="checklistTitleStyle">Vehicle & Bag Details</v-card-title>
                <v-icon class="checklistIconStyle" color="#0afd01" size="34" v-if="vehicleInfo && showStatus">mdi-check-circle-outline</v-icon>
                <v-icon class="checklistIconStyle" color="#FF0000" size="34" v-else-if="showStatus">mdi-close-circle-outline</v-icon>

                <v-tooltip
                    v-if="!vehicleInfo"
                    activator="parent"
                    location="bottom"
                    width="300px"
                ><span v-html="vehicleInfoTooltip"></span></v-tooltip>
              </v-row>
            </v-card>
          </v-col>
          <v-btn
              prepend-icon="mdi-upload"
              variant="text"
              :disabled=verifyRequirements
              class="submitBtnStyle"
              @click="submitFormConfirmation"
          >
            Apply For Account Approval
          </v-btn>
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
      is_dlivrd_driver: false,
      loader: loader,
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
      value: String,
      valuePassword: String,
      username: "",
      loading: true,
      showMessage: false,
      loadView: false,
      userProfileImage: null,
      name: "",
      newLogin: false,
      referral: "",
      password: null,
      confirmPassword: null,
      validationFailed: false,
      displayContent: false,
      // check verification
      personalInfo: false,
      documentsInfo: false,
      questionnaireInfo: false,
      bankingInfo: false,
      deliveryInfo: false,
      availabilityInfo: false,
      vehicleInfo: false,
      verifyRequirements: true,
      // variables for username
      desiredUsername: null,
      responseUsernameAvailibility: {},
      customUsername: null,
      username_tf: false,
      personalInfoTooltip: "",
      documentsInfoTooltip: "",
      questionnaireInfoTooltip: "",
      bankingInfoTooltip: "",
      deliveryInfoTooltip: "",
      availabilityInfoTooltip: "",
      vehicleInfoTooltip: "",
      showStatus: false,
      count: 0,
      // Criminal Check
      btnDisable: false,
      askCriminalBackgroundCheck: false,
      backgroundCheck: true,
      criminal_selection: '',
      criminal_description: false,
      criminal_description_detail: '',
      criminal_description_detail_char_count: 0,
      criminal_description_detail_help: 'Please explain below With Minimum 50 character',
      criminalCheckSolved: false,
      fleet_id: null,

    }
  },
  beforeMount() {

    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
  },
  mounted() {
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
    this.is_dlivrd_driver = localStorage.getItem('is_dlivrd_driver') == 'true'
    this.userProfileImage = localStorage.getItem('userProfileImage')
    if(localStorage.getItem('is_dlivrd_driver') == 'true'){
      this.$router.push('/analytics')
      return;
    }
    this.sessionValidator();
  },
  watch: {
    criminal_description_detail() {
      this.criminal_description_detail_char_count = this.criminal_description_detail.split("").length
      var count = 50 - this.criminal_description_detail.split("").length
      if(count <= 0){
        this.criminal_description_detail_help = 'Good To Go'
        count =0
      }else{
        this.criminal_description_detail_help = 'Please explain here with minimum ' + count+ ' character'

      }
    },
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
        if(response.status == 200) {
          //   console.log(response)
          //   var verifySession = response.data;
          //   if(verifySession['Success']){
          //     this.loadView = true;
          //     this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
          //     if(verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true){
          //       this.validationFailed = false;
          //     }
          //     else{
          //       this.validationFailed = true;
          //     }
          //     this.loadChecklistStatus();
          //   }
          //   else{
          //     this.clearFields();
          //     this.$router.push('/');
          //   }
          // }
          console.log("Session Response")
          console.log(response)
          var verifySession = response.data;
          if (verifySession['Success']) {
            this.loadView = true;
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
            // this.getDriverStats();
            if (verifySession['background_check'] == false) {
              console.log("Background Check")
              this.criminalCheckPopup()
              this.askCriminalBackgroundCheck = true;
              return;
            }
            else if (localStorage.getItem('require_password') == 'true') {
              console.log("Require Password")
              console.log(localStorage.getItem('require_password'))
              this.checkNewLogin()
              return;
            }
            else if (localStorage.getItem('first_login') == 'true') {
              console.log("First Time Login")
              console.log(localStorage.getItem('first_login'))
              this.firstTimeLogin()
              return;
            }
            if (verifySession['info_completed'] == false) {
              console.log("Info Verified is false")
              this.accountWarningText = true
            }
            else {
              console.log("Info Verified is true")
              this.accountWarningText = false;
            }
            if (verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true) {
              console.log("Validation is false")
              this.validationFailed = false;
            }
            else {
              console.log("Validation is true")
              this.validationFailed = true;
            }
            this.loadChecklistStatus();
            this.displayContent = true;
          }
          else{
            if(verifySession['Failure'] == "Account under review."){
              this.loadView = true;
              this.verifyOTP = false;
              this.sessionStatus = false;
              this.alert_title = "Warning";
              this.alert_description = "Account under review";
              this.alert_error = null;
              this.dialog = true;
              this.agreeButtonText = "logout";
              this.cancelButtonText = null
            }
            else if(verifySession['Failure'] == "Invalid request."){
              this.loadView = true;
              this.verifyOTP = false;
              this.sessionStatus = false;
              this.alert_title = "Warning";
              this.alert_description = "Invalid request.";
              this.alert_error = null;
              this.dialog = true;
              this.agreeButtonText = "logout";
              this.cancelButtonText = null
            }
            else {
              this.clearFields();
              this.$router.push('/');
            }
          }

        }
      }).catch((e) => {
        console.log("Errrroooooor")
        console.log(e)
        // this.$router.push('/');
      })
    },
    loadChecklistStatus(){
      var url = this.baseurl + 'get_onboard_checklist';
      var data = {
        identity: this.username
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
        console.log(" C response")
        console.log(response)
        if(response.data['Success']){

          // personal Info tooltip
          if(response.data['checklist']['personal_info']){
            this.personalInfo = true
          }
          else {
            if (response.data['missing_info']['personal_info']) {
              if (response.data['missing_info']['personal_info']['name_verified']) {
                this.personalInfoTooltip += response.data['missing_info']['personal_info']['name_verified'] +"</br>"
              }
              if(response.data['missing_info']['personal_info']['mobile_number_verified']) {
                this.personalInfoTooltip += response.data['missing_info']['personal_info']['mobile_number_verified'] +"</br>"
              }
              if(response.data['missing_info']['personal_info']['email']) {
                this.personalInfoTooltip += response.data['missing_info']['personal_info']['email'] +"</br>"
              }
              // if(response.data['missing_info']['personal_info']['ssn_verified']) {
              //   this.personalInfoTooltip += response.data['missing_info']['personal_info']['ssn_verified'] +"</br>"
              // }
              // if(response.data['missing_info']['personal_info']['dob_verified']) {
              //   this.personalInfoTooltip += response.data['missing_info']['personal_info']['dob_verified'] +"</br>"
              // }
              if(response.data['missing_info']['personal_info']['country']) {
                this.personalInfoTooltip += response.data['missing_info']['personal_info']['country'] +"</br>"
              }
              if(response.data['missing_info']['personal_info']['state']) {
                this.personalInfoTooltip += response.data['missing_info']['personal_info']['state'] +"</br>"
              }
              if(response.data['missing_info']['personal_info']['address']) {
                this.personalInfoTooltip += response.data['missing_info']['personal_info']['address'] +"</br>"
              }
              // if(response.data['missing_info']['personal_info']['purpose']) {
              //   this.personalInfoTooltip += response.data['missing_info']['personal_info']['purpose'] +"</br>"
              // }
              if(response.data['missing_info']['personal_info']['selfie']) {
                this.personalInfoTooltip += response.data['missing_info']['personal_info']['selfie'] +"</br>"
              }

            }
          }
          // documents info tooltip
          if(response.data['checklist']['documents']){
            this.documentsInfo = true
          }
          else{
            if (response.data['missing_info']['documents']) {
              if(response.data['missing_info']['documents']['license_front']) {
                this.documentsInfoTooltip += response.data['missing_info']['documents']['license_front'] +"</br>"
              }
              if(response.data['missing_info']['documents']['license_back']) {
                this.documentsInfoTooltip += response.data['missing_info']['documents']['license_front'] +"</br>"
              }
              if(response.data['missing_info']['documents']['vehicle_registration']) {
                this.documentsInfoTooltip += response.data['missing_info']['documents']['vehicle_registration'] +"</br>"
              }
            }
          }
          // questionnaire info tooltip
          if(response.data['checklist']['questionnaire']){
            this.questionnaireInfo = true
            localStorage.setItem('questionnaire', false)
          }
          else{
            if (response.data['missing_info']['questionnaire']) {
              if(response.data['missing_info']['questionnaire']['questionnaire']) {
                this.questionnaireInfoTooltip += response.data['missing_info']['questionnaire']['questionnaire'] +"</br>"
              }
            }
            localStorage.setItem('questionnaire', true)
          }
          // banking info tooltip
          if(response.data['checklist']['banking_info']){
            this.bankingInfo = true
          }
          else{
            if (response.data['missing_info']['banking_info']) {
              if(response.data['missing_info']['banking_info']['banking_info']) {
                this.bankingInfoTooltip += response.data['missing_info']['banking_info']['banking_info'] +"</br>"
              }
            }
          }
          // delivery info tooltip
          if(response.data['checklist']['delivery_location']){
            this.deliveryInfo = true
          }
          else{
            if (response.data['missing_info']['delivery_location']) {
              if(response.data['missing_info']['delivery_location']['delivery_location']) {
                this.deliveryInfoTooltip += response.data['missing_info']['delivery_location']['delivery_location'] +"</br>"
              }
              if(response.data['missing_info']['delivery_location']['tip_preference']) {
                this.deliveryInfoTooltip += response.data['missing_info']['delivery_location']['tip_preference'] +"</br>"
              }
            }
          }
          // availability tooltip
          if(response.data['checklist']['preferred_slots']){
            this.availabilityInfo = true
          }
          else{
            if (response.data['missing_info']['preferred_slots']) {
              if(response.data['missing_info']['preferred_slots']['preferred_slots']) {
                this.availabilityInfoTooltip += response.data['missing_info']['preferred_slots']['preferred_slots'] +"</br>"
              }
            }
          }
          // vehicle and bag details tooltip
          if(response.data['checklist']['vehicle_bag_details']){
            this.vehicleInfo = true
          }
          else{
            if (response.data['missing_info']['vehicle_bag_details']) {
              if(response.data['missing_info']['vehicle_bag_details']['vehicle']) {
                this.vehicleInfoTooltip += response.data['missing_info']['vehicle_bag_details']['vehicle'] +"</br>"
              }
              if(response.data['missing_info']['vehicle_bag_details']['cart']) {
                this.vehicleInfoTooltip += response.data['missing_info']['vehicle_bag_details']['cart'] +"</br>"
              }
              if(response.data['missing_info']['vehicle_bag_details']['cart_image']) {
                this.vehicleInfoTooltip += response.data['missing_info']['vehicle_bag_details']['cart_image'] +"</br>"
              }
              if(response.data['missing_info']['vehicle_bag_details']['catering_bags']) {
                this.vehicleInfoTooltip += response.data['missing_info']['vehicle_bag_details']['catering_bags'] +"</br>"
              }
              if(response.data['missing_info']['vehicle_bag_details']['catering_bags_image']) {
                this.vehicleInfoTooltip += response.data['missing_info']['vehicle_bag_details']['catering_bags_image'] +"</br>"
              }
            }
          }
          if(this.personalInfo == false || this.documentsInfo == false || this.bankingInfo == false || this.deliveryInfo == false || this.availabilityInfo == false || this.vehicleInfo == false || this.questionnaireInfo == false){
            this.verifyRequirements = true;
          }
          else{
            this.verifyRequirements = false;
          }
          this.showStatus = true;
        }
        else{
          this.clearFields();
          this.$router.push('/')
        }
      }).catch(() => {
        this.clearFields();
        this.$router.push('/')
      })
    },
    submitFormConfirmation(){
      this.alert_title = "Submit";
      this.alert_description = "Are you sure you want to submit your application for review?";
      this.agreeButtonText = "Process";
      this.cancelButtonText = "Cancel";
      this.dialog = true;
    },
    enterUsername(){
      this.username_tf = true
      this.alert_title = "Display Name"
      this.alert_description = "Enter your username for the account."
      this.dialog = true
      this.agreeButtonText = "SaveUsername"
      this.showError = false;
    },
    checkUsernameAvailability(){
      this.alert_error = null;
      if(this.desiredUsername == null || this.desiredUsername.length < 8 || this.desiredUsername.length > 20){
        this.errorMessage = "The username should have 8-20 characters.";
        this.showError = true;
        return;
      }
      else if (!this.desiredUsername.match(/^[A-Za-z0-9]*$/)) {
        this.errorMessage = "The username should have characters and numbers only.";
        this.showError = true;
        return;
      }
      this.loading = false;
      this.btnDisable = true;
      var url = this.baseurl + 'check_tookan'
      var data = {
        identity: this.username,
        tookan_username: this.desiredUsername
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
        console.log("Approval response")
        console.log(response)
        this.loading = true;
        this.btnDisable = false;
        if(response.status == 200){
          this.responseUsernameAvailibility = response.data;
          if(this.responseUsernameAvailibility['tookan_username_available'] == false) {
            this.alert_error = "Username already taken.";
            return;
          }
          this.username_tf = false
          this.modulesCompleted()
        }
      }).catch(() => {
        this.alert_title = "Warning";
        this.alert_description = "Session Expired. Please login again.";
        this.agreeButtonText = "logout";
        this.dialog = true;
        this.username_tf = false;
      })
    },
    modulesCompleted() {
      if(this.responseUsernameAvailibility['Failure']){
        if(this.responseUsernameAvailibility['Failure'] == 'Rider already registered at Tookan.') {
          this.verifyOTP = false;
          this.sessionStatus = false;
          this.alert_title = "Warning";
          this.alert_description = "Account already exists";
          this.alert_error = null;
          this.dialog = true;
          this.agreeButtonText = "logout";
          this.cancelButtonText = null
        }
        else if(this.responseUsernameAvailibility['Failure'] == "Account Already On Hubspot") {
          this.verifyOTP = false;
          this.sessionStatus = false;
          this.alert_title = "Warning";
          this.alert_description = "Account already exists.";
          this.dialog = true;
          this.cancelButtonText = null
          this.agreeButtonText = "logout";
        }
        else if(this.responseUsernameAvailibility['Failure'] == 'No Account Created.') {
          this.verifyOTP = false;
          this.sessionStatus = false;
          this.alert_title = "Warning";
          this.agreeButtonText = "logout";
          this.alert_description = "No account created.";
          this.cancelButtonText = null
          this.dialog = true;
        }
        else {
          this.verifyOTP = false;
          this.sessionStatus = false;
          this.alert_title = "Warning";
          this.agreeButtonText = "logout";
          this.alert_description = "No account created.";
          this.cancelButtonText = null
          this.dialog = true;
        }
      }
      else if(this.responseUsernameAvailibility['Success']){
        if(this.responseUsernameAvailibility['Success']){
          this.successResponseTitle = "Account Created"
          this.successResponse = "Congratulations and welcome to dlivrd."
        }
        else if(this.responseUsernameAvailibility['tookan_response']){
          this.successResponseTitle = "Account Creation Failed"
          this.successResponse = "Account not created successfully."
        }
        this.accountCreationResponse()
      }
    },
    accountCreationResponse(){
      this.alert_title = this.successResponseTitle;
      this.alert_description = this.successResponse;
      this.alert_error = null;
      this.dialog = true
      this.verifyNumber = false
      this.tx_number = localStorage.getItem('mobile')
      this.agreeButtonText = "Ok";
      this.cancelButtonText = null
      this.QuestionsIsLoaded = true;
    },
    updateStatus(){
      console.log("Account created successfuly")
      localStorage.setItem('is_dlivrd_driver', true)
      this.$router.push('/analytics')
      localStorage.clear();
    },
    closeDialog(){
      this.dialog = false
      this.username_tf = null;
    },
    routeToPage(index){
      console.log("index:  " + index)
    if(index == 1){
        this.$router.push('/educate')
      }
     else if(index == 2){
        // if(this.personalInfoTooltip.includes('image')){
        //   this.$router.push('/personalDetails')
        // }
        // else{
        //   this.$router.push('/validation')
        // }
        this.$router.push('/personalDetails')
      }
      else if(index == 3){
        this.$router.push('/documents')
      }
      else if(index == 4){
        this.$router.push('/validation')
      }
      else if(index == 5){
        this.$router.push('/deliverylocation')
      }
      else if(index == 6){
        this.$router.push('/availability')
      }
      else if(index == 7){
        this.$router.push('/vehicleandbagdetails')
      }
    },
    closeDrawer(){
      this.drawer = false;
    },
    criminalCheckPopup(){
      this.criminal_description = false
      this.criminal_description_detail = ''
      this.alert_title = "Screening Question";
      this.alert_description = "Have you ever been convicted of a crime that would legally prohibit you from entering government buildings, schools, churches, offices or any other establishment?"
      this.agreeButtonText = "Criminal";
      this.cancelButtonText = "Criminal";
      this.alert_error = null;
      this.dialog = true
    },
    criminalCheck(selection){
      // criminalCheckPopupYES()
      // criminalCheckPopupNO()
      this.criminal_selection = selection
      if(this.criminal_selection == 'y'){
        this.criminal_description = true

      }else if(this.criminal_selection == 'n'){
        this.criminal_description = false
        this.criminalCheckSolved = true;
      }
    },
    criminalCheckPopupYES(){
      this.criminal_description_detail = ''
      this.criminal_description=true
    },
    criminalCheckPopupNO(){
      this.criminalCheckUpdate(false)
    },
    criminalCheckUpdate(){
      console.log("FUnciton Called")
      var condition = true
      if(this.criminal_selection == 'y'){
        condition = true
      }else if(this.criminal_selection == 'n'){
        this.criminal_description_detail = ''
        condition = false
      }else{
        return
      }
      if(this.criminal_description_detail_char_count<50 && condition == true){
        return
      }
      var url = this.baseurl + 'submit_background_check'
      var data = {
        identity: this.username,
        affirmation: condition,
        affirmation_text: this.criminal_description_detail,
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
        this.loading = true
        if(response.status == 200){
          var verifySession = response.data;
          this.customUsername = verifySession['custom_username_enabled']
          if(verifySession['Success']){
            this.criminalCheckSolved = true;
            console.log(verifySession)
            if(verifySession['account_under_review'] == true) {
              // this.account_under_review()

            }else{
              this.criminal_description = false
              this.criminal_description_detail = ''
              this.dialog = false
              this.askCriminalBackgroundCheck = false;
              this.alert_title = '';
              this.alert_description = '';
              this.criminal_description = false
              this.criminal_description_detail = ''
              this.agreeButtonText = ''
              this.cancelButtonText = '';
              this.sessionValidator()
            }
          }
        }
      }).catch(() => {
        this.$router.push('/')
      })
    },
    checkNewLogin(){
      console.log("Check new Login")
      var checkIfFirstTimeLogin = localStorage.getItem('require_password')
      if(checkIfFirstTimeLogin == 'true'){
        this.newLogin = true;
        this.dialog = true;
        this.alert_title = "Create your new password"
        this.agreeButtonText = "Save";
        this.cancelButtonText = "";
      }
    },
    updatePassword(){
      if(this.password == null || this.password == ''){
        this.showError = true;
        this.errorMessage = "Password cannot be empty.";
      }
      else if(this.password.length < 8){
        this.showError = true;
        this.errorMessage = "Password should be at least 8 characters long.";
      }
      else if(this.confirmPassword == null || this.confirmPassword == ''){
        this.showError = true;
        this.errorMessage = "Confirm Password cannot be empty.";
      }
      else if(this.password != this.confirmPassword){
        this.showError = true;
        this.errorMessage = "Password and Confirm Password do not match."
      }
      else{
        var url =this.baseurl + 'update_rider'
        var data = {
          identity: this.username,
          password: this.password,
        }
        if(this.fleet_id != null){
          data["fleet_id"] = this.fleet_id
        }
        axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            "session":localStorage.getItem('session_id'),
            "sessiontype":"user"
          }
        }).then((response) => {
          if(response.status == 200){
            var fetchedResponse = response.data
            if(fetchedResponse['Success']){
              localStorage.setItem('require_password',false);
              this.dialog = false
              this.newLogin = false
              this.showError = false
              this.errorMessage = false
              console.log("First Time login")
              console.log(localStorage.getItem('first_login'))
              this.sessionValidator()
              // this.firstTimeLogin();
            }
            else{
              this.dialog = true;
              this.alert_title = "Warning";
              this.alert_description = "Password not updated successfully. Your session may have expired.<br/>Please login again";
              this.agreeButtonText = "logout"
            }
          }
        }).catch( () => {
          this.clearFields();
          this.$router.push('/')
        })
      }
    },
    firstTimeLogin(){
      console.log("First time Login Function")
      var checkIfFirstTimeLogin = localStorage.getItem('first_login')
      if(checkIfFirstTimeLogin == 'true'){
        this.dialog = true;
        if(this.count == 0 ){
          this.alert_title = "Hi " + localStorage.getItem('name') + "!"
          this.alert_description = "My name is Chris Heffernan and I am the CEO and Founder of dlivrd. Thank you again for your interest in the high-quality earning opportunities available on the dlivrd platform. It is our mission here to “dlivr” success through committed people, extraordinary experiences, and dynamic systems. Transparency is a pillar of everything we do so you will always have a good idea of what each earning opportunity includes, how much driving is involved and most importantly what you can expect to earn before you decide whether it is worth your valuable time. In the spirit of that, I wanted to give you a little more information about the benefits of using the dlivrd platform and what next steps will look like on your dlivd Driver Portal onboarding journey.<br/><br/>" +
              "The dlivrd platform is best used to easily earn money as a side job or supplement the income you are generating with other gig work such as driving for Uber, Lyft, Door Dash, Instacart, etc. Most earning opportunities will include completing catering deliveries that take about 30 minutes of time between the hours of 10am and 2pm. New drivers average $25-$35 earned per delivery and earnings will generally increase as you move beyond 10 deliveries completed through the platform and acquire more equipment such as large, insulated catering delivery bags."
          this.agreeButtonText = "Next";
          this.cancelButtonText = "";
          this.alert_error = null;
        }
        else if (this.count == 1){
          this.alert_title = "Welcome to dlivrd!"
          this.alert_description = "The benefits you can expect:<br/>" +
              "- Earnings per opportunity of at least $20<br/>" +
              "- You’ll know what to expect for pay, distance and timing before accepting opportunities<br/>" +
              "- Humans on standby to help you communicate with clients and customers about issues<br/>" +
              "- Next business day pay<br/>" +
              "- Referral bonus opportunities<br/><br/>" +
              "What you will need:<br/>" +
              "- Your own motor vehicle (no scooters, motorcycles or bicycles) that can be used to make deliveries<br/>" +
              "- To be age 21 or older<br/>" +
              "- A valid driver’s license for your area<br/>" +
              "- The ability to lift and transport large quantities of food<br/><br/>" +
              "What you will do:<br/>" +
              "- Transport food safely from pick-up location to delivery destination<br/>" +
              "- Follow the customer’s requests for setting up food<br/>" +
              "- Provide professional customer service";
          this.agreeButtonText = "Next"
          this.cancelButtonText = "Previous"
          this.alert_error = null;
        }
        else if(this.count == 2){
          this.alert_title = "Driver Portal Onboarding Process";
          this.alert_description = "The steps for the dlivrd Driver Portal registration process are as follows:<br/>" +
              "1. \tWatch a series of 4 educational videos about how best to work with the platform<br/>" +
              "2. \tAnswer questions about what you learn after each<br/>" +
              "3. \tComplete a final set of questions about the dlivrd experience<br/>" +
              "4. \tYou will have the option to speak with one of our agents to discuss any questions<br/><br/>" +
              "The whole process can be completed in under 45 minutes and you will be able to progress at your own pace. Stop and start, and save your progress whenever you like. If you do not login for 10 days, we will assume that you are no longer interested at this time but you will have the opportunity to pick back up any time if you so choose.<br/><br/>" +
              "Please do not download the dlivrd app ahead of completing these steps. You will not be able to begin delivering with us until the sign-up process outlined above is completed.<br/><br/>" +
              "Thank you again for your interest. We look forward to making earning easy with you!<br/><br/>" +
              "-Chris"
          this.agreeButtonText = "Next";
          this.cancelButtonText = "Previous";
          this.alert_error = null;
        }
        else if(this.count == 3){
          this.alert_title = "Get Started";
          this.alert_description = "Last thing before you get started learning more about the dlivrd experience: If you were referred to the dlivrd platform by someone, please submit their first and last name below so we can hook them up.";
          this.agreeButtonText = "Get Started";
          this.cancelButtonText = "Previous"
          this.alert_error = null;
        }
      }
    },
    nextDialog(){
      this.count++;
      this.firstTimeLogin()
      this.DialogScrollToTop()
      this.scrollToTopWindow()
    },
    previousDialog(){
      if(this.count > 0){
        this.count--;
      }
      if(this.referral != ""){
        this.referral = null;
      }
      this.firstTimeLogin()
      this.DialogScrollToTop()
      this.scrollToTopWindow()
    },
    gettingStarted(){
      if(this.referral == ""){
        this.referral = '-';
      }
      var url =this.baseurl + 'update_rider'
      var data = {
        identity: this.username,
        referer: this.referral,
        initial_stage: 'false'
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          "session":localStorage.getItem('session_id'),
          "sessiontype":"user"
        }
      }).then((response) => {
        if(response.status == 200){
          var checkResponse = response.data
          if(checkResponse['Success']){
            localStorage.setItem('first_login',false);
            this.dialog = false
            this.count = -1
            this.displayContent = true
            this.loadChecklistStatus();
          }
        }
      }).catch( () =>{
        this.alert_title = "Warning";
        this.alert_description = "Session Expired. Please log in again";
        this.dialog = true;
        this.agreeButtonText = "logout";
      })
    },
    DialogScrollToTop(){
      var dialogElement = document.getElementById('dialogDescription');
      dialogElement.scrollTo(0,0)
    },
    scrollToTopWindow(){
      window.scrollTo({ top: 0, behavior: 'smooth'});
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
.checklistElementRow{
  padding: 10px 15px 10px 5px;
  margin: 15px !important;
  background-color: transparent !important;
  border-radius: 5px;
  align-items: center;
  border: 2px solid #0AFD01;
}
.checklistCardStyle{
  text-align: -moz-center !important;
  /*background-color: #0AFD01 !important;*/
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}
.unapproved_block:hover{
  background-color: #0AFD01 !important;
  cursor: pointer;
}
.approved_block:hover{
  color: #0adf01;
  background-color: #26225b !important;
  cursor: pointer;
}
.checklistIconStyle{
  width: 20% !important;
  justify-content: end !important;
}
.submitBtnStyle{
  background-color: #0AFD01 !important;
  margin-top: 20px;
  margin-bottom: 60px;
}
.checklistTitleStyle{
  width:80%;
  text-align: left;
}
.selected_criminal_selection{
  background-color: #0AFD01 !important;
}
</style>

