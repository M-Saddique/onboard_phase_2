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
    <v-row>
      <v-col md="2"></v-col>

      <v-col cols="12" sm="12" md="4" style="align-self: center">
        <v-col>
          <v-img src='../src/assets/dlivrdlogo.png'></v-img>
          <v-card-text style="color: white; padding: 0px; text-align: center">
            Enter Registered Username
          </v-card-text>
        </v-col>
        <TextFieldItem>
          <template #heading>User Name</template>
          <v-text-field
              background-color="black"
              required
              v-model="username"
              hide-details
              :readonly = editMobileNumber
              placeholder="Enter number"
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
        <v-col align-self="center" sm="12" style="text-align: center; margin-top: 10px">
          <v-btn v-if="loading" prepend-icon="mdi-send-variant-outline" class="btn_green" @click="requestResetPass">Resend</v-btn>
          <v-btn v-if="loading" prepend-icon="mdi-shield-check" class="btn_green" style="margin-left: 10px" @click="requestResetPass">Verify</v-btn>
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
import axios from "axios";
import { AtomSpinner } from 'epic-spinners'

export default {
  components: {
    'TextFieldItem': TextFieldItem,
    'SignUpHeader': SignUpHeader,
    AtomSpinner
  },
  data () {
    return {
      username: "",
      dialog: false,
      alert_title: '',
      alert_description: '',
      loading: true,
      otpCode: '',
      editMobileNumber: false
    }
  },
  methods: {
    requestResetPass(){
      if(this.username == ""){
        this.alert_title = "Warning";
        this.alert_description = "Please enter dlivrd Username";
        this.dialog = true;
        this.agreeButtonText = "Ok";
        this.cancelButtonText = "Cancel"
      }else {
          this.loading = false
          var url = this.baseurl + 'onboard_forgotPassword'
          const data = {
            identity: this.username,
            ttc: 'open',
          }
          //console.log(data)
          axios.post(url, data, {
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            }
          }).then((response) => {
            console.log(response)
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
            console.log(e)
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
