<template>
  <v-card v-if="!loadView" style="background-color: #ffffff;width: 100vw;height: 100vh;">
    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
  </v-card>
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
            <v-btn
                v-if="agreeButtonText == 'Updated Successfully'"
                prepend-icon="mdi-check"
                class="dialogBoxGreenColor"
                variant="text"
                @click="this.$router.push('/checklist')"
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
          <v-col>
            <v-btn v-if="!is_dlivrd_driver" v-on:click="$router.push('/checklist')" style="font-size: 15px; color: #26225b">
              <v-icon style="font-size: 25px; color: #26225b">mdi-chevron-left</v-icon>
              Checklist
            </v-btn>
            <v-app-bar-nav-icon v-if="is_dlivrd_driver"  variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          </v-col>
          <v-col>
            <v-toolbar-title class="toolbarTitleStyle">Personal Information</v-toolbar-title>
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
                  <!--                <v-icon class="accountIcon" size="32">mdi-account</v-icon>-->
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
          </v-col>
        </v-app-bar>
        <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>
        <v-main class="mainView">
          <v-row class="mainBlockStyle">
            <v-col class="columnStyle">
              <v-row class="detailsBlockHead">
                <v-avatar size="160" class="topCardCenter editProfileImage">
                  <div
                      ref="fileProfile"
                      class="profileImageWrapper"
                  >
                    <v-img
                        :src=profileImage
                        :lazy-src='profileImage'
                        class="bg-grey-lighten-2"
                        @click="selectProfileImage(previewProfileFile,false)"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0 loaderPlacement">
                          <v-img v-if="!previewProfileFile" :src="lazy_load_profile" ></v-img>
                          <v-progress-circular
                              v-if="loadingProfileImage"
                              indeterminate
                              color="#000000"
                              style="position: absolute"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                    <v-badge icon="mdi-close" v-if="previewProfileFile != null" class="editProfileOverlay" @click="selectProfileImage(previewProfileFile,true)" ></v-badge>
                  </div>
                  <v-file-input
                      ref="fileProfile"
                      type="file"
                      accept="image/*"
                      v-model="fileImageProfile"
                      @emptied="fileImageProfile = null"
                      @input="pickProfileFile"
                      style="display: none"
                  ></v-file-input>
                </v-avatar>
                <v-col>
                  <v-card-text style="padding: 0" class="cardStyleName topCardCenter">{{ fullName }}</v-card-text>
                  <v-row style="margin: 0; ">
                    <v-icon style="font-size: 20px">
                      mdi-phone
                    </v-icon>
                    <v-card-text class="topCardCenter" style="font-size:18px; padding: 0; margin-left: 5px">
                      +1{{ phone }}
                    </v-card-text>
                  </v-row>
                </v-col>
                <v-col class="profileSectionLogo">
                  <v-img :src=dlivrdProfileLogo width="200"></v-img>
                </v-col>
              </v-row>
              <v-row v-if="showProfileWarning" style="margin: 0 20px; text-align: left;">
                <v-card-text style="padding: 0; color: red">
                  *Please add a profile picture
                </v-card-text>
              </v-row>
              <!-- Personal Information -->
              <v-card-title class="bankingInfoTitle fontSize">Personal Information</v-card-title>
              <v-row>
                <!-- First Name, Last name, Mobile number, DOB and Purpose -->
                <v-col cols="12" md="6" sm="12" xs="12" class="columnPadding">
                  <!-- first name -->
                  <v-col class="columnStyle">
                    <v-card-title class="titleAlignment">First Name</v-card-title>
                    <v-text-field v-model="firstName" :readonly=nameVerified :hint="nameVerifiedHint" class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>
                  </v-col>
                  <!-- last name -->
                  <v-col class="columnStyle">
                    <v-card-title class="titleAlignment">Last Name</v-card-title>
                    <v-text-field v-model="lastName" :readonly=nameVerified :hint="nameVerifiedHint" class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>
                  </v-col>
                  <!-- Mobile Number -->
                  <v-col class="columnStyle">
                    <v-card-title class="titleAlignment">Mobile Number</v-card-title>
                    <v-text-field v-model="phone" readonly hint="Mobile number cannot be edited." class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>
                  </v-col>
                  <!-- Email Address -->
                  <v-col class="columnStyle">
                    <v-card-title class="titleAlignment">Email Address</v-card-title>
                    <v-text-field v-model="emailAddress" readonly hint="Email cannot be changed." class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>
                  </v-col>
                  <!-- Date of Birth-->
