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

    <img  alt="Vue logo" class="logo" style="object-fit: contain;width: 80vw; position: fixed; top:40%; left: 7%; opacity: 0.1;" src="../assets/dlivrdlogo.png"  />

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
          <v-card-title class="text-h5" style="background-color: #7efb01">{{alert_title}}</v-card-title>
          <v-card-text id="dialogDescription" style="overflow-y: scroll; text-align: justify" v-html="alert_description"></v-card-text>
          <v-card-text v-if="showError" style="color:red; padding-top: 0px" v-html="errorMessage"></v-card-text>
          <v-card-actions style="align-self: end; margin-top: 30px">
            <v-spacer></v-spacer>
            <v-btn
                v-if="cancelButtonText == 'Cancel'"
                prepend-icon="mdi-close"
                style="background-color: #7efb01"
                variant="text"
                @click="dialog = false"
            >
              {{ cancelButtonText }}
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'logout'"
                prepend-icon="mdi-logout"
                style="background-color: #7efb01"
                variant="text"
                @click="logoutOnboarding"
            >
              Logout
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Okay'"
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="btnOkayClick"
            >
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-container fluid style="padding-right:0px; padding-left: 0px">
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
            <v-toolbar-title class="toolbarTitleStyle">Preferred Availability</v-toolbar-title>
          </v-col>
          <v-col style="display: flex; justify-content: right">
            <v-menu width="180px">
              <template v-slot:activator="{ props }">
                <v-btn
                    icon
                    :ripple="false"
                    v-bind="props">
                  <!--            <v-icon style="background-color: white; border-radius: 50%" size="32">mdi-flag</v-icon>-->
                  <v-img :src=selectedLanguage width="38" height="38"/>
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
                  <v-avatar class="accountIcon" size="38">
                    <v-img :src=userProfileImage cover/>
                  </v-avatar>
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
          <v-row class="pageHeadingStyle">
            <v-col style="text-align: center;">
              <v-card-text>Please mark which days / times you are available for deliveries. Dlivrd will attempt to limit any offers outside of those times.</v-card-text>
            </v-col>
          </v-row>

          <v-col class="layoutStyle screenLayout">
            <v-overlay :model-value="loadingTableData">
              <v-card style="background-color: transparent;width: 100vw;height: 100vh;">
                <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
              </v-card>
            </v-overlay>
