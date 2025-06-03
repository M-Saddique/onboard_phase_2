<template>
  <v-card v-if="!loadView" style="background-color: #ffffff;width: 100vw;height: 100vh;">
    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
  </v-card>
  <v-card
      color="grey-lighten-4"
      flat
      style="min-height: 100vh; align-content: center; justify-content: center; text-align: -moz-center"
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
          <v-card-title class="text-h5 dialogBoxGreenColor">{{alert_title}}</v-card-title>
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
            <v-btn
                v-if="agreeButtonText == 'Save'"
                prepend-icon="mdi-upload"
                style="background-color: #7efb01"
                variant="text"
                @click="updatePassword"
            >
              {{ agreeButtonText }}
            </v-btn>
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
    <v-container v-if="displayContent" fluid class="mainContainerBlock">
      <v-layout id="dashboardView">
        <v-app-bar
            color="#0AFD01"
            class="top_bar_title"
            prominent
        >
          <v-app-bar-nav-icon variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title class="toolbarTitleStyle">My Stats</v-toolbar-title>
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
        <v-main  class="scrollView" id="viewPort">
<!--            <v-card-text v-if="accountWarningText" class="accountSetupWarningText">In order to receive orders, <span class="completeAccountWarning" @click="routeToChecklist" > Click here</span> to complete your profile.</v-card-text>-->
          <!-- Driver Stats -->
          <v-col cols="12" class="driverStatsMainCol">
            <v-row class="colContentAlign">
              <!-- Total Orders -->
              <v-col md="2" sm="5">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                >
                  <v-card-title class="cardTitle">
                    Total Orders
                  </v-card-title>
                  <v-icon size="64" color="#0afd01">mdi-cart</v-icon>
                  <v-card-text class="textStyle">{{ totalOrders }}</v-card-text>
                </v-card>
              </v-col>
              <!-- Total Earnings -->
              <v-col md="2" sm="5">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                >
                  <v-card-title class="cardTitle">
                    Total Earnings
                  </v-card-title>
                  <v-icon size="64" color="#0afd01">mdi-currency-usd</v-icon>
                  <v-card-text class="textStyle">{{ totalEarnings }}</v-card-text>
                </v-card>
              </v-col>
              <!-- Partner Versary -->
              <v-col md="2">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                >
                  <v-card-title class="cardTitle">
                    Partner-Versary
                  </v-card-title>
                  <v-icon size="64" color="#0afd01">mdi-handshake</v-icon>
                  <v-card-text class="textStyle">{{ partnerVersary }}</v-card-text>
                </v-card>
              </v-col>
              <!-- Last Delivery -->
              <v-col md="2">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                >
                  <v-card-title class="cardTitle">
                    Last Delivery
                  </v-card-title>
                  <v-icon size="64" color="#0afd01">mdi-calendar-range</v-icon>
                  <v-card-text class="textStyle">{{ lastDelivery }}</v-card-text>
                </v-card>
              </v-col>
              <!-- Total Distance Covered -->
              <v-col md="2" class="cardViewStyle">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                >
                  <v-card-title class="cardTitle">
                    Distance Covered
                  </v-card-title>
                  <v-icon size="64" color="#0afd01">mdi-map-marker-distance</v-icon>
                  <v-card-text class="textStyle">{{ distanceCovered }} miles</v-card-text>
                </v-card>
              </v-col>
              <!-- On-Time Percentage -->
              <v-col md="2" class="cardViewStyle">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                >
                  <v-card-title class="cardTitle">
                    On-Time Percentage
                  </v-card-title>
                  <v-icon size="64" color="#0afd01" style="transform: rotate(90deg)">mdi-timeline-clock-outline</v-icon>
                  <v-card-text class="textStyle">{{ onTime }}%</v-card-text>
                </v-card>
              </v-col>
              <!--Response Time-->
              <v-col md="2" class="cardViewStyle" style="padding-bottom: 60px">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                >
                  <v-card-title class="cardTitle">
                    Response Rate
                  </v-card-title>
                  <v-icon size="64" color="#0afd01">mdi-chart-timeline-variant</v-icon>
                  <v-card-text class="textStyle">{{ responseRate }}%</v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row class="viewStyle colContentAlign">
              <!-- Total Distance Covered -->
              <v-col md="3">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                    height="195"
                >
                  <v-row style="align-items: center">
                    <v-col md="4">
                      <v-icon size="140" color="#0afd01">mdi-map-marker-distance</v-icon>
                    </v-col>
                    <v-col md="8">
                      <v-card-title class="cardTitle">
                        Traveled
                      </v-card-title>
                      <v-card-text class="textStyle">{{ distanceCovered }} miles</v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <!-- On time percentage -->
              <v-col md="2">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                >
                  <v-card-title class="cardTitle">
                    On-Time
                  </v-card-title>
                  <v-icon size="64" color="#0afd01" style="transform: rotate(90deg);">mdi-timeline-clock-outline</v-icon>
                  <v-card-text class="textStyle" >{{ onTime }}%</v-card-text>
                </v-card>
              </v-col>
              <!-- Response time -->
              <v-col md="3">
                <v-card
                    color="#eeeeee"
                    class="cardStyle"
                    height="195"
                >
                  <v-row style="align-items: center">
                    <v-col md="4">
                      <v-icon size="140" color="#0afd01">mdi-chart-timeline-variant</v-icon>
                    </v-col>
                    <v-col md="8">
                      <v-card-title class="cardTitle">
                        Response Time
                      </v-card-title>
                      <v-card-text class="textStyle">{{ responseRate }}%</v-card-text>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-main>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { AtomSpinner } from 'epic-spinners'
