
<template style="background-color: #0afd01">

  <div class="mobile-view">
    <header style="background-color: white;">
      <div style="width: 100%; display: flex; justify-content: space-between; padding: 10px">
        <img
            alt="Vue logo"
            class="logo"
            style="  object-fit: contain;width: 150px"
            src="../assets/dlivrdlogo.png"
            width="125"
            height="50"
        />
        <v-menu
            width="200"
            location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-icon
                size="28"
                color="#0afd01"
                style="border-radius: 30px; height: 50px;width: 50px;"
                v-bind="props">
              mdi-dots-vertical
            </v-icon>
          </template>
          <v-list>
            <v-list-item @click="openSettings">
              <v-list-item-title>
                <v-icon style="margin-right: 10px">mdi-cog</v-icon>Settings
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="openFeedback">
              <v-list-item-title>
                <v-icon style="margin-right: 10px">mdi-comment-quote-outline</v-icon>Feedback
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="openHelp">
              <v-list-item-title>
                <v-icon style="margin-right: 10px">mdi-help</v-icon>Help
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="this.dialog = true">
              <v-list-item-title>
                <v-icon style="transform: rotate(180deg); margin-right: 10px">mdi-logout</v-icon>Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </header>
    <!-- Header -->
    <v-row justify="center">
      <v-dialog
          id="dialogBox"
          v-model="dialog"
          transition="dialog-top-transition"
          max-width="300px"
          persistent
      >
        <v-card>
          <v-card-title class="text-h5" style="background-color: #7efb01">{{alert_title}}</v-card-title>
          <v-card-text id="dialogDescription" style="overflow-y: scroll; text-align: justify" v-html="alert_description"></v-card-text>
          <v-card-text v-if="showError" style="color:red; padding-top: 0px" v-html="errorMessage"></v-card-text>
          <v-card-actions style="align-self: end; margin-top: 30px">
            <v-spacer></v-spacer>
            <v-btn
                v-if="session_live"
                prepend-icon="mdi-close"
                style="background-color: #7efb01"
                variant="text"
                @click="dialog = false"
            >
              No
            </v-btn>

            <v-btn
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="logout"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
      <h1 v-if="!no_order_found && session_live && no_security_question" style="font-weight: bold;text-align: center;color: black">OPEN ORDERS</h1>

    <div v-if="false" style="display: none">
      <v-col>
        <h2  >Verify OTP</h2>
      </v-col>
      <v-col>
        <input  type="number" style="width: 100%;height: 40px;border-radius: 2px">
      </v-col>
      <v-col style="text-align: center">
        <v-btn variant="outlined" height="50" color="#0E383A" class="saveQBtn orderDetailsHeaderBtn">
          Verify
        </v-btn>
        <v-btn @click="send_OTP" style="margin-left: 10px"  variant="outlined" height="50" color="#0E383A" class="saveQBtn orderDetailsHeaderBtn">
          Send OTP
        </v-btn>
      </v-col>
    </div>
    <div v-if="!no_security_question" style="width: 100%;justify-content: center;margin-top: 10px">
      <v-col>
        <h2 style="text-align: center" >Security Questions</h2>
        <h4 style="text-align: center" >Please update your Security questions.</h4>
      </v-col>

      <v-col>
        <select v-model="selectedOption1" class="question_select">
          <option  value="Please select one question">Please select one question</option>
          <option v-for="type in questions" v-bind:value="type.value">{{type.value}}</option>
        </select>
      </v-col>
      <v-col>
        <input v-model="selectedOption1ans" style="width: 100%;height: 40px;border-radius: 2px">
      </v-col>
      <v-col>
          <div style="width: 100%;height: 0.2px;background-color: white"></div>
      </v-col>

      <v-col>
        <select v-model="selectedOption2" class="question_select">
          <option  value="Please select one question">Please select one question</option>
          <option v-for="type in questions" v-bind:value="type.value">{{type.value}}</option>
        </select>
      </v-col>
      <v-col>
        <input v-model="selectedOption2ans" style="width: 100%;height: 40px;border-radius: 2px">
      </v-col>
      <v-col style="text-align: center">
        <v-btn  @click="uploadQuestion" variant="outlined" height="50" color="#0E383A" class="saveQBtn orderDetailsHeaderBtn">
