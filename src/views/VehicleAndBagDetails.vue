<template>
<!--  <v-card v-if="!loadView" style="background-color: #ffffff;width: 100vw;height: 100vh;">-->
<!--    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>-->
<!--  </v-card>-->
  <v-card
      color="grey-lighten-4"
      flat
      style="min-height: 100vh; text-align: -moz-center"
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
                @click="btnOkayClick"
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
            <v-app-bar-nav-icon v-if="is_dlivrd_driver" variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          </v-col>
          <v-col>
            <v-toolbar-title class="toolbarTitleStyle">Vehicle Details</v-toolbar-title>
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
        <v-main class="mainViewStyle">
          <v-row v-if="processingDetails" style="position: fixed;width: 100vw;background-color: transparent; z-index:10;">
            <v-col style="width: 100vw; height: 100vh;text-align: center;">
              <atom-spinner :animation-duration="1000" :size="130" color="#ffffff" class="loading_bar" />
            </v-col>
          </v-row>
          <v-col class="screenView">
            <v-col class="pageHeading">
              <v-card-title class="fontSize">Add Vehicle Details</v-card-title>
            </v-col>
            <v-row class="centerAlignContent">
              <v-col style="padding-bottom: 0" cols="12" md="3" sm="10">
                <v-select
                    clearable
                    open-on-clear
                    v-model="vehicleMake"
                    id="make_id"
                    :items=make
                    label="Make"
                    variant="solo"
                    placeholder="Select Manufacturer"
                    hide-details>
                </v-select>
              </v-col>
              <v-col style="padding-bottom: 0" cols="12" md="3" sm="10">
                <v-select
                    clearable
                    open-on-clear
                    v-model="vehicleModel"
                    :items=model
                    :disabled="disableModel"
                    id="make_id"
                    label="Model"
                    variant="solo"
                    placeholder="Select Model"
                    hide-details>
                </v-select>
                <v-text-field v-model="customModel" v-if="vehicleModel == addCustomText"
                              style="margin-top: 20px; margin-bottom: -50px" variant="solo" placeholder="Enter Model"/>
              </v-col>
              <v-col style="padding-bottom: 0" cols="12" md="3" sm="10">
                <v-select
                    clearable
                    open-on-clear
                    v-model="vehicleYear"
                    :items=year
                    :disabled="disableYear"
                    id="make_id"
                    label="Year"
                    variant="solo"
                    placeholder="Select Year"
                    hide-details
                >
                </v-select>
                <v-text-field v-model="customYear" v-if="vehicleModel == addCustomText || vehicleYear == addCustomText"
                              style="margin-top: 20px; margin-bottom: -50px" variant="solo" placeholder="Enter Year"/>
              </v-col>
            </v-row>
            <v-row class="centerAlignContent">
              <v-col style="padding-top: 0" cols="12" md="3" sm="10">
                <v-select
                    clearable
                    open-on-clear
                    v-model="vehicleType"
                    :items=type
                    id="make_id"
                    label="Type"
                    variant="solo"
                    placeholder="Select Car Type"
                    hide-details
                >
                </v-select>
              </v-col>
              <v-col style="padding-top: 0" cols="12" md="3" sm="10">
                <v-text-field clearable class="registration" label="Registration Number" v-model="vehicleRegistration" style="margin-bottom: -20px" variant="solo" placeholder="Enter Registration Number"/>
              </v-col>
            </v-row>
            <v-col class="mainColView">
              <v-col class="bagsBlockView">
                <!-- Catering Bags -->
                <v-card-title class="fontSize">Do you have catering bags?</v-card-title>
                <v-radio-group
                    inline
                    v-model="cateringBags"
                    hide-details
                    class="radioBtns"
                >
                  <v-radio style="color: black" label="Yes" :value=true ></v-radio>
                  <v-radio style="color: black" label="No" :value=false ></v-radio>
                </v-radio-group>
                <!-- Cart -->
                <v-card-title class="fontSize">Do you have a cart?</v-card-title>
                <v-radio-group
                    inline
                    v-model="cart"
                    hide-details
                    class="radioBtns"
                >
                  <v-radio style="color: black" label="Yes" :value=true ></v-radio>
                  <v-radio style="color: black" label="No" :value=false ></v-radio>
                </v-radio-group>
                <!-- Number of Catering bags and image-->
                <v-col v-if="cateringBags" class="bagsDetailView">
                  <!-- Number of bags -->
                  <v-card-title class="fontSize">Number of catering bags?</v-card-title>
                  <v-select
                      v-model="numberOfBags"
                      :items="quantityOfBags"
                      box
                      placeholder="Quantity of Bags"
                      hide-details
                      bg-color="#ffffff"
                      class="selectFieldBagsQuantity"
                  >
                  </v-select>
                  <!-- Image of Catering Bags -->
                  <v-col cols="12" md="5" sm="12" class="alignFileInput">
                    <v-card-title class="fontSize">Image of Catering Bags</v-card-title>
                    <v-card-text class="note">*You can upload a maximum of 12 images.</v-card-text>
                    <v-card-text class="note" style="margin-bottom: 20px">*Acceptable Image Format: JPG, PNG.</v-card-text>
                    <div class="bagsImagesMainBlock">
                      <div
                          v-for="(item, index) in bagsImagesList"
                          :key=index
                          class="imagePreviewBlockBags"
                          style="background-color: white"
                      >
                        <v-img
                            :src=item
                            :lazy-src='item'
                            class="bg-grey-lighten-2 imagePreviewWrapperBags"
                        >
                          <!-- <template v-slot:placeholder>-->
                          <!--  <v-row class="fill-height ma-0 loaderPlacement">-->
                          <!--   <v-img v-if="!bagsImageFile" :src="lazy_load_bags_image" ></v-img>-->
                          <!--   <v-progress-circular-->
                          <!--      v-if="loadingBagsImage"-->
                          <!--      indeterminate-->
                          <!--      color="#000000"-->
                          <!--      style="position: absolute"-->
                          <!--   ></v-progress-circular>-->
                          <!--  </v-row>-->
                          <!-- </template>-->
                        </v-img>
                        <v-badge icon="mdi-close" class="badgeStyle" @click="removeBagsImage(index,item)" ></v-badge>
                      </div>

                      <!--Add New Image-->
                      <div
                          v-if="addNewBagsImage"
                          ref="bagsFileInput"
                          class="imagePreviewBlockBags"
                          style="background-color: white"
                      >
                        <v-img
                            :src=uploadImageDefault
                            :lazy-src='uploadImageDefault'
                            class="bg-grey-lighten-2 imagePreviewWrapperBags"
                            @click="selectBagsImage()"
                        >
                        </v-img>
                      </div>
                    </div>

                    <v-file-input
                        ref="bagsFileInputData"
                        type="file"
                        accept="image/*"
                        v-model="fileBags"
                        @emptied="fileBags = null"
                        @input="pickBagsFile"
                        style="display: none"
                    ></v-file-input>
                  </v-col>
                </v-col>
                <!-- Image of Cart-->
                <v-col v-if="cart" class="bagsDetailView">
                  <v-col cols="12" md="5" sm="12" class="alignFileInput">
                    <v-card-title class="fontSize">Image of Cart</v-card-title>
                    <v-card-text class="note">*You can upload maximum of 2 cart images.</v-card-text>
                    <v-card-text class="note" style="padding-bottom: 20px !important;">*Acceptable Image Format: JPG, PNG.</v-card-text>
                    <!-- Cart First Image -->
                    <div
                        v-if="cartImage1"
                        class="imagePreviewBlock"
                        style="background-color: white"
                    >
                      <v-img
                          :src=cartImage
                          :lazy-src='cartImage'
                          class="bg-grey-lighten-2 imagePreviewWrapper"
                      >
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0 loaderPlacement">
                            <v-img v-if="!cartImageFile" :src="lazy_load_cart_image" ></v-img>
                            <v-progress-circular
                                v-if="loadingCartImage"
                                indeterminate
                                color="#000000"
                                style="position: absolute"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                      <v-badge icon="mdi-close" v-if="cartImageFile != null" class="badgeStyle" @click="removeCartImage('1',cartImageFile,true)" ></v-badge>
                    </div>
                    <!-- Cart Second Image -->
                    <div
                        v-if="cartImage2"
                        class="imagePreviewBlock"
                        style="background-color: white"
                    >
                      <v-img
                          :src=cartImageSecond
                          :lazy-src='cartImageSecond'
                          class="bg-grey-lighten-2 imagePreviewWrapper"
                      >
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0 loaderPlacement">
                            <v-img v-if="!cartImageFile2" :src="lazy_load_cart_image" ></v-img>
                            <v-progress-circular
                                v-if="loadingCartImage"
                                indeterminate
                                color="#000000"
                                style="position: absolute"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                      <v-badge icon="mdi-close" v-if="cartImageFile2 != null" class="badgeStyle" @click="removeCartImage(2,cartImageFile2,true)" ></v-badge>
                    </div>
                    <!-- No Current Cart Image -->
                    <div
                        v-if="!cartImage2"
                        ref="cartFileInput"
                        class="imagePreviewBlock"
                        style="background-color: white"
                    >
                      <v-img
                          :src=uploadImageDefault
                          :lazy-src='uploadImageDefault'
                          class="bg-grey-lighten-2 imagePreviewWrapper"
                          @click="selectCartImage()"
                      >
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0 loaderPlacement">
                            <v-img v-if="!cartImageFile" :src="lazy_load_cart_image" ></v-img>
                            <v-progress-circular
                                v-if="loadingCartImage"
                                indeterminate
                                color="#000000"
                                style="position: absolute"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </div>

                    <v-file-input
                        ref="cartFileInputdata"
                        type="file"
                        accept="image/*"
                        v-model="fileCart"
                        @emptied="fileCart = null"
                        @input="pickCartFile"
                        style="display: none"
                    ></v-file-input>
                  </v-col>
                </v-col>
                <v-col class="fileUploadBlockContainer">
                  <v-card-text v-if="showBagsWarning" class="note" v-html="bagsDetails"></v-card-text>
                  <v-card-text v-if="showVehicleWarning" class="note" v-html="requiredWarning"></v-card-text>
                  <v-btn
                      prepend-icon="mdi-check"
                      class="buttonView2"
                      variant="text"
                      :disabled="buttonAction"
                      @click="saveVehicleAndBagDetails"
                  >
                    Save
                  </v-btn>
                </v-col>
              </v-col>
            </v-col>
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
import uploadImage from '../assets/Upload.png';
import englishImg from '../assets/english.png'
import spanishImg from '../assets/spanish.png'
import loader from "../assets/DlivrdLogo.gif";
import Api from '../config/index'


