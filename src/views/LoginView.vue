<template >
  <v-container class="mainblock" fluid>

    <v-dialog
        id="dialogBox"
        v-model="showError"
        transition="dialog-top-transition"
        max-width="600px"
        persistent
    >
      <v-card>
        <v-card-title class="text-h5" style="background-color: red">
          Warning
        </v-card-title>
        <v-card-text id="dialogDescription" style="overflow-y: scroll; text-align: justify" v-html="errorMessage"></v-card-text>
        <!--        <v-card-text v-if="showError" style="color:red; padding-top: 0px" v-html="errorMessage"></v-card-text>-->
        <!--        <v-card-text v-if="alert_error != null" style="overflow-y: scroll; text-align: justify;color: red;font-size: 12px;width: 100%;text-align: left; padding-top: 0px">{{alert_error}}</v-card-text>-->
        <v-card-actions style="align-self: end; margin-top: 30px">
          <v-spacer></v-spacer>
          <v-btn
              style="background-color: #7efb01"
              variant="text"
              @click="showError = !showError"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row class="mainblock">
      <v-card>
        <v-row justify="center">
          <v-dialog
              v-model="dialog"
              transition="dialog-top-transition"
              width="auto"
          >
            <v-card>
              <v-card-title class="text-h5">
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
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-card>

      <v-row>
        <v-col md="4"></v-col>
        <v-col cols="12" sm="12" md="4" align-self="center">
          <h3 style="color: white; text-align: center; font-size: 1.3rem"> Welcome to dlivrd Driver Partner Portal</h3>
          <!--      </v-col>-->
          <!--      <v-col cols="12" sm="12" md="4" style="border-radius: 5px">-->
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
          <v-col class="alignForgotPass">
            <h6 @click="this.$router.push('/forgotPassword')" class="forgotPass">Forgot Your Password?</h6>
          </v-col>
          <v-col>
            <v-card-text style="color: white; padding: 0px; text-align: center">
              Don't have an account? <span class="signUpLink" onclick="window.parent.location.href= 'https://www.dlivrd.io/drive'">Create Now!</span>
            </v-card-text>
          </v-col>
          <v-col align-self="center" sm="12" style="text-align: center;">
            <v-btn
                prepend-icon="mdi-login"
                v-if="loading"
                class="btn_green"
                @click="login"
            >
              Login
            </v-btn>
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
import axios from "axios";
import { AtomSpinner } from 'epic-spinners'

export default {
  components: {
    'TextFieldItem': TextFieldItem,
    AtomSpinner,
  },
  data () {
    return {
      // username: "2675854333",
      // userPassword: "chris@1234",
      username: "",
      userPassword: "",
      dialog: false,
      alert_title: '',
      alert_description: '',
      showError: false,
      errorMessage: null,
      loading:true,
      value: String,
    }
  },
  mounted(){

  },
  methods: {
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
        localStorage.clear();
        this.loading = false
        var url = this.baseurl + 'onboard_signin'
        const data = {
          identity: this.username,
          password: this.userPassword,
        }
        axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          }
        }).then((response) => {
          this.loading = true
          if(response.status == 200){
            console.log("Login Response")
            console.log(response)
            var processLogin = response.data
            if(processLogin['Failure']){
              this.showError = true;
              if(processLogin['Failure'] == 'Account under review.'){
                this.errorMessage = 'Account under review.'
              }else if(processLogin['Failure'] == 'Incorrect Username or Password. Please contact administration.'){
                this.errorMessage = 'Incorrect Username or Password.';
              }
              else {
                // this.errorMessage = "Your Onboarding process is already complete."
                this.errorMessage = "You are already registered on the dlivrd Driver Portal."
              }
            }
            else {
              if(processLogin['wait_list']){
                this.showError = true;
                this.errorMessage = "Hi " + processLogin['user_name'] + "! We are currently not partnering with new drivers in your area, but you have been added to our WAITING LIST. We will notify you once space becomes available."
              }
              else{
                localStorage.setItem('email',  this.username);
                localStorage.setItem('username', this.username);
                localStorage.setItem('name', processLogin.user_name);
                localStorage.setItem('stage', processLogin.stage);
                localStorage.setItem('country',processLogin.country);
                localStorage.setItem('session_id',processLogin.session_id);
                localStorage.setItem('mobile', processLogin.mobile_number);
                localStorage.setItem('phoneverified', processLogin.phone_verified);
                localStorage.setItem('is_dlivrd_driver', processLogin.is_dlivrd_driver);
                localStorage.setItem('userProfileImage', this.baseImageurl + processLogin.profile_image);
                if(processLogin['fleet_id']){
                  localStorage.setItem('fleet_id', processLogin['fleet_id']);
                }
                if(processLogin['initial_stage']){
                  localStorage.setItem('first_login',processLogin['initial_stage'])
                }
                if(processLogin['requires_password_update']){
                  localStorage.setItem('require_password',processLogin['requires_password_update'])
                }
                if(processLogin['first_visit_on_tutorials']){
                  console.log("Variable is true")
                  console.log(processLogin['first_visit_on_tutorials'])
                  localStorage.setItem('first_visit_on_tutorials',processLogin['first_visit_on_tutorials']);
                }

                if(processLogin['info_completed'] == true){
                  localStorage.setItem('new_driver', false);
                  this.$router.push('/analytics')
                }
                else{
                  localStorage.setItem('new_driver', true);
                  this.$router.push('/checklist')
                }
              }
            }
          }
        }).catch( () => {
          this.loading = true;
          this.showError = true;
          this.errorMessage = "You are having issues logging in to your account. Please Try Again after 30 minutes."
        })
      }
    },
    checkExistingSession(){
      if(localStorage.getItem('session_id') != null){
        this.$router.push('/analytics')
      }
    },
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


