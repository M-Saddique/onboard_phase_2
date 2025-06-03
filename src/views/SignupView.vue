<template >
  <v-container fill-height fluid class="mainblock">
    <!--    Error message strip   -->
<!--    <v-row v-if="showError" style="background-color: red; position: absolute; top: 0; width: 100%; overflow-x: hidden; z-index: 5; align-items: center">-->
<!--      <v-card-text style="background-color: red; color:white; padding-bottom: 6px; width: 90%" v-html="errorMessage"></v-card-text>-->
<!--      <v-icon style="padding-top: 10px; padding-right: 10px; cursor: pointer; width: 10%; justify-content: right" color="#ffffff" @click="showError = false">mdi-close</v-icon>-->
<!--    </v-row>-->
    <!--    main sign up screen view   -->
    <v-row class="mainblock">
      <v-card>
        <v-row justify="center">
          <v-dialog
              v-model="dialog"
              transition="dialog-top-transition"
              max-width="600px"
              max-height="500px"
          >
            <v-card>
              <v-card-title class="text-h5" style="background-color: #7efb01">
                {{alert_title}}
              </v-card-title>
              <v-card-text style="text-align: justify; overflow-y: scroll; font-size: 16px" v-html="alert_description"></v-card-text>
              <v-card-actions style="align-self: end; margin-top: 15px">
                <v-spacer></v-spacer>
                <v-btn
                    v-if="viewTerms"
                    style="background-color: #7efb01"
                    variant="text"
                    @click="closeDialog"
                >
                  Okay
                </v-btn>
                <v-btn
                    v-else-if="!viewTerms && agreeButtonText != 'Okay'"
                    style="background-color: #7efb01"
                    variant="text"
                    @click="routeToLoginPage"
                >
                  Okay
                </v-btn>
                <v-btn
                    v-if="agreeButtonText == 'Okay'"
                    style="background-color: #7efb01"
                    variant="text"
                    @click="closeDialog"
                >
                  Okay
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-card>

      <v-row>
        <v-col md="2"></v-col>
        <v-col cols="12" sm="12" md="4" style="align-self: center;" >
          <SignUpHeader />
        </v-col>
        <v-col id="signupform" cols="12" sm="12" md="4"  style="overflow-y: scroll;height: 70vh;">
          <!-- First Name -->
          <TextFieldItem>
            <template #heading><span>First Name</span></template>
            <v-text-field
                required
                hide-details
                v-model="firstName"
                placeholder="Enter First Name"
                :persistent-placeholder='true'
                class="generic_tx px-1"
                name="firstName"
                type="text"
                density="comfortable"
            />
          </TextFieldItem>
          <!-- Middle Name -->
          <TextFieldItem>
            <template #heading>Middle Name</template>
            <v-text-field
                hide-details
                v-model="middleName"
                placeholder="Enter Middle Name (Optional)"
                :persistent-placeholder='true'
                class="generic_tx px-1"
                name="middleName"
                type="text"
                density="comfortable"
            />
          </TextFieldItem>
          <!-- Last Name -->
          <TextFieldItem>
            <template #heading>Last Name</template>
            <v-text-field
                required
                hide-details
                v-model="lastName"
                placeholder="Enter Last Name"
                :persistent-placeholder='true'
                class="generic_tx px-1"
                name="lastName"
                type="text"
                density="comfortable"
            />
          </TextFieldItem>
          <!-- Mobile Number -->
          <TextFieldItem>
            <template #heading>Mobile Number</template>
            <!--          <MazPhoneNumberInput-->
            <!--              v-model="phoneNumber"-->
            <!--              show-code-on-list-->
            <!--              color="info"-->
            <!--              :preferred-countries="['FR', 'BE', 'DE', 'US', 'GB']"-->
            <!--              :ignored-countries="['AC']"-->
            <!--          />-->
            <!--          <VuePhoneNumberInput v-model="phoneNumber"-->
            <!--          />-->

            <!--          @update="results = $event"-->
            <!--          :success="results?.isValid"-->


            <v-text-field
                required
                hide-details
                v-model="mobileNumber"
                placeholder="Enter Mobile Number"
                :persistent-placeholder='true'
                class="generic_tx px-1"
                name="mobileNumber"
                type="text"
                density="comfortable"
            />
          </TextFieldItem>
          <!-- Email Address -->
          <TextFieldItem>
            <template #heading>Email Address</template>
            <v-text-field
                required
                hide-details
                v-model="userEmail"
                placeholder="Enter Email"
                :persistent-placeholder='true'
                class="generic_tx px-1"
                name="userEmail"
                type="email"
                density="comfortable"
            />
          </TextFieldItem>
          <!-- Country -->
          <TextFieldItem>
            <template class="text_header_color" #heading>Country</template>
            <v-select
                clearable
                open-on-clear
                color="#ffffff"
                bg-color="#ffffff"
                :items="countries"
                v-model="optedCountry"
                placeholder="Select Country"
                :persistent-placeholder='true'
                class="generic_tx selectdropdown"
                hide-details
                density="comfortable"
            >
            </v-select>
          </TextFieldItem>
          <!-- State -->
          <TextFieldItem>
            <template class="text_header_color" #heading>States</template>
            <v-select
                clearable
                open-on-clear
                color="#ffffff"
                bg-color="#ffffff"
                :items="states"
                v-model="optedState"
                placeholder="Select State"
                :persistent-placeholder='true'
                class="generic_tx selectdropdown"
                hide-details
                density="comfortable"
            >
            </v-select>
          </TextFieldItem>
          <!-- City -->
          <TextFieldItem>
            <template class="text_header_color" #heading>City</template>
            <v-select
                clearable
                open-on-clear
                color="#ffffff"
                bg-color="#ffffff"
                :items="cities"
                v-model="optedCity"
                placeholder="Select City"
                :persistent-placeholder='true'
                class="generic_tx selectdropdown"
                hide-details
                density="comfortable"
            >
            </v-select>
          </TextFieldItem>
          <!-- Driving license -->
          <TextFieldItem>
            <template class="text_header_color" #heading>Do you have a valid Driving License?</template>
            <v-radio-group
                inline
                v-model="driversLicense"
                hide-details
            >
              <v-radio label="Yes" :value=true class="radiobtn"></v-radio>
              <v-radio label="No" :value=false class="radiobtn adjustment"></v-radio>
            </v-radio-group>
          </TextFieldItem>
          <!-- Legally Eligible -->
          <TextFieldItem>
            <template class="text_header_color" #heading>Are you legally eligible to work in {{optedCountryView}} ?</template>
            <v-radio-group
                inline
                v-model="legallyEligible"
                hide-details
            >
              <v-radio label="Yes" :value=true class="radiobtn"></v-radio>
              <v-radio label="No" :value=false class="radiobtn adjustment"></v-radio>
            </v-radio-group>
          </TextFieldItem>
          <!-- Comfortable using your own vehicle -->
          <TextFieldItem>
            <template class="text_header_color" #heading>
              Comfortable using your own vehicle for deliveries?
            </template>
            <v-radio-group
                inline
                v-model="vehicleComfortability"
            >
              <v-radio label="Yes" :value=true class="radiobtn"></v-radio>
              <v-radio label="No" :value=false class="radiobtn adjustment"></v-radio>
            </v-radio-group>
          </TextFieldItem>
          <v-layout style="display: inline-flex; margin-top: 10px; z-index: 0 !important;">
            <v-checkbox @click="agreedOnTerms" style="z-index:10" v-model="agreeToTermsAndConditions"></v-checkbox>
            <v-card-text style="padding-bottom: 0px; padding-left: 30px; font-size: 18px; color:white; text-align: justify">I would like to receive updates from dlivrd. These messages will vary in frequency, message and data rates may apply. Reply HELP for help or STOP to opt out of short code SMS service. View our <span class="privacy_policy" @click="openSMSTerms">SMS Terms</span>, <span class="privacy_policy" @click="openPrivacyPolicy"> Privacy Policy</span> and <span class="privacy_policy" @click="openICA"> Independent Contract Agreement.</span></v-card-text>
          </v-layout>
          <v-col v-if="showError">
            <v-card-text class="signupFieldError" v-html="errorMessage"></v-card-text>
          </v-col>
          <v-col sm="12" class="alignCaptcha">
            <VueRecaptcha
                sitekey="6Ld7pNAmAAAAAG4qWGWSDntc7Cc4HsywpB2lYvpI"
                :load-recaptcha-script="true"
                @verify="handleSuccess"
                @error="handleError"
            ></VueRecaptcha>
          </v-col>
          <v-col sm="12" style="text-align: center">
            <v-card-text v-if="!captchaChecked" style="color: red; padding: 0">{{captchaWarning}}</v-card-text>
            <v-btn v-if="loading" :disabled="!agreeToTermsAndConditions" prepend-icon="mdi-login" class="btn_green" style="margin-bottom: 40px; margin-top: 30px" @click="performSignUp">Sign up</v-btn>
            <div class="alignSpinner">
              <atom-spinner v-if="!loading"  :animation-duration="1000" :size="90" color="#0AFD01" />
            </div>
          </v-col>
        </v-col>
        <v-col md="2"></v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import TextFieldItem from '../components/TextFieldItem.vue'
