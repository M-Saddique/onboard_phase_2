<template>
  <div class="order_view_web" :style="{'background-color':primary_color, 'color': text_color}">

    <div v-if="(loading || confirmation_loading)" style="width: 100%;display: flex;justify-content: center;padding: 10px; background-color: transparent">
      <img  alt="Company logo" class="logo" style="  object-fit: contain;width: 150px" :src=logo_url width="125" height="50" />
    </div>
    <!-- Header -->
    <h3 v-if="(!order_found && !loading)"
        class="heading2"
        style="height: 50px;font-weight: bold;margin-top:100px;text-align: center;padding-left:10px;display: flex; align-items: center; justify-content: center"
        :style="{'color':text_color, 'background-color':secondary_color}">
      {{failmsg}}
    </h3>
    <div v-if="(loading || confirmation_loading)" style="width: 100%; align-items: center; background-color: #26225B; height: 160px">
      <v-img :src="loaderGIF" width="25%" style="margin: auto; margin-top: 50%; z-index: 100;"></v-img>
      <v-card-text
          style="text-align: center; font-size: 20px; font-weight: bold; color: white">Fetching Details...</v-card-text>
    </div>
    <v-dialog
        v-if="!completed"
        v-model="isComplete"
        transition="dialog-top-transition"
        max-width="350px"
        persistent

    >
      <v-col :style="{'background-color': primary_color, 'border-color': text_color}" style="display: grid; justify-items: center; border: 2px solid;">
        <v-icon style="font-size: 80px" :style="{'color':text_color}">mdi-package-variant-closed-check</v-icon>
        <h2  id="header" style="font-weight: bold;text-align: left;padding-left:10px; margin-top:15px; font-size: 25px" :style="{'color':text_color}">O# {{order_id}}</h2>
        <h3 style="font-weight: bold;margin-top:15px;text-align: center;padding-left:10px;" :style="{'color':text_color}">{{complete_msg}}</h3>
        <v-card-actions style="align-self: end; margin-top: 30px; width: 100%;">
          <v-spacer></v-spacer>
          <v-btn
              :style="{'background-color':secondary_color, 'color': text_color}"
              class="btnDialog"
              style="width: 100%; height: 55px"
              variant="text"
              @click="completed = true"
          >
            Done
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-dialog>




    <v-col v-if="(completed && order_found)" style="display: grid; justify-content: center; align-content: center; height: 100%; justify-items: center;">
      <v-icon style="font-size: 80px" :style="{'color':text_color}">mdi-package-variant-closed-check</v-icon>
      <h2  id="header" style="font-weight: bold;text-align: left;padding-left:10px; margin-top:15px" :style="{'color':text_color}">O# {{order_id}}</h2>
      <h3 style="font-weight: bold;margin-top:15px;text-align: center;padding-left:10px;" :style="{'color':text_color}">{{complete_msg}}</h3>
    </v-col>
    <!-- Main Content -->

    <v-dialog
        id="dialogBox"
        v-model="dialog"
        transition="dialog-top-transition"
        max-width="300px"
        persistent
    >
      <v-card>
        <v-card-title class="text-h5" :style="{'background-color':primary_color, 'color': text_color}">{{alert_title}}</v-card-title>
        <v-card-text id="dialogDescription" style="overflow-y: scroll; text-align: justify" v-html="alert_description"></v-card-text>
        <v-card-actions style="align-self: end; margin-top: 30px">
          <v-spacer></v-spacer>
          <v-btn
              prepend-icon="mdi-close"
              class="btnDialog"
              :style="{'background-color': primary_color, 'color':text_color}"

              variant="text"
              @click="dialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="(order_found && !completed)" style="height: 92vh; overflow: scroll; padding-bottom: 82px">
      <main v-if="!loading" >
        <v-row  style="margin: 0; z-index: 1000; height: 0;">
          <div style="width: 100%;display: flex;justify-content: center;padding: 10px; background-color: transparent">
          <img  alt="Company logo" class="logo" style="  object-fit: contain;width: 150px" :src=logo_url width="125" height="50" />
        </div>
          <div style="display: flex; z-index: 2000;justify-content: center; max-width: 400px; width: 100%;border-radius: 4px; margin-bottom: 7px; padding: 0 5px 5px 5px; margin-top: -10px;">
            <div
                v-if="(!loading && order_found && !completed)"
                :style="{'background-color':secondary_color, 'border-color':secondary_color}"
                style="display: flex; width: 92%; align-items: center; justify-content: center; border-radius: 5px">
              <v-icon style="margin-right: 5px">
                mdi-package-variant-closed
              </v-icon>
              <h3  id="header" style="font-weight: bold;text-align: center;" :style="{'color':text_color}">
                Order ID:
                <span>
            #{{order_id}}
          </span>
              </h3>
            </div>
          </div>
        </v-row>
        <!-- Map -->
        <div style="height:75vh; width:100%">
          <l-map ref="map" v-model:zoom="zoom" :center="this.centerLeaflet">
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
        </div>

        <div class="order-list" style="display: block; margin: 15px">
          <div class="delivery_activity" :style="{'background-color': secondary_color}" style="border: 0">
            <!--            <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <h2 style="font-weight: bold;color: black;">Earning</h2><h2 style="color: black;font-weight: bold">{{order_details.order_earnings}} $</h2></div>-->
            <!--            <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;">Distance</p><p style="color: black;"><i class="fas fa-clock"></i>{{ Math.round(order_details.distance_to_dropoff * 100) / 100    }} Miles</p></div>-->
            <div
                :style="{'border-color': text_color, 'background-color': primary_color}"
                style="display: flex; justify-content: space-between; width: 96%; margin: 5px auto; padding: 5px 12px;border-radius: 4px; border: 2px solid; filter: brightness(80%)">
              <div style="display: flex; filter: brightness(100%);">
                <v-icon class="icons" style="margin-right: 4px;">
                  mdi-currency-usd
                </v-icon>
                <p style="font-weight: bold;" >Order Value</p>
              </div>
              <p><i class="fas fa-map-marker-alt"></i> ${{order_subtotal}}</p>
            </div>
            <!--            <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;padding-top: 10px">Partner</p> <img   class="logo" style="  object-fit: contain;width: 150px" :src="delivery_partner_image" width="125" height="50" /></div>-->
            <div style="display: inline-flex;justify-content: center;width: 100%; margin-bottom: 10px">
              <p style="font-weight: bold;">DELIVERY ACTIVITY</p>
            </div>
            <div @click="viewOrderDetails(order.marker_location)" v-for="(order, index) in this.jobs" :key="order.id" class="activity_block" >
              <div style="display: inline-flex">
                <div>
                  <!--                  <div v-if="order.type != 'Pickup'" class="activity_track" :style="{'background_color': secondary_color, 'background': secondary_color, 'border-color': secondary_color}"></div>-->
                  <v-icon v-if="order.type != 'Pickup'" class="icons" style="margin-left: 8px; margin-bottom: 0; padding-bottom: 0; background-color: #0adf01; color: #26225B;">
                    mdi-package-variant-closed
                  </v-icon>
                  <v-icon v-else class="icons" style="margin-left: 8px; margin-bottom: 0; background-color: #0adf01; color: #26225B;">
                    mdi-truck-delivery-outline
                  </v-icon>
                  <div v-if="index < this.jobs.length-1" class="activity_track" :style="{'border-color': text_color}"></div>

                  <!--                  <v-icon class="activity_track">mdi-package-variant-closed</v-icon>-->
                </div>
                <div v-if="order.type != 'Pickup'" style="margin-left: 20px;" >
                  <h4 style="font-weight: bold">{{ order.location_name }}</h4>
                  <p><v-icon  size="20" :color="text_color" >mdi-package-variant-closed</v-icon>  {{ order.time.replace('T',' ') }}</p>
                  <v-row>
                    <v-col cols="1" sm="1" style="width: 10px"><v-icon  size="20" :color="text_color">mdi-map-marker-outline</v-icon></v-col>
                    <v-col style="align-self:flex-end"> <p  style="font-size: 80%;"> {{ order.address  }}</p></v-col>
                  </v-row>
                  <v-row v-if="order.instructions" style="margin-top: 0">
                    <v-col cols="1" sm="1" style="width: 10px; padding-top: 0"><v-icon  size="20" :color="text_color">mdi-information-outline</v-icon></v-col>
                    <v-col style="align-self:flex-end; padding-top: 0"> <p  style="font-size: 80%;"> {{ order.instructions  }}</p></v-col>
                  </v-row>
                </div>
                <div v-if="order.type == 'Pickup'" style="margin-left: 20px;">
                  <h4 style="font-weight: bold">{{ order.location_name }}</h4>
                  <p><v-icon  size="20" :color="text_color">mdi-store-clock</v-icon> {{ order.time.replace('T',' ') }}</p>
                  <v-row>
                    <v-col cols="1" sm="1" style="width: 10px"><v-icon  size="20" :color="text_color">mdi-map-marker-outline</v-icon></v-col>
                    <v-col style="align-self:flex-end"> <p style="font-size: 80%;"> {{ order.address  }}</p></v-col>
                  </v-row>
                  <v-row v-if="order.instructions" style="margin-top: 0">
                    <v-col cols="1" sm="1" style="width: 10px; padding-top: 0"><v-icon  size="20" :color="text_color">mdi-information-outline</v-icon></v-col>
                    <v-col style="align-self:flex-end; padding-top: 0"> <p  style="font-size: 80%;"> {{ order.instructions }}</p></v-col>
                  </v-row>
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-card-title>
          Reference Images
        </v-card-title>