<!--            <atom-spinner v-if="loadingTableData" :animation-duration="1000" :size="130" color="#0AFD01" class="loading_bar" />-->
            <!-- Table Head-->
            <v-row class="tableHeadRow">
              <v-col v-for="(day, index) in days" :key="index" :class="index == lunchTime.length - 1 ? 'headerCellColorSmall' : 'headerCellColor'">
                <v-card-text  style="display: flex; align-items: center; justify-content: center" class="headerTextStyle">{{ day }}</v-card-text>
              </v-col>
            </v-row>
            <!-- Late night Row-->
            <v-row  class="tableRowContentStyle">
              <v-col v-for="(day, index) in lateNightTime" :key="index" :class="index == lunchTime.length - 1 ? 'tableCellColorSmall' : 'tableCellColor'" @click="selectSlot(days[index], index, 'Latenight')">
                <v-card-text style="display: flex; align-items: center; justify-content: center" class="tableTextStyle" :id="`time_Latenight_q_${(days[index])}_index_${index}`" :ref="`time_Latenight_q_${(days[index])}_index_${index}`">{{ day }}
                  <v-icon v-if="index != 0" size="50" class="checkIconStyle" :id="`time_Latenight_q_${(days[index])}_index_${index}_icon`" :ref="`time_Latenight_q_${(days[index])}_index_${index}_icon`">mdi-checkbox-marked-circle-outline</v-icon>
                </v-card-text>
              </v-col>
            </v-row>
            <!-- BreakFast Row-->
            <v-row  class="tableRowContentStyle">
              <v-col v-for="(day, index) in breakfastTime" :key="index" :class="index == lunchTime.length - 1 ? 'tableCellColorSmall' : 'tableCellColor'" @click="selectSlot(days[index], index, 'Breakfast')">
                <v-card-text style="display: flex; align-items: center; justify-content: center" class="tableTextStyle" :id="`time_Breakfast_q_${(days[index])}_index_${index}`" :ref="`time_Breakfast_q_${(days[index])}_index_${index}`">{{ day }}
                  <v-icon v-if="index != 0" size="50" class="checkIconStyle" :id="`time_Breakfast_q_${(days[index])}_index_${index}_icon`" :ref="`time_Breakfast_q_${(days[index])}_index_${index}_icon`">mdi-checkbox-marked-circle-outline</v-icon>
                </v-card-text>
              </v-col>
            </v-row>
            <!-- Lunch Row-->
            <v-row class="tableRowContentStyle">
              <v-col v-for="(day, index) in lunchTime" :key="index" :class="index == lunchTime.length - 1 ? 'tableCellColorSmall' : 'tableCellColor'"  @click="selectSlot(days[index], index,'Lunch')">
                <v-card-text style="display: flex; align-items: center; justify-content: center" class="tableTextStyle" :id="`time_Lunch_q_${(days[index])}_index_${index}`" :ref="`time_Lunch_q_${(days[index])}_index_${index}`">{{ day }}
                  <v-icon v-if="index != 0" size="50" class="checkIconStyle" :id="`time_Lunch_q_${(days[index])}_index_${index}_icon`" :ref="`time_Lunch_q_${(days[index])}_index_${index}_icon`">mdi-checkbox-marked-circle-outline</v-icon>
                </v-card-text>
              </v-col>
            </v-row>
            <!-- Evening Row-->
            <v-row class="tableRowContentStyle">
              <v-col v-for="(day, index) in eveningTime" :key="index" :class="index == lunchTime.length - 1 ? 'tableCellColorSmall' : 'tableCellColor'"  @click="selectSlot(days[index], index,'Evening')">
                <v-card-text style="display: flex; align-items: center; justify-content: center" class="tableTextStyle" :id="`time_Evening_q_${(days[index])}_index_${index}`" :ref="`time_Evening_q_${(days[index])}_index_${index}`">{{ day }}
                  <v-icon v-if="index != 0" size="50" class="checkIconStyle" :id="`time_Evening_q_${(days[index])}_index_${index}_icon`" :ref="`time_Evening_q_${(days[index])}_index_${index}_icon`">mdi-checkbox-marked-circle-outline</v-icon>
                </v-card-text>
              </v-col>
            </v-row>
            <!-- Dinner Row-->
            <v-row align-content="center" justify="center" class="tableRowContentStyle" style="margin-bottom: 0px;">
              <v-col v-for="(day, index) in dinnerTime" :key="index" :class="index == lunchTime.length - 1 ? 'dinnerCellColorSmall' : 'dinnerCellColor'" @click="selectSlot(days[index], index, 'Dinner')">
                <v-card-text style="display: flex; align-items: center; justify-content: center" class="tableTextStyle" :id="`time_Dinner_q_${(days[index])}_index_${index}`" :ref="`time_Dinner_q_${(days[index])}_index_${index}`">{{ day }}
                  <v-icon v-if="index != 0" size="50" class="checkIconStyle" :id="`time_Dinner_q_${(days[index])}_index_${index}_icon`" :ref="`time_Dinner_q_${(days[index])}_index_${index}_icon`">mdi-checkbox-marked-circle-outline</v-icon>
                </v-card-text>
              </v-col>
            </v-row>
            <!-- Full Time Row-->
            <v-row align-content="center" justify="center" class="tableRowContentStyle" style="margin-bottom: 0px; margin-top: 0;">
              <v-col v-for="(day, index) in days" :key="index" :class="index == lunchTime.length - 1 ? 'dinnerCellColorSmall' : 'dinnerCellColor'" style="display: flex; align-items: center; border-top: 0">
                <v-row>
                  <v-card-text v-if="index == 0" style="display: flex; justify-content: center; padding: 0" class="tableTextStyle">
                    Full time
                  </v-card-text>
                  <v-checkbox v-if="index != 0" hide-details class="fullTimeCheckbox" v-model="checkboxes['checkbox' + day]" :label="day" :ref="'fullTime' + day" :id="'fullTime' + day" v-on:click="fullTimeSelect(day, index)"></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-row>
            <v-checkbox
                hide-details
                class="ondemandCheckbox"
                v-model="ondemand_availability"
                color="#0adf01"
                label="Are you willing to receive On-demand orders in the selected time slots?">
            </v-checkbox>
          </v-row>
          <v-col style="padding: 0" class="btnLayout">
            <v-btn
                v-if="loading"
                prepend-icon="mdi-content-save-check"
                class="buttonStyle"
                variant="text"
                @click="submitPreferredTimeDetails"
            >
              Save
            </v-btn>
            <v-overlay :model-value="!loading">
              <v-card style="background-color: transparent;width: 100vw;height: 100vh;">
                <v-img :width="400" :src="loader"
                       style="margin: auto; margin-top: 100px"/>
              </v-card>
            </v-overlay>
