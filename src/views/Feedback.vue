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
            :close-on-content-click=false
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
            <v-list-item @click="openSettings">
              <v-list-item-title>
                <v-icon style="margin-right: 10px">mdi-cog</v-icon>Settings
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
    <h1 id="header" style="font-weight: bold;text-align: center;color: black">FEEDBACK</h1>
    <div v-if="loading && allowFeedback" style="width: 100%;text-align: center;position: absolute">
      <v-overlay :model-value="true">
        <v-card style="background-color: transparent;width: 100vw;height: 100vh;">
          <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
        </v-card>
      </v-overlay>

      <atom-spinner :animation-duration="1000" :size="90" color="#ffffff" style="margin: auto; margin-top: 100px"/>
    </div>
    <!-- Main Content -->
    <div v-if="!allowFeedback" style="padding-left:30px; padding-right:30px; padding-top: 20px; height: 75vh; overflow: scroll">
      <v-card-text style="color:#000000; font-size: 16px">{{allowFeedbackResponse}}</v-card-text>
    </div>
    <v-card-text style="color:#000000; font-size: 16px">Please help us improve the Open Orders Board by providing feedback about one of these topics.</v-card-text>
    <div v-if="!loading && allowFeedback" style="padding-left:30px; padding-right:30px; padding-top: 20px; height: 75vh; overflow: scroll">
      <main>
        <v-row v-for="items in feedbackQuestions" style="padding-bottom: 0">
          <v-checkbox v-ripple.stop
              v-model="items.value"
              :label=items.title
              :ripple="false"
              class="feedbackLabel"
              hide-details>

          </v-checkbox>
        </v-row>
        <v-row style="padding-left: 5px; padding-right: 5px; margin-top: 30px;">
          <v-textarea
              placeholder="Enter comments"
              bg-color="#0afd01"
              hide-details
              v-model="comments"
              class="commentsTextArea"
          >
          </v-textarea>
        </v-row>
        <v-row style="justify-content: center; margin-top: 40px">
          <v-btn
              @click="saveFeedback"
          >
            Save
          </v-btn>
        </v-row>
      </main>
    </div>
    <!-- Footer -->
    <footer style="position: absolute;bottom: 20px;width: 100%">
      <p style="text-align: center">&copy; 2023 dlivrd.  Rights Reserved.</p>
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
      allowFeedback: true,
      allowFeedbackResponse: null,
      feedbackQuestions: [
        {title:'Not enough orders.', value:null},
        {title:'Earnings are too low.', value:null},
        {title:'Orders too far away from me.', value:null},
        {title:'Order mileage too high.', value:null},
        {title:'Delays in receiving orders to app.', value:null},
        {title:'Technical Issues.', value:null}
      ],
      comments: null,
    };
  },
  mounted() {
    // Initialize the map
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
          console.log("Feedback Session")
          // console.log("Session response")
          console.log(response)
          var verifySession = response.data;
          if(verifySession['allow_feedback']['Failure'] ){

            this.allowFeedback = false;
            this.allowFeedbackResponse = verifySession['allow_feedback']['Failure'];
          }
          else if(verifySession['Success']){
            localStorage.setItem('profile_image', verifySession['profile_image']);
            this.loading = false;
            this.allowFeedback = true;
          }
          else{
            console.log("Session not verified")
          this.$router.push('/')
          }
        }
      }).catch( () => {
        // console.log("Session not verified")
        // console.log(e)
        this.$router.push('/')
      })
    },
    openOrders(){
      this.$router.push('/openOrders')
    },
    openFeedback(){
      this.$router.push('/feedback')
    },
    openHelp(){
      this.$router.push('/help')
    },
    openSettings(){
      this.$router.push('/settings')
    },
    saveFeedback(){
      var feedbackResponse = [];
      for(var i = 0; i < this.feedbackQuestions.length; i++){
        if(this.feedbackQuestions[i].value == true){
          feedbackResponse.push(this.feedbackQuestions[i].title);
        }
      }
      var url = this.baseurl + 'submit_rider_openboard_feedback';
      const data = {
        identity: this.username,
        selected_feedback_options: feedbackResponse,
        detailed_feedback: this.comments
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
            this.alert_description = "Thank you for your feedback!";
            this.dialog = true;
            this.agreeButtonText = 'Okay';
            this.allowFeedback = false;
            this.loading = true;
            this.allowFeedbackResponse = "Your feedback is under review. You can submit a new feedback after 3 days."
          }
          else{
            if(response.data['Failure'] == 'Invalid values'){
              this.alert_title = 'Warning';
              this.alert_description = "Please fill out the feedback form.";
              this.dialog = true;
              this.agreeButtonText = 'Okay';
            }
            else{
              this.alert_title = 'Warning';
              this.alert_description = response.data['Failure'];
              this.dialog = true;
              this.agreeButtonText = 'Okay';
            }
          }
        }
      }).catch( () => {
        this.$router.push('/')
        // console.log("Error Updating Feedback");
        // console.log(e)
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
.feedbackLabel{
  padding-bottom: 0 !important;
}
.feedbackLabel .v-selection-control .v-label {
  color: black !important;
  font-weight: 600 !important;
}
.commentsTextArea .v-field__input {
  -webkit-mask-image: unset !important;
  mask-image: unset !important;
  color: black !important;
  font-size: 16px;
  border-radius: 5px;
  border-width: 2px;
  border-color: black;
  font-family: Sans-serif;
}
.feedbackLabel .v-input__control{
  height: 30px;
}
</style>