export default {
  components: {
    AtomSpinner,
    NavigationDrawer
  },
  data () {
    return {
      is_dlivrd_driver: false,
      loader: loader,
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
      quantityOfBags: ['1','2','3','4','5','6','7','8','9','10','10+'],
      make: [],
      model: [],
      year: [],
      type:['Car', 'SUV', 'Truck', 'Mini Van'],
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
      detailsOfVehicle: false,
      vehicleType: null,
      vehicleRegistration: null,
      vehicleMake: null,
      vehicleModel: null,
      vehicleYear: null,
      cateringBags: null,
      cart: null,
      numberOfBags: 0,
      imgCateringBags: null,
      requiredWarning: "",
      bagsDetails: null,
      showBagsWarning: false,
      showVehicleWarning: false,
      processingDetails: false,
      buttonAction: false,
      loadView: false,
      checkServerData: false,
      uploadImageDefault: uploadImage,
      // Bags Image
      bagsImage: null,
      bagsImageFile: null,
      lazy_load_bags_image: '',
      loadingBagsImage: true,
      fileBags: null,
      bagsImagesList: [],
      existingBagImages: [],
      removedBagsImages: [],
      bagsImageFileList: [],
      NumberOfBagsImages: 0,
      addNewBagsImage: true,
      // Cart Image
      cartImage: null,
      cartImageSecond: null,
      cartImageFile: null,
      cartImageFile2: null,
      cartImage1: false,
      cartImage2: false,
      cartImagesArray: [],
      existingCartImages: [],
      removedCartImages: [],

      lazy_load_cart_image: '',
      loadingCartImage: true,
      fileCart: null,
      name: "",
      disableModel: true,
      disableYear: true,
      validationFailed: false,

      addCustomText:  "Other...",
      customYear: null,
      customModel: null,
      checkWorking: true,
      fleet_id: null,
    }
  },
  beforeMount() {
    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
  },
  mounted() {
    this.sessionValidator();
    this.is_dlivrd_driver = localStorage.getItem('is_dlivrd_driver') == 'true'
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
  },
  watch: {
    vehicleMake(){
      if(!this.checkServerData){
        this.setModel()
      }
    },
    vehicleModel(){
      if(!this.checkServerData){
        this.setVehicleYear()
      }
    },
    cateringBags(){
      this.checkCateringBags();
    }
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
    btnOkayClick(){
      if(this.alert_title == "Update Successful") {
        this.$router.push('/checklist')
      }
      this.dialog = false
    },
    loadVehicleData(){
      var data = {
        identity: this.username
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('get_make_model_year', data).then((response) => {
        if(response.data['Success']){
          this.make = response.data['makes']
        }
      }).catch( () => {
        this.alert_title = "Warning";
        this.alert_description = "Session Expired. Please Login again.";
        this.alert_error = null;
        this.dialog = true;
        this.agreeButtonText = "logout";
      })
    },
    setModel(){
      if(this.vehicleMake == null){
        this.vehicleModel = null;
        this.vehicleYear = null;
        this.model=[]
        this.year = []
        this.disableModel = true;
        this.disableYear = true;
        return
      }
      else{
        this.vehicleModel = null;
        this.vehicleYear = null;
        this.model=[]
        this.year = []
        var data = {
          identity: this.username,
          make: this.vehicleMake
        }
        if(this.fleet_id != null){
          data["fleet_id"] = this.fleet_id
        }
        Api.post('get_make_model_year', data).then((response) => {
          if(this.vehicleMake == null){
            return
          }
          else{
            this.disableModel = false;
            this.model = response.data['models']
            this.model.push( this.addCustomText)
          }
        }).catch( () => {
          this.clearFields();
          this.$router.push('/')
        })
      }
    },
    setVehicleYear(){
      if(this.vehicleModel ==  this.addCustomText){
        this.disableYear = true
        return;
      }
      this.disableYear = false
      if(this.vehicleModel == null){
        this.vehicleYear = null;
        this.year = [];
        this.disableYear = true;
        return
      }
      else{
        this.vehicleYear = null;
        this.year = [];
        var data = {
          identity: this.username,
          make: this.vehicleMake,
          model: this.vehicleModel
        }
        if(this.fleet_id != null){
          data["fleet_id"] = this.fleet_id
        }
        Api.post('get_make_model_year', data).then((response) => {
          if(this.vehicleModel == null){
            return
          }
          else{
            this.disableYear = false;
            this.year = response.data['years']
            this.year.push(this.addCustomText)
          }

        }).catch( () => {
          this.clearFields();
          this.$router.push('/')
        })
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
        this.clearFields();
        this.$router.push('/');
      })
    },
    saveVehicleAndBagDetails(){
      if(this.vehicleModel ==  this.addCustomText){
        this.vehicleYear = this.customYear
      }
      this.showVehicleWarning = false;
      this.showBagsWarning = false;
      if (this.vehicleMake == null) {
        this.requiredWarning = "*Please select the vehicle manufacturer."
        this.showVehicleWarning = true
        return
      }
      else if (this.vehicleRegistration == null) {
        this.requiredWarning = "*Please enter the vehicle registration number."
        this.showVehicleWarning = true
        return
      }
      else if (this.vehicleType == null) {
        this.requiredWarning = "*Please select the vehicle type."
        this.showVehicleWarning = true
        return
      }
      else if (this.vehicleModel == null) {
        this.requiredWarning = "*Please select the vehicle model."
        this.showVehicleWarning = true
        return
      }
      else if (this.vehicleModel ==  this.addCustomText && (this.customModel == null || this.customModel == '')) {
        this.requiredWarning = "*Please enter the vehicle model."
        this.showVehicleWarning = true
        return
      }
      else if (this.vehicleYear == null && this.vehicleModel !=  this.addCustomText) {
        this.requiredWarning = "*Please select the vehicle make year."
        this.showVehicleWarning = true
        return
      }
      else if (this.vehicleModel ==  this.addCustomText && (this.vehicleYear == null || this.vehicleYear == '')) {
        this.requiredWarning = "*Please enter the vehicle make year."
        this.showVehicleWarning = true
        return
      }
      else if (this.vehicleYear ==  this.addCustomText && (this.customYear == null || this.customYear == '')) {
        this.requiredWarning = "*Please enter the vehicle make year."
        this.showVehicleWarning = true
        return
      }
      else if (this.cateringBags == null) {
        this.bagsDetails = "*Please select an option for catering bags"
        this.showBagsWarning = true
        return
      }
      else if (this.cart == null) {
        this.bagsDetails = "*Please select an option for cart"
        this.showBagsWarning = true
        return
      }
      else if (this.cateringBags && this.bagsImageFileList.length < 1) {
        this.bagsDetails = "*Please provide images for your catering bag(s)"
        this.showBagsWarning = true
        return
      }
      else if (this.cart && this.cartImagesArray.length < 1) {
        this.bagsDetails = "*Please provide images for your cart"
        this.showBagsWarning = true
        return
      }
      this.processingDetails = true;
      this.buttonAction = true;

      var data = new FormData();
      data.append('identity', this.username);
      data.append('vehicle_make', this.vehicleMake);
      if(this.fleet_id != null){
        data.append('fleet_id', this.fleet_id)
      }
      if(this.vehicleModel ==  this.addCustomText){
        data.append('vehicle_model', this.customModel);
      }
      else{
        data.append('vehicle_model', this.vehicleModel);
      }
      if(this.vehicleYear ==  this.addCustomText){
        data.append('vehicle_year', this.customYear);
      }
      else{
        data.append('vehicle_year', this.vehicleYear);
      }
      data.append('has_catering_bags', this.cateringBags);
      data.append('has_cart', this.cart);
      data.append('number_of_bags', this.numberOfBags);
      // data.append('bag_image', this.bagsImageFile);
      // data.append('cart_image', this.cartImageFile);
      data.append('bag_image_remove_list', this.removedBagsImages);
      data.append('cart_image_remove_list', this.removedCartImages);
      data.append('registration_number', this.vehicleRegistration);
      data.append('vehicle_type', this.vehicleType);
      for(var i = 0; i < this.bagsImageFileList.length; i++){
        data.append('bag_image_'+i, this.bagsImageFileList[i])
      }

      for(var i = 0; i < this.cartImagesArray.length; i++){
        data.append('cart_image_'+i, this.cartImagesArray[i])
      }
      Api.post('update_rider_vehicle_bag_details', data).then((response) => {
        console.log("Save vehicle and Bag Details API response")
        console.log(response)
        this.processingDetails = false;
        this.buttonAction = false;
        if(response.data['Success']){
          this.alert_title = "Update Successful";
          this.alert_description = "dlivrd Driver vehicle and bag details updated.";
          this.dialog = true;
          this.agreeButtonText = "Okay";
          this.cartImagesArray = []
          this.removedCartImages = [];
        }
        else{
          if(response.data['Failure'] == 'Session Expired. Please login again.'){
            this.clearFields();
            this.$router.push('/')
          }
          else {
            this.dialog = true;
            this.alert_title = "Update Failed";
            if (response.data['bag_image']) {
              this.alert_description = response.data['bag_image'];
            }
            else {
              this.alert_description = "Vehicle and bag details not updated. Try Again!";
            }
            this.agreeButtonText = 'Okay'
          }
        }
      }).catch(() => {
        this.clearFields();
        this.$router.push('/');
      })
    },
    sessionValidator(){
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('onboard_verifySession', data).then((response) => {
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
            this.userProfileImage = this.baseImageurl + verifySession['profile_image']
            this.getUserVehicleAndBagDetails();
            this.loadVehicleData();
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
    getUserVehicleAndBagDetails(){
      var data = {
        identity: this.username
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('get_rider_vehicle_and_bag_details', data).then((response) => {
        console.log("Get vehicle and Bag Details Response")
        console.log(response)
        if(response.data['Success']){
          this.checkServerData = true
          this.vehicleMake = response.data['vehicle_details']['make']
          this.vehicleModel = response.data['vehicle_details']['model']
          this.vehicleYear = response.data['vehicle_details']['year']
          this.vehicleRegistration = response.data['registration_number']
          this.vehicleType = response.data['vehicle_type']
          if(this.vehicleType == '')
            this.vehicleType = null
          this.numberOfBags = response.data['number_of_bags']
          this.model = response.data['models']
          this.model.push(this.addCustomText)
          this.year = response.data['years']
          this.year.push(this.addCustomText)
          this.disableModel = false;
          this.disableYear = false;
          if(response.data['has_cart'] == true){
            this.cart = true
          }
          else{
            this.cart = false
          }
          if(response.data['has_catering_bags'] == true){
            this.cateringBags = true
          }
          else{
            this.cateringBags = false
          }
          if(response.data['bag_image_url'] != []){
            for(var i = 0; i < response.data['bag_image_url'].length; i++){
              var imageBag = this.baseImageurl + response.data['bag_image_url'][i]
              this.bagsImagesList.push(imageBag)
              this.existingBagImages.push(response.data['bag_image_url'][i])
            }
            this.numberOfBagsImages = this.bagsImagesList.length;
            if(this.numberOfBagsImages == 12){
              this.addNewBagsImage = false
            }
          }
          else{
            this.bagsImageFile = null
            this.bagsImage = uploadImage
          }
          if(response.data['cart_image_url'][0] && response.data['cart_image_url'][1]){
            this.cartImageFile = this.baseImageurl + response.data['cart_image_url'][0]
            this.cartImage = this.cartImageFile
            this.cartImage1 = true
            this.cartImageFile2 = this.baseImageurl + response.data['cart_image_url'][1]
            this.cartImageSecond = this.cartImageFile2
            this.cartImage2 = true
            this.existingCartImages.push(response.data['cart_image_url'][0])
            this.existingCartImages.push(response.data['cart_image_url'][1])
          }
          else if(response.data['cart_image_url'][0]){
            this.cartImageFile = this.baseImageurl + response.data['cart_image_url'][0]
            this.cartImage = this.cartImageFile
            this.cartImage1 = true
            this.existingCartImages.push(response.data['cart_image_url'][0])
          }
          this.loadingBagsImage = false;
          this.loadingCartImage = false;
        }
        else{
          this.loadingBagsImage = false;
          this.loadingCartImage = false;
          this.bagsImage = uploadImage;
        }
      }).catch( () => {
        this.clearFields();
        this.$router.push('/')
      }).finally(() => {
        this.checkServerData = false;
      })
    },
    // Bags Image Handling Functions
    removeBagsImage(index, item){
      if(this.bagsImagesList.includes(item)){
        if(item.includes(this.baseImageurl)){
          var referenceSplit = item.split(this.baseImageurl)
          item = referenceSplit[1]
        }
        if(this.existingBagImages.includes(item)){
          this.bagsImagesList.splice(this.bagsImagesList.indexOf(item),1)
          this.removedBagsImages.push(item)
        }
        else{
          this.bagsImagesList.splice(this.bagsImagesList.indexOf(item),1)
          this.bagsImageFileList.splice(this.bagsImageFileList.indexOf(item),1)
        }
      }
      this.numberOfBagsImages -= 1
      if(this.numberOfBagsImages < 12){
        this.addNewBagsImage = true;
      }
    },
    selectBagsImage() {
      this.$refs.bagsFileInputData.click()
    },
    pickBagsFile(e) {
      this.bagsImageFile = e.target.files[0]
      this.lazy_load_bags_image = ''
      let input = this.$refs.bagsFileInputData
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.bagsImage = e.target.result
          this.bagsImagesList.push(this.bagsImage)
          this.bagsImageFileList.push(this.bagsImageFile)
        }
        reader.readAsDataURL(file[0])
        this.$emit('input', file[0])
      }
      this.numberOfBagsImages += 1;
      if(this.numberOfBagsImages == 12){
        this.addNewBagsImage = false;
      }
    },
    // Cart Image Handling Functions
    removeCartImage(imageNo,reference,badge_click){
      if(typeof reference == "string"){
        if(reference.includes(this.baseImageurl)){
          var referenceSplit = reference.split(this.baseImageurl)
          reference = referenceSplit[1]
        }
      }
      if(imageNo == 1 && badge_click == true){
        if(this.existingCartImages.includes(reference)){
          this.removedCartImages.push(reference)
        }
        if(this.cartImagesArray.includes(reference)){
          this.cartImagesArray.splice(this.cartImagesArray.indexOf(reference),1)
        }
        if(this.cartImageSecond != null){
          this.cartImage = this.cartImageSecond;
          this.cartImageFile = this.cartImageFile2;
          this.cartImageSecond = null;
          this.cartImageFile2 = null;
          this.cartImage2 = false;
        }
        else{
          this.cartImage = null;
          this.cartImageFile = null;
          this.lazy_load_cart_image = uploadImage;
          this.fileCart = null;
          this.cartImage1 = false
        }
      }
      else if(imageNo == 2 && badge_click == true){
        if(this.existingCartImages.includes(reference)){
          this.removedCartImages.push(reference)
        }
        if(this.cartImagesArray.includes(reference)){
          this.cartImagesArray.splice(this.cartImagesArray.indexOf(reference),1)
        }
        this.cartImageSecond = null;
        this.cartImageFile2 = null;
        this.lazy_load_cart_image = uploadImage;
        this.fileCart = null;
        this.cartImage2 = false
      }
    },
    selectCartImage() {
      this.$refs.cartFileInputdata.click()
    },
    pickCartFile(e) {
      if(this.cartImage1 == false){
        this.cartImageFile = e.target.files[0]
        this.lazy_load_cart_image = ''
        let input = this.$refs.cartFileInputdata
        let file = input.files
        if (file && file[0]) {
          let reader = new FileReader
          reader.onload = e => {
            this.cartImage = e.target.result
            this.cartImagesArray.push(this.cartImageFile)
          }
          reader.readAsDataURL(file[0])
          this.$emit('input', file[0])
        }
        this.cartImage1 = true;
      }
      else{
        this.cartImageFile2 = e.target.files[0]
        this.lazy_load_cart_image = ''
        let input = this.$refs.cartFileInputdata
        let file = input.files
        if (file && file[0]) {
          let reader = new FileReader
          reader.onload = e => {
            this.cartImageSecond = e.target.result
            this.cartImagesArray.push(this.cartImageFile2)
          }
          reader.readAsDataURL(file[0])
          this.$emit('input', file[0])
        }
        this.cartImage2 = true;
      }
    },
    checkCateringBags(){
      if( this.cateringBags == true){
        this.numberOfBags = 1;
      }
      else {
        this.numberOfBags = 0;
      }
    },
    closeDrawer(){
      this.drawer = false;
    },
  }
}
</script>
<style>
.registration .v-label{
  z-index: 1;
}
#make_id{
  opacity: 0 !important;
}
</style>
<style>
.bgImage{
  object-fit: contain;
  width: 80vw;
  position: fixed;
  top:40%;
  left: 7%;
  opacity: 0.1;
}
.screenView{
  margin-top: 40px !important;
}
.mainContainerView{
  text-align:-webkit-center;
}
.buttonView2{
  background-color: #ffffff !important;
  margin-top: 20px;
}
.pageHeading{
  text-align: -webkit-center;
  padding: 0 !important;
}
.note{
  padding: 0 !important;
/*padding-bottom: 20px !important;*/
  color: red;
}
.vehicleNote{
  padding-left: 0 !important;
  padding-bottom: 0 !important;
  text-align: start;
  color: red;
}
.fileUploadBlockContainer{
  padding: 0 !important;
  width: 60%;
}
.selectFieldBagsQuantity{
  margin-top: 10px;
  width: 30%
}
.radioBtns{
  justify-items: center !important;
}
.bagsDetailView{
  padding: 0 !important;
}
.bagsBlockView{
  /*width: 50% !important;*/
  width: 76% !important;
  background-color:#0AFD01;
  padding-top: 30px !important;
  padding-bottom: 30px !important;
  border-radius: 30px;
}
@media (max-width: 800px){
  .screenView{
    padding-bottom: 60px !important;
  }
  .bagsBlockView{
    width: 100% !important;
  }
  .mainColView{
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .selectFieldBagsQuantity{
    margin-top: 10px;
    width: 60%
  }
}
@media (max-width: 500px) {
  .selectFieldBagsQuantity{
    margin-top: 10px;
    width: 90%
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
.accountIcon{
  background-color: white;
  border-radius: 50%;
}
.centerAlignContent{
  justify-content: center;
}
.imagePreviewWrapperBags {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid #0AFD01;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.imagePreviewBlockBags {
  width: 30%;
  height: auto;
  display: block;
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 20px;
  border: 1px solid #0AFD01;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  margin-right: 10px
}
.bagsImagesMainBlock{
  display: flex;
  flex-wrap: wrap !important;
  justify-content: center;
}
</style>

