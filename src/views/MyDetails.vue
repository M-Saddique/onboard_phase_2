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
                v-if="agreeButtonText == 'Successfully Updated'"
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
            <v-app-bar-nav-icon v-if="is_dlivrd_driver" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          </v-col>
          <v-col>
            <v-toolbar-title class="toolbarTitleStyle">Documents</v-toolbar-title>
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
                  <v-card-title style="text-align: center">{{name}}</v-card-title>
                </v-list-item>
                <!--              <v-list-item prepend-icon="mdi-account-cog-outline" title="Settings" value="settings" @click="openSettings"></v-list-item>-->
                <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-app-bar>
        <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>
        <v-main>
          <v-row class="mainBlockStyle">
            <!-- My Details-->
            <v-col md="12" sm="12" class="centerAlignContent" >
              <v-row style="justify-content: center">

                <!-- Insurance Card -->
<!--                <v-col cols="12" md="4" sm="12" class="alignFileInput">
                  <v-card-title class="centerText">Insurance Card</v-card-title>
                  <div
                      ref="insuranceCardFileInput"
                      class="imagePreviewBlock"
                  >
&lt;!&ndash;                    <div v-if="insuranceCardImage == null" class="addLicImgBLock" @click="selectInsuranceCardImage(insuranceCardImage,false)"></div>&ndash;&gt;
&lt;!&ndash;                    <v-img style="z-index: -10;" aspect-ratio="16/9" src=uploadImage></v-img>&ndash;&gt;
                    <v-img
                        :src=insuranceCardImage
                        :lazy-src='insuranceCardImage'
                        class="bg-grey-lighten-2 imagePreviewWrapper"
                        @click="selectInsuranceCardImage(insuranceCardImageFile,false)"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0 loaderPlacement">
                          <v-img v-if="!insuranceCardImageFile" :src="lazy_load_insurance" ></v-img>
                          <v-progress-circular
                              v-if="loadingInsurance"
                              indeterminate
                              color="#000000"
                              style="position: absolute"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                    <v-badge icon="mdi-close" v-if="insuranceCardImageFile != null" class="badgeStyle" @click="selectInsuranceCardImage(insuranceCardImageFile,true)" ></v-badge>
                  </div>
                  <v-file-input
                      ref="insuranceCardFileInput"
                      type="file"
                      accept="image/*"
                      v-model="fileInsurance"
                      @emptied="fileInsurance = null"
                      @input="pickInsuranceCardFile"
                      style="display: none"
                  ></v-file-input>
                </v-col>-->
<!--                Lisence Card front-->
                <v-col cols="12" md="4" sm="12" class="alignFileInput">
                  <v-card-title class="centerText">License Front Image</v-card-title>
                  <div
                      ref="fileInput"
                      class="imagePreviewBlock"
                  >
                    <v-img
                        :src=previewImage
                        :lazy-src='previewImage'
                        class="bg-grey-lighten-2 imagePreviewWrapper"
                        @click="selectLicenseFrontImage(previewImagefrontfile,false)"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0 loaderPlacement">
                          <v-img v-if="!previewImagefrontfile" :src="lazy_load" ></v-img>
                          <v-progress-circular
                              v-if="loadingFrontImage"
                              indeterminate
                              color="#000000"
                              style="position: absolute"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                    <v-badge icon="mdi-close" v-if="previewImagefrontfile != null" class="badgeStyle" @click="selectLicenseFrontImage(previewImagefrontfile,true)" ></v-badge>
                  </div>

                  <v-file-input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      v-model="file"
                      @emptied="file = null"
                      @input="pickLicenceFrontFile"
                      style="display: none"
                  ></v-file-input>
                </v-col>
