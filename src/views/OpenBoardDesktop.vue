<template>
    <v-card v-if="loadView" style="background-color: #ffffff;width: 100vw;height: 100vh; z-index: 101">
      <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
    </v-card>
  <v-container v-if="!loadView" fluid style="padding: 0">
    dialog box
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
            <!--        <v-card-text v-if="showError" style="color:red; padding-top: 0px" v-html="errorMessage"></v-card-text>-->
            <v-card-actions style="align-self: end; margin-top: 30px">
              <v-spacer></v-spacer>
              <v-btn
                  v-if="interested || (confirm_logout && session_live)"
                  prepend-icon="mdi-close"
                  style="background-color: #7efb01"
                  variant="text"
                  @click="btnCancel"
              >
                Cancel
              </v-btn>

              <v-btn
                  v-if="order_confirmed == false && !confirm_logout && session_live"
                  prepend-icon="mdi-check"
                  style="background-color: #7efb01"
                  variant="text"
                  @click="decide_open_order"
              >
                Confirm
              </v-btn>

              <v-btn
                  v-if="confirm_logout"
                  prepend-icon="mdi-check"
                  style="background-color: #7efb01"
                  variant="text"
                  @click="logout"
              >
                Yes
              </v-btn>
              <v-btn
                  v-if="order_confirmed == true && !confirmLogout"
                  prepend-icon="mdi-check"
                  style="background-color: #7efb01"
                  variant="text"
                  @click="dialog = false"
              >
                Ok
              </v-btn>
              <v-btn
                  v-if="!session_live"
                  prepend-icon="mdi-check"
                  style="background-color: #7efb01"
                  variant="text"
                  @click="logout"
              >
                Ok
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    <v-layout id="openBoardView">
      <v-app-bar
          color="#0AFD01"
          class="top_bar_title"
          prominent
      >
        <v-app-bar-nav-icon variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="toolbarTitleStyle" style="margin: 0">Open Opportunity Board</v-toolbar-title>
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
            <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="confirmLogout"></v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>
      <v-main style="display: block; z-index: 101; background-color: #F2F3F5; padding-top: 35px; padding-bottom: 0; margin-bottom: 0">
        <v-row style="color: #26225b; display: flex; margin: 0; padding: 0">
          <v-col cols="3" style="padding-left: 0; padding-right: 0; padding-bottom: 0; overflow-y: scroll; overflow-x: hidden; height: 96vh; border-right: 1px solid #cccccc; display: block;">
            <v-card-text v-if="!no_order_found" style="padding: 0; text-align-last: center; font-size: 18px; padding-top: 20px">Available Orders</v-card-text>
            <v-divider v-if="!no_order_found" color="#0AFD01" thickness="3"></v-divider>
            <v-row class="orderCard" v-if="!no_order_found" v-for="(order, index) in orders" v-on:click="get_open_order(order.order_id)">
              <v-col style="padding-left: 0; padding-right: 0; padding-bottom: 0">
                <v-row>
                  <v-col cols="9" style="padding: 0; display: flex; align-items: center">
                    <v-icon style="font-size: 25px; border: 2px solid #26225b; border-radius: 30px; height: 30px; width: 30px">mdi-package-variant-closed</v-icon>
                    <v-card-text style="padding: 0; margin-left: 4px;font-size: 16px; font-weight: bolder">OrderID: O#{{order.order_id}}</v-card-text>
                  </v-col>
                  <v-col cols="3" style="padding: 0; display: grid; justify-content: right; align-content: center;">
                    <v-card-text style="font-size: 10px; padding: 4px 8px; background-color: #0adf01; border-radius: 25px; font-weight: bolder">
                      Earn ${{order.order_earnings}}
                    </v-card-text>
                  </v-col>
                </v-row>
                <v-row style="text-wrap: normal; justify-content: space-between; padding: 5px">
                  <v-card-subtitle style="padding: 0; font-size: 12px; display: flex">
                    <v-icon style="margin-right: 3px">mdi-clock</v-icon>
                    {{ order.pickups[0]['pickupAt'].replace('T',' ') }}</v-card-subtitle>
                  <v-card-subtitle style="padding: 0; font-size: 12px">
                    <v-icon style="margin-right: 3px">mdi-car-side</v-icon>
                    {{Math.round(order.distance_to_dropoff * 100) / 100 }} Miles</v-card-subtitle>
                  <v-card-subtitle style="padding: 0; font-size: 12px">
                    <v-icon style="margin-right: 3px">mdi-map-marker</v-icon>
                    {{order.pickups[0].address}}</v-card-subtitle>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-else style="display: grid; justify-content: center; justify-items: center; align-items: center; align-content:center;height: 100%">
              <v-icon style="font-size: 100px;">mdi-emoticon-sad-outline</v-icon>
              <v-card-title style="font-weight: bold; margin-bottom: 30px">There are no orders available</v-card-title>
              <v-btn @click="set_notify_me" v-if="!notify_me" variant="outlined" height="50" color="#0E383A" class="notifyMeBtn orderDetailsHeaderBtn">
                <v-icon size="28">mdi-bell</v-icon>
                Notify Me
              </v-btn>
            </v-row>
            <!--        </v-row>-->
          </v-col>
          <v-col cols="9" v-if="order_selected && !loading" style="padding: 0; display: grid; align-content: space-between; height: 100%">
            <v-row>
              <v-row style="height:48vh; width:97%; margin: 19px 19px 3px !important;">
                <l-map ref="map" v-model:zoom="zoom" :center="this.center">
                  <l-tile-layer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      layer-type="base"
                      name="OpenStreetMap"
                  ></l-tile-layer>
                  <l-marker
                      v-for="marker in this.markerlist"
                      :lat-lng="marker.position"
                      :icon="marker.icon"
                  >
                  </l-marker>
                </l-map>
              </v-row>
              <v-row style="margin: 0; z-index: 1000; background-color: #F2F3F5; position: relative; bottom: 0px">
                <v-col cols="8" style="padding: 0; max-height: 38vh; display: grid; align-content: space-between;">
                  <v-card class="order-list"
                          variant="flat"
                          style="display: block; margin: 15px 15px 5px; max-height:26vh; padding: 8px">
                    <v-row
                        :style="{'border-color': text_color}"
                        style="display: flex; justify-content: space-between; margin: 5px auto; padding: 5px 12px;border-radius: 4px; border: 2px solid;">
                      <v-row style="display: flex; filter: brightness(100%); align-items: center">
                        <v-icon class="icons" style="margin-right: 4px;">
                          mdi-clock
                        </v-icon>
                        <v-card-text style="font-weight: bold; padding: 0; font-size: 18px" >Order Value</v-card-text>
                      </v-row>
                      <p><i class="fas fa-map-marker-alt"></i> ${{order_subtotal}}</p>
                    </v-row>
                    <v-row>
                      <v-col cols="12" style="padding: 5px 0 0;">
                        <v-row>
                          <v-col cols="6" style="display: flex; align-items: center; padding: 0">
                            <v-icon style="font-size: 21px; width: 33px; height: 33px;border: 3px solid #26225b; border-radius: 25px">
                              mdi-map-marker-distance
                            </v-icon>
                            <v-card-text style="padding-top: 0; padding-bottom: 0; font-size: 16px">
                              Distance
                            </v-card-text>
                          </v-col>
                          <v-col cols="6" style="display: flex; align-items: center; justify-content: right; padding-right: 0;">
                            <v-card-text style="padding-top: 0; padding-bottom: 0; padding-right: 0;font-size: 16px; text-align: right">
                              {{total_distance}} Miles
                            </v-card-text>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="6" style="display: flex; align-items: center; padding: 0">
                            <v-icon style="font-size: 21px; width: 33px; height: 33px;border: 3px solid #26225b; border-radius: 25px">
                              mdi-cash
                            </v-icon>
                            <v-card-text style="padding-top: 0; padding-bottom: 0; font-size: 16px">
                              Earnings
                            </v-card-text>
                          </v-col>
                          <v-col cols="6" style="display: flex; align-items: center; justify-content: right; padding-right: 0;">
                            <v-card-text style="padding-top: 0; padding-bottom: 0; padding-right: 0;font-size: 16px; text-align: right">
                              $ {{order_subtotal}}
                            </v-card-text>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="6" style="display: flex; align-items: center; padding: 0">
                            <v-icon style="font-size: 21px; width: 33px; height: 33px;border: 3px solid #26225b; border-radius: 25px">
                              mdi-handshake
                            </v-icon>
                            <v-card-text style="padding-top: 0; padding-bottom: 0; font-size: 16px">
                              Partner
                            </v-card-text>
                          </v-col>
                          <v-col cols="6" style="display: flex; align-items: center; justify-content: right; padding-right: 0;">
                            <v-card-text style="padding-top: 0; padding-bottom: 0; padding-right: 0;font-size: 16px; text-align: right">
                              <img
                                  alt="Vue logo"
                                  class="logo"
                                  style="  object-fit: contain;"
                                  :src="delivery_partner_image"
                                  width="80"
                                  height="20"
                              />
                            </v-card-text>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card>
                  <v-card class="order-list"
                          variant="flat"
                          style="display: block; margin: 0px 15px; max-height: 9vh; padding: 12px 0; background-color: transparent; : right">
                    <v-row>
                      <v-col style="padding: 0">
                        <v-btn class="btnDecline" v-on:click="order_selected = false" style="width: 95%; height: 47px; border-radius: 10px">Decline</v-btn>
                      </v-col>
                      <v-col style="padding: 0; display: flex; justify-content: right">
                        <v-btn v-on:click="confirmOrder" class="btnAccept" style="width: 95%; height: 47px; border-radius: 10px">Interested</v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col cols="4" style="padding: 0; max-height: 38vh">
                  <v-card class="order-list"
                          variant="flat"
                          style="display: block; margin: 15px; max-height: 35vh; overflow: scroll; z-index: 101; padding: 0">
                    <div class="delivery_activity" :style="{'background-color': secondary_color}" style="border: 0">
                      <v-col
                          :style="{'border-color': text_color}"
                          style="display: flex;width: 97%; margin: 4px auto; padding: 5px 12px;border-radius: 4px; border: 2px solid; height: 41px">
                        <v-row style="display: flex; filter: brightness(100%); align-items: center;">
                          <v-icon class="icons" style="margin-right: 4px;">
                            mdi-clock
                          </v-icon>
                          <v-card-text style="font-weight: bold; padding: 0; font-size: 18px" >Delivery Activity</v-card-text>
                        </v-row>
                      </v-col>
                      <div style="display: inline-flex;justify-content: center;width: 100%; margin-bottom: 10px">
                        <p style="font-weight: bold;"></p>
                      </div>
                      <div v-for="(order, index) in this.jobs" :key="order.id" class="activity_block" >
                        <div style="display: inline-flex">
                          <div>
                            <v-icon v-if="order.type != 'Pickup'" class="icons" style="margin-left: 8px; margin-bottom: 0; padding-bottom: 0; background-color: #0adf01; color: #26225B;">
                              mdi-package-variant-closed
                            </v-icon>
                            <v-icon v-else class="icons" style="margin-left: 8px; margin-bottom: 0; background-color: #0adf01; color: #26225B; ">
                              mdi-truck-delivery-outline
                            </v-icon>
                            <div v-if="index < this.jobs.length-1" class="activity_track" :style="{'border-color': text_color}"></div>
                          </div>
                          <div v-if="order.type != 'Pickup'" style="margin-left: 20px;" >
                            <h4 style="font-weight: bold">{{ order.location_name }}</h4>
                            <p><v-icon  size="20" :color="text_color" >mdi-package-variant-closed</v-icon>  {{ order.time.replace('T',' ') }}</p>
                            <v-row>
                              <v-col cols="1" sm="1" style="width: 10px; padding-left: 0"><v-icon  size="20" :color="text_color">mdi-map-marker-outline</v-icon></v-col>
                              <v-col style="align-self:flex-end; padding-right: 0"> <p  style="font-size: 80%;"> {{ order.address  }}</p></v-col>
                            </v-row>
                          </div>
                          <div v-if="order.type == 'Pickup'" style="margin-left: 20px;">
                            <h4 style="font-weight: bold">{{ order.location_name }}</h4>
                            <p><v-icon  size="20" :color="text_color">mdi-store-clock</v-icon>  {{ order.time.replace('T',' ') }}</p>
                            <v-row>
                              <v-col cols="1" sm="1" style="width: 10px; padding-left: 0"><v-icon  size="20" :color="text_color">mdi-map-marker-outline</v-icon></v-col>
                              <v-col style="align-self:flex-end; padding-right: 0"> <p style="font-size: 80%;"> {{ order.address  }}</p></v-col>
                            </v-row>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-row>
          </v-col>
          <v-col v-else-if="!loading" cols="9" style="display: grid; justify-content: center; align-content: center; justify-items: center; padding: 0; background-color: #ececec">
            <v-icon style="font-size: 90px; height: 130px; width: 130px; border: 3px solid #26225b; border-radius: 50%">
              mdi-truck-delivery-outline
            </v-icon>
            <v-card-title style="padding: 0; font-weight: bold; font-size: 24px; margin-top: 10px">Select an Order to view its details</v-card-title>
          </v-col>
          <v-col v-else cols="9" style="display: grid; justify-content: center; align-content: center; justify-items: center">
            <atom-spinner v-if="loading" :animation-duration="1000" :size="90" color="#0AFD01"/>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </v-container>


