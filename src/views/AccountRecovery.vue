<template >
  <v-container fill-height fluid class="mainblock">
    <v-card>
      <v-row justify="center">
        <v-dialog
            v-model="dialog"
            transition="dialog-top-transition"
            width="auto"
        >
          <v-card>
            <v-card-title class="text-h5" style="background-color: #7efb01">
              {{alert_title}}
            </v-card-title>
            <v-card-text>{{alert_description}}</v-card-text>
            <v-card-actions style="align-self: end; margin-top: 30px">
              <v-spacer></v-spacer>
              <v-btn
                  v-if="alert_title == 'Success'"
                  style="background-color: #7efb01"
                  variant="text"
                  @click="dialog = false">
                Okay
              </v-btn>
              <v-btn
                  v-else-if="alert_title == 'Warning'"
                  style="background-color: #7efb01"
                  variant="text"
                  @click="dialog = false">
                Okay
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-card>
    <v-row style="justify-content: center" >


      <v-col cols="12" sm="12" md="4" style="align-self: center">
        <v-col>
          <v-img :src='this.logo'></v-img>
          <v-card-text style="color: white; padding: 0px; text-align: center;font-size: 40px">
            Enter Registered Username
          </v-card-text>
        </v-col>
        <TextFieldItem>
          <template #heading>dlivrd UserName</template>
          <v-text-field
              background-color="black"
              required
              v-model="username"
              hide-details
              :readonly = editMobileNumber
              placeholder="UserName on dlivrd mobile app"
              :persistent-placeholder='true'
              class="generic_tx px-1"
              name="login"
              type="text"
              density="comfortable"
              @keyup.enter="requestResetPass"
          />
        </TextFieldItem>
        <Transition name="fade" mode="out-in">
          <TextFieldItem v-if="editMobileNumber == true">
            <template #heading>One Time Password</template>
            <v-text-field
                background-color="black"
                required
                v-model="otpCode"
                hide-details
                placeholder="Enter OTP"
                :persistent-placeholder='true'
                class="generic_tx px-1"
                name="otp"
                type="number"
                density="comfortable"
                @keyup.enter="confirmOTP"
            />
          </TextFieldItem>
        </Transition>
        <v-col sm="12" class="alignCaptcha" style="text-align: center" >
          <VueRecaptcha
              style="align-items: center;display: inline-table"
              sitekey="6Ld7pNAmAAAAAG4qWGWSDntc7Cc4HsywpB2lYvpI"
              :load-recaptcha-script="true"
              @verify="handleSuccess"
              @error="handleError"
          ></VueRecaptcha>
        </v-col>
        <v-col align-self="center" sm="12" style="text-align: center; margin-top: 10px">
          <v-btn v-if="loading" prepend-icon="mdi-send-variant-outline" class="btn_green" @click="requestResetPass">Resend</v-btn>
          <v-btn v-if="loading" prepend-icon="mdi-shield-check" class="btn_green" style="margin-left: 10px" @click="requestResetPass">Verify</v-btn>
          <div style="width: 100%; text-align: -webkit-center">
            <v-overlay :model-value="!loading">
              <v-card style="background-color: transparent;width: 100vw;height: 100vh;">
                <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
              </v-card>
            </v-overlay>
<!--            <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#0AFD01" />-->
          </div>
        </v-col>
      </v-col>

    </v-row>
  </v-container>
</template>


<script>
import TextFieldItem from '../components/TextFieldItem.vue'
import logo from '../assets/dlivrdlogo.png';
import SignUpHeader from '../components/SignUpHeader.vue'
import axios from "axios";
import { AtomSpinner } from 'epic-spinners'
import { VueRecaptcha } from 'vue-recaptcha';
export default {
  components: {
    'TextFieldItem': TextFieldItem,
    'SignUpHeader': SignUpHeader,
    AtomSpinner,VueRecaptcha
  },
  data () {
    return {
      username: "",
      dialog: false,
      alert_title: '',
      alert_description: '',
      loading: true,
      otpCode: '',
      logo:logo,
      editMobileNumber: false,
      captchaToken: null,
      captchaChecked: false,
    }
  },
  methods: {
    handleSuccess(event){
      this.captchaToken = event;
      this.captchaChecked = true;
    },
    handleError(){
      this.captchaChecked = false;
    },
    requestResetPass(){
      if(this.username == ""){
        this.alert_title = "Warning";
        this.alert_description = "Please enter Email Address";
        this.dialog = true;
        this.agreeButtonText = "Ok";
        this.cancelButtonText = "Cancel"
      }else {
          this.loading = false
          var url = this.baseurl + 'onboard_forgotPassword'
          const data = {
            identity: this.username,
            ttc: 'open',
            captchaKey: this.captchaToken,
          }
          //console.log(data)
          axios.post(url, data, {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            }
          }).then((response) => {
            //console.log(response)
            this.loading = true
            if (response.status == 200) {
              var responseResult = response.data;
              if(responseResult['Success']){
                this.alert_title = "Success";
                this.alert_description = responseResult['Success'];
                this.dialog = true;
                this.agreeButtonText = "Ok";
              }
              else{
                this.alert_title = "Warning";
                this.alert_description = responseResult['Failure'];
                this.dialog = true;
                this.agreeButtonText = "Ok";
              }
            }
          }).catch((e) => {
            //console.log(e)
            //console.log("Not liked!");
          })
      }
    },
    confirmOTP(){
      this.$router.push('/resetPassword')
    },
  },
}
</script>
<style>

input{
  font-size: 20px !important;
}
.generic_tx {
  -webkit-text-fill-color: #4b4b4b;
  font-size: 20px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
