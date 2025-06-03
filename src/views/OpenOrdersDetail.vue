
<template  >

  <div class="order_view_web">
  <header style="background-color: white;border-bottom: 3px #0afd01 solid;">
    <div style="width: 100%;display: flex;justify-content: space-between;padding: 10px">
    <v-icon v-if="!urgent_link" @click="$router.go(-1)" style="background-color: transparent;color:#0afd01;border-radius: 30px;height: 100%;width: 50px" size="50">mdi-arrow-left-thin-circle-outline</v-icon>
    <img alt="Vue logo" class="logo" style="  object-fit: contain;width: 150px" src="../assets/dlivrdlogo.png" width="125" height="50" />
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
                v-if="order_confirmed == false"
                prepend-icon="mdi-close"
                style="background-color: #7efb01"
                variant="text"
                @click="dialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
                v-if="order_confirmed == false"
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="decide_open_order"
            >
              Confirm
            </v-btn>
            <v-btn
                v-if="order_confirmed == true"
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="return_to_list"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <h3 v-if="!order_found && !loading" id="header2" style="font-weight: bold;margin-top:20px;text-align: center;padding-left:10px;color: black">Order Already Claimed</h3>
    <h1 v-if="!loading && order_found" id="header" style="font-weight: bold;text-align: left;padding-left:10px;color: black">O# {{order_details.order_id}}</h1>
    <!-- Main Content -->
    <div v-if="loading || confirmation_loading " style="width: 100%;align-items: center;position: absolute;">
    <atom-spinner  :animation-duration="1000" :size="190" color="black"   style="margin: auto;   margin-top: 100px;z-index: 100;"/>
    </div>
    <div v-if="order_found" style="padding-left:10px;padding-right:10px;height: 75vh;overflow: scroll">
<!--      <div style="background-color: black;z-index: 100;width: 100%;height: 1px;position: absolute">-->
<!--      </div>-->
      <main v-if="!loading" >


      <div id="map" class="map" style="display: none"></div>
        <div style="height:400px; width:100%" class="map_box">
          <l-map ref="map" v-model:zoom="zoom" :center="this.center">
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            ></l-tile-layer>
            <l-marker
                v-for="marker in this.markerlist"
                :lat-lng="marker.position"
                :icon="marker.icon">
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
          <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <h2 style="font-weight: bold;color: black;">Earning</h2><h2 style="color: black;font-weight: bold">{{order_details.order_earnings}} $</h2></div>
          <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;">Distance</p><p style="color: black;"><i class="fas fa-clock"></i>{{ Math.round(order_details.distance_to_dropoff * 100) / 100    }} Miles</p></div>
          <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;">Order Value</p><p style="color: black;"><i class="fas fa-map-marker-alt"></i> {{order_subtotal}}$</p></div>
          <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;padding-top: 10px">Partner</p> <img   class="logo" style="  object-fit: contain;width: 150px" :src="delivery_partner_image" width="125" height="50" /></div>


          <!--            <p><i class="fas fa-map-marker-alt"></i>Earning: 25$</p>-->

        </div>
        <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;">DELIVERY ACTIVITY</p></div>

        <div class="delivery_activity">
        <div @click="viewOrderDetails(order.marker_location)" v-for="order in this.jobs" :key="order.id" class="activity_block" >
          <div style="display: inline-flex">
            <div style="">
              <div v-if="order.type != 'Pickup'" class="activity_track"><p style="visibility: hidden">p</p> </div>
              <div v-if="order.type == 'Pickup'" class="activity_track_icon" ><v-icon color="#0afd01" style=" border-radius: 30px;height: 100%;" size="40">mdi-truck-delivery-outline</v-icon>
              </div>
              <div class="activity_infoblock"><p style="visibility: hidden">p</p> </div>
              <div class="activity_track"><p style="visibility: hidden">p</p> </div>
            </div>
            <div style="margin-left: 20px" >
              <h4 style="color: black;font-weight: bold">{{ order.location_name }}</h4>
              <p style="color: black;"><v-icon  size="20" style="color: #0afd01">mdi-store-clock</v-icon>  {{ order.time.replace('T',' ') }}</p>
