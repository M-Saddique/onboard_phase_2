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
                  @click="confirmResetPassword">
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

    <v-row v-if="tokenVerified">
      <v-col md="2"></v-col>
      <v-col cols="12" sm="12" md="4" align-self="center">
        <SignUpHeader />
      </v-col>
      <v-col cols="12" sm="12" md="4" style="align-self: center">
        <TextFieldItem>
          <template #heading>Password</template>
          <v-text-field
              required
              v-model="userPassword"
              hide-details
              placeholder="Enter new password"
              :persistent-placeholder='true'
              class="generic_tx px-1"
              name="login"
              :value="userPassword"
              :append-icon="value ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="() => (value = !value)"
              :type="value ? 'password' : 'text'"
              density="comfortable"
              @keyup.enter="requestResetPass"
          />
        </TextFieldItem>
        <TextFieldItem>
          <template #heading>Confirm Password</template>
          <v-text-field
              required
              v-model="confirmPassword"
              hide-details
              placeholder="Confirm password"
              :persistent-placeholder='true'
              class="generic_tx px-1"
              name="login"
              :valueConfirmPassword="confirmPassword"
              :append-icon="valueConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="() => (valueConfirmPassword = !valueConfirmPassword)"
              :type="valueConfirmPassword ? 'password' : 'text'"
              density="comfortable"
              @keyup.enter="requestResetPass"
          />
        </TextFieldItem>
        <v-col align-self="center" sm="12" style="text-align: center; margin-top: 10px">
          <v-btn v-if="loading" class="btn_green" @click="requestResetPass">Reset Password</v-btn>
          <div style="width: 100%; text-align: -webkit-center">
            <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#0AFD01" />
          </div>
        </v-col>
      </v-col>
      <v-col md="2"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import TextFieldItem from '../components/TextFieldItem.vue'
import SignUpHeader from '../components/SignUpHeader.vue'
import { AtomSpinner } from 'epic-spinners'
import axios from "axios";

export default {
  components: {
    'TextFieldItem': TextFieldItem,
    'SignUpHeader': SignUpHeader,
    AtomSpinner
  },
  data () {
    return {
      userPassword: "",
      confirmPassword: "",
      dialog: false,
      alert_title: '',
      alert_description: '',
      loading: true,
      loadingToken: true,
      tokenVerified: false,
      value: String,
      valueConfirmPassword: String,
      redirectTo: null,
    }
  },
  computed: {
    tokenId: function () {
      // return this.$router.query.tokenId;
      return this.$route.params.tokenId;
    },
  },
  mounted() {
    this.verifyToken()
  },
  methods: {
    verifyToken(){
      this.tokenVerified = false;
      var auth_token = ''
      var url = this.baseurl + 'onboard_resetPassword_verifyToken'
      const data = {
        token: this.tokenId,
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          authorization : auth_token
        }
      }).then((response) => {
        if(response.status == 200){
          this.tokenVerified = true
        }
      }).catch(() => {
        this.alert_title = "OOOPS!!!";
        this.alert_description = "Link not found";
        this.dialog = true;
        this.agreeButtonText = "Ok";
      })
    },
    requestResetPass(){
      if(this.userPassword == '' || this.confirmPassword == ''){
        this.alert_title = "Warning";
        this.alert_description = "Please fill all the fields";
        this.dialog = true;
        this.agreeButtonText = "Ok";
      }
      else if(this.userPassword != '' && this.confirmPassword != ''){
        if(this.userPassword == this.confirmPassword){

          this.loading = false
          var auth_token = ''//localStorage.getItem("auth_token")
          var url = this.baseurl + 'onboard_resetPassword'
          const data = {
            token: this.tokenId,
            new_password: this.userPassword,
          }
          axios.post(url, data, {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              authorization : auth_token
            }
          }).then((response) => {
            console.log("Reset Password")
            console.log(response)
            var reqPass = response.data
            this.loading = true
            if(response.status == 200){
              // response.redirect
              this.redirectTo = reqPass['redirect']
              this.alert_title = "Success";
              this.alert_description = "Password updated successfully";
              this.dialog = true;
              this.agreeButtonText = "Ok";
            }
          }).catch(() => {
            this.alert_title = "Warning";
            this.alert_description = "Password not updated/ Try Again!";
            this.dialog = true;
            this.agreeButtonText = "Ok";
          })
        }
        else{
          this.alert_title = "Warning";
          this.alert_description = "Password and confirm password do not match";
          this.dialog = true;
          this.agreeButtonText = "Ok";
        }
      }
    },
    confirmResetPassword(){
      if(this.redirectTo == 'on'){
        this.$router.push('/')
      }
      else if (this.redirectTo == 'open'){
        // this.$router.push('https://urgent.dlivrd.io/')
        window.location.href = 'https://urgent.dlivrd.io/';
      }
    }
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
</style>