<!--            <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#0AFD01" class="loading_bar" />-->
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
      is_dlivrd_driver: false,
      loader: loader,
      checkboxes:{},
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
      times: ['Latenight', 'Breakfast', 'Lunch', 'Evening', 'Dinner'],
      days: ['Days/ Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      lateNightTime: ['Midnight till 6am', '', '', '', '', '', '', ''],
      breakfastTime: ['Breakfast (6am - 10am)', '', '', '', '', '', '', ''],
      lunchTime: ['Lunch (10am - 2pm)', '', '', '', '', '', '', ''],
      eveningTime: ['Evening (2pm - 8pm)', '', '', '', '', '', '', ''],
      dinnerTime: ['Dinner (8pm till mid-night)', '', '', '', '', '', '', ''],
      fullTimeCall: false,
      ondemand_availability: false,
      drawer: false,
      loading:true,
      alert_title: '',
      alert_description: '',
      dialog: false,
      errorMessage: false,
      showError: false,
      username: "",
      agreeButtonText: "",
      cancelButtonText: "",
      checkSlotSelection: {},
      save_slots: {},
      loadView: false,
      loadingTableData: true,
      name: "",
      fleet_id: null,
      validationFailed: false,
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
    btnOkayClick(){
      if(this.alert_title == "Success") {
        this.$router.push('/checklist')
      }
      this.dialog = false
    },
    selectSlot(day, i,time){
      if(this.save_slots[day] == null){
        this.save_slots[day] = [];
      }
      if(this.checkSlotSelection['time_' + time + '_q_' + day + '_index_' + i] == true) {
        this.$refs['time_' + time + '_q_' + day + '_index_' + i][0].$el.style.background = 'transparent';
        this.$refs['time_' + time + '_q_' + day + '_index_' + i + '_icon'][0].$el.style.visibility = 'hidden';
        this.checkSlotSelection['time_' + time + '_q_' + day + '_index_' + i] = false;
        if(day in this.save_slots){
          if(time == "Latenight"){
            for(var i = 0; i< this.save_slots[day].length; i++){
              if(this.save_slots[day][i] == 0){
                this.save_slots[day].splice(i,1)
              }
            }
          }
          if(time == "Breakfast"){
            for(var i = 0; i< this.save_slots[day].length; i++){
              if(this.save_slots[day][i] == 1){
                this.save_slots[day].splice(i,1)
              }
            }
          }
          if(time == "Lunch"){
            for(var i = 0; i< this.save_slots[day].length; i++){
              if(this.save_slots[day][i] == 2){
                this.save_slots[day].splice(i,1)
              }
            }
          }
          if(time == "Evening"){
            for(var i = 0; i< this.save_slots[day].length; i++){
              if(this.save_slots[day][i] == 3){
                this.save_slots[day].splice(i,1)
              }
            }
          }
          if(time == "Dinner"){
            for(var i = 0; i< this.save_slots[day].length; i++){
              if(this.save_slots[day][i] == 4){
                this.save_slots[day].splice(i,1)
              }
            }
          }
        }
      }
      else if( i > 0) {
        this.$refs['time_' + time + '_q_' + day + '_index_' + i][0].$el.style.background = '#0AFD01';
        this.$refs['time_' + time + '_q_' + day + '_index_' + i + '_icon'][0].$el.style.visibility = 'visible';
        this.checkSlotSelection['time_' + time + '_q_' + day + '_index_' + i] = true;
        if(time == "Latenight"){
          this.save_slots[day].push(0);
        }
        if(time == "Breakfast"){
          this.save_slots[day].push(1);
        }
        if(time == "Lunch"){
          this.save_slots[day].push(2);
        }
        if(time == "Evening"){
          this.save_slots[day].push(3);
        }
        if(time == "Dinner"){
          this.save_slots[day].push(4);
        }
      }

      if(!this.fullTimeCall){
        for(var index = 0; index < this.times.length; index++){
          if(!this.checkSlotSelection['time_' + this.times[index] + '_q_' + day + '_index_' + i]){
            this.checkboxes['checkbox' + day] = false
            return
          }
        }
        this.checkboxes['checkbox' + day] = true
      }
    },

    fullTimeSelect(day, index){
      if(this.checkboxes['checkbox' + day]){
        this.checkboxes['checkbox' + day] = false
      }
      else{
        this.checkboxes['checkbox' + day] = true
      }
      this.fullTimeCall = true
      var time = ['Latenight', 'Breakfast', 'Lunch', 'Evening', 'Dinner']
      for(var i = 0; i < 5; i++){
        if (this.checkSlotSelection['time_' + time[i] + '_q_' + day + '_index_' + index] != this.checkboxes['checkbox' + day]) {
          this.selectSlot(day, index, time[i])
        }
      }
      this.fullTimeCall = false
    },
    submitPreferredTimeDetails(){
      this.loading = false;
      var url = this.baseurl + 'update_rider_pref_slots'
      var data = {
        identity: this.username,
        pref_slots: this.save_slots,
        ondemand_availability: this.ondemand_availability,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      console.log("Save Preference Data")
      console.log(data)
      // return;
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then( response => {
        if(response.data['Success']){
          console.log("Preferences Saved Response")
          console.log(response);
          this.alert_title = "Success";
          this.alert_description = "Preferred time slots saved successfully.";
          this.alert_error = null;
          this.dialog = true;
          this.agreeButtonText = "Okay";
        }
        else {
          if (response.data['Failure'] == 'Session Expired. Please login again.') {
            this.$router.push('/')
          } else {
            this.alert_title = "Warning";
            this.alert_description = "Preferred time slots not updated. Please try again!";
            this.alert_error = null;
            this.dialog = true;
            this.agreeButtonText = "Okay";
          }
        }
        this.loading = true;
      }).catch ( () => {
        this.alert_title = "Warning";
        this.alert_description = "Preferred time slots not updated. Please try again!";
        this.dialog = true;
        this.agreeButtonText = "logout";
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
    getPreferredTimeSlots(){
      var fullTimeCheck = false
      var url = this.baseurl + 'get_rider_pref_slots';
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
      }).then( response => {
        console.log('Availablity response')
        console.log(response)
        this.loadingTableData = false;
        var data = response.data
        var dayIndex = 0
        this.ondemand_availability = data.ondemand_availability
        for (var day in data['pref_slots']){
          for ( var i = 0; i< this.days.length; i++){
            if(day == this.days[i]){
              dayIndex = i;
            }
          }
          for(var i in data['pref_slots'][day]) {
            var index_ref = ''
            if(data['pref_slots'][day][i] == 0){
              index_ref = ('time_'+'Latenight'+'_q_' + day + '_index_'+dayIndex)
            }
            else if(data['pref_slots'][day][i] == 1){
              index_ref = ('time_'+'Breakfast'+'_q_' + day + '_index_'+dayIndex)
            }
            else if(data['pref_slots'][day][i] == 2){
              index_ref = ('time_'+'Lunch'+'_q_' + day + '_index_'+dayIndex)
            }
            else if(data['pref_slots'][day][i] == 3){
              index_ref = ('time_'+'Evening'+'_q_' + day + '_index_'+dayIndex)
            }
            else{
              index_ref = ('time_'+'Dinner'+'_q_' + day + '_index_'+dayIndex)
            }
            this.$refs[index_ref][0].$el.style.background = '#0AFD01';
            this.$refs[index_ref + '_icon'][0].$el.style.visibility = 'visible';
            this.checkSlotSelection[index_ref] = true;

            if(this.save_slots[day] == null){
              this.save_slots[day]=[]
              this.save_slots[day].push(data['pref_slots'][day][i])
            }else{
              this.save_slots[day].push(data['pref_slots'][day][i])
            }
          }
          fullTimeCheck = true
          console.log("this.checkSlotSelection")
          console.log(this.checkSlotSelection)
          console.log("||||||||||||||||")
          for(var index = 0; index < this.times.length; index++){
            if(!this.checkSlotSelection['time_'+this.times[index]+'_q_' + day + '_index_'+dayIndex]){
              this.checkboxes['checkbox' + day] = false
              fullTimeCheck = false
            }
          }
          if(fullTimeCheck){
            this.checkboxes['checkbox' + day] = true
          }
        }
      }).catch( () => {
        this.clearFields();
        this.$router.push('/');
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
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
            this.getPreferredTimeSlots();
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
    closeDrawer(){
      this.drawer = false;
    },
  }
}
</script>

<style>
.ondemandCheckbox .v-selection-control {
  color: black !important;
  display: flex;
  align-items: center;
  max-width: 95vw;
  margin: 0 11vw 9px;
  font-size: 17px;
}
.ondemandCheckbox .v-label {
  color: black !important;
  opacity: 1;
  font-size: 16px;
  font-weight: bold;
}
.fullTimeCheckbox .v-selection-control {
  color: black !important;
  display: flex;
  height: inherit !important;
  align-items: center;
  margin: auto;
}
.layoutStyle{
  width: 100%;
  text-align: -webkit-center;
  text-align: -moz-center;
}
.pageHeadingStyle{
  justify-content: center;
  margin-top: 30px !important;
  margin-bottom: 20px !important;
}
.tableHeadRow{
  width: 80% !important;
  border-left: 1px solid;
}
.headerCellColorSmall{
  background-color: #0AFD01;
  border-left: 0px !important;
  border-bottom: 0px !important;
  border: 1px solid black;
  text-align: -webkit-center;
}
.headerCellColor{
  background-color: #0AFD01;
  border-left: 0px !important;
  border-bottom: 0px !important;
  border: 1px solid black;
  text-align: -webkit-center;
  height: 80px;
  width: 115px !important;
}
.tableCellColorSmall{
  border-left: 0px !important;
  border-bottom: 0px !important;
  background-color: #ffffff !important;
  color: black;
  border: 1px solid black;
  text-align: -webkit-center;
  padding: 0px !important;
}
.tableCellColor{
  border-left: 0px !important;
  border-bottom: 0px !important;
  background-color: #ffffff !important;
  color: black;
  border: 1px solid black;
  text-align: -webkit-center;
  padding: 0px !important;
}
.dinnerCellColorSmall{
  border-left: 0px !important;
  border: 1px solid black;
  background-color: #ffffff !important;
  color: black;
  text-align: -webkit-center;
  padding: 0px !important;
}
.dinnerCellColor{
  border-left: 0px !important;
  border: 1px solid black;
  background-color: #ffffff !important;
  color: black;
  text-align: -webkit-center;
  padding: 0px !important;
}
.tableTextStyle{
  width: 100%;
  height: 100%;
  font-weight: bold !important;
}
.headerTextStyle{
  font-weight: bold !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.tableRowContentStyle{
  background-color: #FFFFFF;
  width: 80%;
  border-left: 1px solid;
}
.checkIconStyle{
  color: black;
  visibility: hidden;
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
#dashboardView::-webkit-scrollbar {
  width: 8px !important;
  height: 100% !important;
  display: block !important;
}
#dashboardView::-webkit-scrollbar-track {
  background:#1E3F20 !important;
  border-radius: 12px !important;
}
#dashboardView::-webkit-scrollbar-thumb {
  display: block !important;
  background: #0AFD01 !important;
  border-radius: 12px !important;
}
.top_bar_title{
  text-align-last:left;
  height: 50px;
}
.v-toolbar__content{
  height: 50px !important;
}

@media (max-width: 1000px) {
  .ondemandCheckbox .v-selection-control {
    color: black !important;
    display: flex;
    align-items: center;
    max-width: 95vw;
    margin: 20px 14vw;
  }
  .tableHeadRow{
    margin: 0 !important;
    display: grid !important;
    height: fit-content;
    width: fit-content;
  }
  .tableRowContentStyle{
    margin: 0!important;
    display: grid !important;
    border: 0 !important;
  }
  .screenLayout {
    max-width: 1000% !important;
    padding-left: 14vw!important;
    padding-right: 14vw!important;
    display: flex;
    overflow-y: scroll;
    /*transform: rotate(90deg);*/
    /*margin-top: 550px;*/
    translate: 0px 0px;
    transform-origin: top center;
  }
  .headerCellColorSmall{
    background-color: #0AFD01;
    border-left: 0px !important;
    border-bottom: 1px solid !important;
    border: 1px solid black;
    text-align: -webkit-center;
    /*height: 90px;*/
    height: 12vh !important;
    display: flex !important;
  }
  .headerCellColor{
    background-color: #0AFD01;
    border-left: 0px !important;
    /*border-bottom: 0px !important;*/
    border: 1px solid black;
    text-align: -webkit-center;
    /*height: 90px;*/
    height: 12vh !important;
    display: flex !important;
    width: 18vw !important;
  }
  .tableCellColorSmall{
    border-bottom: 1px solid !important;
    margin: 0 !important;
    display: flex !important;
    height: 12vh !important;
  }
  .tableCellColor {
    /*border-left: 0px !important;*/
    /*border-right: 0px !important;*/
    margin: 0 !important;
    display: flex !important;
    height: 12vh !important;
    width: 18vw !important;
  }
  .dinnerCellColorSmall{
    display: flex !important;
    height: 12vh !important;
  }
  .dinnerCellColor {
    border-bottom: 0px !important;
    display: flex !important;
    height: 12vh !important;
    width: 18vw !important;
  }
}
@media (max-width: 700px) {
  .ondemandCheckbox .v-selection-control {
    color: black !important;
    display: flex;
    align-items: center;
    margin: 18px 3vw;

  }
  .tableCellColorSmall{
    background-color: red;
  }
  .tableHeadRow{
    margin: 0 !important;
    display: grid !important;
    height: fit-content;
    width: fit-content;
  }
  .tableRowContentStyle{
    margin: 0!important;
    display: grid !important;
  }
  .screenLayout {
    max-height: 100vh;
    overflow-x: scroll;
    padding: 2vw!important;
    display: flex;
    /*width: 1200px !important;*/
    /*transform: rotate(90deg);*/
    /*margin-top: 500px;*/
    margin-bottom: 0px;
    translate: -0px 0px;
    transform-origin: top center;
  }
  .headerCellColor {
    height: 12vh !important;
    display: flex !important;
    width: 24vw !important;
  }
  .headerTextStyle{
    font-size: 12px !important;
  }
  .tableCellColor {
    margin: 0 !important;
    display: flex !important;
    height: 12vh !important;
    width: 24vw !important;
  }
  .dinnerCellColor {
    display: flex !important;
    height: 12vh !important;
    width: 24vw !important;
  }
  .tableTextStyle{;
    font-size: 12px !important;
  }
  .buttonStyle{
    margin-top: 0px !important;
    margin-bottom: 58px !important;
  }
}
@media (min-width: 700px) and (max-width: 1000px){
  .screenLayout{
    /*width: 1500px !important;*/
    /*transform: rotate(90deg);*/
    /*margin-top: 620px;*/
    /*margin-bottom: 180px;*/
    translate: 0px 0px;
    transform-origin: top center;
  }
}
.btnLayout{
  text-align: -webkit-center;
  text-align: -moz-center;
}
.buttonStyle{
  background-color: #0AFD01 !important;
  margin-top: 0;
  margin-bottom: 50px;
}
</style>