<!--              <p style="color: black;"><v-icon  size="20" style="color: #0afd01">mdi-truck-delivery-outline</v-icon> {{ order.address }}</p>-->
              <v-row>
                <v-col cols="1" sm="1"   style="width: 10px"><v-icon  size="20" style="color: #0afd01;">mdi-map-marker-outline</v-icon></v-col>
                <v-col style="align-self:flex-end"> <p style="color: black;font-size: 80%;"> {{ order.address  }}</p></v-col>
              </v-row>
            </div>
          </div>
<!--          <button  style="background-color: #0afd01;color: black;font-weight: bold">Locate</button>-->
        </div>
        </div>
      </div>
      <div v-if=" !(loading || confirmation_loading) " style="text-align: center">
        <button v-if="btn_back" class="decision_button" @click=" this.$router.go(-1)" style="background-color: red;color: black;font-size: 15px;font-weight: bold">BACK</button>
        <button class="decision_button" @click="dialog = true" style="background-color: #0afd01;color: black;font-size: 15px;font-weight: bold">INTERESTED</button>
      </div>

      <!-- Map -->

    </main>
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
import Chompies from '../assets/logos/Chompies.png'
import Cosi from '../assets/logos/Cosi.png'
import EmmySquaredPizza from '../assets/logos/EmmySquaredPizza.png'
import EzCater from '../assets/logos/EzCater.png'
import Foodee from '../assets/logos/Foodee.png'
import HipCityVeg from '../assets/logos/HipCityVeg.png'
import LocalGrind from '../assets/logos/LocalGrind.png'
import QDOBA from '../assets/logos/QDOBA.png'
import QdobaPhilly from '../assets/logos/QdobaPhilly.png'
import Sauce from '../assets/logos/Sauce.png'
import sharebite from '../assets/logos/sharebite.png'
import SimpleCater from '../assets/logos/SimpleCater.png'
import TacoDeli from '../assets/logos/TacoDeli.png'
import vromo from '../assets/logos/vromo.png'
import dlivrd from '../assets/dlivrdlogo.png';