<!--                  <v-col v-if="false" class="columnStyle">-->
<!--                    <v-card-title class="titleAlignment">Date of Birth</v-card-title>-->
<!--                    &lt;!&ndash; <v-text-field v-model="dob" readonly class="tf_width" variant="filled" color="#0afd01" density="comfortable" hide-details type="date" format="YYYY/MM/DD"></v-text-field>&ndash;&gt;-->
<!--                    <v-text-field v-model="dob" readonly :hint=hintDOB class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>-->
<!--                  </v-col>-->
                  <!-- Purpose -->
<!--                  <v-col v-if="false" class="columnStyle">-->
<!--                    <v-card-title class="titleAlignment">Tax Type</v-card-title>-->
<!--                    <v-select-->
<!--                        v-model="selectedPurpose"-->
<!--                        :items=purpose-->
<!--                        regular-->
<!--                        id="tf_id"-->
<!--                        color="#0afd01"-->
<!--                        bg-color="#ffffff"-->
<!--                        class="tf_width"-->
<!--                        density="comfortable"-->
<!--                    >-->
<!--                    </v-select>-->
<!--                  </v-col>-->
                </v-col>
                <!-- Email,Country, State, City and SSN -->
                <v-col md="6" sm="12" xs="12" class="columnPadding">

                  <!-- Country -->
                  <v-col class="columnStyle">
                    <v-card-title class="titleAlignment">Country</v-card-title>
                    <v-select
                        v-model="optedCountry"
                        :items="countries"
                        clearable
                        :readonly=locationVerified
                        :hint="countryVerifiedHint"
                        open-on-clear
                        color="#0AFD01"
                        bg-color="#FFFFFF"
                        placeholder="Select Country"
                        :persistent-placeholder='true'
                        class="tf_width"
                        density="comfortable"
                    ></v-select>
                  </v-col>
                  <!-- Sate -->
                  <v-col class="columnStyle">
                    <v-card-title class="titleAlignment">State</v-card-title>
                    <v-select
                        v-model="optedState"
                        :items="states"
                        clearable
                        open-on-clear
                        :readonly=locationVerified
                        :hint="stateVerifiedHint"
                        color="#0AFD01"
                        bg-color="#FFFFFF"
                        placeholder="Select State"
                        :persistent-placeholder='true'
                        class="tf_width"
                        density="comfortable"
                    >
                    </v-select>
                  </v-col>
                  <!-- City -->
                  <v-col class="columnStyle">
                    <v-card-title class="titleAlignment">City</v-card-title>
                    <v-select
                        v-model="optedCity"
                        :items="cities"
                        clearable
                        open-on-clear
                        :readonly=locationVerified
                        :hint="cityVerifiedHint"
                        color="#0AFD01"
                        bg-color="#FFFFFF"
                        placeholder="Select City"
                        :persistent-placeholder='true'
                        class="tf_width"
                        density="comfortable"
                    >
                    </v-select>
                  </v-col>
                  <!-- Language -->
                  <v-col class="columnStyle">
                    <v-card-title class="titleAlignment">Language</v-card-title>
                    <v-select
                        v-model="preferredLanguage"
                        :items="languages"
                        :onselect="language(preferredLanguage)"
                        open-on-clear
                        color="#0AFD01"
                        bg-color="#FFFFFF"
                        placeholder="Select Language"
                        :persistent-placeholder='true'
                        class="tf_width"
                        density="comfortable"
                    >
                    </v-select>
                  </v-col>
                  <!-- SSN -->
<!--                  <v-col v-if="false" class="columnStyle">-->
<!--                    <v-card-title class="titleAlignment">SSN/ EIN</v-card-title>-->
<!--&lt;!&ndash;                    <v-text-field v-model="SSN" :hint=hintSSN class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>&ndash;&gt;-->
<!--                    <v-text-field v-model="SSN" placeholder="Enter your SSN/ EIN number" class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>-->
<!--                  </v-col>-->
                  <!-- License Image -->
