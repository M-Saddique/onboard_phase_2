<template >
  <v-container class="mainblock" fluid>
    <v-row v-if="showError" style="background-color: red; position: absolute; top: 0; width: 100vw; overflow-x: hidden; z-index: 10; align-items: center">
      <v-card-text style="background-color: red; color:white; padding-bottom: 6px; width: 90%">{{ errorMessage }}</v-card-text>
      <v-icon style="padding-top: 10px; padding-right: 10px; cursor: pointer; width: 10%; justify-content: right" color="#ffffff" @click="showError = false">mdi-close</v-icon>
    </v-row>
    <v-row class="mainblock">
      <v-card>
        <v-row justify="center">
          <v-dialog
              v-model="dialog"
              transition="dialog-top-transition"
              width="auto"
          >
            <v-card>
              <v-card-title class="text-h5" style="color: #0adf01">
                {{alert_title}}
              </v-card-title>
              <v-card-text>{{alert_description}}</v-card-text>
              <v-card-actions style="align-self: end; margin-top: 30px">
                <v-spacer></v-spacer>
                <v-btn
                    v-if="alert_title == 'Warning'"
                    style="background-color: #7efb01"
                    variant="text"
                    @click="dialog = false">
                  Okay
                </v-btn>
                <v-btn
                    v-if="alert_title != 'Warning'"
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

      <v-row>

        <v-col md="4"></v-col>

        <v-col cols="12" sm="12" md="4" align-self="center">
<!--          <LoginHeader />-->
          <!--      </v-col>-->
          <!--      <v-col cols="12" sm="12" md="4" style="border-radius: 5px">-->
          <v-col>
            <v-img :src='this.logo'></v-img>
            <v-card-text style="color: white; padding: 0px; text-align: center">
              Welcome to Open Order Portal
            </v-card-text>
          </v-col>
          <TextFieldItem>
            <template #heading>Username</template>
            <v-text-field
                v-model="username"
                background-color="black"
                required
                hide-details
                placeholder="Enter Username"
                :persistent-placeholder='true'
                class="generic_tx px-1"
                name="login"
                type="text"
                density="comfortable"
                @keyup.enter="login"
                autocomplete="new"
            />
          </TextFieldItem>
          <TextFieldItem>
            <template class="text_header_color" #heading>Password</template>
            <v-text-field
                required
                hide-details
                v-model="userPassword"
                placeholder="Enter Password"
                :persistent-placeholder='true'
                class="generic_tx px-2"
                name="login"
                :value="userPassword"
                :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="() => (value = !value)"
                :type="value ? 'password' : 'text'"
                density="comfortable"
                @keyup.enter="login"
            />
          </TextFieldItem>
<!--          <v-col class="alignForgotPass">-->
<!--             <h6 @click="this.$router.push('/forgotPassword')" class="forgotPass">Forgot Your Password?</h6>-->
<!--          </v-col>-->
          <v-col>
            <v-card-text style="color: white; padding: 0px; text-align: center">
              First time logging in? <span class="signUpLink" onclick="window.parent.location.href= '/AccountRecovery'">Retrieve Now!</span>
            </v-card-text>
          </v-col>
          <v-col align-self="center" sm="12" style="text-align: center;">
            <v-btn prepend-icon="mdi-login" v-if="loading" class="btn_green" @click="login">Login</v-btn>
            <div class="alignSpinnerCenter">
              <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#ffffff"/>
            </div>
          </v-col>
        </v-col>
        <v-col md="4"></v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import TextFieldItem from '../components/TextFieldItem.vue'
import LoginHeader from '../components/LoginHeader.vue'
import axios from "axios";
import logo from '../assets/dlivrdlogo.png';
import { AtomSpinner } from 'epic-spinners'

// import {getFCMToken} from '../firebase.js'