<!--          <v-icon size="28">mdi-save</v-icon>-->
          Save
        </v-btn>
      </v-col>
    </div>
    <div v-if="no_security_question">
      <div v-if="no_order_found" style="position: absolute;width: 100%;padding-top: 100px;text-align: center;z-index: 10">
        <h2  id="no_open_order" style="color: White;font-weight: bold; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">No OPEN ORDERS</h2>
        <div id="timer_clock">

        </div>
        <v-btn @click="set_notify_me" v-if="notify_me" variant="outlined" height="50" color="#0E383A" class="notifyMeBtn orderDetailsHeaderBtn">
          <v-icon size="28">mdi-bell</v-icon>
          Notify Me
        </v-btn>
      </div>
      <div v-if="loading && session_live" style="width: 100%;text-align: center;position: absolute;z-index: 20">
        <atom-spinner  :animation-duration="1000" :size="90" color="#000000" style="margin: auto; margin-top: 100px"/>
      </div>
      <div style="padding-left:10px;padding-right:10px;height: 75vh;overflow: scroll;scrollbar-width: none;">
      <main >
        <div v-for="order in orders" :key="order.id" class="order-item openjob_block" style="background-color: white">
          <div class="order-info" style="width: 100%" @click=" this.$router.push('OpenOrdersDetail/'+order.order_id)">
            <!--            <div class="order-icon">-->
            <!--              <i class="fas fa-shopping-cart"></i>-->
            <!--            </div>-->
            <div class="order-details" style="padding: 0px !important;margin: 0px!important;width: 100%">
              <v-row style="display: inline-flex;width: 100%;margin: 0px;" >
                <v-col class="justify-center" style="padding: 0px;margin: 0px;width: 20% !important; align-self: center;flex-grow:0.2;">

                  <p style="color: black;width: 100%;text-align: center;font-weight: bold ;background-color: #0afd01">Earn</p>
                  <p style="color: black;width: 100%;text-align: center;font-size: 14px;font-weight: bold;color: black">${{ order.order_earnings }}</p>

                  <p style="color: black;width: 100%;text-align: center;font-weight: bold ;background-color: #0afd01;margin-top: 10px">Total</p>
                  <p style="color: black;width: 100%;text-align: center;font-size: 14px;font-weight: bold;color: black">${{ order.order_subtotal }}</p>
                </v-col>
                <v-col style="padding: 0px;width: 20% !important; border-left: 1px solid #0afd01;margin-right: 5px;padding-left: 6px;padding-top: 5px;padding-bottom: 5px;">
                  <p style="color: black;font-size: 80%;font-weight: bold">O# {{ order.order_id }}</p>
                  <v-col style="flex-grow:0.2;padding: 0px !important;">
                    <p style="color: black;font-size: 80%;"> <v-icon  size="20" style="color: #0afd01">mdi-store-clock</v-icon> {{ order.pickups[0]['pickupAt'].replace('T',' ') }}</p>
                    <v-row>
                      <v-col cols="1" sm="1"   style="width: 10px"><v-icon  size="20" style="color: #0afd01;">mdi-map-marker-outline</v-icon></v-col>
                      <v-col style="align-self:flex-end"> <p style="color: black;font-size: 80%;"> {{ order.pickups[0].address  }}</p></v-col>
                      <!--                      <v-col sm="1" style="width: 10px"><v-icon  size="20" style="color: #0afd01;">mdi-map-marker-outline</v-icon></v-col>-->
                      <!--                      <v-col> <p style="color: black;font-size: 80%;"> {{ order.pickups[0]['address'] }}</p></v-col>-->


                    </v-row>
                    <p style="color: black;font-size: 80%;"><v-icon  size="20" style="color: #0afd01">mdi-truck-delivery-outline</v-icon>
                      {{Math.round(order.distance_to_dropoff * 100) / 100 }} Miles</p>
                  </v-col>
                </v-col>
              </v-row>
            </div>
          </div>
          <button @click=" this.$router.push('OpenOrdersDetail/'+order.order_id)" style="background-color: transparent;color: black;font-weight: bold;margin-right: 10px;">
            <v-icon style="background-color: transparent;border-radius: 30px;height: 100%;width: 2px" size="50">mdi-chevron-right</v-icon>
          </button>
        </div>
        <div style="display: none">
          <div style="height:400px; width:100%" class="map_box">
            <l-map ref="map" v-model:zoom="zoom" :center="this.centerLeaflet">
              <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  layer-type="base"
                  name="OpenStreetMap"
              ></l-tile-layer>
              <l-marker
                  :lat-lng="this.markerOptionsPickupLeaflet"
                  :icon="icon"
              >
              </l-marker>
              <l-marker
                  :lat-lng="this.markerOptionsDropLeaflet"
                  :icon="iconDrop"
              >
                <!-- <l-popup :content="arcade.properties.name"></l-popup>-->
              </l-marker>
              <!-- <l-polyline :lat-lngs="travel" />-->
            </l-map>
          </div>


          <!--      <GmapMap-->
          <!--          :center='center'-->
          <!--          :zoom='12'-->
          <!--          style='width:100%;  height: 400px;'-->
          <!--      />-->
          <div class="order-list" style="display: block;padding-top: 10px">

            <div class="order-details" style="width: 100% !important;margin-bottom: 15px;">
              <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <h2 style="font-weight: bold;color: black;">Price</h2><h2 style="color: black;">257$</h2></div>
              <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;">Distance</p><p style="color: black;"><i class="fas fa-clock"></i>14.6 KM</p></div>
              <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;">Earning</p><p style="color: black;"><i class="fas fa-map-marker-alt"></i> 25$</p></div>


              <!--            <p><i class="fas fa-map-marker-alt"></i>Earning: 25$</p>-->

            </div>

          </div>
          <div>
            <button class="decision_button" @click="viewOrderDetails(1)" style="background-color: red">Decline</button>
            <button class="decision_button" @click="viewOrderDetails(2)" style="background-color: green">Interested</button>
          </div>
        </div>
        <!-- Map -->

      </main>
    </div>
    </div>
    <!-- Footer -->
    <footer style="position: absolute;bottom: 20px;width: 100%">
      <p style="text-align: center">&copy; 2023 dlivrd.  Rights Reserved.</p>
    </footer>

  </div>
