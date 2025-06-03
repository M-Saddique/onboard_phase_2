<template>
  <!-- popup dialog box -->
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
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  <div class="mainPageview">
    <header style="background-color: white;">
      <div style="width: 100%;display: flex;justify-content: space-between;padding: 30px 10px 0 10px">
        <img alt="Vue logo" class="logo" style="  object-fit: contain;width: 150px" src="../assets/dlivrdlogo.png" width="125" height="50" />
        <v-icon @click="logout" style="height: 50px;width: 50px" size="40">mdi-logout-variant</v-icon>
      </div>
    </header>
    <!-- Header -->
    <h1 id="header" style="font-weight: bold;text-align: center;color: red">OPEN ORDERS 2</h1>
    <div style="display: inline-flex; width: 100%">
      <!-- Orders List -->
      <div style="width: 60%">
        <!-- Main Content -->
        <div style="padding-left:10px;padding-right:10px;height: 75vh;overflow: scroll">
          <main >
            <div v-for="order in orders" :key="order.id" class="order-item openjob_block" style="background-color: white">
              <div class="order-info" style="width: 100%" @click="">
                <div class="order-details" style="padding: 0px !important;margin: 0px!important;width: 100%">
                  <v-row style="display: inline-flex;width: 100%;margin: 0px;" >
                    <v-col class="justify-center" style="padding: 0px;margin: 0px;width: 20% !important; align-self: center;flex-grow:0.2;">
                      <p style="color: black;width: 100%;text-align: center;font-weight: bold ;background-color: #0afd01">Earn</p>
                      <p style="color: black;width: 100%;text-align: center;font-size: 20px;font-weight: bold;color: black">{{ order.Earning }}</p>
                    </v-col>
                    <v-col style="padding: 0px;width: 20% !important; border-left: 1px solid #0afd01;margin-right: 5px;padding-left: 6px;padding-top: 5px;padding-bottom: 5px;">
                      <p style="color: black;font-size: 80%;font-weight: bold">O# {{ order.ONumber }}</p>
                      <v-col style="flex-grow:0.2;padding: 0px !important;">
                        <p style="color: black;font-size: 80%;"> <v-icon  size="20" style="color: #0afd01">mdi-store-clock</v-icon> {{ order.time }}</p>
                        <p style="color: black;font-size: 80%;"><v-icon  size="20" style="color: #0afd01">mdi-map-marker-outline</v-icon>  {{ order.address }}</p>
                        <p style="color: black;font-size: 80%;"><v-icon  size="20" style="color: #0afd01">mdi-truck-delivery-outline</v-icon>  1 Pickup - 2 Delivery</p>
                      </v-col>
                    </v-col>
                  </v-row>
                </div>
              </div>
              <button @click=" this.$router.push('urgentOrder')" style="background-color: transparent;color: black;font-weight: bold;margin-right: 10px;">
                <v-icon style="background-color: transparent;border-radius: 30px;height: 100%;width: 2px" size="50">mdi-chevron-right</v-icon>
              </button>
            </div>
            <div style="display: none">
              <div id="map" class="map" style="display: none"></div>
              <GoogleMap api-key="" style="width: 100%; height: 400px;" :center="this.center" :zoom="12" >
                <Marker :options="this.markerOptionspickup" />
                <Marker :options="this.markerOptionsdrop" />
              </GoogleMap>


              <!--      <GmapMap-->
              <!--          :center='center'-->
              <!--          :zoom='12' :KEY=""-->
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
      <!-- Order Details -->
      <div style="width: 40%">
        <div style="padding-left:10px;padding-right:10px;height: 75vh;overflow: scroll">
          <main>
            <OpenOrderDetails></OpenOrderDetails>
          </main>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <footer style="margin-bottom: 20px;height: 10vh; color: white">
      <p style="text-align: center">&copy; 2023 dlivrd.  Rights Reserved.</p>
    </footer>
  </div>
</template>

<script>
// import GoogleMapsApiLoader from 'google-maps-api-loader'
import { GoogleMap, Marker } from "vue3-google-map";
import OpenOrderDetails from "../components/OpenOrderDetails.vue";
import axios from "axios";