export default {
  components: {
    'TextFieldItem': TextFieldItem,
    'LoginHeader': LoginHeader,AtomSpinner
  },
  data () {
    return {
      username: "",
      userPassword: "",
      dialog: false,
      alert_title: '',
      alert_description: '',
      showError: false,
      logo:logo,
      errorMessage: null,
      loading:true,
      value: String,
    }
  },
  mounted(){
    // localStorage.setItem('first_time_login_message',true)
    // alert(localStorage.getItem('first_time_login_message', true))
    if(localStorage.getItem('first_time_login_message', true) != 'false'){
      this.first_time_login_message()
    }
    this.checkExistingSession();
    // getFCMToken()
  },
  methods: {
    first_time_login_message(){
      localStorage.setItem('first_time_login_message',  false);
      this.alert_title = 'Welcome To Dlivrd Open Board'
      this.alert_description = 'This portal will help you to secure an order that has been opened for the Dlivrd Drivers to take. Please use your driver app username to retrieve your account and secure high earning orders.'
      this.dialog = true
    },
    login(){
      if(this.username == "" && this.userPassword == ""){
        this.alert_title = "Warning";
        this.alert_description = "Email and Password cannot be empty";
        this.dialog = true;
        this.agreeButtonText = "Okay";
        return
      }
      else if(this.username == "" || this.userPassword == ""){
        this.alert_title = "Warning";
        this.alert_description = "Please fill all the fields";
        this.dialog = true;
        this.agreeButtonText = "Okay";
        return
      }
      else{
        this.loading = false
        var url = this.baseurl + 'dlivrd_drivers_signin'
        const data = {
          identity: this.username,
          password: this.userPassword,
        }
        axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          }
        }).then((response) => {
          //console.log("Response")
          //console.log(response)
          this.loading = true
          if(response.status == 200){
            var processLogin = response.data
            if(processLogin['Failure']){
              this.showError = true;
              this.errorMessage = processLogin.Failure
            }
            else {
              localStorage.setItem('on_fullname',  processLogin.full_name);
              localStorage.setItem('on_username', processLogin.username);
              localStorage.setItem('onboard_session_id', processLogin.session_id);

              // // localStorage.setItem('require_username', processLogin.)
              // if(processLogin['initial_stage']){
              //   localStorage.setItem('first_login',processLogin['initial_stage'])
              // }
              // if(processLogin['requires_password_update']){
              //   localStorage.setItem('require_password',processLogin['requires_password_update'])
              // }
              // // this.$router.push('/educate')
              this.$router.push('openOrders')

            }
          }
        }).catch( (e) => {
          //console.log(e)
          this.loading = true;
          this.showError = true;
          this.errorMessage = "You are having issues logging in to your account. Please Try Again after 30 minutes."
        })
      }
    },
    checkExistingSession(){
      // this.loading = false
      var url = this.baseurl + 'dlivrd_drivers_verify_session'
      if(localStorage.getItem('on_username','') == '' || localStorage.getItem('on_username','') == null){
        return ''
      }
      const data = {
        identity: localStorage.getItem('on_username'),
        check:3
      }
      // alert(localStorage.getItem('onboard_session_id'))
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('onboard_session_id')
        }
      }).then((response) => {
        //console.log("Settings session response")
        //console.log(response)

        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            localStorage.setItem('profile_image', verifySession['profile_image']);
            this.$router.push('openOrders')

          }

        }
      }).catch(() => {
        //console.log('')
      })
      if(localStorage.getItem('onboard_session_id') != ''){
        this.$router.push('openOrders')
      }
    }
  }
}
</script>

<style>
.signUpLink{
  color: #0AFD01;
  cursor: pointer;
}
.signUpLink:hover{
  color: #00bd7e;
}

.alignForgotPass{
  text-align: -webkit-right;
  padding-right: 0px !important;
}
.alignSpinnerCenter{
  width: 100%;
  text-align: -webkit-center;
}
@-moz-document url-prefix() {
  .alignForgotPass {
    text-align: -moz-right;
    padding-right: 0px;
  }
  .alignSpinnerCenter {
    width: 100%;
    text-align: -moz-center;
  }
}

input{
  font-size: 20px !important;
}
.generic_tx {
  -webkit-text-fill-color: #4b4b4b;
  font-size: 20px !important;
}
.forgotPass{
  cursor:pointer;
  color: #0AFD01;
  width: fit-content;
}
.forgotPass:hover{
  color: hsla(160, 100%, 37%, 1) !important;
}
.v-input__append{
  margin-inline-start: 0px !important;
  background-color: white !important;
  padding-right: 10px !important;
}
</style>