</template>

<script>
import dlivrd from '../assets/dlivrdlogo.png'
import { AtomSpinner } from 'epic-spinners'

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LIcon, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import { latLng, icon } from "leaflet";
import mapPickup from '../assets/mappickup.png';
import mapDropoff from '../assets/mapdropoff.png';
import axios from "axios";
import Chompies from "../assets/logos/Chompies.png";
import Cosi from "../assets/logos/Cosi.png";
import EmmySquaredPizza from "../assets/logos/EmmySquaredPizza.png";
import EzCater from "../assets/logos/EzCater.png";
import Foodee from "../assets/logos/Foodee.png";
import HipCityVeg from "../assets/logos/HipCityVeg.png";
import LocalGrind from "../assets/logos/LocalGrind.png";
import QDOBA from "../assets/logos/QDOBA.png";
import QdobaPhilly from "../assets/logos/QdobaPhilly.png";
import Sauce from "../assets/logos/Sauce.png";
import sharebite from "../assets/logos/sharebite.png";
import SimpleCater from "../assets/logos/SimpleCater.png";
import TacoDeli from "../assets/logos/TacoDeli.png";
import vromo from "../assets/logos/vromo.png";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import englishImg from "../assets/english.png";
import spanishImg from "../assets/spanish.png";
import loader from "../assets/DlivrdLogo.gif";

