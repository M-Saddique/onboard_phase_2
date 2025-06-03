
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
            <v-list-item @click="openHelp">
              <v-list-item-title>
                <v-icon style="margin-right: 10px">mdi-help</v-icon>Help
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
    <h1 id="header" style="font-weight: bold;text-align: center;color: black">SETTINGS</h1>
    <div v-if="loading" style="width: 100%;text-align: center;position: absolute">
      <atom-spinner :animation-duration="1000" :size="90" color="#ffffff" style="margin: auto; margin-top: 100px"/>
    </div>
    <!-- Main Content -->
    <div v-if="!loading" style="padding-left:30px; padding-right:30px; padding-top: 20px; height: 75vh; overflow: scroll">
      <main>
        <v-row style="padding-bottom: 0">
          <v-switch
              v-model="urgentOrder"
              hide-details
              @change="UrgentOrderClicked"
              inset
              label="Receive Urgent Order Notifications"
              class="settings"
              color="#000000"
          >
          </v-switch>
          <v-switch
              v-model="openOrder"
              hide-details
              @change="OpenOrderClicked"
              inset
              label="Receive Open Order Notifications"
              class="settings"
              color="#000000"
          >
          </v-switch>
        </v-row>

        <v-row style="justify-content: center; margin-top: 40px">
          <v-btn @click="saveSettings">
            Save
          </v-btn>
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
    UrgentOrderClicked(){

      if(!this.urgentOrder == false){
        this.alert_title = 'Warning';
        this.alert_description = 'You will not receive urgent order sms ';
        this.dialog = true;
        this.agreeButtonText = 'Okay';
      }
    },
    OpenOrderClicked(){
      if(!this.openOrder == false){
        this.alert_title = 'Warning';
        this.alert_description = 'You will not receive open order sms ';
        this.dialog = true;
        this.agreeButtonText = 'Okay';
      }
    },
    logout(){
      localStorage.setItem('username','');
      localStorage.setItem('session_id','');
      this.$router.push('/')
    },
    sessionValidator(){
      console.log("Settings validator")
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
            console.log("Session validated")
            localStorage.setItem('profile_image', verifySession['profile_image']);
            // this.loading = false;
            this.loadSettings();
          }
          else{
            console.log("Session not validated")
            // this.$router.push('/order')
            this.$router.push('/O')
          }
        }
      }).catch((e) => {
        this.$router.push('/order')
      })
    },
    openFeedback(){
      this.$router.push('/feedback')
    },
    openOrders(){
      this.$router.push('/openOrders')
    },
    openHelp(){
      this.$router.push('/help')
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
            this.urgentOrder = !response.data['send_urgent_order_notification']
            this.openOrder = !response.data['send_open_order_notification']
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
        send_urgent_order_notification: !this.urgentOrder,
        send_open_order_notification: !this.openOrder,
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
