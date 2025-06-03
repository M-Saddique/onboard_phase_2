<style>
.profile_info_block{
  min-width: 50%;
  padding: 30px !important;
}
@media (max-width: 430px) {
  .profile_info_block{
    padding: 15px;
    min-width: 100%;
    padding: 20px !important;
  }
}
.v-switch .v-label{
  color: #0AFD01 !important;
  font-size: 18px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: bold;
}
.vjs-icon-placeholder{
  position: static;
}
.v-btn__overlay{
  display: none;
}
.v-btn__underlay{
  display: none;
}
.v-selection-control{
  align-items: start;
}
.v-selection-control__input::before{
  background-color: transparent !important;
}
.loading_bar{
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top:50%;
  z-index: 100;
  text-align: center;
}
.button_back{
  background-color: #0AFD01 !important;
}
.button_update{
  background-color: #0AFD01 !important;
  margin-left: 10px;
}
</style>

<template>
  <v-card
      color="grey-lighten-4"
      flat
      style="min-height: 100vh;"
      rounded="0"
  >
    <img  alt="Vue logo" class="logo" style="object-fit: contain;width: 80vw; position: fixed; top:40%; left: 7%; opacity: 0.1;" src="../assets/dlivrdlogo.png"  />

    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          transition="dialog-top-transition"
          max-width="600px"
          persistent
      >
        <v-card>
          <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#0AFD01" class="loading_bar" />
          <v-card-title class="text-h5" style="background-color: #7efb01">
            {{alert_title}}
          </v-card-title>
          <v-card-text style="overflow-y: scroll; text-align: justify" v-html="alert_description"></v-card-text>
          <v-card-actions style="align-self: end; margin-top: 30px">
            <v-spacer></v-spacer>
            <v-btn
                v-if="agreeButtonText == 'logout'"
                style="background-color: #7efb01"
                variant="text"
                @click="logoutOnboarding"
            >
              {{ agreeButtonText }}
            </v-btn>
            <v-btn
                v-else
                style="background-color: #7efb01"
                variant="text"
                @click="dialog = false"
            >
              Okay
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-container fluid>
      <v-layout>
        <v-app-bar
            color="#0AFD01"
            class="top_bar_title"
            prominent
        >
          <v-app-bar-nav-icon variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title class="toolbarTitleStyle">Settings</v-toolbar-title>
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
        <NavigationDrawer :drawer=drawer :key="drawer"></NavigationDrawer>
        <v-main class="scrollView">
          <v-row v-if="loadingUserDetails" style="width:100%; justify-content: center; margin-top: 50px;">
            <atom-spinner :animation-duration="1000" :size="90" color="#0AFD01" />
          </v-row>
          <!-- Details fields block -->
          <v-row v-if="!loadingUserDetails" style="width:100%; justify-content: center; margin-top: 0;margin-left: 0;margin-right: 0">
            <v-card
                color="grey-lighten-4"
                flat
                class="profile_info_block"
                rounded="0"
            >
              <!-- First Name -->
              <TextFieldItem>
                <template #heading>First Name</template>
                <v-text-field
                    required
                    hide-details
                    v-model="firstName"
                    placeholder="Enter First Name"
                    :persistent-placeholder='true'
                    class="generic_tx px-1"
                    name="firstName"
                    type="text"
                    density="comfortable"
                />
              </TextFieldItem>
              <!-- Middle Name -->
              <TextFieldItem>
                <template #heading>Middle Name</template>
                <v-text-field
                    hide-details
                    v-model="middleName"
                    placeholder="Enter Middle Name (Optional)"
                    :persistent-placeholder='true'
                    class="generic_tx px-1"
                    name="middleName"
                    type="text"
                    density="comfortable"
                />
              </TextFieldItem>
              <!-- Last Name -->
              <TextFieldItem>
                <template #heading>Last Name</template>
                <v-text-field
                    required
                    hide-details
                    v-model="lastName"
                    placeholder="Enter Last Name"
                    :persistent-placeholder='true'
                    class="generic_tx px-1"
                    name="lastName"
                    type="text"
                    density="comfortable"
                />
              </TextFieldItem>
              <!-- Mobile Number -->
              <TextFieldItem>
                <template #heading>Mobile Number</template>
                <v-text-field
                    required
                    hide-details
                    v-model="mobileNumber"
                    readonly
                    class="generic_tx px-1"
                    name="mobileNumber"
                    type="text"
                    density="comfortable"
                />
              </TextFieldItem>
            </v-card>
            <v-card
                color="grey-lighten-4"
                flat
                class="profile_info_block"
                rounded="0"
            >
              <!-- Email Address -->
              <TextFieldItem>
                <template #heading>Email Address</template>
                <v-text-field
                    required
                    hide-details
                    v-model="userEmail"
                    readonly
                    class="generic_tx px-1"
                    name="userEmail"
                    type="email"
                    density="comfortable"
                />
              </TextFieldItem>
              <!-- Country -->
              <TextFieldItem>
                <template class="text_header_color" #heading>Country</template>
                <v-select
                    clearable
                    open-on-clear
                    color="#ffffff"
                    bg-color="#ffffff"
                    :items="countries"
                    v-model="optedCountry"
                    placeholder="Select Country"
                    :persistent-placeholder='true'
                    class="generic_tx selectdropdown"
                    hide-details
                    density="comfortable"
                >
                </v-select>
              </TextFieldItem>
              <!-- State -->
              <TextFieldItem>
                <template class="text_header_color" #heading>States</template>
                <v-select
                    clearable
                    open-on-clear
                    color="#ffffff"
                    bg-color="#ffffff"
                    :items="states"
                    v-model="optedState"
                    placeholder="Select State"
                    :persistent-placeholder='true'
                    class="generic_tx selectdropdown"
                    hide-details
                    density="comfortable"
                >
                </v-select>
              </TextFieldItem>
              <!-- City -->
              <TextFieldItem>
                <template class="text_header_color" #heading>City</template>
                <v-select
                    clearable
                    open-on-clear
                    color="#ffffff"
                    bg-color="#ffffff"
                    :items="cities"
                    v-model="optedCity"
                    placeholder="Select City"
                    :persistent-placeholder='true'
                    class="generic_tx selectdropdown"
                    hide-details
                    density="comfortable"
                >
                </v-select>
              </TextFieldItem>
            </v-card>
          </v-row>
          <!-- Change Password block -->
          <v-row v-if="!loadingUserDetails" style="width:100%; justify-content: center;">
            <v-card
                color="grey-lighten-4"
                flat
                style="min-width: 100vw;margin-top: 20px;padding: 40px !important;"
                rounded="0"
            >
              <v-switch
                  v-model="togglePassword"
                  color='#0AFD01'
                  label="Change Password"
                  value="true"
                  hide-details
              ></v-switch>
              <v-col>
                <v-col cols="12"  >
                  <!-- New Password -->
                  <TextFieldItem v-if="togglePassword">
                    <template #heading>New Password</template>
                    <v-text-field
                        hide-details
                        v-model="newPassword"
                        placeholder="Enter New Password"
                        :persistent-placeholder='true'
                        class="generic_tx px-1"
                        name="newPassword"
                        type="password"
                        density="comfortable"
                    />
                  </TextFieldItem>
                </v-col>
                <v-col cols="12" >
                  <!-- Confirm New Password -->
                  <TextFieldItem v-if="togglePassword">
                    <template #heading>Confirm Password</template>
                    <v-text-field
                        hide-details
                        v-model="confirmPassword"
                        placeholder="Confirm Password"
                        :persistent-placeholder='true'
                        class="generic_tx px-1"
                        name="confirmPassword"
                        type="password"
                        density="comfortable"
                    />
                  </TextFieldItem>
                </v-col>
              </v-col>
            </v-card>
            <v-col align-self="center" sm="12" style="text-align: center; margin-bottom: 80px">
              <v-btn v-if="loading" class="button_back" prepend-icon="mdi-arrow-left" @click="goToDashboard">Back</v-btn>
              <v-btn v-if="loading" class="button_update" prepend-icon="mdi-update" @click="updateDetails">Update</v-btn>
              <div style="width: 100%; text-align: -webkit-center">
                <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#0AFD01" />
              </div>
            </v-col>
          </v-row>
        </v-main>
      </v-layout>
    </v-container>


  </v-card>
