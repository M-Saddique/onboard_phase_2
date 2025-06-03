<template>
  <v-card v-if="!loadView" style="background-color: #ffffff;width: 100vw;height: 100vh;">
    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
  </v-card>
  <v-card
      color="grey-lighten-4"
      flat
      style="min-height: 100vh"
      rounded="0"
      v-if="loadView"
  >
    <img  alt="Vue logo" class="logo bgImage" src="../assets/dlivrdlogo.png"  />
    <v-row justify="center">
      <v-dialog
          id="dialogBox"
          v-model="dialog"
          transition="dialog-top-transition"
          max-width="600px"
          persistent
      >
        <v-card>
          <v-overlay :model-value="!loading">
            <v-card style="background-color: transparent;width: 100vw;height: 100vh;">
              <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
            </v-card>
          </v-overlay>
<!--          <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#0AFD01" class="loading_bar" />-->
          <v-card-title class="text-h5 dialogBoxGreenColor">
            {{alert_title}}
          </v-card-title>
          <v-card-text id="dialogDescription" class="dialogBoxDescription" v-html="alert_description"></v-card-text>
          <v-card-text v-if="showError" class="dialogBoxError" v-html="errorMessage"></v-card-text>
          <v-card-actions class="dialogBoxActionButtons">
            <v-spacer></v-spacer>
            <v-btn
                v-if="cancelButtonText == 'Cancel'"
                prepend-icon="mdi-close"
                class="dialogBoxGreenColor"
                variant="text"
                @click="dialog = false"
            >
              {{ cancelButtonText }}
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'logout'"
                prepend-icon="mdi-logout"
                class="dialogBoxGreenColor"
                variant="text"
                @click="logoutOnboarding"
            >
              Logout
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Okay'"
                prepend-icon="mdi-check"
                class="dialogBoxGreenColor"
                variant="text"
                @click="dialog = false"
            >
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-container fluid class="mainContainerView">
      <v-layout>
        <v-app-bar
            color="#0AFD01"
            class="top_bar_title"
            prominent
        >
          <v-app-bar-nav-icon variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title class="toolbarTitleStyle">FAQ's</v-toolbar-title>
          <v-menu width="180px">
            <template v-slot:activator="{ props }">
              <v-btn
                  icon
                  :ripple="false"
                  v-bind="props">
                <!--            <v-icon style="background-color: white; border-radius: 50%" size="32">mdi-flag</v-icon>-->
                <v-img :src=selectedLanguage width="38" height="38"></v-img>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :prepend-avatar="english" title="English" value="English" @click="language('English')"></v-list-item>
              <v-list-item :prepend-avatar="spanish" title="Español" value="Spanish" @click="language('Spanish')"></v-list-item>
            </v-list>
          </v-menu>
          <v-menu width="220px">
            <template v-slot:activator="{ props }">
              <v-btn
                  icon
                  v-bind="props">
                <v-avatar class="accountIcon" size="38"><v-img :src=userProfileImage cover></v-img></v-avatar>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-layout style="justify-content: center">
                  <v-avatar
                      size="100px"
                      style="background-color: #0AFD01"
                  >
                    <v-img :src=userProfileImage cover></v-img>
                  </v-avatar>
                </v-layout>
                <v-card-title style="text-align: center">{{name}}</v-card-title>
              </v-list-item>
<!--              <v-list-item prepend-icon="mdi-account-cog-outline" title="Settings" value="settings" @click="openSettings"></v-list-item>-->
              <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>
        <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>
        <v-main class="mainViewStyle">
