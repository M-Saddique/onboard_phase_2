
<template  >
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
            prepend-icon="mdi-close"
            style="background-color: #7efb01"
            variant="text"
            @click="dialog = false"
        >
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div v-if="loading" style="width: 100%;text-align: center;position: absolute;z-index: 20;color: #0AFD01">
    <atom-spinner  :animation-duration="1000" :size="90" color="#000000" style="margin: auto; margin-top: 100px"/>
  </div>
  <div   class="order_view_web">
  <header style="background-color: white;border-bottom: 3px #0afd01 solid;">
    <div style="width: 100%;text-align: center;padding-top: 10px">

    <img alt="Vue logo" class="logo" style="  object-fit: contain;width: 150px" src="../assets/dlivrdlogo.png" width="125" height="50" />
    </div>
  </header>
    <!-- Header -->
    <p  v-if="!loading && !loadOTP" class="title_block" >
      Verify Your Identity
    </p>
    <p  v-if="!loading && !loadOTP" class="title_sub_block" >
      Answer Any One Of The Question
    </p>

    <p  v-if="loadOTP && !VerificationComplete" class="title_block" >
      Verify OTP
    </p>
    <p  v-if="loadOTP && !VerificationComplete" class="title_sub_block" >
      An OTP is send to your new number
    </p>


    <p  v-if="VerificationComplete" class="title_block" >
      Congratulations
    </p>
    <p  v-if="VerificationComplete" class="title_sub_block" >
      Your New Phone Number Verification Is Now Complete.
    </p>



    <!-- Main Content -->
    <div  v-if="!loading && loadOTP && !VerificationComplete" style="padding-left:10px;padding-right:10px;height: 75vh;overflow: scroll">
      <main  >

        <div style="margin-top: 30px">
          <TextFieldItem>


            <p class="question_block" >
              OTP
            </p>

            <v-text-field
                required
                hide-details
                v-model="otp_code"
                placeholder="OTP Code"
                :persistent-placeholder='true'
                class="generic_tx px-2 answer_field"
                name="login"
                :value="otp_code"
                density="comfortable"
            ></v-text-field>
          </TextFieldItem>
        </div>

        <div style="text-align: center;margin-top: 30px">

          <button class="decision_button" @click="verify_otp" style="background-color: green">Verify</button>
        </div>

        <!-- Map -->

      </main>
    </div>




    <!-- Main Content -->
    <div style="padding-left:10px;padding-right:10px;height: 75vh;overflow: scroll">
    <main  v-if="!loading && !loadOTP" >

      <div style="margin-top: 30px">
        <TextFieldItem>


            <p class="question_block" >
              {{ question_1 }}
            </p>

            <v-text-field
                required
                hide-details
                v-model="answer_1"
                placeholder="Answer"
                :persistent-placeholder='true'
                class="generic_tx px-2 answer_field"
                name="login"
                :value="answer_1"
                density="comfortable"
            ></v-text-field>
        </TextFieldItem>
      </div>
      <div style="width: 100%;margin-top: 30px;height: 2px;background-color: #0AFD01"></div>
      <div style="margin-top: 30px">
        <TextFieldItem>
          <p class="question_block" >
            {{ question_2 }}
          </p>

          <v-text-field
              required
              hide-details
              v-model="answer_2"
              placeholder="Answer"
              :persistent-placeholder='true'
              class="generic_tx px-2 answer_field"
              name="login"
              :value="answer_2"
              density="comfortable"
          ></v-text-field>
        </TextFieldItem>
      </div>
      <div style="text-align: center;margin-top: 30px">
        <v-col  class="alignCaptcha" style="text-align: center;" >
          <VueRecaptcha
              style="align-items: center;display: inline-table"
              sitekey="6Ld7pNAmAAAAAG4qWGWSDntc7Cc4HsywpB2lYvpI"
              :load-recaptcha-script="true"
              @verify="handleSuccess"
              @error="handleError"
          ></VueRecaptcha>
        </v-col>
        <button class="decision_button" @click="approve_questions" style="background-color: green">Verify</button>
      </div>

      <!-- Map -->

    </main>
    </div>
    <!-- Footer -->
    <footer style="margin-bottom: 20px;height: 10vh">
      <p style="text-align: center">&copy; 2023 dlivrd.  Rights Reserved.</p>
    </footer>

  </div>