export default {
  name: "OpenBoardDesktop",
  components: {
    NavigationDrawer,
    AtomSpinner,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup,
    LPolyline,
  },
  data(){
    return{
      loader: loader,
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
      interested: false,
      cancelButtonText: 'Cancel',
      agreeButtonText: '',
      drawer: false,
      validationFailed: false,
      name: null,
      userProfileImage: null,
      notify_me: false,
      loading: false,
      loadView: true,
      order_selected: false,
      dialog:false,
      order_confirmed:false,
      no_order_found: true,
      confirm_logout:false,
      alert_title:'Confirmation',
      alert_description:'Do you want this order ?',
      session_live: true,
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
      order_details:{},
      orders: [],
      order_found:false,
      text_color: '#26225B',
      primary_color: '#0adf01',
      secondary_color: '#ffffff',
      order_subtotal: '20',
      center: [41.9855989, -87.8332167],
      pickup: { lat: 41.9855989, lng: -87.8332167 },
      drop: { lat: 41.9800399, lng: -87.8650262 },
      markerlist:[],
      map: null,
      zoom: 11,
      delivery_partner_image: dlivrd,
      total_distance: '14.6',
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
      jobs:[
        {
          type: 'Pickup',
          location_name: 'Colabs',
          time: '2024-01-16 10:50:00',
          address: '22N Colabs, Johar Town',
        },
        {
          type: 'Dropoff',
          location_name: 'Colabs',
          time: '2024-01-16 10:50:00',
          address: '22N Colabs, Johar Town',
        }
      ],
      fleet_id: null,
    }
  },
  mounted() {
    if(localStorage.getItem('is_dlivrd_driver') == 'false'){
      this.$router.push('/checklist')
      return;
    }
    // Initialize the map
    this.username = localStorage.getItem('username');
    this.name = localStorage.getItem('name');
    this.sessionValidator();
    this.punch_last_call_time()
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
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
      localStorage.setItem('username','');
      localStorage.setItem('session_id','');
      this.$router.push('/')
    },
    sessionValidator(){
      this.loadView = true
      console.log("OpenOrders validator")
      var url = this.baseurl + 'dlivrd_drivers_verify_session'
      if(localStorage.getItem('username') == '' || localStorage.getItem('username') == null){
        // this.$router.push('/')
      }
      this.username = localStorage.getItem('username')
      var data = {
        identity: this.username,
        check:1
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
          //"session":"bb81f8154d510682df9f206eb33e0e8e"
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
            if(verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true){
              this.validationFailed = false;
            }
            else{
              this.validationFailed = true;
            }
            this.loadView = true;
            this.userProfileImage = localStorage.getItem('userProfileImage');
            this.initMap();
            this.get_open_orders()
          }
          else {
            this.loadView = false
            this.dialog = true
            this.alert_title = "Failure"
            this.alert_description = verifySession['Failure']
            this.session_live = false
            this.order_selected= false
            this.order_confirmed=false
            this.confirm_logout=false
          }
          this.userProfileImage = localStorage.getItem('userProfileImage');
        }
        else{
          console.log("Session not verified")
          this.session_logout()
        }
      }).catch(() => {
        // //console.log('')
      })
    },
    session_logout(){
      localStorage.setItem('username','');
      localStorage.setItem('session_id','');
      this.alert_title = "Session Expired."
      this.alert_description = "Please login again"
      this.session_live = false
      this.dialog = true
      this.order_selected= false
      this.order_confirmed=false
      this.confirm_logout=false
    },
    punch_last_call_time(){
      var current = new Date();
      localStorage.setItem('last_call_time',current.getTime())
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

      // if(localStorage.getItem('session_id') != ''){
      //   this.timeout_inst = true
      //   setTimeout(this.get_open_orders, this.refreash_timeline);
      // }
      var url = this.baseurl + 'get_all_open_orders'
      var data = {
        identity: this.username,
        // identity: this.username,
        "page_number": 1,
        "records_per_page": 30,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
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
          "session":localStorage.getItem('session_id'),
          // "session":"bb81f8154d510682df9f206eb33e0e8e"
        }
      }).then((response) => {
        console.log("Openboard desktop response")
        console.log(response)
        this.loading = false
        if(response.status == 200){
          this.loadView = false
          var response = response.data;
          if(response['Success']){
            this.no_order_found = false
            this.orders = response['orders']
          }
          else if(response['Failure'] == "No eligible orders found for the provided rider."){
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
    initMap() {
      // Create a new map instance

    },
    get_open_order(order_id){

      this.loading = true
      var url = this.baseurl + 'get_single_open_order_details'
      var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        "session":localStorage.getItem('session_id')
        // "session":"bb81f8154d510682df9f206eb33e0e8e"
      }
      var data = {
        identity: this.username,
        // identity: this.username,
        "page_number": 1,
        "order_id": order_id
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
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
      axios.post(url, data, {
        headers
      }).then((response) => {
        console.log("Single order response")
        console.log(response)
        if(response.status == 200){
          this.jobs= []
          this.markerlist = [];
          var response = response.data;
          this.loading = false
          if(response['Success'] == 'Order found.' || response['Success'] == 'Order Returned'){
            this.order_details = response['order']
            this.order_found = true
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
            this.total_distance = this.order_details['distance_to_dropoff']
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
            this.order_selected = true
          }
        }else{
          this.loading = false
        }
      }).catch(() => {
        //console.log('')
      })
    },
    decide_open_order(){
      // this.loading = false
      this.dialog= false
      this.confirmation_loading = true
      var url = this.baseurl + 'assign_open_order'
      var headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        "session":localStorage.getItem('session_id')
        // "session":"bb81f8154d510682df9f206eb33e0e8e"
      }
      var  data = {
        identity: this.username,
        // identity: this.username,
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
    confirmOrder(){
      this.intersted = true
      this.dialog = true
      this.alert_title = 'Confirmation'
      this.alert_description = 'Do you want this order?'
    },
    set_notify_me(){
      this.loading = true
      var url = this.baseurl + 'mark_notify_me'
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
      }).then((response) => {
        this.loading = false
        if(response.status == 200){
          console.log('response')
          console.log(response)
          var response = response.data;
          if(response['Success'] == 'You will be notified when an open order is available.'){
            this.notify_me = false
          }
        }
      }).catch(() => {
        ////console.log('')
      })
    },
    confirmLogout(){
      this.confirm_logout = true
      this.dialog = true
      this.alert_title = 'Logout'
      this.alert_description = 'Are you sure you want to logout?'
    },
    closeDrawer(){
      this.drawer = false;
    },
    btnCancel(){
      this.dialog = false
      this.confirm_logout = false
      this.interested = false
    }
  },
}
</script>

<style scoped>
.headerRow{
  background-color: white;
  min-height: 80px;
  align-content: center;
  margin: 0 !important;
  border-bottom: 2px solid #cccccc;
}
.v-row{
  margin: 0 !important;
}
.orderCard{
  padding-left: 12px;
  padding-right: 12px;
}
.orderCard:hover{
  cursor: pointer;
  background-color: #cccccc;
}
.icons{
  border-radius: 50%;
  background-color: #26225B;
  color: #0adf01;
  font-size: 20px;
  height: 25px;
  width: 25px;
}
.order-list{
  border-radius: 10px;
}
.btnAccept{
  background-color: #0adf01;
  color: white !important;
}
.btnAccept:hover{
  background-color: #26225b;
  color: #0adf01 !important;
}
.btnDecline{
  background-color: darkred;
  color: white !important;
}
.btnDecline:hover{
  background-color: red;
  color: white !important;
}
</style>