import { LMap, LTileLayer, LMarker, LIcon, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import mapPickup from '../assets/mappickup.png';
import mapDropoff from '../assets/mapdropoff.png';
import {icon} from "leaflet";

import { AtomSpinner } from 'epic-spinners'
// import urgentOrder from "./UrgentOrder";

export default {
  components: {
    GoogleMap,
    Marker,
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
      order_details:{},
      order_id:'',
      username:'',
      loading:true,
      order_found:false,
      first_job:'',
      markerlist:[],
      confirmation_loading:false,
      partners_icons:{
        "Chompies":Chompies,
        "Cosi":Cosi,
        "EmmySquaredPizza":EmmySquaredPizza,
        "EzCater":EzCater,
        "Foodee":Foodee,
        "HipCityVeg":HipCityVeg,
        "LocalGrind":LocalGrind,
        "QDOBA":QDOBA,
        "QdobaPhilly":QdobaPhilly,
        "Sauce":Sauce,
        "sharebite":sharebite,
        "SimpleCater":SimpleCater,
        "TacoDeli":TacoDeli,
        "vromo":vromo,
        "dlivrd":dlivrd
      },
      btn_back:true,
      // delivery_partner_image:'src/assets/logos/',
      delivery_partner_image:dlivrd,
      order_subtotal:0,
      alert_title:'Confirmation',
      order_confirmed:false,
      dialog:false,
      urgent_link:false,
      alert_description:'Do you want this order ?',
      center: { lat: 41.9855989, lng: -87.8332167 },
      pickup: { lat: 41.9855989, lng: -87.8332167 },
      markerOptionspickup : { position:{ lat: 41.9855989, lng: -87.8332167 }, label: "P", title: "Hooters" },
      drop: { lat: 41.9800399, lng: -87.8650262 },
      markerOptionsdrop : { position:{ lat: 41.9800399, lng: -87.8650262 } , label: "D", title: "Bridge Industrial" },
      jobs:[],
      orders: [
        {
          id: 1,
          orderNumber: 'Pickup_1',
          time: '9:00 AM',
          address: '123 Main St',
        },
        {
          id: 2,
          orderNumber: 'Drop_1',
          time: '10:30 AM',
          address: '456 Elm St',
        }
      ],
      map: null,

      //leaflet map variables
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
    this.order_id = this.$route.params.Order_id
    // Initialize the map
    this.username = localStorage.getItem('username');

    var locationUrl = String(window.location)
    if(locationUrl.includes('/ur/'))
    {
      this.urgent_link = true
      this.btn_back = false
    }
    if(this.urgent_link == true){
      //alert('calling direct')
      // this.urgent_link = false
      this.get_open_order(this.order_id);
    }else{
      this.sessionValidator();
    }

  },
  methods: {
    return_to_list(){
      this.dialog = false
      this.$router.go(-1)
    },
    sessionValidator(){
      // this.loading = false
      var url = this.baseurl + 'dlivrd_drivers_verify_session'
      const data = {
        identity: this.username,
        check:2
      }
      // alert(localStorage.getItem('onboard_session_id'))
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then((response) => {
        //console.log(response)
        this.loading = true
        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            localStorage.setItem('profile_image', verifySession['profile_image']);

            this.get_open_order(this.order_id);
          }
          else{
            alert('session Expired ')
            this.$router.go(-1)
          }

        }
      }).catch(() => {
        //console.log('')
        this.loading = false
      })
    },
    simluate_open_order(){
      this.dialog= false
      this.confirmation_loading = true
    },
    decide_open_order(){
      // this.loading = false
      this.dialog= false
      this.confirmation_loading = true
      var url = this.baseurl + 'assign_open_order'
      var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        "session":localStorage.getItem('onboard_session_id','')
      }
      var  data = {
        identity: this.username,
        order_id:this.order_id
      }
      if(this.urgent_link == true){
        //alert(order_id)
        url = this.baseurl + 'urgent_order_request'
        headers =  {
          'Content-Type': 'application/json;charset=UTF-8'
        }
        data = {
          "token": this.order_id
        }
      }
      // alert(localStorage.getItem('onboard_session_id'))
      axios.post(url, data, {
        headers
      }).then((response) => {
        //console.log('accept request generated')
        //console.log(response)
        this.loading = false
        if(response['data']['Success'] == 'Rider Added to the urgent request list'){

          this.alert_title = 'Order Sent'
          this.alert_description = 'You have been added to the wait list.If order is available it will be sent to your driver app'
          this.confirmation_loading = false
          this.order_confirmed = true
          this.dialog = true
          // this.$router.go(-1)

        }else if(response['data']['Success']){

          this.alert_title = 'Order Sent'
          this.alert_description = 'Please check your driver app to accept the order '
          this.confirmation_loading = false
          this.order_confirmed = true
          this.dialog = true
          // this.$router.go(-1)

        }else if(response['data']['Failure'] == 'Order is already in assigned state.'){

          this.alert_title = 'Order Update'
          this.alert_description = 'If order is available it will be sent to your driver app '
          this.confirmation_loading = false
          this.order_confirmed = true
          this.dialog = true
          // this.$router.go(-1)

        }
        else{
          this.alert_title = 'Order Update'
          this.alert_description = 'If order is available it will be sent to your driver app '
          this.confirmation_loading = false
          this.order_confirmed = true
          this.dialog = true
        }
      }).catch(() => {
        //console.log('')
      })
    },
    append_marker_google_map(){

    },
    get_open_order(order_id){
      // this.loading = false
      var url = this.baseurl + 'get_single_open_order_details'
      var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        "session":localStorage.getItem('onboard_session_id','')
      }
      var data = {
        identity: this.username,
        "page_number": 1,
        "order_id": order_id
      }

      if(this.urgent_link == true){
        //alert(order_id)
        url = this.baseurl + 'urgent_order_retrieve_data'
        headers =  {
              'Content-Type': 'application/json;charset=UTF-8'
            }
        data = {
          "token": order_id
        }
      }

      // alert(localStorage.getItem('onboard_session_id'))
      // alert(this.username)
      axios.post(url, data, {
        headers
      }).then((response) => {
        //console.log(response)

        if(response.status == 200){
          var response = response.data;
          if(response['Success'] == 'Order found.' || response['Success'] == 'Order Returned'){
            this.order_details = response['order']
            this.order_found = true
            this.loading = false
            if( this.order_details['order_subtotal'] !== undefined){
              this.order_subtotal = this.order_details['order_subtotal']
            }else{
              this.order_subtotal = this.order_details['subtotal']
            }
            if(this.order_details['delivery_partner'] in this.partners_icons){
              this.delivery_partner_image = this.partners_icons[this.order_details['delivery_partner']]
            }
            else{
              this.delivery_partner_image = dlivrd
            }
            for(var i=0;i<this.order_details['pickups'].length;i++){
              this.markerOptionsPickupLeaflet = [parseFloat(this.order_details['pickups'][i]['latitude']), parseFloat(this.order_details['pickups'][i]['longitude'])]
              var marker_location = { position:{ lat: parseFloat(this.order_details['pickups'][i]['latitude']), lng: parseFloat(this.order_details['pickups'][i]['longitude']) }, label: "P", title: this.order_details['pickups'][i]['location_name'], icon: this.icon}
              this.markerlist.push(marker_location)

              this.jobs.push({'type':'Pickup','location_name':this.order_details['pickups'][i]['location_name'],'address':this.order_details['pickups'][i]['address'],'time':this.order_details['pickups'][i]['pickupAt'],'latitude':this.order_details['pickups'][i]['latitude'],'longitude':this.order_details['pickups'][i]['longitude'],'marker_location':marker_location})
            }
            for(var i=0;i<this.order_details['dropoffs'].length;i++){
              this.markerOptionsDropLeaflet = [parseFloat(this.order_details['dropoffs'][i]['latitude']), parseFloat(this.order_details['dropoffs'][i]['longitude'])]
              var marker_location = { position:{ lat: parseFloat(this.order_details['dropoffs'][i]['latitude']), lng: parseFloat(this.order_details['dropoffs'][i]['longitude']) }, label: "D", title: this.order_details['dropoffs'][i]['location_name'], icon: this.iconDrop}
              this.markerlist.push(marker_location)
              this.jobs.push({'type':'Dropoff','location_name':this.order_details['dropoffs'][i]['location_name'],'address':this.order_details['dropoffs'][i]['address'],'time':this.order_details['dropoffs'][i]['dropoffAt'],'latitude':this.order_details['dropoffs'][i]['latitude'],'longitude':this.order_details['dropoffs'][i]['longitude'],'marker_location':marker_location})
            }
            this.center = this.markerlist[0]['position']
          }
          else{
            this.loading = false
            // alert('Session Expired Please Login Again')
            // this.$router.go(-1)
          }
        }else{
          this.loading = false
        }
      }).catch(() => {
        //console.log('')
      })
    },
    initMap() {
      // Create a new map instance

    },
    viewOrderDetails(location) {

        this.center = location['position']
    },
  },
};
</script>

<style>


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

.delivery_activity{
  border-radius: 5px;
  border: 2px #0afd01 solid;
  padding: 5px;
}
.decision_button{
  width: 46%;
  height: 40px;
  margin: 6px;

}
.order_view_web {
  height: 100vh;
  background-color: #ffffff;
  max-width: 400px;
  margin: 0 auto;
  /*padding-left: 10px;*/
  /*padding-right: 10px;*/
  padding-bottom: 10px;
}

header {
  text-align: center;
  margin-bottom: 20px;
}
.map_box{
  border: 2px solid #0afd01;
  border-radius: 5px;
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
.activity_block {
  height: 30% !important;
  justify-content:space-between;
  align-items: center;
}
.activity_track{
  width: 3px;
  height: 45%;
  margin-left: 18px;
  background-color: #0afd01;
}
.activity_track_icon{
  height: 45%;
}
.activity_infoblock{

  height: 10%;
  width: 10px;
  border-radius: 50%;
  background: #0afd01;
  margin-left: 14px;
  border: 3px #0afd01 solid;
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
</style>