<!--          <v-row class="mainBlockStyle">-->
            <!-- Account FAQ's -->
            <v-col md="12" sm="12" >
              <v-card-title class="fontSize">Account</v-card-title>
              <v-expansion-panels variant="popout" color="#eeeeee95" class="expansionPanelStyle">
                <v-expansion-panel
                    v-for="i in accountFAQ"
                    :key="i"
                    :title=i.title
                    :text=i.text
                ></v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            <!-- Payment FAQ's -->
            <v-col md="12" sm="12" >
              <v-card-title class="fontSize">Payment</v-card-title>
              <v-expansion-panels variant="popout" color="#eeeeee95" class="expansionPanelStyle">
                <v-expansion-panel
                    v-for="i in paymentFAQ"
                    :key="i"
                    :title=i.title
                    :text=i.text
                ></v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            <!-- Delivery Process FAQ's -->
            <v-col md="12" sm="12" >
              <v-card-title class="fontSize">Delivery Process</v-card-title>
              <v-expansion-panels variant="popout" color="#eeeeee95" class="expansionPanelStyle">
                <v-expansion-panel
                    v-for="i in deliveryProcessFAQ"
                    :key="i"
                    :title=i.title
                    :text=i.text
                ></v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            <!-- Delivery Offer Process -->
            <v-col md="12" sm="12" style="padding-bottom: 50px;">
              <v-card-title class="fontSize">Delivery Offer Process</v-card-title>
              <v-expansion-panels variant="popout" color="#eeeeee95" class="expansionPanelStyle">
                <v-expansion-panel
                    v-for="i in deliveryOfferProcessFAQ"
                    :key="i"
                    :title=i.title
                    :text=i.text
                ></v-expansion-panel>
              </v-expansion-panels>
            </v-col>

<!--          </v-row>-->
        </v-main>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { AtomSpinner } from 'epic-spinners'
import NavigationDrawer from "../components/NavigationDrawer.vue";
import axios from "axios";
import englishImg from "../assets/english.png";
import spanishImg from "../assets/spanish.png";
import loader from "../assets/DlivrdLogo.gif";

