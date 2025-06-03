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
              <v-btn
                  v-else-if="alert_title == 'Alert'"
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
      <v-col cols="12" sm="12" md="4" align-self="center">
        <SignUpHeader />
      </v-col>
      <v-col cols="12" sm="12" md="4" style="align-self: center">
        <TextFieldItem>
          <template #heading>Mobile Number</template>
          <v-text-field
              background-color="black"
              required
              v-model="mobileNumber"
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
        <v-col sm="12" class="alignCaptcha">
          <VueRecaptcha
              sitekey="6Ld7pNAmAAAAAG4qWGWSDntc7Cc4HsywpB2lYvpI"
              :load-recaptcha-script="true"
              @verify="handleSuccess"
              @error="handleError"
          ></VueRecaptcha>
        </v-col>
        <v-col align-self="center" sm="12" style="text-align: center; margin-top: 10px">
          <v-card-text v-if="!captchaChecked" style="color: red; padding: 0">{{captchaWarning}}</v-card-text>
          <v-btn v-if="loading" prepend-icon="mdi-shield-check" class="btn_green" style="margin-left: 10px" @click="requestResetPass">Verify</v-btn>
          <div v-if="!loading" style="width: 100%; text-align: -webkit-center">
            <atom-spinner :animation-duration="1000" :size="90" color="#0AFD01"/>
          </div>
        </v-col>
        <v-col v-if="resendpasswordResetLink">
          <v-card-text style="color:white; text-align: center">Didn't get the code? <span class="resendPass" @click="resendResetPass">Resend!</span></v-card-text>
<!--          <v-btn v-if="loading" prepend-icon="mdi-send-variant-outline" class="btn_green" @click="requestResetPass">Resend</v-btn>-->
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
import { VueRecaptcha } from 'vue-recaptcha';

export default {
  components: {
    'TextFieldItem': TextFieldItem,
    'SignUpHeader': SignUpHeader,
    AtomSpinner,
    VueRecaptcha
  },
  data () {
    return {
      mobileNumber: "",
      dialog: false,
      alert_title: '',
      alert_description: '',
      loading: true,
      otpCode: '',
      editMobileNumber: false,
      captchaChecked: false,
      captchaWarning: "",
      captchaToken: null,
      resendpasswordResetLink: false,
    }
  },
  methods: {
    handleSuccess(event){
      this.captchaToken = event;
      this.captchaChecked = true;
    },
    handleError(){
      this.alert_title = "Alert"
      this.alert_description = "Please solve the Captcha again."
      this.dialog = true;
      this.captchaChecked = false;
    },
    resendResetPass(){

    },
    requestResetPass(){
      if(this.captchaChecked == false){
        this.captchaWarning = "Please verify you are human";
        return;
      }
      else{
        this.captchaChecked = true;
      }
      if(this.mobileNumber == ""){
        this.alert_title = "Warning";
        this.alert_description = "Please enter your registered Mobile Number.";
        this.dialog = true;
      }else {
        this.loading = false
        var url = this.baseurl + 'onboard_forgotPassword'
        const data = {
          identity: this.mobileNumber,
          captchaKey: this.captchaToken,
          // captchaKey: '03AL8dmw83oU_tpbt0wp_IVHNFuDhvhfJGEk1l0cbp7qpK5XOCnEMngZSrIOA710FdA-Un4EFSCPTLoAUgki-cR4xfSoasVtVZnYeS2MNircDpoqQrTkbN98ry03rRij2sLAhwhUp6kb8czAG8I5mdcmJdibtxvLXFF8L2g147YGxVi21_0bjquilx0eWTJeVzNtpuOIECkbCKRb4kr24ABx5ygG0gKBpN1wLBQPRK9M_21iNXserFKULKn4Hg1xR5YG-UQ_9-0Z1ctoHR8dAJ1GSa8C74rVzHrO5hmivG3eGz47TijH97SzoV8J0HFh-IByLA9dc5t4mml7bWKJXe7uFbfLBc7b_ZZtRdFqZjLxySRIeUNON53pFgfDQxo-H_LhHz7z2c8jCdPns3PseAD85U1aePDZKFu5WDHt5pNyzc_shxxXKD7gSIBPRB3m8Kb_ScF2f7s-SiY-WIDuUMhwidk3b1SaY1oxZMqnmaJuGQ_HgXXS6kt91BPnAqz_napaTaXpuJzX6Jjy2g8KGciN_7eSuh4cbRSJ5LDjzGkyu6j3hRbX37Crib0mKVILAMQUnOMeiAUasq8TqHd06vTWT1hWho1SCIVUEJfm3CqinSPv5kuI9QQIBBo2pXaXHwLMFP-SAMuNfXO-_v6wVoZsoQoK42jvH02KRXIT6Nl9Dwm3-X7hdw_zrTTiD0OaB7FnmAxfCuVD-SiptYl8tUeUMr0HrCZyDXEvHesAm-gj5xRR0P_nuGNaMbnw26-H5KJKgxg0A02rjj19uLPSl24diLfMnrK1gcFB5olGjratHs9WKENFCwBpSKfK495y6WH8Nj-TiLCzsJczg__9EJ4O3S9IXUT9VVMuI9aXZSdv8GSE09gUgxKRtg5-fIyIidw0AM7jDsfqSa1Y4nG6q5UUimz1tyvBYxarq-KgL1rHAPDLx8KCJztnlduI6cHnv-cUmNzLmbcAZheIyIKuU-M-6VCIgy3DJYPTsN7Y2FyvEoJW4V2g43N_Bn_U0rxjV3sFQyF6OH8W5_Cx-EypHP6M7a4DFOz2fl-fydgGlofnEAiW_ReIJKc1qgjS1nJiszycFhD_tTiLsh5EHmud43nNG51wrRxZjNVcC0RMiVpqdLgCytYv3lLFes5bbjgkNMkeIO5ebNUlOTKilpprW-eHkuCwSV6_1ECJLHPx3UeIWRN6mBVCP_-b-FhKYBLS1dqAzpAAdBog-O5ExAU69q7wCe8RYa_4EpX7cPXZEbo-muqpDkVOsh9dY6aSsnxH_uFce7ImiouyTeRtSAjRHQmGKGRggzL-ofv8bxxkBlZKvfvetT__N7xKrcvDTCC0WRgFWZIbdeGHMcuGiNfRAurGbhSNEWalukO4P040xviWHhQTTYJrWXDk_-pPz2mJrHXTucE3pgtgFk_c-JHiDR2alxYjLOfwVOeVDYT0S94BE9Hv-lLeiM6_jDaNfXdZfGXyUyRb82HLvL',
        }
        axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          }
        }).then((response) => {
          this.loading = true
          if (response.status == 200) {
            this.resendpasswordResetLink = true;
            var responseResult = response.data;
            if(responseResult['Success']){
              this.alert_title = "Success";
              this.alert_description = responseResult['Success'];
              this.dialog = true;
            }
            else{
              this.alert_title = "Warning";
              if(responseResult['Failure'] == 'Captcha not verified.'){
                this.alert_description = 'Error verifying the mobile number. Please try again.';
              }
              else{
                this.alert_description = responseResult['Failure'];
              }
              this.dialog = true;
            }
          }
        }).catch((e) => {
          this.$router.push('/')
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
.alignCaptcha{
  padding-top: 25px !important;
  text-align: -webkit-center;
}
.resendPass{
  color: #0afd01;
  cursor: pointer;
}
.resendPass:hover{
  color: #00bd7e;
}
@-moz-document url-prefix() {
  .alignCaptcha{
    text-align: -moz-center;
  }
}
</style>