export default {
  components: { GoogleMap, Marker, OpenOrderDetails },
  data() {
    return {
      drawer: false,
      center: { lat: 41.9855989, lng: -87.8332167 },
      pickup: { lat: 41.9855989, lng: -87.8332167 },
      markerOptionspickup : { position:{ lat: 41.9855989, lng: -87.8332167 }, label: "P", title: "Hooters" },
      drop: { lat: 41.9800399, lng: -87.8650262 },
      markerOptionsdrop : { position:{ lat: 41.9800399, lng: -87.8650262 } , label: "D", title: "Bridge Industrial" },
      orders: [
        {
          id: 1,
          orderNumber: 'Pickup_1',

          time: '9:00 AM',
          address: '123 Main St',
          OName:'Olo',
          ONumber:'165498498494',
          PickupLocation:['Tacidekku Cibgress Caterubg'],
          DueIn: ['3 H, 57 m'],
          NumberOfTask: 4,
          Earning:'100$',
          TravelDistance:14.6,

        },
        {
          id: 1,
          orderNumber: 'Pickup_1',

          time: '9:00 AM',
          address: '123 Main St',
          OName:'Olo',
          ONumber:'165498498494',
          PickupLocation:['Tacidekku Cibgress Caterubg'],
          DueIn: ['3 H, 57 m'],
          NumberOfTask: 4,
          Earning:'100$',
          TravelDistance:14.6,

        },
        {
          id: 1,
          orderNumber: 'Pickup_1',

          time: '9:00 AM',
          address: '123 Main St',
          OName:'Olo',
          ONumber:'165498498494',
          PickupLocation:['Tacidekku Cibgress Caterubg'],
          DueIn: ['3 H, 57 m'],
          NumberOfTask: 4,
          Earning:'100$',
          TravelDistance:14.6,

        },
        {
          id: 1,
          orderNumber: 'Pickup_1',

          time: '9:00 AM',
          address: '123 Main St',
          OName:'Olo',
          ONumber:'165498498494',
          PickupLocation:['Tacidekku Cibgress Caterubg'],
          DueIn: ['3 H, 57 m'],
          NumberOfTask: 4,
          Earning:'100$',
          TravelDistance:14.6,

        },
        {
          id: 1,
          orderNumber: 'Pickup_1',

          time: '9:00 AM',
          address: '123 Main St',
          OName:'Olo',
          ONumber:'165498498494',
          PickupLocation:['Tacidekku Cibgress Caterubg'],
          DueIn: ['3 H, 57 m'],
          NumberOfTask: 4,
          Earning:'100$',
          TravelDistance:14.6,

        },
        {
          id: 1,
          orderNumber: 'Pickup_1',

          time: '9:00 AM',
          address: '123 Main St',
          OName:'Olo',
          ONumber:'165498498494',
          PickupLocation:['Tacidekku Cibgress Caterubg'],
          DueIn: ['3 H, 57 m'],
          NumberOfTask: 4,
          Earning:'100$',
          TravelDistance:14.6,

        },
        {
          id: 1,
          orderNumber: 'Pickup_1',

          time: '9:00 AM',
          address: '123 Main St',
          OName:'Olo',
          ONumber:'Order 165498498494',
          PickupLocation:['Tacidekku Cibgress Caterubg'],
          DueIn: ['3 H, 57 m'],
          NumberOfTask: 4,
          Earning:'100$',
          TravelDistance:14.6,

        },
      ],
      map: null,
      username: null,
      name: null,
      alert_title: null,
      alert_description: null,
      dialog: false,
      agreeButtonText: null,
      cancelButtonText: null,
      userProfileImage: null,
    };
  },
  beforeMount(){
    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
  },
  mounted() {
    // Initialize the map
    this.initMap();
  },
  methods: {
    initMap() {
      // Create a new map instance

    },
    viewOrderDetails(orderId) {
      // Handle logic to view order details
      if(orderId == 1){
        this.center = this.pickup
      }else{
        this.center = this.drop
      }
      console.log('View details for order ID:', orderId);
    },

    sessionValidator(){
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
        if(response.status == 200){
          var verifySession = response.data;
          this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
        }
        else{
          localStorage.setItem('email', '');
          localStorage.setItem('password', '');
          localStorage.setItem('username','')
          localStorage.setItem('stage', '')
          localStorage.setItem('country','')
          localStorage.setItem("currentStage",'')
          this.$router.push('/');
        }
      }).catch(() => {
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
.mainPageview {
  background-color: #eeeeee;
  width: 100vw;
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
  height: 200px;
  margin-top: 20px;
}
</style>