export default {
  components: {
    AtomSpinner,
    NavigationDrawer
  },
  data () {
    return {
      loader: loader,
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
      accountFAQ: [
        {'title': 'How do I reset my password?','text': 'You can reset your password by going to the dlivrd app and clicking the word “Forgot” under the password field. You will be sent an email from dlivrd with a link to reset your password. If you do not see the email, come through, first check your spam folder. If it is not in there and does not come up when you search for “dlivrd” in your inbox, please contact us at 1-844-515-2932.'},
        {'title': 'What is my username and password?','text': 'Your username will generally be your phone number including area code. Your password is generated at random to make sure that your account is secure. This is texted to you from 58973 when you are first onboarded. If you require further assistance, please follow the link below.'},
      ],
      paymentFAQ: [
        {'title':'How do I get paid?','text':'Working on the dlivrd platform enables you to be paid for your deliveries the business day following your completed delivery. We work with a third-party payment platform called Everee to accomplish this. Deliveries completed Monday through Thursday are paid the next business banking day. Deliveries completed Friday through Sunday are paid on Mondays. If Monday is a banking holiday you will be paid the following business day.'},
        {'title':'How much can I expect to earn per delivery?','text':'At the beginning of your experience with dlivrd, you are most likely to see deliveries with average earnings of about $25. As you take more deliveries and acquire more equipment such as, large, insulated catering delivery bags and/or a delivery cart you will start to see larger orders with more earnings attached. Across our operating areas, drivers average about $42 per catering delivery. The amount earned per delivery is largely influence by the number of deliveries you complete and your number of large, insulated catering delivery bags.'},
        {'title':'Something is wrong with my payment, what do I do?','text':'Orders are paid the following business day after the date of delivery and usually arrive in your bank account after 2pm, local time. An order delivered on Monday is paid Tuesday, an order on Thursday is paid Friday. Friday and weekend orders are paid Monday. If you believe a payment is missing, please follow the link here, fill out the form and click submit. Dates and the Order ID’s can be found in your dlivrd app. Also, please make sure to check with your bank and ensure your Everee account is up to date before submitting this form. One of our employees will research and email you within 1 business day with findings. Please keep in mind, weekends and holidays are not business days.'}
      ],
      deliveryProcessFAQ: [
        {'title':'Do I have to use the in-app GPS function','text':'You can use whatever GPS you would like to get to your destinations. You can change your in-app GPS provider by going to settings in the menu of the dlivrd app. Our only ask is that you continue sharing your location with us throughout the delivery process so that our platform can help facilitate updates to the clients and customers for you. As long you don’t close the app completely while on delivery, this your location will continue to share. Additionally, if you are using the GPS outside of the dlivrd app it will be important that you enter address information accurately or else you could be taken out of your way.'},
        {'title':'How does the actual delivery process work?','text':'Refer to delivery task in your app for the customer’s directions of who to contact or direction of where to meet the customer.\n' +
              'If you are unsure of where to go, simply press the phone symbol and the call will direct you to the customer.\n' +
              'If you find that you are having an issue reaching the customer, text delivery support at 1-844-515-2932.\n' +
              'Set up the order according to the customer’s direction\n' +
              'Upload a picture of the food setup in the required field – please make sure to include as much of the food as possible in the photo for context.\n' +
              'You will not be able to complete the delivery task without adding at least one image. Learn more about proof of delivery pictures here.\n' +
              'It is best to do this via the camera on your phone and then uploading to the dlivrd app.\n' +
              'Be sure to swipe that the delivery was successful in the app before you leave the location to complete tracking and properly process your payment.'},
        {'title':'I’ve answered the confirmation text, now how will the restaurant know that I’m on my way?','text':'30 minutes prior to the pickup time of your delivery it is best to open the app and swipe start on the pickup task. Be sure your calendar is set for the right day when you open the app. If we see that this does not happen, someone from the dlivrd team will reach out to remind you. Even if your pick-up location is only five minutes from your current location and you won’t be leaving for some time, it is important to swipe start on the pickup task ahead of time so that restaurant partners have peace of mind that their food is going to be in good hands.'},
        {'title':'What do I do once I’m at the pick-up location?','text':'The app will automatically mark that you have arrived at the pickup location via the GPS. If the door is locked, always try knocking. Text us at 1-844-515-2932 if you are not having any luck. Once inside, make sure to announce yourself, the client you are picking up for and the order ID, found in the pickup task in your app: “Hi, I’m (Christine). I’m here for client XYZ order ZQ1-37P.” The restaurant will begin handing over food items for your delivery. Before leaving, check with the restaurant by asking “do I have everything?” Assuming they respond with yes, you should let them know that you are heading for the delivery location.\n' +
              '\n' +
              'It is not your responsibility to check an itemized packing list. Once you’ve loaded up, swipe to complete the pickup task. After you swipe to complete the pickup task, your app will go directly to the delivery task. Swipe to start on the delivery task then press the navigation icon to use the in-app GPS or you can use your own and make your way to the delivery location.'},
        {'title':'What happens first on the day of my accepted delivery offer?','text':'You will receive a confirmation text from 58973 about one hour prior to your first scheduled pick-up time of the day. If you do not respond with just the word “yes” within the time communicated in the text, we will try to reach you from 1-844-515-2932. If you do not respond at that point, we will assume that you are no longer available to complete the delivery. We will then remove the delivery offer from you and begin offering to other earning partners.'},
        {'title':'What if I am left waiting at the pick-up location because the food is not ready?','text':'We’ve already stressed the importance of being right on-time. You probably realize that this will, at times, mean you will have to wait for the restaurant to be ready. We understand that this can be frustrating. For that reason, you will be compensated for waiting. If you are on-time for the pickup, have used the app as instructed and the food is not ready within 15 minutes of the scheduled pickup time. We will start billing the restaurant on your behalf. You will be compensated at a rate of $0.25 per minute for every minute you wait after the first 15 minutes have passed. This rate equates to $15 per hour. To make sure this goes according to plan it is best to let us know that you are waiting for the restaurant by texting 1-844-515-2932.'},
        {'title':'What if I’m running late to pick-up or deliver the food?','text':'If you are running late, it is best to let us know as quickly and safely as possible by contacting us at 1-844-515-2932. We will facilitate that communication so that the client can inform the customer. If we are not informed and can’t facilitate that communication, it can negatively impact your earnings via chargebacks from the client. There may also be situations in which the food is on track to be so late that the client insists that we redirect the earning opportunity to another partner to avoid refunds.'},
        {'title':'Why do I need to take pictures of completed deliveries?','text':'Taking good pictures of your successfully completed delivery is a staple for any delivery business. If there is ever a dispute about a customer’s delivery instructions being followed, these pictures are used as proof to protect your earnings for completing the delivery. When disputes happen, we want to be able to stand for the success of your business. Oftentimes, you are going to be delivering to locations where cell phone service can be an issue. For that reason, it is best practice to take your delivery pictures on your phone’s camera versus in the app. You can then upload the picture into the app versus taking it directly in the app.'}
      ],
      deliveryOfferProcessFAQ: [
        {'title':'Do I have to accept a certain number of deliveries to remain active on the platform?','text':'You are never required to accept a delivery offered to you on our platform to remain active. Our only ask is that you respond to the deliveries offered to you by accepting or declining within the time given to you to do so. You will know how much time you have by looking at the notification text that you receive (pictured below). When you do not respond at all to 3 delivery offers in the same day, we will assume that you are unavailable and will not send any more offers to you for that day.'},
        {'title':'How often can I expect to make deliveries?','text':'This can also vary depending on the number of deliveries you have completed and how many large, insulated catering delivery bags you own. You can always purchase delivery bags on your own and send us pictures at 1-844-515-2932 or by going to www.dlivrd.io/shop. After first signing up, you can expect to be offered a delivery once every few days in most markets. As you complete more deliveries through the dlivrd platform, more earning opportunities will be offered to you. Please note that newer markets will usually be slower when we first kickoff operations there.'},
        {'title':'How will I know that I am offered a delivery?','text':'When you are offered a delivery, you will receive a text to the phone number with which you used to sign up on the dlivrd platform. Delivery offers will be sent to you whether you are marked as “on-duty” in the app or not. This text will come from 58973. To view the full offer details and accept or decline you will need to open the app and review the tasks.'},
        {'title':'I’m off duty, why am I still receiving delivery offers?','text':'On-duty simply means that you are sharing your location with us via GPS. If you are off-duty you can still be sent delivery offers. It is best to use on-duty as a means of letting us know where you like to complete deliveries. If you are going to be unavailable for more than a day or two simply let us know by texting 1-844-515-2932 and we will make sure you aren’t bothered with delivery offers for as long as you tell us that you will be unavailable.'},
        {'title':'What do I do when I receive a delivery offer?','text':'It is best to open the dlivrd app after receiving a delivery offer to evaluate the full details of the opportunity. Once in the app you should use the calendar to ensure you are looking at the appropriate day. Once you are on the correct day to evaluate the offer, tap on the pickup task. The pickup task includes the name of the pickup location, their address, and the pickup time. The delivery task includes the customer’s name, their address, delivery and/or setup instructions, food subtotal, and payment breakdown. After reviewing the details tap and hold the multi-colored circle at the bottom of the screen. Swipe right to accept the delivery offer and left to decline it. As a reminder, there is no negative impact to you for declining delivery offers.'},
        {'title':'What if I need to cancel a delivery offer that I’ve accepted?','text':'Failing to successfully complete an accepted delivery offer will impact your standing negatively based when you tell us that you need to cancel. If you can let us know the day prior to your delivery by 9pm Eastern Standard Time, that is much preferred. The closer to the pickup time we are made aware that you will not complete the delivery, the more negatively your standing will be impacted. “No-showing” without any notice or not completing your first accepted delivery offer will impact your ability to receive future delivery offers immediately. These cancellations can lead to refunds for customers that can ultimately impact your future earnings negatively. You can inform us of your cancellation by calling or texting 1-844-515-2932.'},
        {'title':'What is an earning opportunity?','text':'dlivrd works with catering companies and restaurants in more than 100 markets across the US and Canada to accumulate delivery opportunities to be coordinated through our app. We call these high-quality earning opportunities. We then partner with a fleet of customer-service driven and independently contracted delivery drivers, like you, to connect to and complete these high-quality earning opportunities successfully. Because dlivrd and the delivery driver work in collaboration to make this experience an extraordinary one for everyone involved, we call you an Earning Partner. Earning Partners use dlivrd as a guide and our platform as a communication tool throughout the process. Earning Partners pick up the food in their personal vehicle from a restaurant or catering partner and deliver it, professionally, to the customer. The customer pays the restaurant. The restaurant sends the delivery costs, usually made up of a base fee and tip, to dlivrd. Your agreed-to earnings flow right from us to you!'},
      ],
      userProfileImage: null,
      drawer: false,
      alert_title: '',
      alert_description: '',
      dialog: false,
      errorMessage: false,
      showError: false,
      agreeButtonText: null,
      cancelButtonText: null,
      username: "",
      loading: true,
      loadView: false,
      name: "",
      fleet_id: null,
      validationFailed: false,
    }
  },
  beforeMount() {
    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
  },
  mounted() {
    if(localStorage.getItem('is_dlivrd_driver') == 'false'){
      this.$router.push('/checklist')
      return;
    }
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
    this.userProfileImage = localStorage.getItem('userProfileImage')
    this.getFAQs();
    this.sessionValidator();
  },
  methods: {
    language(lang){
      if(lang == "English"){

        this.language_code = '';
        this.selectedLanguage = this.english;
      }else if (lang == "Spanish"){
        this.language_code = '_spain';
        this.selectedLanguage = this.spanish;
      }
    },
    logout(){
      this.alert_title = "Confirmation";
      this.alert_description = "Are you sure you want to logout? ";
      this.dialog = true;
      this.agreeButtonText = "logout";
      this.cancelButtonText = "Cancel"
    },
    logoutOnboarding(){
      var url =this.baseurl + 'onboard_logout'
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
        var logoutResponse = response.data;
        if(logoutResponse['Success'] || logoutResponse['Failure']){
          this.clearFields();
          this.dialog = false;
          this.$router.push('/');
        }
      }).catch( () => {
        this.clearFields();
        this.$router.push('/');
      })
    },
    sessionValidator(){
      console.log(localStorage)
      var url = this.baseurl + 'onboard_verifySession'
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
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
            if(verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true){
              this.validationFailed = false;
            }
            else{
              this.validationFailed = true;
            }
            this.loadView = true;
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
          }
          else{
            this.clearFields();
            this.$router.push('/');
          }
        }
      }).catch(() => {
        this.clearFields();
        this.$router.push('/');
      })
    },
    getFAQs(){
      console.log("FAQ")
      console.log("this.username")
      console.log(this.username)
      console.log('session_id')
      console.log(localStorage.getItem('session_id'))
      var url = this.baseurl + 'get_faqs'
      var data = {
        identity: this.username,
        language: "english"
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then((response) => {
        console.log("FAQs response")
        console.log(response)
        if(response.status == 200){
          var FAQs = response.data.faqs
          console.log("FAQs")
          console.log(FAQs)
          if(response.data['Success']){
            this.accountFAQ = FAQs["accountfaq"]
            this.deliveryProcessFAQ = FAQs["deliveryProcessFAQ"]
            this.paymentFAQ = FAQs["paymentFAQ"]
            this.deliveryOfferProcessFAQ = FAQs["deliveryOfferProcessFAQ"]
          }
        }
      }).catch(() => {
      })
    },
    clearFields(){
      localStorage.setItem('email', '');
      localStorage.setItem('password', '');
      localStorage.setItem('username','')
      localStorage.setItem('stage', '')
      localStorage.setItem('country','')
      localStorage.setItem('currentStage','')
      localStorage.setItem('name','')
      localStorage.setItem('mobile','')
      localStorage.setItem('phoneverified','')
      localStorage.setItem('session_id','')
    },
    closeDrawer(){
      this.drawer = false;
    },
  }
}
</script>

<style scoped>

</style>

<style>
button{
  background-color: transparent;
  color: black !important;
}
.v-expansion-panel-title__overlay{
  color: #0adf0166;
}
.bgImage{
  object-fit: contain;
  width: 80vw;
  position: fixed;
  top:40%;
  left: 7%;
  opacity: 0.1;
}
.mainBlockStyle{
  width: 100%;
  margin-top: 30px !important;
}
.mainContainerView{
  text-align:-webkit-center;
  text-align:-moz-center;
  margin-top: 20px;
}
.accountIcon{
  background-color: white;
  border-radius: 50%;
}
.expansionPanelStyle{
  width: 80% !important;
}
@media (max-width: 800px){
  .expansionPanelStyle{
    width: 100% !important;
  }
}
</style>

