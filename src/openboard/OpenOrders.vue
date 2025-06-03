
<template style="background-color: #0afd01">

  <div class="mobile-view">
  <header style="background-color: white;">
    <div style="width: 100%;display: flex;justify-content: space-between;padding: 10px">
      <v-icon @click="this.dialog = true" style="color: #0afd01;border-radius: 30px; height: 50px;width: 50px; transform: rotate(180deg);" size="50">mdi-logout-variant</v-icon>

<!--      <v-icon  @click="$router.go(-1)" style="background-color: #0afd01;border-radius: 30px;height: 100%;padding: 6px;width: 60px" size="40">mdi-logout-variant</v-icon>-->
<!--  -->
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
    <h1 v-if="!no_order_found" id="header" style="font-weight: bold;text-align: center;color: black">OPEN ORDERS</h1>
    <h2 v-if="no_order_found" id="no_open_order" style="position: absolute;width: 100%;font-weight: bold;padding-top: 100px;text-align: center;color: White; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;">No OPEN ORDERS</h2>
    <div v-if="loading" style="width: 100%;text-align: center;position: absolute">
    <atom-spinner  :animation-duration="1000" :size="90" color="#ffffff" style="margin: auto; margin-top: 100px"/>
    </div>
    <!-- Main Content -->
    <div style="padding-left:10px;padding-right:10px;height: 75vh;overflow: scroll">
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
                  <p style="color: black;width: 100%;text-align: center;font-size: 14px;font-weight: bold;color: black">{{ order.order_earnings }}$</p>

                  <p style="color: black;width: 100%;text-align: center;font-weight: bold ;background-color: #0afd01;margin-top: 10px">Total</p>
                  <p style="color: black;width: 100%;text-align: center;font-size: 14px;font-weight: bold;color: black">{{ order.order_subtotal }}$</p>
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
                      {{order.distance_to_dropoff}} Miles</p>
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
      <div id="map" class="map" style="display: none"></div>
      <GoogleMap api-key="AIzaSyCxupdlf2THy6HbkYf33JTupUz14AP2plY" style="width: 100%; height: 400px;" :center="this.center" :zoom="12" >
        <Marker :options="this.markerOptionspickup" />
        <Marker :options="this.markerOptionsdrop" />
      </GoogleMap>


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
      username:'',
      no_order_found:false,

      center: { lat: 41.9855989, lng: -87.8332167 },
      pickup: { lat: 41.9855989, lng: -87.8332167 },
      markerOptionspickup : { position:{ lat: 41.9855989, lng: -87.8332167 }, label: "P", title: "Hooters" },
      drop: { lat: 41.9800399, lng: -87.8650262 },
      markerOptionsdrop : { position:{ lat: 41.9800399, lng: -87.8650262 } , label: "D", title: "Bridge Industrial" },
      orders:[],
      loading:true,
      alert_title:'Confirmation',
      dialog:false,
      alert_description:'Do you want this Logout ?',
      orders2: [
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

        },{
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

        },{
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

        },{
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

        },{
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

        },{
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

        },{
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
    };
  },
  mounted() {
    // Initialize the map
    this.username = localStorage.getItem('on_username');
    this.sessionValidator();
    this.initMap();
  },
  methods: {
    logout(){
      localStorage.setItem('on_username','');
      localStorage.setItem('onboard_session_id','');
      this.$router.push('/')
    },
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

        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            localStorage.setItem('profile_image', verifySession['profile_image']);

            this.get_open_orders()

          }
          else{
            // alert('session Expired sessuib exoured')
            this.$router.go(-1)
          }
        }
      }).catch(() => {
        console.log('')
      })
    },
    get_open_orders(){
      // alert('test')
      setTimeout(this.get_open_orders, 60000);
      // this.loading = false
      var url = this.baseurl + 'get_all_open_orders'
      const data = {
        identity: this.username,
        "page_number": 1,
        "records_per_page": 20
      }
      // alert(localStorage.getItem('onboard_session_id'))
      // alert(this.username)
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('onboard_session_id')
        }
      }).then((response) => {
        this.loading = false
        console.log("Settings session response")
        console.log(response)

        if(response.status == 200){
          var response = response.data;
          if(response['Success'] == ''){
           this.orders = response['orders']
            this.no_order_found = false
          }else if(response['Failure'] == 'No eligible orders found for the provided rider.'){

            this.no_order_found = true
          }
          else{
            alert('session Expired get all orders')
            this.$router.go(-1)
          }
        }
      }).catch(() => {
        console.log('')
      })
    },
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