</template>

<script>
// import GoogleMapsApiLoader from 'google-maps-api-loader'
import { GoogleMap, Marker } from "vue3-google-map";
import axios from "axios";
import { AtomSpinner } from 'epic-spinners'
import { VueRecaptcha } from 'vue-recaptcha';
export default {
  components: { GoogleMap, Marker,AtomSpinner,VueRecaptcha },
  data() {
    return {
      question_1: '',
      question_2: '',
      answer_1: '',
      loading:true,
      loadOTP:false,
      answer_2: '',
      captchaToken: null,
      VerificationComplete:false,
      captchaChecked: false,
      tokenId:'',
      otp_code:'',
      verifyTokanId:'',
      dialog:false,
      alert_title:'',
      alert_description:''
    };
  },
  mounted() {
    this.tokenId = this.$route.params.tokenid
    // Initialize the map
    this.pull_questions()
  },
  methods: {
    showAlert(title,description){
      this.alert_title = title
      this.alert_description = description
      this.dialog = true
    },
    handleSuccess(event){
      this.captchaToken = event;
      this.captchaChecked = true;
    },
    handleError(){
      this.captchaChecked = false;
    },
    pull_questions() {
      var url = this.baseurl + 'number_verification_verify_token'
      const data = {
        token: this.tokenId,
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('onboard_session_id')
        }
      }).then((response) => {
        if(response.status == 200 && response.data['Success']){
          this.question_1 = response['data']['questions'][0]
          this.question_2 = response['data']['questions'][1]
          this.loading = false
        }else{
          this.showAlert('Error','Token expired')
        }

      }).catch(() => {

      })
    },
    verify_otp(){
      this.loading = true
      var url = this.baseurl + 'number_verification_verify_otp'
      const data = {
        old_token: this.tokenId,
        token: this.verifyTokanId,
        otp: this.otp_code

      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('onboard_session_id')
        }
      }).then((response) => {
        if(response['data']['Success']){
          this.loading = false
          this.VerificationComplete = true
          // this.showAlert('Congratulations','Your New Number Is Now Verified')


        }else{
          this.showAlert('Error','Invalid OTP')

          this.loading = false
        }

        this.loading = false
      }).catch(() => {

      })
    },
    request_otp(){
      var url = this.baseurl + 'number_verification_send_otp'
      const data = {
        token: this.verifyTokanId,
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('onboard_session_id')
        }
      }).then((response) => {
        if(response['data']['Success']){
          this.loading = false
           this.loadOTP = true


        }else{
          this.showAlert('Error',response['data']['Failure'])
          this.loading = false
        }

      }).catch(() => {

      })
    },
    approve_questions() {
      if(this.answer_1 == '' && this.answer_2 == ''){

        this.alert_title = 'Error'
        this.alert_description = 'Please Answer At-least One Question'

        this.dialog = true
        return
      }
      if(this.captchaToken == null){
        this.alert_title = 'Error'
        this.alert_description = 'Please Solve Captcha'
        this.dialog = true
        return
      }
      this.loading = true
      var url = this.baseurl + 'number_verification_verify_security_answers'
      var questions = {}
      questions[this.question_1] = this.answer_1
      questions[this.question_2] = this.answer_2
      const data = {
        token: this.tokenId,
        captcha_key:this.captchaToken,
        answers: questions,
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('onboard_session_id')
        }
      }).then((response) => {

        if(response.status == 200){
          if(response['data']['Success']){
            this.verifyTokanId = response['data']['new_token']
            this.request_otp()


          }else{
            this.showAlert('Error','Questions Not Verified. Please Retry')
            this.loading = false
          }


        }
      }).catch(() => {

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
.answer_field{
  margin-top: 10px;
}
.title_block{
  font-weight: bold;
  font-size: 30px;
  text-align: center;

}.title_sub_block{
  font-size: 15px;
  text-align: center;

}
.question_block{
  font-weight: bold;
  font-size: 20px;

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