<!--                Lisence Card back-->

                <v-col cols="12" md="4" sm="12" class="alignFileInput">
                  <v-card-title class="centerText">License Back Image</v-card-title>
                  <div
                      ref="fileInputBack"
                      class="imagePreviewBlock"
                  >
                    <v-img
                        :src=previewBackImage
                        :lazy-src='previewBackImage'
                        class="bg-grey-lighten-2 imagePreviewWrapper"
                        @click="selectLicenseBackImage(previewImageBackfile,false)"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0 loaderPlacement">
                          <v-img v-if="!previewImageBackfile" :src="lazy_load_back" ></v-img>
                          <v-progress-circular
                              v-if="loadingBackImage"
                              indeterminate
                              color="#000000"
                              style="position: absolute"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                    <v-badge icon="mdi-close" v-if="previewImageBackfile != null" class="badgeStyle" @click="selectLicenseBackImage(previewImageBackfile,true)" ></v-badge>
                  </div>
                  <v-file-input
                      ref="fileInputBack"
                      type="file"
                      accept="image/*"
                      v-model="fileBack"
                      @emptied="fileBack = null"
                      @input="pickLicenceBackFile"
                      style="display: none"
                  ></v-file-input>
                </v-col>
                <!-- Vehicle Registration -->
                <v-col cols="12" md="4" sm="12" class="alignFileInput">
                  <v-card-title class="centerText">Vehicle Registration</v-card-title>
                  <div
                      ref="vehicleRegistrationfileInput"
                      class="imagePreviewBlock"
                  >
                    <v-img
                        :src=vehicleRegistrationImage
                        :lazy-src='vehicleRegistrationImage'
                        class="bg-grey-lighten-2 imagePreviewWrapper"
                        @click="selectRegistrationImage(vehicleRegistrationImageFile,false)"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0 loaderPlacement">
                          <v-img v-if="!vehicleRegistrationImageFile" :src="lazy_load_registration" ></v-img>
                          <v-progress-circular
                              v-if="loadingRegistration"
                              indeterminate
                              color="#000000"
                              style="position: absolute"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                    <v-badge icon="mdi-close" v-if="vehicleRegistrationImageFile != null" class="badgeStyle" @click="selectRegistrationImage(vehicleRegistrationImageFile,true)" ></v-badge>
                  </div>
                  <v-file-input
                      ref="vehicleRegistrationfileInput"
                      type="file"
                      accept="image/*"
                      v-model="fileRegistration"
                      @emptied="fileRegistration = null"
                      @input="pickRegistrationFile"
                      style="display: none"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-card-text v-if="warning" class="warningMessage" v-html="detailsWarning"></v-card-text>
              <atom-spinner v-if="uploadingDetails" :animation-duration="1000" :size="90" color="#0AFD01" class="loading_bar" />
              <v-btn
                  v-else
                  prepend-icon="mdi-content-save-check"
                  class="dialogBoxGreenColor uploadBtn"
                  variant="text"
                  :disabled=checkButton
                  @click="uploadDetailsData"
              >
                save
              </v-btn>
            </v-col>
          </v-row>
        </v-main>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { AtomSpinner } from 'epic-spinners'
import NavigationDrawer from '../components/NavigationDrawer.vue'
import axios from "axios";
import uploadImage from '../assets/Upload.svg';
import imgUpload from "../assets/Upload.svg";
import englishImg from "../assets/english.png";
import spanishImg from "../assets/spanish.png";


import loader from "../assets/DlivrdLogo.gif";