<!--        <v-dialog-->
<!--            v-model="imageDialog"-->
<!--            transition="dialog-top-transition"-->
<!--            max-width="400px"-->
<!--            persistent-->
<!--        >-->
<!--          <v-card>-->
<!--            <v-row style="display: flex; justify-content: end; margin: 0; background-color: #0adf01">-->
<!--                <v-icon v-on:click="imageDialog = false" class="imgDialogClose">-->
<!--                  mdi-close-->
<!--                </v-icon>-->
<!--            </v-row>-->
<!--            <v-row style="margin: 0">-->
<!--              <v-img-->
<!--                  style="border-radius: 0; height: fit-content"-->
<!--                  width="600px"-->
<!--                  :src=imgDialogsrc-->
<!--                  class="bg-grey-lighten-2"-->
<!--              />-->
<!--            </v-row>-->
<!--          </v-card>-->
<!--        </v-dialog>-->
        <v-carousel
            :class="(refImages.length > 1)? 'enableBtns' : 'disableBtns'"
            hide-delimiters style="height: fit-content; margin: 15px auto;">
          <template v-for="item in refImages">
            <v-carousel-item
                class="imagePreviewWrapperBags"
                style="width: 370px; margin: auto; height: fit-content; border-radius: 5px"
                v-for="item2 in item.ref_img"
                :key="item.id"
                :src="item2"
                cover
            ></v-carousel-item>
          </template>
        </v-carousel>
        <v-row style="margin: 0; background-color: transparent;">
          <v-card-title>
            Status Timeline
          </v-card-title>
        </v-row>
        <v-timeline side="end" truncate-line="both" align="start" style="justify-content: start">
          <v-timeline-item
              class="v-timeline-divider-line"
              :dot-color="secondary_color"
              v-for="(item, index) in timeline"
              :key="item.id"
              size="smaller">
            <v-card variant="flat" style="width: 300px; display: flex; background-color: transparent">
              <v-card-text :style="{'color': text_color}" style="padding: 0; display: flex; width: 130px;">
                {{item.process}} {{item.process_value}}
              </v-card-text>
              <v-card-text :style="{'color': text_color}" style="padding: 0; text-align: right;">
                {{index}}
              </v-card-text>
            </v-card>
          </v-timeline-item>
          <v-timeline-item
              class="v-timeline-divider-line"
              :dot-color="secondary_color"
              v-for="(item) in tempTimeline"
              :key="item.id"
              size="smaller">
            <v-card variant="flat" style="width: 300px; display: flex; background-color: transparent">
              <v-card-text :style="{'color': text_color}" style="padding: 0; display: flex; width: 30px">
                {{item}}
              </v-card-text>
              <v-card-text :style="{'color': text_color}" style="padding: 0; text-align: right;">
                Just now
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
        <div v-if="(takeImages)" class="order-list"
             style="display: block;padding-top: 10px; padding-left:15px;padding-right:15px;">
          <div  :style="{'border-color': secondary_color}">
            <img-upload @upload="imageUploaded" :primary_color="primary_color" :secondary_color="secondary_color" :text_color="text_color"></img-upload>
          </div>
        </div>
      </main>
    </div>
    <footer
        v-if=" (!(loading && confirmation_loading) && order_found && !completed)"
        :style="{'background-color': primary_color}"
        style="text-align: center;position:fixed; bottom: 5px; max-width: 400px; width: 26%; display: grid; justify-content: left; justify-items: center;padding-left: 7px">
      <slide-unlock
          :style="{'color': text_color, '--su-color-bg': primary_color, '--su-color-text-normal': text_color}"
          style="border: solid 2px; border-radius: 8px;"
          ref="vueslideunlock"
          :auto-width="false"
          :circle="false"
          :disabled="false"
          :noanimate="false"
          :width="360"
          :height="60"
          :text=taskStatus
          :success-text=taskSuccess
          name="slideunlock"
          @completed="status_update()"
      />
    </footer>



  </div>

