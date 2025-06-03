
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
            <v-list-item @click="openOrders">
              <v-list-item-title>
                <v-icon style="margin-right: 10px">mdi-truck-delivery-outline</v-icon>Orders
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="openFeedback">
              <v-list-item-title>
                <v-icon style="margin-right: 10px">mdi-comment-quote-outline</v-icon>Feedback
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="openSettings">
              <v-list-item-title>
                <v-icon style="margin-right: 10px">mdi-cog</v-icon>Settings
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logoutClicked">
              <v-list-item-title>
                <v-icon style="transform: rotate(180deg); margin-right: 10px">mdi-logout</v-icon>Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </header>
    <!-- Dialog Box -->
    <v-row justify="center">
      <v-dialog
          id="dialogBox"
          v-model="dialog"
          transition="dialog-top-transition"
          max-width="350px"
          persistent
      >
        <v-card>
          <v-card-title class="text-h5" style="background-color: #7efb01">{{alert_title}}</v-card-title>
          <v-card-text id="dialogDescription" v-html="alert_description"></v-card-text>
          <v-card-actions style="align-self: end; margin-top: 30px">
            <v-spacer></v-spacer>
            <v-btn
                v-if="agreeButtonText == 'Logout'"
                prepend-icon="mdi-close"
                style="background-color: #7efb01"
                variant="text"
                @click="dialog = false"
            >
              No
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Logout'"
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="logout"
            >
              Yes
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Okay'"
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="dialog = false"
            >
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <h1 id="header" style="font-weight: bold;text-align: center;color: black">Help</h1>
    <div v-if="loading" style="width: 100%;text-align: center;position: absolute">
      <atom-spinner :animation-duration="1000" :size="90" color="#ffffff" style="margin: auto; margin-top: 100px"/>
    </div>
    <!-- Main Content -->
    <div v-if="!loading" style="padding-left:30px; padding-right:30px; padding-top: 20px; height: 75vh; overflow: scroll">
      <main>
        <v-row style="padding-bottom: 0">
          <h5 style="font-weight: bold; text-align: center; color: black">The dlivrd Open Orders Board is another chance for partners to find and accept delivery opportunities. At 8pm each night, all orders for the next day that are still available will be uploaded onto the board. These orders are available to be claimed, first come, first serve.</h5>
        </v-row>
        <v-row style="padding-bottom: 0;margin-top: 30px;">
          <h4 style="font-weight: bold ;color: black;">Will you still be offering orders by text?</h4>
          <h5 style="color: black">Yes! We will continue texting orders just like always but any orders that fail to get accepted will be found on the Open Orders Board.
          </h5>
        </v-row>
        <v-row style="padding-bottom: 0;margin-top: 30px;">
          <h4 style="font-weight: bold ;color: black;">What happens if I accept an order within the Open Orders Board?</h4>
          <h5 style="color: black">If you see an order that you want, you can select “Interested”. This will alert the system to send the order to your driver app. You still need to open your app and “Accept” the order.
          </h5>
        </v-row>
        <v-row style="padding-bottom: 0;margin-top: 30px;">
          <h4 style="font-weight: bold ;color: black;">I clicked interested but the order never came to me - why?</h4>
          <h5 style="color: black">Many drivers will be interacting with the Open Orders board at the same time. Even though you clicked “Interested” on an order, it’s possible another driver scooped it up first.
          </h5>
        </v-row>
        <v-row style="padding-bottom: 0;margin-top: 30px;">
          <h4 style="font-weight: bold ;color: black;">There aren’t any orders on the board.</h4>
          <h5 style="color: black">This means that all of the next day's orders were already accepted. Don’t be discouraged - keep checking the board as you never know when a great order will be waiting!
          </h5>
        </v-row>


        <v-row style="padding-bottom: 0;margin-top: 30px;">
          <h4 style="font-weight: bold ;color: black;"></h4>
          <h5 style="color: black"></h5>
        </v-row>
        <v-row style="padding-bottom: 0;margin-top: 30px;">
          <h4 style="font-weight: bold ;color: black;"></h4>
          <h5 style="color: black"></h5>
        </v-row>

      </main>
    </div>
    <!-- Footer -->
    <footer style="position: absolute;bottom: 20px;width: 100%">
      <p style="text-align: center">&copy; 2023 dlivrd. All Rights Reserved.</p>
    </footer>

  </div>
</template>

<script>
import axios from "axios";
import { AtomSpinner } from 'epic-spinners'
export default {
  components: { AtomSpinner},
  data() {
    return {
      username: '',
      loading: true,
      alert_title: null,
      dialog: false,
      alert_description: null,
      agreeButtonText: null,
      openOrder: false,
      urgentOrder: false,
    };
  },
  mounted() {
    this.username = localStorage.getItem('username');
    this.sessionValidator();
  },
  methods: {
    logoutClicked(){
      this.alert_title = 'Confirmation';
      this.alert_description = 'Do you want to Logout ?';
      this.dialog = true;
      this.agreeButtonText = 'Logout';
    },
    logout(){
      localStorage.setItem('username','');
      localStorage.setItem('session_id','');
      this.$router.push('/')
    },
    sessionValidator(){
      console.log("Help Session")
      var url = this.baseurl + 'dlivrd_drivers_verify_session'
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
          if(verifySession['Success']){
            localStorage.setItem('profile_image', verifySession['profile_image']);
            // this.loading = false;
            this.loadSettings();
          }
          else{
            console.log("Session not validated")
            // this.$router.push('/order')
            this.$router.push('/order')
          }
        }
      }).catch((e) => {
        this.$router.push('/order')
      })
    },
    openFeedback(){
      this.$router.push('/feedback')
    },
    openSettings(){
      this.$router.push('/settings')
    },
    openOrders(){
      this.$router.push('/openOrders')
    },
    loadSettings(){
      var url = this.baseurl + 'get_rider_openboard_settings';
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
        if(response.status == 200){
          if(response.data['Success']){
            this.urgentOrder = response.data['send_urgent_order_notification']
            this.openOrder = response.data['send_open_order_notification']
          }
        }
        this.loading = false
      }).catch((e) => {
        this.loading = false
        this.router.push('/order')
      })
    },
    saveSettings(){
      var url = this.baseurl + 'update_rider_openboard_settings';
      const data = {
        identity: this.username,
        send_urgent_order_notification: this.urgentOrder,
        send_open_order_notification: this.openOrder,
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
        if(response.status == 200){
          if(response.data['Success']){
            this.alert_title = "Success";
            this.alert_description = "Settings Updated Successfully!";
            this.dialog = true;
            this.agreeButtonText = 'Okay';
          }
        }
      }).catch((e) => {
        console.log("Error Updating Settings")
        console.log(e);
        // this.router.push('/order')
      })
    }
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
.mobile-view {
  background-color: #0afd01;
  max-width: 400px;
  margin: 0 auto;
  height: 100vh;
  padding-bottom: 10px;
}
header {
  text-align: center;
  margin-bottom: 20px;
}
.settings .v-label {
  color: black !important;
}
.settings .v-selection-control {
  align-items: center;
}
</style>