export default {
  components: {
    AtomSpinner,
    NavigationDrawer,
  },
  data () {
    return {
      is_dlivrd_driver: false,
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      loader: loader,
      english: englishImg,
      spanish: spanishImg,
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
      licImgError: false,
      licImgMessage: null,
      license: false,
      licenseFrontImage: null,
      licenseBackImage: null,
      licenseImage: null,

      drawer: false,
      alert_title: '',
      alert_description: '',
      dialog: false,
      errorMessage: false,
      showError: false,
      agreeButtonText: null,
      cancelButtonText: null,
      username: "",
      loggedInUserEmail: "",
      loading: true,
      detailsWarning: null,
      warning: false,
      //Variables for Image files
      vehicleRegistrationImage: null,
      insuranceCardImage: null,
      lazy_load_registration: '',
      lazy_load_insurance: '',
      loadView: false,
      vehicleRegistrationImageFile: null,
      insuranceCardImageFile: null,
      loadingRegistration: true,
      loadingInsurance: true,
      fileRegistration: null,
      fileInsurance: null,
      uploadingDetails: false,
      checkButton: true,
      name: "",
      validationFailed: false,
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
    logoutOnboarding(){
      var url =this.baseurl + 'onboard_logout'
      var data = {
        identity: this.loggedInUserEmail,
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
    selectRegistrationImage(reference,badge_click) {
      if(badge_click == false && reference == null){
        this.$refs.vehicleRegistrationfileInput.click()
      }
      else if(badge_click == true){
        this.warning = true
        this.detailsWarning = "*Acceptable Image Format: JPG, PNG."
        this.vehicleRegistrationImage = null
        this.vehicleRegistrationImageFile = null;
        this.lazy_load_registration = uploadImage;
        this.fileRegistration = null;
        if(this.previewImagefrontfile == null && this.previewImageBackfile == null)
          this.checkButton = true
      }
    },
    pickRegistrationFile(e) {
      this.vehicleRegistrationImageFile = e.target.files[0];
      this.lazy_load_registration = '';
      this.checkButton = false;
      if(this.previewImagefrontfile != null && this.previewImageBackfile != null){
        this.warning = false;
      }
      let input = this.$refs.vehicleRegistrationfileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.vehicleRegistrationImage = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
    },
    selectInsuranceCardImage(reference,badge_click) {
      if(badge_click == false && reference == null){
        this.$refs.insuranceCardFileInput.click()
      }else if(badge_click == true){
        this.warning = true
        this.detailsWarning = "*Acceptable Image Format: JPG, PNG."
        this.insuranceCardImage = null;
        this.insuranceCardImageFile = null;
        this.lazy_load_insurance = uploadImage;
        this.fileInsurance = null;
        if(this.vehicleRegistrationImageFile==null){
          this.checkButton = true;
        }
      }
    },
    pickInsuranceCardFile(e) {
      this.insuranceCardImageFile = e.target.files[0]
      this.lazy_load_insurance = ''
      this.checkButton = false;
      this.warning = false;
      let input = this.$refs.insuranceCardFileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.insuranceCardImage = e.target.result
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
    },
    uploadDetailsData() {
      this.uploadingDetails = true;
      var url = this.baseurl + 'update_rider_details_insurance_selfie_reg';
      var data = new FormData();
      if(this.fleet_id != null){
        data.append("fleet_id", this.fleet_id)
      }
      data.append('identity', this.username);
      if((typeof(this.vehicleRegistrationImageFile) != 'string') && (this.vehicleRegistrationImageFile != null)){
        data.append('vehicle_registration', this.vehicleRegistrationImageFile);
      }
      if((typeof(this.previewImagefrontfile) != 'string') && (this.previewImagefrontfile != null)){
        data.append('license_front', this.previewImagefrontfile);
      }
      if((typeof(this.previewImageBackfile) != 'string') && (this.previewImageBackfile != null)){
        data.append('license_back', this.previewImageBackfile);
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
        this.uploadingDetails = false;
        console.log(response)
          this.uploadingData = false;
          if(response.data['Success']){
            this.dialog = true;
            this.alert_title = "Success";
            this.alert_description = "Images successfully updated."
            this.agreeButtonText = 'Successfully Updated'
          }
          else{
            this.dialog = true;
            this.alert_title = "Update Failed";
            if(response.data['license_front']){
              this.alert_description = response.data['license_front'];
            }
            else if(response.data['license_back']){
              this.alert_description = response.data['license_back'];
            }
            else if(response.data['vehicle_registration']){
              this.alert_description = "Vehicle registration " + response.data['vehicle_registration'];
            }
            else if(response.data['Failure'] == 'Session Expired. Please login again.'){
              this.$router.push('/')
            }
            else{
              this.alert_description = response.data['Failure'];
            }
            this.agreeButtonText = 'Okay'
          }
      }).catch( (e) => {
        this.dialog = true;
        this.alert_title = "Warning";
        this.alert_description = "Your session has expired. Please Login Again"
        this.agreeButtonText = "logout"
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
            if(verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true){
              this.validationFailed = false;
            }
            else{
              this.validationFailed = true;
            }
            this.loadView = true;
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image']
            this.getDetailsImages();
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
    getDetailsImages(){
      var url = this.baseurl + 'get_rider_details_insurance_selfie_reg';
      var data = {
        identity: this.username
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url ,data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
        console.log("Respopnse")
        console.log(response)
        if(response.data['Success']){
          if(response.data['urls']['vehicle_registration_image_url'] == "image not found"){
            this.vehicleRegistrationImageFile = null;
            this.vehicleRegistrationImage = uploadImage
          }
          else{
            this.vehicleRegistrationImageFile = this.baseImageurl + response.data['urls']['vehicle_registration_image_url'];
            this.vehicleRegistrationImage = this.vehicleRegistrationImageFile;
          }
          if(response.data['urls']['license_front_url'] == "image not found"){
            this.previewImagefrontfile = null;
            this.previewImage = imgUpload;
          }
          else{
            this.previewImagefrontfile = this.baseImageurl + response.data['urls']['license_front_url'];
            this.previewImage = this.previewImagefrontfile;
          }
          // Get License Back Image
          if(response.data['urls']['license_back_url'] == "image not found"){
            this.previewImageBackfile = null;
            this.previewBackImage = imgUpload;
          }
          else{
            this.previewImageBackfile = this.baseImageurl + response.data['urls']['license_back_url'];
            this.previewBackImage = this.previewImageBackfile;
          }
          // if(response.data['urls']['insurance_image_url'] == "image not found"){
          //   this.insuranceCardImageFile = null
          //   this.insuranceCardImage = uploadImage;
          // }
          // else{
          //   this.insuranceCardImageFile = this.baseImageurl + response.data['urls']['insurance_image_url'];
          //   this.insuranceCardImage = this.insuranceCardImageFile;
          //   this.checkButton = false;
          // }
          if(this.previewImagefrontfile == null || this.previewImageBackfile == null || this.vehicleRegistrationImageFile == null){
            this.warning = true
            this.detailsWarning = "*Acceptable Image Format: JPG, PNG."
          }
          this.loadingRegistration = false;
          this.loadingBackImage = false;
          this.loadingFrontImage = false;
          this.loadingInsurance = false;
          this.lazy_load_registration = '';
          this.lazy_load_insurance = '';
        }
      }).catch( (e) => {
        console.log(e);
        // this.clearFields();
        // this.$router.push('/')
      })
    },
    closeDrawer(){
      this.drawer = false;
    },
    selectLicenseFrontImage(reference,badge_click) {
      if(badge_click == false && reference == null){
        this.$refs.fileInput.click()
      }
      else if(badge_click == true){
        this.warning = true
        if(this.vehicleRegistrationImageFile == null && this.previewImageBackfile == null)
          this.checkButton = true
        this.detailsWarning = "*Acceptable Image Format: JPG, PNG."
        this.previewImage = null;
        this.previewImagefrontfile = null;
        this.lazy_load = imgUpload;
        this.file = null;
        if(this.previewBackImage == null){
          this.progressValue = 0;
        }
        else{
          this.progressValue = 50;
        }
      }
    },
    selectLicenseBackImage(reference,badge_click) {
      if(badge_click == false && reference == null){
        this.$refs.fileInputBack.click()
      }
      else if(badge_click == true){
        if(this.vehicleRegistrationImageFile == null && this.previewImagefrontfile == null)
          this.checkButton = true
        this.warning = true
        this.detailsWarning = "*Acceptable Image Format: JPG, PNG."
        this.previewBackImage = null;
        this.previewImageBackfile = null;
        this.lazy_load_back = imgUpload;
        this.fileBack = null;
        if(this.previewImage == null){
          this.progressValue = 0;
        }
        else{
          this.progressValue = 50;
        }
      }
    },
    pickLicenceFrontFile(e) {
      this.previewImagefrontfile = e.target.files[0]
      this.checkButton = false;
      this.lazy_load = ''
      if(this.vehicleRegistrationImageFile != null && this.previewImageBackfile != null){
        this.warning = false;
      }
      this.licImgError = false;
      let input = this.$refs.fileInput
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.previewImage = e.target.result
          if(this.previewBackImage == null){
            this.progressValue = 50
          }
          else{
            this.progressValue = 100
          }
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
    },
    pickLicenceBackFile(e) {
      this.previewImageBackfile = e.target.files[0]
      this.checkButton = false;
      this.lazy_load_back = ''
      if(this.vehicleRegistrationImageFile != null && this.previewImagefrontfile != null){
        this.warning = false;
      }
      this.licImgError = false;
      let input = this.$refs.fileInputBack
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.previewBackImage = e.target.result
          if(this.previewImage == null){
            this.progressValue = 50
          }
          else{
            this.progressValue = 100
          }
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
    },
    licenseImagesUploaded(){
      if(this.previewImagefrontfile || this.previewImageBackfile){
        this.btnColor = '#0afd01'
        this.licImgIcon = 'mdi-check'
      }
      else{
        this.btnColor = '#eeeeee';
        this.licImgIcon = "mdi-upload";
      }
      this.licImgError = false;
      this.licImgMessage = null;
      this.licImg = false;
      this.showddDetailsWarning = false;
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
.mainBlockStyle{
  width: 100%;
  height: 100%;
  margin-top: 0px !important;
  padding-top: 30px !important;
}
.mainContainerView{
  text-align:-webkit-center;
}
@media (max-width: 800px){
  .mainBlockStyle{
    width: 100%;
    height: 100%;
    padding-top: 0 !important;
    padding-bottom: 100px !important;
  }
  .imagePreviewBlock {
    width: auto !important;
    height: 24vh !important;
  }
}
.accountIcon{
  background-color: white;
  border-radius: 50%;
}
.centerAlignContent{
  justify-content: center;
}
.warningMessage{
  color:red;
  padding-top: 30px;
}
.imagePreviewBlock {
  width: 29vw;
  height: 39vh;
  display: block;
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 20px;
  border: 1px solid #0AFD01;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.uploadBtn{
  margin-top: 20px;
}
</style>