<!--                  <v-col v-if="false" class="columnStyle">-->
<!--                    <v-btn-->
<!--                        :append-icon=licImgIcon-->
<!--                        :color=btnColor-->
<!--                        :disabled=btnProperty-->
<!--                        size="large"-->
<!--                        style="margin-top: 40px;"-->
<!--                        @click="licImg = true"-->
<!--                    >Upload License-->
<!--                    </v-btn>-->
<!--                  </v-col>-->
                </v-col>
              </v-row>
              <!-- Password Change Block -->
              <v-row>
                <v-switch
                    v-model="togglePassword"
                    color='#0AFD01'
                    label="Change Password"
                    value="true"
                    class="toggleBtnStyle"
                    hide-details
                ></v-switch>
              </v-row>
              <!-- New Password and Confirm Password -->
              <v-row v-if="togglePassword">
                <!-- New Password -->
                <v-col cols="12" md="6" sm="12" class="columnPadding">
                  <v-card-title class="tf_passwordTitleAlignment">New Password</v-card-title>
                  <v-text-field
                      hide-details
                      v-model="newPassword"
                      placeholder="Enter Password"
                      :persistent-placeholder='true'
                      class="tf_password"
                      name="newPassword"
                      :value="newPassword"
                      :append-icon="newPasswordValue ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="() => (newPasswordValue = !newPasswordValue)"
                      :type="newPasswordValue ? 'password' : 'text'"
                      density="comfortable"
                  />
                </v-col>
                <!-- Confirm New Password -->
                <v-col md="6" sm="12" class="columnPadding">
                  <v-card-title class="tf_passwordTitleAlignment">Confirm Password</v-card-title>
                  <v-text-field
                      hide-details
                      v-model="confirmPassword"
                      placeholder="Confirm Password"
                      :persistent-placeholder='true'
                      class="tf_password"
                      name="confirmPassword"
                      :value="confirmPassword"
                      :append-icon="newConfirmPassValue ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="() => (newConfirmPassValue = !newConfirmPassValue)"
                      :type="newConfirmPassValue ? 'password' : 'text'"
                      density="comfortable"
                  />
                </v-col>
              </v-row>
              <!-- Banking Information-->
<!--              <v-card-title v-if="false" class="bankingInfoTitle fontSize">Banking Information</v-card-title>-->
<!--              <v-row v-if="false">-->
<!--                <v-col cols="12" md="6" sm="12" xs="12" class="columnPadding">-->
<!--                  &lt;!&ndash; Account name &ndash;&gt;-->
<!--                  <v-col class="columnStyle">-->
<!--                    <v-card-title class="titleAlignment">Account Name</v-card-title>-->
<!--                    <v-text-field v-model="accountName" :hint="accountNameHint" readonly class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>-->
<!--                  </v-col>-->
<!--                  &lt;!&ndash; Account Number &ndash;&gt;-->
<!--                  <v-col class="columnStyle">-->
<!--                    <v-card-title class="titleAlignment">Account Number</v-card-title>-->
<!--                    <v-text-field v-model="accountNumber" :hint="accountNumberHint" readonly class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>-->
<!--                  </v-col>-->
<!--                  &lt;!&ndash; Account type &ndash;&gt;-->
<!--                  <v-col class="columnStyle">-->
<!--                    <v-card-title class="titleAlignment">Account Type</v-card-title>-->
<!--                    <v-text-field v-model="accountType" :hint="accountTypeHint" readonly class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>-->
<!--                  </v-col>-->
<!--                </v-col>-->
<!--                <v-col md="6" sm="12" xs="12" class="columnPadding">-->
<!--                  &lt;!&ndash; Bank Name &ndash;&gt;-->
<!--                  <v-col class="columnStyle">-->
<!--                    <v-card-title class="titleAlignment">Bank</v-card-title>-->
<!--                    <v-text-field v-model="bank" :hint="bankHint" readonly class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>-->
<!--                  </v-col>-->
<!--                  &lt;!&ndash; Bank Details Updated At &ndash;&gt;-->
<!--                  <v-col class="columnStyle">-->
<!--                    <v-card-title class="titleAlignment">Routing Number</v-card-title>-->
<!--                    <v-text-field v-model="routingNumber" :hint="routingNumberHint" readonly class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>-->
<!--                  </v-col>-->
<!--                  &lt;!&ndash; Routing Number &ndash;&gt;-->
<!--                  <v-col class="columnStyle">-->
<!--                    <v-card-title class="titleAlignment">Updated At</v-card-title>-->
<!--                    <v-text-field v-model="bankDetailsUpdatedAt" :hint="bankDetailsUpdatedAtHint" readonly class="tf_width" variant="filled" color="#0afd01" density="comfortable"></v-text-field>-->
<!--                  </v-col>-->
<!--                </v-col>-->
<!--              </v-row>-->
              <!-- Warning Message -->
              <v-col>
                <v-card-text v-if="showddDetailsWarning" class="warningMessageStyle" v-html="errorMessage"></v-card-text>
              </v-col>
              <!-- Save button -->
              <v-col>
                <v-btn
                    :disabled="!updatable"
                    v-if="!uploadingData"
                    prepend-icon="mdi-content-save-check"
                    variant="text"
                    style="background-color: #0AFD01;"
                    @click="saveddDetails"
                >
                  Save
                </v-btn>
                <atom-spinner v-if="uploadingData" :animation-duration="1000" :size="90" color="#0AFD01" class="loading_bar" />
              </v-col>
            </v-col>
          </v-row>
        </v-main>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { AtomSpinner } from 'epic-spinners'