</template>

<script>
// import GoogleMapsApiLoader from 'google-maps-api-loader'
import { GoogleMap, Marker } from "vue3-google-map";
import axios from "axios";
import { AtomSpinner } from 'epic-spinners'
import { LMap, LTileLayer, LMarker, LIcon, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import mapPickup from '../assets/mappickup.png';
import mapDropoff from '../assets/mapdropoff.png';
import {icon} from "leaflet";
export default {
  components: { GoogleMap,
    Marker ,
    AtomSpinner,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup,
    LPolyline,
  },
  data() {
    return {
      showError: false,
      username:'',
      no_order_found:false,
      session_live:true,
      center: { lat: 41.9855989, lng: -87.8332167 },
      pickup: { lat: 41.9855989, lng: -87.8332167 },
      markerOptionspickup : { position:{ lat: 41.9855989, lng: -87.8332167 }, label: "P", title: "Hooters" },
      drop: { lat: 41.9800399, lng: -87.8650262 },
      markerOptionsdrop : { position:{ lat: 41.9800399, lng: -87.8650262 } , label: "D", title: "Bridge Industrial" },
      orders:[],
      loading:true,
      selectedOption1:'Please select one question',
      selectedOption2:'Please select one question',
      alert_title:'Confirmation',
      dialog:false,
      notify_me:false,
      selectedOption1ans:'',
      selectedOption2ans:'',
      no_security_question:true,
      timeout_inst:false,
      alert_description:'Do you want this Logout ?',
      refreash_timeline:60000,
      questions: [
        {"id": "q1","value":"What is your favorite book?"},
        {"id": "q2","value":"What was the name of your first pet?"},
        {"id": "q3","value":"In which city were you born?"},
        {"id": "q4","value":"What is your mother's maiden name?"},
        {"id": "q5","value":"What was the name of your first school?"},
        {"id": "q6","value":"What is the name of your favorite childhood friend?"},
        {"id": "q7","value":"What was the model of your first car?"},
        {"id": "q8","value":"What is the name of your favorite movie?"},
        {"id": "q9","value":"What street did you grow up on?"},
        {"id": "q10","value":"What is your favorite song?"},
        {"id": "q11","value":"What was the name of your first stuffed animal?"},
        {"id": "q12","value":"What is the name of your favorite teacher?"},
        {"id": "q13","value":"In which city did you meet your spouse/partner?"},
        {"id": "q14","value":"What is your favorite food?"},
        {"id": "q15","value":"What is the name of the company where you had your first job?"}


      ],

      filterMenu: [
        { title: 'Sort by Earning'},
        { title: 'Sort by Distance'},
        { title: 'Sort by Pickup Time'},
      ],
      map: null,
      sortKey: "",
      firstcall:false,

      //leaflet map variables
      centerLeaflet: [41.9855989, -87.8332167],
      markerOptionsPickupLeaflet : [41.9855989, -87.8332167],
      markerOptionsDropLeaflet : [41.9800399, -87.8650262],
      zoom: 13,
      icon: icon({
        iconUrl: mapPickup,
        iconSize: [45, 52],
        iconAnchor: [16, 37]
      }),
      iconDrop: icon({
        iconUrl: mapDropoff,
        iconSize: [45, 52],
        iconAnchor: [16, 37]
      }),
    };
  },
  mounted() {

    // Initialize the map
    this.username = localStorage.getItem('username');
    this.sessionValidator();
    this.punch_last_call_time()
    window.addEventListener('focus', this.focusChange, false);

  },
  methods: {
    focusChange(){
      if(this.timeout_inst != false && localStorage.getItem('session_id') != ''){

        //console.log('called function')

        if(this.validate_last_server_call()){
          this.loading = true
          this.get_open_orders()
        }
      }
    },
    logout(){
      localStorage.setItem('username','');
      localStorage.setItem('session_id','');
      this.$router.push('/')
    },
    uploadQuestion(){
      if (this.selectedOption1 == 'Please select one question' || this.selectedOption2 == 'Please select one question' ){
          alert('Please fill all the security questions')
      }
      else if(this.selectedOption1 == this.selectedOption2 ){
          alert('Security Question Can Not Be Same')
      }
      else if(this.selectedOption1ans == '' || this.selectedOption2ans == '' ){
        alert('Security Answer Can Not Be Empty')
      }
      else if(this.selectedOption1ans.split(/\S/g).length > 100){
        alert('Security Answer 1 Can Not More Then 100 Characters')
      }
      else if(this.selectedOption2ans.split(/\S/g).length > 100){
        alert('Security Answer 2 Can Not Then 100 Characters')
      }
      else{
        alert('All Questions uploaded')
        this.loading = true
        var url = this.baseurl + 'update_security_questions'

        var Questions = {}
        Questions[this.selectedOption1] = this.selectedOption1ans
        Questions[this.selectedOption2] = this.selectedOption2ans
        const data = {
          identity: this.username,
          questions:Questions
        }
        axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "session":localStorage.getItem('session_id')
          }
        }).then((response) => {
          this.loading = false
          if(response.status == 200){
            this.sessionValidator()
          }
        }).catch(() => {
          ////console.log('')
        })
      }
    },
    openFeedback(){
      this.$router.push('/feedback')
    },
    openSettings(){
      this.$router.push('/settings')
    },
    openHelp(){
      this.$router.push('/help')
    },
    sessionValidator(){
      console.log("OpenOrders validator")
      var url = this.baseurl + 'dlivrd_drivers_verify_session'
      if(localStorage.getItem('username','') == '' || localStorage.getItem('username','') == null){
        // this.$router.push('/')
      }
      this.username = localStorage.getItem('username')
      const data = {
        identity: this.username,
        check:1
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then((response) => {
        //console.log('---------')
        console.log(response)
        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession["force_sec_questions"] !== undefined){
            this.no_security_question = false
          }
          else{
            this.no_security_question = true
          }
          if(verifySession['Success']){

            localStorage.setItem('profile_image', verifySession['profile_image']);
            this.initMap();
            this.get_open_orders()
          }
          else{
            console.log("Session not verified")
            this.session_logout()
          }
        }
      }).catch(() => {
        // //console.log('')
      })
    },
    settingUpdate(preference){
      // this.loading = false
      console.log("OpenOrders Session")
      var url = this.baseurl + 'dlivrd_drivers_verify_session'
      const data = {
        identity: this.username,
        sort_key: preference,
        check:4
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
            this.get_open_orders()
          }
          else{
            console.log("Session not validated")
            this.session_logout()
          }
        }
      }).catch(() => {
        // //console.log('')
      })
    },
    session_logout(){
      console.log("this.username")
      console.log(this.username)
      console.log(localStorage.getItem('session_id'))
      localStorage.setItem('username','');
      localStorage.setItem('session_id','');
      this.alert_description = "Session Expired."
      this.session_live = false
      this.dialog = true
    },
    punch_last_call_time(){
      var current = new Date();
      localStorage.setItem('last_call_time',current.getTime())
      //console.log('punching time')
      //console.log(current)
    },
    validate_last_server_call(){
      var last_time = localStorage.getItem('last_call_time')
      var current = new Date();
      var difference = (current.getTime() - last_time)/ 1000

      if(difference >60){
        //console.log('------ calling server ------')
        //console.log(difference)
        return true

      }else{
        //console.log('------ not calling server as last call was 60 second  ------')
        //console.log(difference)
        return false
      }

    },
    get_open_orders(){

      if(localStorage.getItem('session_id') != ''){
        this.timeout_inst = true
        setTimeout(this.get_open_orders, this.refreash_timeline);

      }

      var url = this.baseurl + 'get_all_open_orders'
      const data = {
        identity: this.username,
        "page_number": 1,
        "records_per_page": 30,
      }
      if(this.firstcall == true)
      {
        if ( document.hidden ) { this.loading = false; return; }
        if(!this.validate_last_server_call()){
          //console.log('server call validate time is not enough')
          return
        }
      }else{
        this.firstcall = true
      }

      //console.log('******** ******** ******* *******')
      //console.log('calling function of data ')
      this.punch_last_call_time()
      //console.log('-------- -------- ------- -------')

      // this.no_order_found = true
      // this.loading = false
      //return
      //return
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then((response) => {
        // console.log(response)
        this.loading = false
        this.firstcall = true
        if(response.status == 200){
          var response = response.data;
          if(response['Success']){
            this.no_order_found = false
            this.orders = response['orders']
          }
          else if(response['Failure'] == 'No eligible orders found for the provided rider.'){
            this.orders = []
            this.no_order_found = true
            this.notify_me = response['allow_notify_me']
          }
          else if(response['Failure'] == 'Session Expired. Please login again.' || response['Failure'] == 'User unavailable. Please contact administrator.' ){
            if(localStorage.getItem('session_id') != ''){
              this.session_logout()
            }
          }
          else{
            this.orders = []
            this.no_order_found = true
            this.notify_me = response['allow_notify_me']
          }
        }
      }).catch(() => {
        this.orders = []
        this.no_order_found = true
        this.notify_me = response['allow_notify_me']
        ////console.log('')
      })
    },
    set_notify_me(){
      this.loading = true
      var url = this.baseurl + 'mark_notify_me'
      const data = {
        identity: this.username
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then((response) => {
        this.loading = false
        if(response.status == 200){
          var response = response.data;
          if(response['Success'] == 'You will be notified when an open order is available.'){
            this.notify_me = false
          }
        }
      }).catch(() => {
        ////console.log('')
      })
    },
    initMap() {
      // Create a new map instance

    },
    send_OTP(){
      alert('test')
    },
    viewOrderDetails(orderId) {
      // Handle logic to view order details
      if(orderId == 1){
        this.center = this.pickup
      }else{
        this.center = this.drop
      }
    },
    filterMenuActions(index){
      if(index == 0){
        this.sortKey = 'earning';
      }
      else if(index == 1){
        this.sortKey = 'distance'
      }
      else{
        this.sortKey = 'pickupAt';
      }
      this.orders = [];
      this.settingUpdate(this.sortKey);
    },
  },
};
</script>