</template>

<script>
import TextFieldItem from '../components/TextFieldItem.vue'
import axios from 'axios'
import {AtomSpinner} from 'epic-spinners'
import NavigationDrawer from "../components/NavigationDrawer.vue";
import englishImg from "../assets/english.png"
import spanishImg from "../assets/spanish.png"

export default {
  components: {
    TextFieldItem,
    AtomSpinner,
    NavigationDrawer
  },
  data () {
    return {
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
      drawer: false,
      width:window.innerWidth * 0.40,
      screenSize: screen.width,
      language_code:'English',
      loading:true,
      agreeButtonText: "",
      sessionStatus:true,
      alert_title: '',
      alert_description:'',
      dialog: false,
      username:'',
      loggedInUserEmail: "",
      referral: null,
      firstName: "",
      lastName: "",
      middleName: "",
      mobileNumber: "",
      userEmail: "",
      countries: [],
      states: [],
      cities: [],
      optedCountry: null,
      optedState: null,
      optedCity:null,
      Data_Countries: {},
      togglePassword: false,
      confirmPassword: "",
      newPassword: "",
      dataLoadedOnMount: 0,
      userData: {},
      updateData: {},
      checkError: false,
      loadingUserDetails: false,
    }
  },
  watch: {
    optedCountry() {
      this.dataLoadedOnMount++;
      this.setStates();
    },
    optedState(){
      this.setCity()
    }
  },
  beforeMount() {
    this.username = localStorage.getItem('username')
    this.loggedInUserEmail = localStorage.getItem('email')

    Twilio.FlexWebChat.MessagingCanvas.defaultProps.memberDisplayOptions = {
      yourDefaultName: this.username,
      yourFriendlyNameOverride: false
    }
  },
  mounted() {
    this.userProfileImage = localStorage.getItem('userProfileImage')
    this.sessionValidator()
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
    loadUser(userData){
      this.firstName = userData['first_name']
      this.middleName = userData['middle_name']
      this.lastName = userData['last_name']
      this.mobileNumber = userData['mobile_number']
      this.userEmail = userData['email']
      this.optedCity = userData['city']
      this.optedCountry = userData['country']
      this.optedState = userData['states']
    },
    loadRegions(datapoints){
      var state, country = "";
      for(var team in datapoints){
        if (team == 'Others'){
          state = "Other"
          country = "USA";
        }
        else{
          state= team.split(', ')[0];
          country= team.split(', ')[1];
        }
        for(var city in datapoints[team]){
          if(this.Data_Countries[country] == null)
            this.Data_Countries[country] = {}
          if(this.Data_Countries[country][state] == null){
            this.Data_Countries[country][state] = []
          }
          this.Data_Countries[country][state].push(datapoints[team][city])
        }
        if(!this.countries.includes(country)){
          this.countries.push(country)
        }
      }
    },
    getRegions(){
      var auth_token = ''
      var url =this.baseurl + 'get_markets_regions'
      const data = {}
      axios.get(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          authorization : auth_token,
          uuid:''
        }
      }).then((response) => {
        if(response.status == 200){
          const data = response.data;
          this.loadRegions(data)
        }
      }).catch(() => {
        //console.log("Regions not fetched")
      })
    },
    getUser(){
      this.loadingUserDetails = true;
      var url =this.baseurl + 'onboard_get_user_details'
      const data = {
        identity: this.username
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          "session":localStorage.getItem('session_id'),
          "sessiontype": 'user'
        }
      }).then((response) => {
        if(response.status == 200){

          this.userData = response.data;
          this.loadUser(this.userData)
          this.loadingUserDetails = false
        }
      }).catch(() => {
        //console.log("Regions not fetched")
      })
    },
    setStates(){
      this.states = []
      if(this.dataLoadedOnMount>1){
        this.optedState = null;
      }
      for(var country in this.Data_Countries){
        if(this.optedCountry == country){
          for(var state in this.Data_Countries[country]){
            this.states.push(state)
          }
          this.states.sort()
        }
      }
      this.setCity()
    },
    setCity(){
      this.cities = [];
      if(this.dataLoadedOnMount>1){
        this.optedCity = null;
      }
      for (var country in this.Data_Countries){
        for(var state in this.Data_Countries[country]){
          if(this.optedState == state){
            for(var city in this.Data_Countries[country][state])
              this.cities.push(this.Data_Countries[country][state][city])
          }
        }
        this.cities.sort()
      }
    },
    logout(){
      this.verifyOTP = false;
      this.alert_title = "Confirmation";
      this.alert_description = "Are you sure you want to logout? ";
      this.dialog = true;
      this.agreeButtonText = "logout";
      this.alert_error = null;
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
        if(response.status == 200){
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
        }
      }).catch( () => {
        this.$router.push('/');
      })
    },
    sessionValidator(){
      this.loading = false
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
        this.loading = true
        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            localStorage.setItem('phoneverified', verifySession['phone_verified']);
            localStorage.setItem('stage', verifySession['stage']);
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
            this.getRegions();
            this.getUser();
          }
          else{
            this.alert_title = "Warning";
            this.alert_description = "Session Expired";
            this.alert_error = null;
            this.dialog = true;
            this.agreeButtonText = "logout";
          }
        }
      }).catch(() => {
        this.alert_title = "Warning";
        this.alert_description = "Password not updated/ Try Again!";
        this.alert_error = null;
        this.dialog = true;
        this.agreeButtonText = "Ok";
      })
    },
    updateDetails(){
      this.checkError = false
      var update_server = {}
      if(this.togglePassword){
        if(this.newPassword != this.confirmPassword){
          this.alert_title = 'Incorrect Passwords'
          this.alert_description = 'Password and confirm password do not match.'
          this.dialog = true
          return
        }else if(this.newPassword == ""){
          this.alert_title = 'Empty Passwords'
          this.alert_description = 'Please Enter your new password.'
          this.dialog = true
          return
        }
        else{
          update_server['password'] = this.newPassword
        }
      }
      update_server['identity'] = this.username
      if(this.firstName != this.userData['first_name']){
        update_server['first_name'] = this.firstName
      }
      if(this.lastName != this.userData['last_name']){
        update_server['last_name'] = this.lastName
      }
      if(this.middleName != this.userData['middle_name']){
        update_server['middle_name'] = this.middleName
      }
      if(this.optedCountry != this.userData['country']){
        update_server['country'] = this.optedCountry
      }
      if(this.optedCity != this.userData['city']){
        update_server['city'] = this.optedCity
      }
      if(this.optedState != this.userData['states']){
        update_server['states'] = this.optedState
      }
      this.loading = false
      var url =this.baseurl + 'update_rider'

      axios.post(url, update_server, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          "session":localStorage.getItem('session_id'),
          "sessiontype": 'user'
        }
      }).then(response => {
        if(response.status == 200){
          var updateResponse = response.data
          if(updateResponse['Success']){
            this.alert_title = "Update Details"
            this.alert_description = "User details have been updated successfully"
            this.dialog = true
            this.loading = true
          }
          else{
            this.alert_title = "Update Details"
            this.alert_description = "Error while updating details. PLease login again"
            this.dialog = true
            this.loading = true
            this.checkError = true
          }
        }
      }).catch( () => {
        this.$router.push('/')
      })
    },
    goToDashboard(){
      this.$router.push('/educate')
    },
  }
}

</script>