import SignupHeader from '../components/SignUpHeader.vue'
import { AtomSpinner } from 'epic-spinners'
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { VueRecaptcha } from 'vue-recaptcha';

import axios from "axios";
export default{
  components: {
    'TextFieldItem': TextFieldItem,
    'SignUpHeader': SignupHeader,
    VuePhoneNumberInput,
    AtomSpinner,
    VueRecaptcha
  },
  data () {
    return {
      firstName: "",
      lastName: "",
      middleName: "",
      mobileNumber: "",
      userEmail: "",
      countries: [],
      states: [],
      cities: [],
      driversLicense: "",
      legallyEligible: "",
      vehicleComfortability: "",
      Data_Countries: {},
      optedCountryView: 'USA',
      optedCountry: null,
      optedState: null,
      optedCity:null,
      alert_title:'',
      alert_description:'',
      dialog :false,
      agreeToTermsAndConditions: false,
      showError: false,
      errorMessage: '',
      loading: true,
      confirmMobileNumber: false,
      agreeButtonText: "",
      numberVerification: "",
      textFieldLabel: "",
      viewTerms: false,
      captchaChecked: false,
      captchaWarning: "",
      captchaToken: null,
    }
  },
  watch: {
    optedCountry() {
      this.optedCountryView = this.optedCountry;
      this.setStates();
    },
    optedState(){
      this.setCity()
    }
  },
  mounted(){
    this.getRegions()
  },
  methods: {
    handleSuccess(event){
      this.captchaToken = event;
      this.captchaChecked = true;
    },
    handleError(){
      this.captchaChecked = false;
    },
    loadRegions(datapoints){
      var state, country = "";
      for(var team in datapoints){
        if (team == 'Others'){
          state = "Other"
          country = "USA";
        }
        else{
          state= team.split(', ')[0];
          country= team.split(', ')[1];
        }
        for(var city in datapoints[team]){
          if(this.Data_Countries[country] == null)
            this.Data_Countries[country] = {}
          if(this.Data_Countries[country][state] == null){
            this.Data_Countries[country][state] = []
          }
          this.Data_Countries[country][state].push(datapoints[team][city])
        }
        if(!this.countries.includes(country)){
          this.countries.push(country)
        }
      }
    },
    getRegions(){
      var auth_token = ''
      var url =this.baseurl + 'get_markets_regions'
      const data = {}
      axios.get(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          authorization : auth_token,
          uuid:''//localStorage.getItem("uuid")
        }
      }).then((response) => {

        if(response.status == 200){
          const data = response.data;
          this.loadRegions(data)
        }
      }).catch(() => {
        //console.log("Regions not fetched")
      })
    },
    setStates(){
      this.states = []
      this.optedState = null;
      for(var country in this.Data_Countries){
        if(this.optedCountry == country){
          for(var state in this.Data_Countries[country]){
            this.states.push(state)
          }
          //console.log(this.states)
          this.states.sort()
        }
      }
      this.setCity()
    },
    setCity(){
      this.cities = [];
      this.optedCity = null;
      for (var country in this.Data_Countries){
        for(var state in this.Data_Countries[country]){
          if(this.optedState == state){
            for(var city in this.Data_Countries[country][state])
              this.cities.push(this.Data_Countries[country][state][city])
          }
        }
        this.cities.sort()
      }
    },
    agreedOnTerms(){
      this.agreeToTermsAndConditions = !this.agreeToTermsAndConditions;
    },
    openSMSTerms(){
      this.dialog = true;
      this.viewTerms = true;
      this.alert_description = "Dlivrd SMS Campaign: Order Notifications<br/><br/>1. SMS are being sent since you signed up to receive order notifications and confirmations of available and upcoming orders.  These SMS’s can be at bulk, or one by one.  You opted in to receive and are expecting these texts to be able to be able to complete delivery functions and the message frequency varies.<br/>" +
          "<br/>2. You can cancel the SMS service at any time. Just text “STOP” to the short code. After you send the SMS message “STOP” to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time and we will start sending SMS messages to you again.<br/>" +
          "<br/>3. If you are experiencing issues with the messaging program you can reply with the keyword HELP for more assistance, or you can get help directly at hello@dlivrd.io<br/>" +
          "<br/>4. Carriers are not liable for delayed or undelivered messages.<br/>" +
          "<br/>5. As always, message and data rates may apply for any messages sent to you from us and to us from you. Messages will vary in frequency. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.<br/>" +
          "<br/>6. If you have any questions regarding privacy, please read our privacy policy.";
      this.alert_title = "SMS Terms";
    },
    openPrivacyPolicy(){
      this.dialog = true;
      this.viewTerms = true;
      this.alert_description = "Version Date: 01.05.2021<br/>" +
          "<br/>" +
          "Thank you for using  dlivrd.<br/>" +
          "<br/>" +
          "Introduction<br/>" +
          "Welcome to dlivrd<br/>" +
          "DLIVRD (“us”, “we”, or “our”) operates WWW.DLIVRD.IO (hereinafter referred to as “Service”).<br/>" +
          "Our Privacy Policy governs your visit to WWW.DLIVRD.IO, and explains how we collect, safeguard and disclose information that results from your use of our Service.<br/>" +
          "We use your data to provide and improve Service. By using Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.<br/>" +
          "Our Terms and Conditions (“Terms”) govern all use of our Service and together with the Privacy Policy constitutes your agreement with us (“agreement”).<br/>" +
          "2. Definitions<br/>" +
          "SERVICE means the WWW.DLIVRD.IO website operated by DLIVRD<br/>" +
          "PERSONAL DATA means data about a living individual who can be identified from those data (or from those and other information either in our possession or likely to come into our possession).<br/>" +
          "USAGE DATA is data collected automatically either generated by the use of Service or from Service infrastructure itself (for example, the duration of a page visit).<br/>" +
          "COOKIES are small files stored on your device (computer or mobile device).<br/>" +
          "DATA CONTROLLER means a natural or legal person who (either alone or jointly or in common with other persons) determines the purposes for which and the manner in which any personal data are, or are to be, processed. For the purpose of this Privacy Policy, we are a Data Controller of your data.<br/>" +
          "DATA PROCESSORS (OR SERVICE PROVIDERS) means any natural or legal person who processes the data on behalf of the Data Controller. We may use the services of various Service Providers in order to process your data more effectively.<br/>" +
          "DATA SUBJECT is any living individual who is the subject of Personal Data.<br/>" +
          "THE USER is the individual using our Service. The User corresponds to the Data Subject, who is the subject of Personal Data.<br/>" +
          "<br/>" +
          "3. Information Collection and Use<br/>" +
          "We collect several different types of information for various purposes to provide and improve our Service to you.<br/>" +
          "<br/>" +
          "4. Types of Data Collected<br/>" +
          "Personal Data<br/>" +
          "While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (“Personal Data”). Personally identifiable information may include, but is not limited to:<br/>" +
          "0.1. Email address<br/>" +
          "0.2. First name and last name<br/>" +
          "0.3. Phone number<br/>" +
          "0.4. Address, State, Province, ZIP/Postal code, City<br/>" +
          "0.5. Cookies and Usage Data<br/>" +
          "We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link.<br/>" +
          "Usage Data<br/>" +
          "We may also collect information that your browser sends whenever you visit our Service or when you access Service by or through a mobile device (“Usage Data”).<br/>" +
          "This Usage Data may include information such as your computer’s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.<br/>" +
          "When you access Service with a mobile device, this Usage Data may include information such as the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device identifiers and other diagnostic data.<br/>" +
          "<br/>" +
          "Location Data<br/>" +
          "We may use and store information about your location if you give us permission to do so (“Location Data”). We use this data to provide features of our Service, to improve and customize our Service.<br/>" +
          "You can enable or disable location services when you use our Service at any time by way of your device settings.<br/>" +
          "<br/>" +
          "Location Data – DLIVRD<br/>" +
          "To participate as a DLIVRD driver, you must permit the DLIVRD Services to access location services through the permission system used by your mobile operating system (“Platform”) or browser. We may collect the precise location of your device when the DLIVRD app is running in the foreground or background of your device. We may also derive your approximate location from your IP address. We use your location information to verify that you are present in your preferred region or city when you begin or engage in a delivery through the DLIVRD (a “Delivery”), connect you with delivery opportunities in your zone, and track the progress and completion of your Deliveries. You can enable the location tracking feature through the settings on your device or Platform or when prompted by the DLIVRD mobile app. If you choose to disable the location feature through the settings on your device or Platform, DLIVRD will not receive precise location information from your device, which will prevent you from being able to Trip and receiving delivery opportunities in your area.<br/>" +
          "<br/>" +
          "Tracking Cookies Data<br/>" +
          "We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information.<br/>" +
          "Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Other tracking technologies are also used such as beacons, tags and scripts to collect and track information and to improve and analyze our Service.<br/>" +
          "<br/>" +
          "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.<br/>" +
          "<br/>" +
          "Examples of Cookies we use:<br/>" +
          "4.1. Session Cookies: We use Session Cookies to operate our Service.<br/>" +
          "4.2. Preference Cookies: We use Preference Cookies to remember your preferences and various settings.<br/>" +
          "4.3. Security Cookies: We use Security Cookies for security purposes.<br/>" +
          "4.4. Advertising Cookies: Advertising Cookies are used to serve you with advertisements that may be relevant to you and your interests.<br/>" +
          "<br/>" +
          "Other Data<br/>" +
          "While using our Service, we may also collect the following information: sex, age, date of birth, place of birth, passport details, citizenship, registration at place of residence and actual address, telephone number (work, mobile), details of documents on education, qualification, professional training, employment agreements, non-disclosure agreements, information on bonuses and compensation, information on marital status, family members, social security (or other taxpayer identification) number, office location and other data.<br/>" +
          "<br/>" +
          "5. Use of Data<br/>" +
          "DLIVRD uses the collected data for various purposes:<br/>" +
          "0.1. to provide and maintain our Service;<br/>" +
          "0.2. to notify you about changes to our Service;<br/>" +
          "0.3. to allow you to participate in interactive features of our Service when you choose to do so;<br/>" +
          "0.4. to provide customer support;<br/>" +
          "0.5. to gather analysis or valuable information so that we can improve our Service;<br/>" +
          "0.6. to monitor the usage of our Service;<br/>" +
          "0.7. to detect, prevent and address technical issues;<br/>" +
          "0.8. to fulfill any other purpose for which you provide it;<br/>" +
          "0.9. to carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection;<br/>" +
          "0.10. to provide you with notices about your account and/or subscription, including expiration and renewal notices, email-instructions, etc.;<br/>" +
          "0.11. to provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information;<br/>" +
          "0.12. in any other way we may describe when you provide the information;<br/>" +
          "0.13. for any other purpose with your consent.<br/>" +
          "<br/>" +
          "6. Retention of Data<br/>" +
          "We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.<br/>" +
          "We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.<br/>" +
          "<br/>" +
          "7. Transfer of Data<br/>" +
          "Your information, including Personal Data, may be transferred to – and maintained on – computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.<br/>" +
          "If you are located outside United States, Puerto Rico and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States, Puerto Rico and process it there.<br/>" +
          "Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.<br/>" +
          "DLIVRD will take all the steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organisation or a country unless there are adequate controls in place including the security of your data and other personal information.<br/>" +
          "<br/>" +
          "8. Disclosure of Data<br/>" +
          "We may disclose personal information that we collect, or you provide:<br/>" +
          "0.1. Disclosure for Law Enforcement.<br/>" +
          "Under certain circumstances, we may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities.<br/>" +
          "0.2. Business Transaction.<br/>" +
          "If we or our subsidiaries are involved in a merger, acquisition or asset sale, your Personal Data may be transferred.<br/>" +
          "0.3. Other cases. We may disclose your information also:<br/>" +
          "0.3.1. to our subsidiaries and affiliates;<br/>" +
          "0.3.2. to contractors, service providers, and other third parties we use to support our business;<br/>" +
          "0.3.3. to fulfill the purpose for which you provide it;<br/>" +
          "0.3.4. for the purpose of including your company’s logo on our website;<br/>" +
          "0.3.5. for any other purpose disclosed by us when you provide the information;<br/>" +
          "0.3.6. with your consent in any other cases;<br/>" +
          "0.3.7. if we believe disclosure is necessary or appropriate to protect the rights, property, or safety of the Company, our customers, or others.<br/>" +
          "<br/>" +
          "9. Security of Data<br/>" +
          "The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.<br/>" +
          "<br/>" +
          "10. Service Providers<br/>" +
          "We may employ third-party companies and individuals to facilitate our Service (“Service Providers”), provide Service on our behalf, perform Service-related services or assist us in analyzing how our Service is used.<br/>" +
          "These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.<br/>" +
          "<br/>" +
          "10a. Short Code Data<br/>" +
          "Data obtained through the short code program will not be shared with any third-parties for their marketing reasons / purposes.     <br/>" +
          "<br/>" +
          "11. Analytics<br/>" +
          "We may use third-party Service Providers to monitor and analyze the use of our Service.<br/>" +
          "<br/>" +
          "12. CI/CD tools<br/>" +
          "We may use third-party Service Providers to automate the development process of our Service.<br/>" +
          "<br/>" +
          "13. Advertising<br/>" +
          "We may use third-party Service Providers to show advertisements to you to help support and maintain our Service.<br/>" +
          "<br/>" +
          "14. Behavioral Re-marketing<br/>" +
          "We may use re-marketing services to advertise on third party websites to you after you visited our Service. We and our third-party vendors use cookies to inform, optimize and serve ads based on your past visits to our Service.<br/>" +
          "<br/>" +
          "15. Payments<br/>" +
          "We may provide paid products and/or services within Service. In that case, we use third-party services for payment processing (e.g. payment processors).<br/>" +
          "We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, Mastercard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of payment information.<br/>" +
          "<br/>" +
          "16. Links to Other Sites<br/>" +
          "Our Service may contain links to other sites that are not operated by us. If you click a third party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit.<br/>" +
          "We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.<br/>" +
          "For example, the outlined Privacy Policy has been created using PolicyMaker.io, a free web application for generating high-quality legal documents. PolicyMaker’s online privacy policy generator is an easy-to-use free tool for creating an excellent privacy policy template for a website, blog, online store or app.<br/>" +
          "<br/>" +
          "17. Children’s Privacy<br/>" +
          "Our Services are not intended for use by children under the age of 18 (“Child” or “Children”).<br/>" +
          "We do not knowingly collect personally identifiable information from Children under 18. If you become aware that a Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from Children without verification of parental consent, we take steps to remove that information from our servers.<br/>" +
          "<br/>" +
          "18. Changes to This Privacy Policy<br/>" +
          "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.<br/>" +
          "We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update “effective date” at the top of this Privacy Policy.<br/>" +
          "You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.<br/>" +
          "<br/>" +
          "19. Contact Us<br/>" +
          "If you have any questions about this Privacy Policy, please contact us by email: HELLO@DLIVRD.IO"
      this.alert_title = "Privacy Policy";
    },
    performSignUp(){
      this.showError = false;
      var validateDetails = this.validatePersonalInformation(this.userEmail);
      if(validateDetails){
        if(this.captchaChecked == false){
          this.captchaWarning = "Please verify you are human";
          return;
        }
        this.loading = false;
        var auth_token = ''
        var url =this.baseurl + 'onboard_signup'
        // this.$route.params.ref
        const data = {
          first_name: this.firstName,
          middle_name: this.middleName,
          last_name: this.lastName,
          mobile_number: this.mobileNumber,
          email: this.userEmail,
          country: this.optedCountry,
          states: this.optedState,
          city: this.optedCity,
          redirect:'dlivrd.io',
          has_valid_license: this.driversLicense,
          legally_eligible: this.legallyEligible,
          self_vehicle_comfortability: this.vehicleComfortability,
          agreed_to_privacy_policy: this.agreeToTermsAndConditions,
          captchaKey: this.captchaToken,
        }
        axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            authorization : auth_token
          }
        }).then((response) => {
          if(response.status == 200){
            var signupProcess = response.data
            if(signupProcess['Failure']){
              if(signupProcess['Failure'] == 'Captcha not verified.'){
                this.alert_title = "Warning";
                this.alert_description = 'Error verifying the mobile number. Please try again.';
                this.dialog = true;
              }
              // this.showError = true;
              this.errorMessage = ''
              if(signupProcess.email){
                this.errorMessage = signupProcess.email + '<br/>'
              }
              else{
                this.errorMessage = signupProcess.Failure + '<br/>'
              }
              if(signupProcess['Failure'] == 'Request failed due to invalid values.'){
                if(signupProcess['has_valid_license']){
                  this.errorMessage += '- Need to have Valid License'+'<br/>'
                }
                if(signupProcess['legally_eligible']){
                  this.errorMessage += '- Need to have Legal Age' +'<br/>'
                }
                if(signupProcess['self_vehicle_comfortability']){
                  this.errorMessage += '- Need to Have Personal Vehicle' +'<br/>'
                }
                if(signupProcess['mobile_number']){
                  this.errorMessage += signupProcess['mobile_number'] +'<br/>'
                }
              }
              this.dialog = true;
              this.alert_title = "Alert";
              this.alert_description = this. errorMessage;
              this.agreeButtonText = 'Okay';
            }
            else {
              localStorage.setItem('email', this.userEmail);
              localStorage.setItem('username', this.firstName + " " + this.lastName)
              localStorage.setItem('stage', 0)
              localStorage.setItem('country',this.optedCountry)
              this.alert_title = "Mobile Number Verification"
              this.alert_description = "Username and Password sent to your mobile number."
              this.dialog = true
            }
          }
        }).catch(() => {

        }).finally( () => {
          this.loading = true;
        })
      }
    },
    routeToLoginPage(){
      this.$router.push('/');
      // window.parent.location.href= 'https://driver.dlivrd.io'
    },
    closeDialog(){
      this.dialog = false;
      this.viewTerms = false;
    },
    validatePersonalInformation(email){
      this.showError = false;
      if(this.firstName == null){
        this.showError = true;
        this.errorMessage = "First name cannot be empty";
        return false;
      }
      else if(this.firstName.length < 3){
        this.showError = true;
        this.errorMessage = "First name should be atleast 3 characters long";
        return false;
      }
      else if(this.lastName == null){
        this.showError = true;
        this.errorMessage = "Last name cannot be empty";
        return false;
      }
      else if(this.lastName.length < 3){
        this.showError = true;
        this.errorMessage = "Last name should be atleast 3 characters long";
        return false;
      }
      else if(this.mobileNumber == null){
        this.showError = true;
        this.errorMessage = "Mobile number cannot be empty";
        return false;
      }
      else if(email == null){
        this.showError = true;
        this.errorMessage = "Email cannot be empty";
        return false;
      }
      else if(email != null) {
        if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          this.showError = true;
          this.errorMessage = "Invalid email address";
          return false;
        }
      }
      else if(this.optedCountry == null){
        this.showError = true;
        this.errorMessage = "Country cannot be empty";
        return false;
      }
      else if(this.optedState == null){
        this.showError = true;
        this.errorMessage = "State cannot be empty";
        return false;
      }
      else if(this.optedCity == null){
        this.showError = true;
        this.errorMessage = "City cannot be empty";
        return false;
      }
      else if(this.driversLicense == null){
        this.showError = true;
        this.errorMessage = "Select an option for valid Driving License";
        return false;
      }
      else if(this.legallyEligible == null){
        this.showError = true;
        this.errorMessage = "Select an option for legal eligibility";
        return false;
      }
      else if(this.vehicleComfortability == null){
        this.showError = true;
        this.errorMessage = "Select an option for using your own vehicle.";
        return false;
      }
      if(this.mobileNumber != null){
        var isphone = /^(\([0-9]{3}\)|[0-9]{3})[0-9]{7}$/.test(this.mobileNumber);

        if(isphone == false){
          this.showError = true;
          this.errorMessage = "Not a valid mobile number";
          return false;
        }
      }
      return true
    },
    openICA(){
      window.open('https://www.dlivrd.io/independent-contractor-agreement/')
    },
  }
}
</script>