<style>

.btn_verify{

}

#header {
  animation: fadeInAnimation ease 3s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
@keyframes fadeInAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.openjob_block:active {
  background-color: lightgrey !important;
  padding: 0px !important;
}
.openjob_block {
  padding: 0px !important;
}

.decision_button{
  width: 46%;
  height: 40px;
  margin: 6px;

}
.mobile-view {
  background-color: #0afd01;
  max-width: 400px;
  margin: 0 auto;
  height: 100vh;
  /*padding-left: 10px;*/
  /*padding-right: 10px;*/
  padding-bottom: 10px;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

.order-list {
  display: flex;
  flex-direction: column;
}

.order-item {
  justify-content:space-between;
  background-color: #0afd01;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.question_select{
  border-radius: 2px;
  width: 100%;
  border-color: #0adf01;
  height: 40px;
}
.order-info {
  display: flex;
  align-items: center;
}

.order-icon {
  margin-right: 10px;
}

.order-details {
  display: flex;
  flex-direction: column;
}

button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.map {
  height: 300px;
  margin-top: 20px;
}
::-webkit-scrollbar{
  display: none;
}

.orderDetailsHeaderBtn{
  border-color: #DCE4E5;
  border-radius: 10px !important;
}


.saveQBtn{
  background-color: #FCEEE9;
  color: #0adf01 !important;
}
.saveQBtn:hover{
  background-color: #0adf01 !important;

}
.v-btn:before {
  opacity: 0 !important;
}

.v-ripple__container {
  opacity: 0 !important;
}




.notifyMeBtn{
  background-color: #FCEEE9;
  color: #DE592C !important;
}
.notifyMeBtn:hover{
  background-color: #DE592Caa !important;

}
</style>