import axios from "axios";
import DatePicker from 'vue-datepicker-next';
import NavigationDrawer from "../components/NavigationDrawer.vue";
import imgUpload from '../assets/Upload.png';
import profileSectionLogo from '../assets/dlivrdlogo.png';
import englishImg from '../assets/english.png'
import spanishImg from '../assets/spanish.png'
import loader from "../assets/DlivrdLogo.gif";

export default {
  components: {
    DatePicker,
    AtomSpinner,
    NavigationDrawer
  },
  data () {
    return {
      is_dlivrd_driver: false,
      noSelfie: true,
      loader: loader,
      userProfileImage: null,
      updatable: false,
      languages: ['English', 'Spanish'],
      preferredLanguage: 'English',
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
      showProfileWarning: true,
      // image files variables
      purpose: ['Business', 'Personal'],
      previewImagefrontfile: null,
      previewImageBackfile: null,
      file: null,
      fileBack: null,
      lazy_load: '',
      lazy_load_back: '',
      previewImage: null,
      previewBackImage: null,
      loadingFrontImage: true,
      loadingBackImage: true,
      drawer: false,
      agreeButtonText: null,
      cancelButtonText: null,
      alert_title: '',
      alert_description: '',
      dialog: false,
      errorMessage: false,
      showError: false,
      licImgError: false,
      licImgMessage: null,
      username: "",
      selectedPurpose: null,
      loading: true,
      license: false,
      licenseFrontImage: null,
      licenseBackImage: null,
      licenseImage: null,
      fullName: null,
      firstName: null,
      lastName: null,
      emailAddress: null,
      phone: null,
      SSN: null,
      hintDOB: null,
      dob: null,
      hintSSN: null,
      // Country, City and States variables
      countries: [],
      states: [],
      cities: [],
      optedCountry: null,
      optedState: null,
      optedCity:null,
      Data_Countries: {},
      dataLoadedOnMount: 0,
      // password variables
      togglePassword: false,
      confirmPassword: "",
      newPassword: "",
      showddDetailsWarning: false,
      licImg: false,
      progressValue: null,
      licImgIcon: "mdi-upload",
      btnColor: '#eeeeee',
      uploadingData: false,
      loadView: false,
      btnProperty: true,
      name: "",
      // profileImage
      profileImage: '../src/assets/user.jpg',
      fileImageProfile: null,
      previewProfileImage: null,
      loadingProfileImage: true,
      lazy_load_profile: '',
      previewProfileFile: null,
      // Account Details
      accountName: '---',
      accountNumber: '---',
      accountType: '---',
      bank: '---',
      routingNumber: '---',
      bankDetailsUpdatedAt: '---',
      nameVerified: false,
      verifySession: null,
      nameVerifiedHint: "",
      locationVerified: false,
      countryVerifiedHint: "",
      cityVerifiedHint: "",
      stateVerifiedHint: "",
      validationFailed: false,
      newPasswordValue: String,
      newConfirmPassValue: String,
      date: new Date().toISOString().substr(0, 10),
      picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dlivrdProfileLogo: null,
      // banking Info Hints
      accountNameHint: null,
      accountNumberHint: null,
      accountTypeHint: null,
      bankHint: null,
      routingNumberHint: null,
      bankDetailsUpdatedAtHint: null,
      fleet_id: null,
    }
  },
  watch: {
    optedCountry() {
      console.log(this.optedCountry)
      if(this.optedCountry == null){
        console.log("Called Function")
        this.optedCountry = null;
      }
      this.dataLoadedOnMount++;
      this.setStates();
    },
    optedState(){
      this.setCity()
    },
    firstName(){
      this.dataLoadedOnMount++
      if(this.dataLoadedOnMount > 1){
        this.updatable = true
      }

    },
    lastName(){
      this.dataLoadedOnMount++
      if(this.dataLoadedOnMount > 1){
        this.updatable = true
      }
    },
    phone(){
      this.dataLoadedOnMount++
      if(this.dataLoadedOnMount > 1){
        this.updatable = true
      }
    },
    emailAddress(){
      if(this.dataLoadedOnMount > 1){
        this.updatable = true
      }
    },
    optedCity(){
      this.dataLoadedOnMount++
      if(this.dataLoadedOnMount > 1){
        this.updatable = true
      }
    },
    preferredLanguage(){
      this.dataLoadedOnMount++
      if(this.dataLoadedOnMount > 1){
        this.updatable = true
      }
    },
    profileImage(){
      this.dataLoadedOnMount++
      if(this.dataLoadedOnMount > 1){
        this.updatable = true
      }
    },
    // dataLoadedOnMount(){
    //   console.log(this.dataLoadedOnMount)
    // },
  },
  beforeMount() {
    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
  },
  mounted() {
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
    this.is_dlivrd_driver = localStorage.getItem('is_dlivrd_driver') == 'true'
    console.log('local storage')
    console.log(localStorage.getItem('userProfileImage'))
    this.userProfileImage = localStorage.getItem('userProfileImage')
    this.sessionValidator()
    this.dlivrdProfileLogo = profileSectionLogo;
    if(this.userProfileImage != this.baseImageurl + 'fjk621654/default_user.png')
      this.showProfileWarning = false
  },
  methods: {
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
      if(this.dataLoadedOnMount == 1){
        this.setStates();
      }
    },
    getRegions(){
      var url =this.baseurl + 'get_markets_regions'
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.get(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'session':localStorage.getItem('session_id')
        }
      }).then((response) => {
        if(response.status == 200){
          const data = response.data;
          this.loadRegions(data)
        }
      }).catch(() => {

      })
    },
    setStates(){
      this.states = []
      if(this.dataLoadedOnMount>1){
        this.optedState = null;
      }
      for(var country in this.Data_Countries){
        if(this.optedCountry == country){
          console.log("Called")
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
        this.$router.push('/');
      })
    },
    saveddDetails(){
      console.log("Save clicked")
      // check Password fields
      if(this.togglePassword){
        if(this.newPassword.length < 8 || this.newPassword.length > 32){
          this.alert_title = 'Invalid Passwords'
          this.alert_description = 'Password should be between 8 and 32 characters.'
          this.dialog = true
          this.agreeButtonText = 'Okay'
          return
        }
        else if(this.newPassword != this.confirmPassword){
          this.alert_title = 'Incorrect Passwords'
          this.alert_description = 'Password and confirm password do not match.'
          this.dialog = true
          this.agreeButtonText = 'Okay'
          return
        }
      }
      // check User details
      if (this.firstName == null || this.firstName == "") {
        this.showddDetailsWarning = true;
        this.errorMessage = "*First name is required."
      }
      else if (this.lastName == null || this.lastName == "") {
        this.showddDetailsWarning = true;
        this.errorMessage = "*Last name is required."
      }
      // else if (this.purpose == null) {
      //   this.showddDetailsWarning = true;
      //   this.errorMessage = "*Please select a purpose of joining dlivrd."
      // }
      else{
        this.showddDetailsWarning = false;
        this.errorMessage = null;
        var data = new FormData();
        data.append('identity', this.username);
        data.append('first_name', this.firstName);
        data.append('last_name', this.lastName);
        data.append('city', this.optedCity);
        data.append('state', this.optedState);
        data.append('country', this.optedCountry);
        if(this.fleet_id != null){
          data.append('fleet_id', this.fleet_id);
        }

        // data.append('purpose', this.selectedPurpose);
        data.append('preferred_language', this.preferredLanguage)
        if(this.togglePassword){
          data.append('password', this.newPassword)
        }
        console.log("===================================")
        console.log(this.previewProfileFile)
        if((typeof(this.previewProfileFile) != 'string') && (this.previewProfileFile != null)){
          data.append('selfie', this.previewProfileFile);
        }
        var url = this.baseurl + 'update_rider_personal_info';
        this.uploadingData = true;
        axios.post(url, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            "session":localStorage.getItem('session_id')
          }
        }).then(response => {
          console.log("Personal Info Save response")
          console.log(response)
          this.uploadingData = false;
          if(response.data['Success']){
            // console.log("localStorage.setItem('userProfileImage', this.previewProfileFile)")
            // console.log(this.fileImageProfile)
            // console.log(this.profileImage)
            // console.log('this.previewProfileFile', this.previewProfileFile)
            // console.log('this.userProfileImage', this.userProfileImage)
            // console.log("===========================")
            this.userProfileImage = this.profileImage
            localStorage.setItem('userProfileImage', this.userProfileImage)
            // localStorage.setItem('userProfileImage', this.userProfileImage)
            this.profileImage = this.fileImageProfile
            this.previewProfileFile = localStorage.getItem('userProfileImage')

            if(this.newPassword){
              this.dialog = true;
              this.alert_title = "Success";
              this.alert_description = "Password updated successfully. Please login again."
              this.agreeButtonText = 'logout'
            }
            else{
              this.dialog = true;
              this.alert_title = "Success";
              this.alert_description = "Details updated successfully."
              this.agreeButtonText = 'Updated Successfully'
            }
          }
          else{
            this.dialog = true;
            this.alert_title = "Update Failed";
            if(response.data['selfie']){
              this.alert_description = response.data['selfie'];
            }
            else if(response.data['not_selfie']){
              this.alert_description = response.data['not_selfie'];
            }
            else if(response.data['Failure'] == 'Session Expired. Please login again.'){
              this.$router.push('/')
            }
            else{
              this.alert_description = "Details not saved. Please Try Again";
            }
            this.agreeButtonText = 'Okay'
          }
        }).catch( (e) => {
          this.dialog = true;
          this.alert_title = "Warning";
          this.alert_description = "Your session has expired. Please Login Again"
          this.agreeButtonText = "logout"
        })
      }
    },
    // selectLicenseFrontImage(reference,badge_click) {
    //   if(badge_click == false && reference == null){
    //     this.$refs.fileInput.click()
    //   }
    //   else if(badge_click == true){
    //     this.previewImage = null;
    //     this.previewImagefrontfile = null;
    //     this.lazy_load = imgUpload;
    //     this.file = null;
    //     if(this.previewBackImage == null){
    //       this.progressValue = 0;
    //     }
    //     else{
    //       this.progressValue = 50;
    //     }
    //   }
    // },
    // selectLicenseBackImage(reference,badge_click) {
    //   if(badge_click == false && reference == null){
    //     this.$refs.fileInputBack.click()
    //   }
    //   else if(badge_click == true){
    //     this.previewBackImage = null;
    //     this.previewImageBackfile = null;
    //     this.lazy_load_back = imgUpload;
    //     this.fileBack = null;
    //     if(this.previewImage == null){
    //       this.progressValue = 0;
    //     }
    //     else{
    //       this.progressValue = 50;
    //     }
    //   }
    // },
    // pickLicenceFrontFile(e) {
    //   this.previewImagefrontfile = e.target.files[0]
    //   this.lazy_load = ''
    //   this.licImgError = false;
    //   let input = this.$refs.fileInput
    //   let file = input.files
    //   if (file && file[0]) {
    //     let reader = new FileReader
    //     reader.onload = e => {
    //       this.previewImage = e.target.result
    //       if(this.previewBackImage == null){
    //         this.progressValue = 50
    //       }
    //       else{
    //         this.progressValue = 100
    //       }
    //     }
    //     reader.readAsDataURL(file[0])
    //     this.$emit('input', file[0])
    //   }
    // },
    // pickLicenceBackFile(e) {
    //   this.previewImageBackfile = e.target.files[0]
    //   this.lazy_load_back = ''
    //   this.licImgError = false;
    //   let input = this.$refs.fileInputBack
    //   let file = input.files
    //   if (file && file[0]) {
    //     let reader = new FileReader
    //     reader.onload = e => {
    //       this.previewBackImage = e.target.result
    //       if(this.previewImage == null){
    //         this.progressValue = 50
    //       }
    //       else{
    //         this.progressValue = 100
    //       }
    //     }
    //     reader.readAsDataURL(file[0])
    //     this.$emit('input', file[0])
    //   }
    // },
    // closeLicenseUploadPopUp(){
    //   if(this.previewImagefrontfile || this.previewImageBackfile){
    //     this.btnColor = '#0afd01'
    //     this.licImgIcon = 'mdi-check'
    //   }
    //   else{
    //     this.btnColor = '#eeeeee'
    //     this.licImgIcon = 'mdi-upload'
    //   }
    //   this.licImg = false;
    //   this.licImgError = false;
    //   this.licImgMessage = null;
    //   this.showddDetailsWarning = false;
    // },
    // licenseImagesUploaded(){
    //   if(this.previewImagefrontfile || this.previewImageBackfile){
    //     this.btnColor = '#0afd01'
    //     this.licImgIcon = 'mdi-check'
    //   }
    //   else{
    //     this.btnColor = '#eeeeee';
    //     this.licImgIcon = "mdi-upload";
    //   }
    //   this.licImgError = false;
    //   this.licImgMessage = null;
    //   this.licImg = false;
    //   this.showddDetailsWarning = false;
    // },
    sessionValidator(){
      console.log('PersonalInfo Validator')
      this.uploadingData = true
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
        console.log(response)
        this.uploadingData = false
        if(response.status == 200){
          this.verifySession = response.data;
          if(this.verifySession['Success']){
            if(this.verifySession['non_verified_values']['name_verified'] == null){
              this.nameVerified = true;
              this.nameVerifiedHint = "Name is verified and cannot be edited."
              this.locationVerified = true;
              this.countryVerifiedHint = "Country is verified and cannot be edited."
              this.cityVerifiedHint = "City is verified and cannot be edited."
              this.stateVerifiedHint = "State is verified and cannot be edited."
            }
            if(this.verifySession['plaid_verification_complete'] == 'success' && this.verifySession['banking_info_verified'] == true){
              this.validationFailed = false;
            }
            else{
              this.validationFailed = true;
            }
            this.loadView = true;
            // this.userProfileImage = this.baseImageurl + this.verifySession['profile_image']
            this.getDriverPersonalDetails();
            this.getRegions();
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
    getDriverPersonalDetails(){
      var url = this.baseurl + 'get_rider_personal_info'
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
        console.log("Driver Personal Details Response")
        console.log(response)
        if(response.data['Success']){
          this.fullName = response.data['rider_info']['first_name'] + " " + response.data['rider_info']['last_name'];
          this.firstName = response.data['rider_info']['first_name']
          this.lastName = response.data['rider_info']['last_name']
          // this.selectedPurpose = response.data['rider_info']['purpose']
          this.phone = response.data['rider_info']['mobile_number']
          this.emailAddress = response.data['rider_info']['email']
          this.optedCountry = response.data['rider_info']['country']
          this.optedCity = response.data['rider_info']['city']
          this.optedState = response.data['rider_info']['state']
          // if(this.verifySession['non_verified_values']['dob_verified'] == false){
          //   this.dob = "Not verified"
          //   this.hintDOB = "Date of Birth is not verified. Please complete your identity verification process."
          // }
          // else{
          //   this.dob = response.data['rider_info']['dob']
          //   this.hintDOB = "Date of Birth is verified and cannot be edited."
          // }
          // if(this.verifySession['non_verified_values']['ssn_verified'] == false){
          //   this.SSN = "Not verified"
          //   this.hintSSN = "SSN is not verified. Please complete your identity verification process."
          // }
          // else{
          //   this.SSN = response.data['rider_info']['ssn']
          //   this.hintSSN = "SSN is verified and cannot be updated."
          // }
          //Get Banking Details
          // this.accountName = response.data['rider_info']['banking_info']['account_name']
          // if(this.accountName == "") {
          //   this.accountNameHint = "Account Name is Not Verfied."
          // }
          // else{
          //   this.accountNameHint = "Account Name is Verified and cannot be edited.";
          // }
          // this.accountNumber = response.data['rider_info']['banking_info']['account_number']
          // if(this.accountNumber == "") {
          //   this.accountNumberHint = "Account Number is Not Verfied."
          // }
          // else{
          //   this.accountNumberHint = "Account Number is Verified and cannot be edited.";
          // }
          // this.accountType = response.data['rider_info']['banking_info']['account_type']
          // if(this.accountType == "") {
          //   this.accountTypeHint = "Account Type is Not Verfied."
          // }
          // else{
          //   this.accountTypeHint = "Account Type is Verified and cannot be edited.";
          // }
          // this.bank = response.data['rider_info']['banking_info']['bank_name']
          // if(this.bank == "") {
          //   this.bankHint = "Bank is Not Verfied."
          // }
          // else{
          //   this.bankHint = "Bank is Verified and cannot be edited.";
          // }
          // this.routingNumber = response.data['rider_info']['banking_info']['routing_number']
          // if(this.routingNumber == "") {
          //   this.routingNumberHint = "Banking Information is not verified yet."
          // }
          // else{
          //   this.routingNumberHint = "Field cannot be edited.";
          // }
          // this.bankDetailsUpdatedAt = response.data['rider_info']['banking_info']['bank_details_updated_at']
          // this.bankDetailsUpdatedAtHint = "Field cannot be edited.";

          // Get Profile Image
          this.previewProfileFile = this.baseImageurl + response.data['rider_info']['profile_image'];
          if(this.previewProfileFile != 'fjk621654/default_user.png'){
            this.noSelfie == false
          }
          this.profileImage = this.previewProfileFile;
          //
          // this.lazy_load = ''
          // this.lazy_load_back = ''
          // this.lazy_load_profile = ''
          // this.btnProperty = false;
          //
          if(this.previewProfileFile){
            this.loadingProfileImage = false;
            this.lazy_load_profile = ''
          }
          else{
            this.loadingProfileImage = false;
            this.profileImage = '../src/assets/User.jpg';
          }
          this.dataLoadedOnMount = -5
        }
      }).catch(() => {
        this.clearFields();
        this.$router.push('/')
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
    selectProfileImage(reference,badge_click) {
      this.$refs.fileProfile.click()
    },
    pickProfileFile(e) {
      this.previewProfileFile = e.target.files[0]
      let input = this.$refs.fileProfile
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.profileImage = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
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
  }
}
</script>
<style>
#tf_id{
  opacity: 0 !important;
}
</style>
<style>
.v-messages__message {
  color: red;
  font-size: 14px;
  text-align: left;
}
.bgImage{
  object-fit: contain;
  width: 80vw;
  position: fixed;
  top:40%;
  left: 7%;
  opacity: 0.1;
}
.mainView{
  padding-top: 60px !important;
}
.mainBlockStyle{
  height: 100%;
  padding-bottom: 100px !important;
  text-align: -moz-center;
}
.mainContainerView{
  text-align:-webkit-center;
}
.detailsBlockHead{
  background-color: #f8f8f8 !important;
  margin: 20px !important;
  padding:15px !important;
  border: 2px solid #c5c5c5 !important;
  border-radius: 15px !important;
  align-items: center !important;
  text-align: left;
}
.warningMessageStyle{
  padding-left: 0 !important;
  padding-bottom: 0 !important;
  text-align: -webkit-center;
  color: red;
}
.columnStyle{
  padding: 0 !important;
}
.titleAlignment{
  width: 80%;
  text-align: left;
  color: #0AFD01;
  padding-left: 0 !important;
  padding-bottom: 0 !important;
}
.tf_width{
  width: 80% !important;
}
.tf_passwordTitleAlignment{
  width: 80%;
  text-align: left;
  color: #0AFD01;
  padding-left: 0 !important;
  padding-bottom: 0 !important;
}
.tf_password{
  width: 80% !important;
}
@media (max-width: 800px){
  .tf_width{
    width: 90% !important;
  }
  .tf_password{
    width: 90% !important;
  }
  .titleAlignment{
    width: 90%;
  }
  .tf_passwordTitleAlignment{
    width: 90%;
  }
  .imagePreviewWrapper {
    height: 25vh !important;
  }
  .bankingInfoTitle{
    margin: 40px 10px 30px 10px !important;
    padding-left: 0 !important;
  }
  .toggleBtnStyle{
    margin-top: 25px;
    margin-left: 20px !important;
  }
  .topCardCenter{
    text-align: center !important;
  }
  .detailsBlockHead{
    justify-content: center;
  }
}
.dialogBoxDescription{
  overflow-y: scroll;
  text-align: justify;
}
.dialogBoxActionButtons{
  align-self: end;
  margin-top: 30px;
}
.dialogButtonsUploadImage{
  align-self: center;
}
.accountIcon{
  background-color: white;
  border-radius: 50%;
}
.centerText{
  text-align: center;
}
.imagePopup{
  margin: 15px 30px 0 30px !important;
}
.badgeStyle{
  position: absolute;
  top:0;
  right: 0;
}
.imagePreviewWrapper {
  width: 100%;
  height: 40vh;
  display: block;
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 20px;
  border: 1px solid #0AFD01;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.profileImageWrapper{
  width: 100%;
  border-radius: 20px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center center;
}
.alignFileInput{
  text-align-last: center;
}
.toolbarTitleStyle{
  text-align-last: center;
}
.profileSectionLogo{
  text-align: -webkit-right;
  text-align: -moz-right;
}
.bankingInfoTitle{
  text-align: left;
  margin: 40px 60px 30px 60px;
  padding-left: 0 !important;
  border-bottom: 2px solid #0afd01
}
.editProfileOverlay{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.editProfileOverlay:hover{
  background-color: #0AFD0142;
  background-image: url("../assets/edit.png");
  background-position: center center;
  background-repeat: no-repeat;
}
.toggleBtnStyle{
  margin-left: 77px;
}
.columnPadding{
  padding: 0 !important;
}
.cardStyleName{
  padding-bottom: 5px !important;
  font-size: 32px !important;
  line-height: 1.8ex !important;
}
.v-switch .v-label{
  color: #0AFD01 !important;
  font-size: 18px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: bold;
}
</style>