<style>
::-webkit-scrollbar {
  height: 0;
  width: 0;
  display: none;
}
::-webkit-scrollbar-thumb {
  display: none;
}
#signupform::-webkit-scrollbar {
  width: 8px !important;
  height: 100% !important;
  display: block !important;
}
#signupform::-webkit-scrollbar-track {
  background:#1E3F20 !important;
  border-radius: 12px !important;
}
#signupform::-webkit-scrollbar-thumb {
  display: block !important;
  background: #7efb01 !important;
  border-radius: 12px !important;
}
.section::-webkit-scrollbar-thumb {
  border: 5px solid transparent;
  border-radius: 100px;
  background-color: #8070d4;
  background-clip: content-box;
}
input{
  font-size: 20px !important;
  border: 0px !important;
  background-color: white !important;
}
.generic_tx {
  -webkit-text-fill-color: #4b4b4b;
  font-size: 20px !important;
}
.privacy_policy{
  color: #0AFD01;
  font-weight: bold
}
.privacy_policy:hover{
  color: #00bd7e;
  cursor: pointer;
}
.alignSpinner{
  width: 100%;
  text-align: -webkit-center;
}
.alignCaptcha{
  padding-top: 25px !important;
  text-align: -webkit-center;
}
@-moz-document url-prefix() {
  .alignSpinner {
    width: 100%;
    text-align: -moz-center;
  }
  #signupform{
    scrollbar-color: #7efb01 #1E3F20;
  }
  .alignCaptcha{
    text-align: -moz-center;
  }
}
</style>





