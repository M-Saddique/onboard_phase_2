<template>
  <div id="header" class="order_view_webb">
    <h1 class="orderNumberStyle">0# 48646464</h1>
    <!-- Main Content -->
    <div class="mainDIV">
      <main>
        <GoogleMap api-key="AIzaSyCxupdlf2THy6HbkYf33JTupUz14AP2plY" class="map_box" style="width: 100%; height: 400px;" :center="this.center" :zoom="12" >
          <Marker :options="this.markerOptionspickup" />
          <Marker :options="this.markerOptionsdrop" />
        </GoogleMap>
        <div class="order-list">
          <div class="order-details">
            <div class="orderBenefits"> <h2 class="orderBenefitsTextStyle">Earning</h2><h2 class="orderBenefitsTextStyle">50 $</h2></div>
            <div class="orderBenefits"> <p class="orderBenefitsTextStyle">Distance</p><p style="color: black;"><i class="fas fa-clock"></i>14.6 Miles</p></div>
            <div class="orderBenefits"> <p class="orderBenefitsTextStyle">Order Value</p><p style="color: black;"><i class="fas fa-map-marker-alt"></i> 205$</p></div>
            <div class="orderBenefits"> <p class="orderBenefitsPartners">Partner</p> <img alt="Vue logo" class="logo" style="  object-fit: contain;width: 150px" src="../assets/logos/Foodee.png" width="125" height="50" /></div>
          </div>
          <div class="orderBenefits"> <p class="orderBenefitsTextStyle">DELIVERY ACTIVITY</p></div>

          <div class="delivery_activity">
            <div @click="viewOrderDetails(order.id)" v-for="order in orders" :key="order.id" class="activity_block" >
              <div style="display: inline-flex">
                <div style="">
                  <div v-if="order.id != 1" class="activity_track"><p style="visibility: hidden">p</p> </div>
                  <div v-if="order.id == 1" class="activity_track_icon" ><v-icon color="#0afd01" style=" border-radius: 30px;height: 100%;" size="40">mdi-truck-delivery-outline</v-icon></div>
                  <div class="activity_infoblock"><p style="visibility: hidden">p</p> </div>
                  <div class="activity_track"><p style="visibility: hidden">p</p> </div>
                </div>
                <div style="margin-left: 20px" >
                  <h2 class="orderBenefitsTextStyle">{{ order.orderNumber }}</h2>
                  <p style="color: black;"><i class="fas fa-clock"></i> {{ order.time }}</p>
                  <p style="color: black;"><i class="fas fa-map-marker-alt"></i> {{ order.address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button class="decision_button" @click="viewOrderDetails(1)" style="background-color: red">Decline</button>
          <button class="decision_button" @click="viewOrderDetails(2)" style="background-color: green">Interested</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
// import GoogleMapsApiLoader from 'google-maps-api-loader'
import { GoogleMap, Marker } from "vue3-google-map";

export default {
  components: { GoogleMap, Marker },
  data() {
    return {
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
          ONumber:'Order 165498498494',
          PickupLocation:['Tacidekku Cibgress Caterubg'],
          DueIn: ['3 H, 57 m'],
          NumberOfTask: 4,
          Earning:100,
          TravelDistance:14.6,

        },
        {
          id: 2,
          orderNumber: 'Drop_1',
          time: '10:30 AM',
          address: '456 Elm St',
        },{
          id: 2,
          orderNumber: 'Drop_1',
          time: '10:30 AM',
          address: '456 Elm St',
        },{
          id: 2,
          orderNumber: 'Drop_1',
          time: '10:30 AM',
          address: '456 Elm St',
        },
        {
          id: 2,
          orderNumber: 'Drop_1',
          time: '10:30 AM',
          address: '456 Elm St',
        },
        {
          id: 2,
          orderNumber: 'Drop_1',
          time: '10:30 AM',
          address: '456 Elm St',
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
.order_view_webb {
  background-color: #ffffff;
  margin: 0 auto;
  padding-bottom: 10px;
}
.map_box{
  border: 2px solid #0afd01;
  border-radius: 5px;
}
.order-list {
  display: block;
  padding-top: 10px
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
  width: 100% !important;
  margin-bottom: 15px;
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
.orderNumberStyle{
  font-weight: bold;
  text-align: center;
  padding-left:10px;
  color: red
}
.mainDIV{
  height: 75vh;
  overflow: scroll;
  padding-left:10px;
  padding-right:10px;
}
.orderBenefits{
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
}
.orderBenefitsTextStyle{
  color: black;
  font-weight: bold;
}
.orderBenefitsPartners{
  color: black;
  padding-top: 10px;
  font-weight: bold;
}
</style>
