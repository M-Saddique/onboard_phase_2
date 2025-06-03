
<template  >

  <div class="order_view_web">
  <header style="background-color: white;border-bottom: 3px #0afd01 solid;">
    <div style="width: 100%;display: flex;justify-content: space-between;padding: 10px">
    <v-icon @click="$router.go(-1)" style="background-color: transparent;color:#0afd01;border-radius: 30px;height: 100%;width: 50px" size="50">mdi-arrow-left-thin-circle-outline</v-icon>
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

                prepend-icon="mdi-close"
                style="background-color: #7efb01"
                variant="text"
                @click="dialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="decide_open_order"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <h1 v-if="!loading" id="header" style="font-weight: bold;text-align: left;padding-left:10px;color: black">0# {{order_details.order_id}}</h1>
    <!-- Main Content -->
    <div style="padding-left:10px;padding-right:10px;height: 75vh;overflow: scroll">
      <atom-spinner v-if="loading" :animation-duration="1000" :size="90" color="#0afd01" style="margin: auto; margin-top: 100px;"/>
    <main v-if="!loading" >


      <div id="map" class="map" style="display: none"></div>
      <GoogleMap id="google_map" api-key="AIzaSyCxupdlf2THy6HbkYf33JTupUz14AP2plY" class="map_box" style="width: 100%; height: 400px;" :center="this.center" :zoom="12" >
        <Marker v-for="marker in markerlist" :options="marker" />
<!--        <Marker :options="this.markerOptionsdrop" />-->
      </GoogleMap>


      <!--      <GmapMap-->
      <!--          :center='center'-->
      <!--          :zoom='12'-->
      <!--          style='width:100%;  height: 400px;'-->
      <!--      />-->
      <div class="order-list" style="display: block;padding-top: 10px">

        <div class="order-details" style="width: 100% !important;margin-bottom: 15px;">
          <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <h2 style="font-weight: bold;color: black;">Earning</h2><h2 style="color: black;font-weight: bold">{{order_details.order_earnings}} $</h2></div>
          <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;">Distance</p><p style="color: black;"><i class="fas fa-clock"></i>{{order_details.distance_to_dropoff}} Miles</p></div>
          <div style="display: inline-flex;justify-content: space-between;width: 100%;"> <p style="font-weight: bold;color: black;">Order Value</p><p style="color: black;"><i class="fas fa-map-marker-alt"></i> {{order_details.order_subtotal}}$</p></div>
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
      <div>
        <button class="decision_button" @click=" this.$router.go(-1)" style="background-color: red">Back</button>
        <button class="decision_button" @click="dialog = true" style="background-color: #0afd01">Interested</button>
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
import { AtomSpinner } from 'epic-spinners'

export default {
  components: { GoogleMap, Marker ,AtomSpinner},
  data() {
    return {
      order_details:{},
      order_id:'',
      username:'',
      loading:true,
      first_job:'',
      markerlist:[],
      delivery_partner_image:'src/assets/logos/',
      alert_title:'Confirmation',
      dialog:false,
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
    };
  },
  mounted() {
    this.order_id = this.$route.params.Order_id
    // Initialize the map
    this.username = localStorage.getItem('on_username');
    this.sessionValidator();
  },
  methods: {
    sessionValidator(){
      // this.loading = false
      var url = this.baseurl + 'dlivrd_drivers_verify_session'
      const data = {
        identity: this.username,
      }
      // alert(localStorage.getItem('onboard_session_id'))
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('onboard_session_id')
        }
      }).then((response) => {
        console.log("Settings session response")
        console.log(response)
        this.loading = true
        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            localStorage.setItem('profile_image', verifySession['profile_image']);

            this.get_open_order(this.order_id);
          }
          else{
            alert('session Expired sessuib exoured')
            this.$router.go(-1)
          }
        }
      }).catch(() => {
        console.log('')
      })
    },
    decide_open_order(){
      // this.loading = false
      this.dialog= false
      var url = this.baseurl + 'assign_open_order'
      const data = {
        identity: this.username,
        order_id:this.order_id
      }
      // alert(localStorage.getItem('onboard_session_id'))
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('onboard_session_id')
        }
      }).then((response) => {
        console.log("Settings session response")
        console.log(response)
        this.loading = true
        if(response.status == 200){

          this.$router.go(-1)

        }
      }).catch(() => {
        console.log('')
      })
    },
    append_marker_google_map(){

    },
    get_open_order(order_id){
      // this.loading = false
      var url = this.baseurl + 'get_single_open_order_details'
      const data = {
        identity: this.username,
        "page_number": 1,
        "order_id": order_id
      }
      // alert(localStorage.getItem('onboard_session_id'))
      // alert(this.username)
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('onboard_session_id')
        }
      }).then((response) => {
        console.log("Settings session response")
        console.log(response)
        this.loading = false
        if(response.status == 200){
          var response = response.data;
          if(response['Success'] == 'Order found.'){
            this.order_details = response['order']
            this.delivery_partner_image += this.order_details['delivery_partner'] + '.png'
            for(var i=0;i<this.order_details['pickups'].length;i++){
              var marker_location = { position:{ lat: parseFloat(this.order_details['pickups'][i]['latitude']), lng: parseFloat(this.order_details['pickups'][i]['longitude']) }, label: "P", title: this.order_details['pickups'][i]['location_name'] }
              this.markerlist.push(marker_location)

              this.jobs.push({'type':'Pickup','location_name':this.order_details['pickups'][i]['location_name'],'address':this.order_details['pickups'][i]['address'],'time':this.order_details['pickups'][i]['pickupAt'],'latitude':this.order_details['pickups'][i]['latitude'],'longitude':this.order_details['pickups'][i]['longitude'],'marker_location':marker_location})
            }
            for(var i=0;i<this.order_details['dropoffs'].length;i++){
              var marker_location = { position:{ lat: parseFloat(this.order_details['dropoffs'][i]['latitude']), lng: parseFloat(this.order_details['dropoffs'][i]['longitude']) }, label: "D", title: this.order_details['dropoffs'][i]['location_name'] }
              this.markerlist.push(marker_location)
              this.jobs.push({'type':'Dropoff','location_name':this.order_details['dropoffs'][i]['location_name'],'address':this.order_details['dropoffs'][i]['address'],'time':this.order_details['dropoffs'][i]['dropoffAt'],'latitude':this.order_details['dropoffs'][i]['latitude'],'longitude':this.order_details['dropoffs'][i]['longitude'],'marker_location':marker_location})
            }
            this.center = this.markerlist[0]['position']
          }
          else{
            alert('session Expired get all orders')
            // this.$router.go(-1)
          }
        }
      }).catch(() => {
        console.log('')
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