</template>

<script>
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
import dlivrd from '../assets/dlivrdlogo.png'

import ImgUpload from "../components/ImgUpload.vue";
import { AtomSpinner } from 'epic-spinners'
//driver app
import SlideUnlock from "vue-slide-unlock"
import dlivrdLogo from "../assets/dlivrdlogo.png"

import chevron from '../assets/chevron-right-double-svgrepo-com.png'
import loaderGIF from '../assets/Box-Loader-New.gif'
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LIcon, LPopup, LPolyline } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import { latLng, icon } from "leaflet";
import mapPickup from '../assets/mappickup.png';
import mapDropoff from '../assets/mapdropoff.png';

export default {
  name: "OpenOrdersDetailRestaurantDriver",
  components: {
    AtomSpinner,
    SlideUnlock,
    ImgUpload,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup,
    LPolyline,
  },
  data() {
    return {
      imageDialog: true,
      imgDialogsrc: null,
      refImages: [],
      timeline: [],
      tempTimeline: [],
      //task_status
      info: false,
      takeImages: false,
      images: [],
      icons: [],
      failmsg: '',
      order_id: '',
      failure: false,
      next_status_info: null,
      tookan_job_id: -1,
      next_status: 0,
      token: '',
      counter: -1,
      taskStatus: "Start Pickup",
      taskSuccess: "Updating",
      completed: false,
      complete_msg: 'Order Completed',
      //business_settings
      logo_url: dlivrdLogo,
      primary_color: 'white',
      secondary_color: '#0adf01',
      text_color: '#26225B',

      slider_icon: chevron,
      loaderGIF: loaderGIF,

      centerLeaflet: [41.9855989, -87.8332167],
      center: [41.9855989, -87.8332167],
      isComplete: false,

      order_details:{},
      // username:'',
      loading: true,
      order_found: false,
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
      zoom: 11,
      // pickupIcon: mapPickup,
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
      jobs:[],
      map: null,
    };
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.token = this.$route.params.token
    // Initialize the map
    // this.username = localStorage.getItem('on_username');
    var time = new Date()
    var date = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate() + ', ' + time.getHours();
    console.log(date)
    var locationUrl = String(window.location)
    if(locationUrl.includes('/rd/'))
    {
      this.get_restaurant_order();
    }

  },
  methods: {
    handleScroll(event) {
      console.log(event)
      console.log(window.scrollY);
    },
    get_restaurant_order(){
      var url = this.baseurl + 'rpanel/business_specific_driver_verify_token'
      var data = {
        "token": this.token
      }
      axios.post(url, data).then((response) => {
        console.log("Order response")
        console.log(response)
        if(response.status == 200){
          var response = response.data;
          if(response['Success']){
            console.log("ssadasd")
            //business_settings
            console.log(response)
            this.refImages = response.data.order_info.dropoffs
            this.markerOptionsPickupLeaflet = []
            this.markerOptionsDropLeaflet = []
            this.order_details = response["data"]["order_info"]
            this.order_id = this.order_details.order_id
            this.next_status_info = this.order_details.next_status_info
            this.taskStatus = this.next_status_info.next_status_text
            this.tookan_job_id = this.next_status_info.tookan_job_id
            this.next_status = this.next_status_info.next_status
            this.order_found = true
            this.timeline = this.order_details['timeline']
            this.loading = false
            if(this.taskStatus == "Dropoff Complete"){
              this.takeImages = true
              // console.log(this.takeImages)
            }
            if( this.order_details['order_subtotal'] != undefined){
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

              this.jobs.push({'type':'Pickup',
                'location_name':this.order_details['pickups'][i]['location_name'],
                'address':this.order_details['pickups'][i]['address'],
                'time':this.order_details['pickups'][i]['pickupAt'],
                'latitude':this.order_details['pickups'][i]['latitude'],
                'longitude':this.order_details['pickups'][i]['longitude'],
                'instructions':this.order_details['pickups'][i]['instructions'],
                'marker_location':marker_location})
            }
            for(var i=0;i<this.order_details['dropoffs'].length;i++){
              this.markerOptionsDropLeaflet = [parseFloat(this.order_details['dropoffs'][i]['latitude']), parseFloat(this.order_details['dropoffs'][i]['longitude'])]
              this.mapCenter()
              var marker_location = {
                position:{
                  lat: parseFloat(this.order_details['dropoffs'][i]['latitude']),
                  lng: parseFloat(this.order_details['dropoffs'][i]['longitude'])
                },
                label: "D",
                title: this.order_details['dropoffs'][i]['location_name'],
                icon: this.iconDrop}
              this.markerlist.push(marker_location)
              // for (var temp = 0; temp < this.order_details['dropoffs'][i]['ref_img'].length; temp++){
              //   this.refImages.push(this.order_details['dropoffs'][i]['ref_img'])
              // }
              this.jobs.push({'type':'Dropoff',
                'location_name':this.order_details['dropoffs'][i]['location_name'],
                'address':this.order_details['dropoffs'][i]['address'],
                'time':this.order_details['dropoffs'][i]['dropoffAt'],
                'latitude':this.order_details['dropoffs'][i]['latitude'],
                'longitude':this.order_details['dropoffs'][i]['longitude'],
                'instructions':this.order_details['dropoffs'][i]['instructions'],
                'marker_location':marker_location})
            }
            this.center = this.markerlist[0]['position']
            this.business_settings = response.data.business_settings
            this.logo_url = this.baseImageurl + this.business_settings.logo_url
            this.primary_color = this.business_settings.primary_color
            this.secondary_color = this.business_settings.secondary_color
            this.text_color = this.business_settings.text_color
            console.log("this.timeline")
            console.log(this.timeline)
            console.log(this.order_details["pickups"][0].instructions)
            console.log('refImages')
            console.log(this.refImages)
            this.refImagesf = JSON.stringify(this.refImages)
            console.log('imgas' , this.refImages)
          }
          else{
            this.loading = false
            this.failmsg = response.Failure
          }
        }
      }).catch(() => {
        //console.log('')
      })

      // console.log("taskStatus")
      // console.log(this.taskStatus)
      // console.log("this.takeImages")
      // console.log(this.takeImages)

    },
    mapCenter() {
      var tempLat = this.markerOptionsPickupLeaflet[0] - (this.markerOptionsPickupLeaflet[0] - this.markerOptionsDropLeaflet[0]) / 2
      var tempLng = this.markerOptionsPickupLeaflet[1] - (this.markerOptionsPickupLeaflet[1] - this.markerOptionsDropLeaflet[1]) / 2
      this.centerLeaflet = [tempLat, tempLng]
      // console.log("this.centerLeaflet")
      // console.log(this.centerLeaflet)
    },
    viewOrderDetails(location) {
      this.center = location['position']
    },
    imageUploaded(imagesList) {
      this.images = imagesList
      // this.imageReceived = true
      // this.alert_title = "Dropoff Images Uploaded"
      // this.alert_description = "The Dropoff images have been uploaded."
      // this.dialog = true
      // console.log("emitted")
      // console.log(this.images)
    },
    status_update(){
      if(this.taskStatus == "Dropoff Complete" && this.images.length < 1)
      {
        this.alert_title = "Missing Dropoff Images"
        this.alert_description = "Please upload the Dropoff images before marking the order as complete."
        this.dialog = true
        this.$refs.vueslideunlock.reset()
        return
      }

      var url = this.baseurl + 'rpanel/business_specific_driver_change_task_status'
      var data = new FormData();
      data.append('token', this.token)
      data.append('tookan_job_id', this.tookan_job_id)
      data.append('next_status', this.next_status)
      if(this.takeImages){
        for(var i = 0; i < this.images.length; i++){
          data.append('drop_image_'+i, this.images[i])
        }
      }
      axios.post(url, data).then((response) => {
        console.log("Update Response")
        console.log(response)
        if(response.status == 200) {
          var result = response.data;
          if (result['Success']){
            this.tempTimeline.push(this.taskStatus)

            // console.log(result)

            this.next_status_info = result.next_status_info
            this.taskStatus = this.next_status_info.next_status_text
            this.tookan_job_id = this.next_status_info.tookan_job_id
            this.next_status = this.next_status_info.next_status
            this.timeline = this.order_details['timeline']
            // console.log("this.next_status")
            // console.log(this.next_status)
            if(this.next_status == -1) {
              // console.log("order completed")
              this.isComplete = true
              this.complete_msg = "Your order has been completed"
            }
            if(this.taskStatus == "Dropoff Complete")
              this.takeImages = true
            else{
              this.takeImages = false
              this.images = []
            }
            this.$refs.vueslideunlock.reset()
          }
          else{
            // console.log("||||||| No Update |||||||")
          }
        }
        else
        {
          // alert("Something went wrong! Please try again")
          this.$refs.vueslideunlock.reset()
        }
      }).catch(() => {
        // console.log('')
      })
    },
    imagePreview(imageSrc){
      this.imageDialog = true
      this.imgDialogsrc = imageSrc
    },
  },
};
</script>