import axios from "axios";
import NavigationDrawer from "../components/NavigationDrawer.vue";
import englishImg from '../assets/english.png'
import spanishImg from '../assets/spanish.png'
import loader from "../assets/DlivrdLogo.gif";

export default {
  components: {
    AtomSpinner,
    NavigationDrawer,
  },
  data () {
    return {
      loader: loader,
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
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
      lastDelivery: "---",
      onTime: 0,
      partnerVersary: "---",
      responseRate: 0,
      totalEarnings: 0,
      totalOrders: 0,
      loadView: false,
      name: "",
      distanceCovered: 0,
      validationFailed: false,
      newLogin: false,
      referral: "",
      password: null,
      confirmPassword: null,
      value: String,
      valuePassword: String,
      successResponseTitle: "",
      successResponse: "",
      tx_number: null,
      displayContent: false,
      count: 0,
      accountWarningText: false,
      // criminal Check Variables
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
    this.userProfileImage = localStorage.getItem('userProfileImage')
    if(localStorage.getItem('is_dlivrd_driver') == 'false'){
      this.$router.push('/checklist')
      return;
    }
    this.sessionValidator()
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
        this.clearFields();
        this.$router.push('/');
      })
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
    getDriverStats(){
      var url = this.baseurl + "get_rider_stats"
      var data = {
        identity: localStorage.getItem('username')
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url, data,  {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
        if(response.data['Success']){
          if(response.data['stats']['last_delivery'] != "" && response.data['stats']['last_delivery'] != null){
            this.lastDelivery = response.data['stats']['last_delivery']
          }
          if(response.data['stats']['on_time_percentage'] != "" && response.data['stats']['on_time_percentage'] != null){
            this.onTime = response.data['stats']['on_time_percentage']
          }
          if(response.data['stats']['partner_versary'] != "" && response.data['stats']['partner_versary'] != null){
            this.partnerVersary = response.data['stats']['partner_versary']
          }
          if(response.data['stats']['response_rate'] != "" && response.data['stats']['response_rate'] != null){
            this.responseRate = response.data['stats']['response_rate']
          }
          if(response.data['stats']['total_earnings'] != "" && response.data['stats']['total_earnings'] != null){
            this.totalEarnings = response.data['stats']['total_earnings']
          }
          if(response.data['stats']['total_earnings'] != "" && response.data['stats']['total_earnings'] != null){
            this.totalOrders = response.data['stats']['total_orders']
          }
          if(response.data['stats']['total_distance_travelled'] != "" && response.data['stats']['total_distance_travelled'] != null){
            this.distanceCovered = response.data['stats']['total_distance_travelled']
          }
        }
      }).catch( () => {
        this.clearFields();
        this.$router.push('/')
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
          console.log("Session Response")
          console.log(response)
          var verifySession = response.data;
          if(verifySession['Success']){
            this.loadView = true;
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
            this.getDriverStats();
            if(verifySession['background_check'] == false){
              console.log("Background Check")
              this.criminalCheckPopup()
              this.askCriminalBackgroundCheck = true;
              return;
            }
            else if(localStorage.getItem('require_password') == 'true'){
              console.log("Require Password")
              console.log(localStorage.getItem('require_password'))
              this.checkNewLogin()
              return;
            }
            else if(localStorage.getItem('first_login') == 'true'){
              console.log("First Time Login")
              console.log(localStorage.getItem('first_login'))
              this.firstTimeLogin()
              return;
            }
            if(verifySession['info_completed'] == false){
              console.log("Info Verified is false")
              this.accountWarningText = true
            }
            else{
              console.log("Info Verified is true")
              this.accountWarningText = false;
            }
            if(verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true){
              console.log("Validation is false")
              this.validationFailed = false;
            }
            else{
              console.log("Validation is true")
              this.validationFailed = true;
            }
              this.displayContent = true;
          }
          else{
            this.clearFields();
            this.$router.push('/');
          }
        }
      }).catch(() => {
        this.clearFields();
        this.$router.push('/');
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
    closeDrawer(){
      this.drawer = false;
    },
    routeToChecklist(){
      this.$router.push('/checklist');
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
              this.account_under_review()
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
.mainContainerBlock{
  padding: 10px 0 0 0 !important;
  text-align:-webkit-center;
}
.accountIcon{
  background-color: white;
  border-radius: 50%;
}
.cardStyle{
  padding: 15px !important;
}
.cardTitle{
  color: #0AFD01;
  text-align: -moz-center !important;
}
.textStyle{
  font-size: 20px !important;
  font-weight: bold !important;
  text-align: -moz-center !important;
}
.scrollView{
  overflow-x: scroll !important;
  height: 101vh !important;
}
.cardViewStyle{
  display: none !important;
}
@media(max-width: 800px){
  .textStyle{
    font-size: 18px !important;
    font-weight: bold !important;
  }
  .viewStyle{
    display: none !important;
  }
  .cardViewStyle{
    display: block !important;
  }
}
.driverStatsMainCol{
  padding-top: 50px !important;
}
.colContentAlign{
  justify-content: center !important;
}
.accountSetupWarningText{
  background-color: red;
  font-size: 16px !important;
  color: white;
}
.completeAccountWarning{
  color: #0afd01;
}
.completeAccountWarning:hover{
  color: #000000;
  cursor: pointer;
}
.selected_criminal_selection{
  background-color: #0AFD01 !important;
}
</style>