<style>

.disableBtns  .v-window__right{
  display: none;
}
.disableBtns .v-window__left{
  display: none;
}
.enableBtns  .v-window__right{
  height: 30px !important;
  width: 30px !important;
}
.enableBtns .v-window__left{
  height: 30px !important;
  width: 30px !important;
}
.enableBtns .v-window__left:hover{
  background-color: #0adf01;
}
.enableBtns .v-window__right:hover{
  background-color: #0adf01;
}

.imgDialogClose{
  height: 30px;
  width: 30px;
  font-size: 20px;
  margin: 3px;
  background-color: red;
}
.imgDialogClose:hover{
  background-color: red;
}

.v-timeline-divider-line .v-timeline-divider {
  z-index: 0;
}
.v-timeline-divider-line .v-timeline-divider__before {
  width: 0 !important;
  border: 1px #0adf01 dashed;
  margin-top: 1px;
}
.v-timeline-divider-line .v-timeline-divider__after {
  width: 0 !important;
  border: 1px #0adf01 dashed;
}
.v-timeline-divider {
  margin-top: 14%;
}
.leaflet-control {
  margin-top: 100px !important;
  z-index: 1 !important;
}
.slideunlock{
  /*background-color: black !important;*/
  margin: 0 !important;
  padding-right: 11px !important;
  padding-left: 11px !important;
}
.slideunlock-handler{
  background-color: #0adf01 !important;
  border: solid 3px;
  border-color: #26225B;
  border-radius: 5px;
  /*border-top-right-radius: 50%;*/
  /*border-bottom-right-radius: 50%;*/
  margin-left: 8px !important;
  -webkit-filter: brightness(500%) contrast(200%);
  filter: brightness(500%) contrast(200%);
  /*filter: contrast(500%);*/
  background-image:url('../assets/chevron-right-double-svgrepo-com.png') !important;
  background-size: 40px 40px !important;

}
.slideunlock[data-v-50e610f5] {
  --su-size-text: 24px;
  --su-size-padding: 6px;
  --su-size-margin: 2px;
  --su-color-bg: white;
  --su-color-progress-normal-bg: #0adf01 !important;
  --su-color-progress-complete-bg: #0adf01 !important;
  --su-color-text-normal: #0adf01;
  --su-color-text-complete: black !important;
  --su-color-handler-bg: blue !important;
  /*--su-icon-handler: url("https://www.svgrepo.com/svg/533660/chevron-right-double") !important;*/
  -webkit-filter: brightness(0.8);
  filter: brightness(0.8);

  display: flex;
  position: relative;
  box-sizing: content-box;
  padding: var(--su-size-padding);
  background-color: var(--su-color-bg);
  text-align: center;
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
.delivery_activity{
  border-radius: 5px;
  border: 0;
  padding: 5px;
}
.image_block{
  border-radius: 5px;
  border: dashed 2px;
  display: flex;
  justify-content: center;
  align-content: center;
  padding-top: 20px;
  padding-bottom: 18px;
}
.decision_button{
  width: 46%;
  height: 40px;
  margin: 6px;
}
.order_view_web {
  height: 100vh;
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
  margin-top: 20px;
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
  background-color: transparent !important;
  border: 2px dashed;
  width: 0;
  margin-top: 0 !important;
  height: 90% !important;
  margin-left: 18px;
}
.activity_track_icon{
  height: 45% !important;
}
.activity_infoblock{
  height: 10px !important;
  width: 10px !important;
  border-radius: 50%;
  /*background: #0afd01;*/
  margin-left: 14px;
  border: 3px solid;
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
/*button {*/
/*  background-color: #007bff;*/
/*  color: #fff;*/
/*  border: none;*/
/*  border-radius: 5px;*/
/*  padding: 5px 10px;*/
/*  cursor: pointer;*/
/*}*/
.map {
  height: 300px;
  margin-top: 20px;
}
.icons{
  border-radius: 50%;
  background-color: #26225B;
  color: #0adf01;
  font-size: 20px;
  height: 25px;
  width: 25px;
}
.primary_color{
  background-color: white;
}
.secondary_color{
  border-color: #0adf01;
}
.secondary_color_text{
  color: #0adf01;
}
.text_color{
  color: black;
}
.btnDialog .v-btn__overlay{
  background-color: transparent !important;
}
.btnDialog:hover{
  background-color: black !important;
}
</style>
<style scoped>
.heading2{
  height: 50px;
  font-weight: bold;
  margin-top:100px;
  text-align: center;
  padding-left:10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.v-btn{
  background-color: #0000FF;
}

</style>
