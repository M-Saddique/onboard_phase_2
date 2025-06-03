<template>
<!--  <v-card v-if="!loadView" style="background-color: #ffffff;width: 100vw;height: 100vh;">-->
<!--    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>-->
<!--  </v-card>-->
  <v-card
      color="grey-lighten-4"
      flat
      style="min-height: 100vh"
      rounded="0"
      v-if="loadView"
  >
    <img  alt="Vue logo" class="logo" style="object-fit: contain;width: 80vw; position: fixed; top:40%; left: 7%; opacity: 0.1;" src="../assets/dlivrdlogo.png"  />

    <!--dialog box-->
    <v-row justify="center">
      <v-dialog
          id="dialogBox"
          v-model="dialog"
          transition="dialog-top-transition"
          max-width="600px"
          persistent
      >
        <v-card>
<!--          <v-overlay :model-value="!loading">-->
<!--            <v-card style="background-color: transparent;width: 100vw;height: 100vh;">-->
<!--              <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>-->
<!--            </v-card>-->
<!--          </v-overlay>-->
<!--          <atom-spinner v-if="!loading" :animation-duration="1000" :size="90" color="#0AFD01" class="loading_bar" />-->
          <v-card-title class="text-h5" style="background-color: #7efb01">
            {{alert_title}}
          </v-card-title>
          <v-card-text id="dialogDescription" style="overflow-y: scroll; text-align: justify" v-html="alert_description"></v-card-text>
          <v-row style="align-items: center" v-if="verifyNumber">
            <v-text-field v-model="tx_number" hide-details style="margin-left: 30px; margin-right: 20px" ref="tf_contact" :readonly=editNumber></v-text-field>
            <v-icon v-if="!this.editNumber" style="margin-right: 20px" @click="contactNumberVerification">mdi-file-edit</v-icon>
            <v-icon v-if="this.editNumber" style="margin-right: 20px;opacity: 0.5;" @click="contactNumberVerification">mdi-file-edit</v-icon>
          </v-row>
          <v-text-field v-model="model_otp" v-if="verifyOTP" label="Enter OTP" hide-details style="margin-left: 30px; margin-right: 20px"></v-text-field>
          <v-card-text v-if="alert_error != null" style="overflow-y: scroll; text-align: justify;color: red;font-size: 12px;width: 100%;text-align: left; padding-top: 0px">{{alert_error}}</v-card-text>
          <v-card-actions style="align-self: end; margin-top: 30px">
            <v-spacer></v-spacer>
            <v-btn
                v-if="cancelButtonText == 'Cancel'"
                prepend-icon="mdi-close"
                style="background-color: #7efb01"
                variant="text"
                @click="dialog = false"
            >
              {{ cancelButtonText }}
            </v-btn>
            <v-btn
                v-else
                style="display: none"
            ></v-btn>
            <v-btn
                v-if="agreeButtonText == 'Ok'"
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="dialog = false"
            >
              {{ agreeButtonText }}
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Okay'"
                prepend-icon="mdi-check"
                style="background-color: #7efb01"
                variant="text"
                @click="questionnaireSolved"
            >
              {{ agreeButtonText }}
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'logout'"
                prepend-icon="mdi-logout"
                style="background-color: #7efb01"
                variant="text"
                @click="logoutOnboarding"
            >
              Logout
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Verify'"
                prepend-icon="mdi-shield-check"
                style="background-color: #7efb01"
                variant="text"
                :disabled="counting" @click="get_otp"
            >
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Verify'"
                prepend-icon="mdi-shield-check"
                style="background-color: #7efb01"
                variant="text"
                @click="optVerification"
            >
              {{agreeButtonText}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
<!--      <v-layout>-->
<!--        <v-app-bar-->
<!--            color="#0AFD01"-->
<!--            class="top_bar_title"-->
<!--            prominent-->
<!--        >-->
<!--          <v-app-bar-nav-icon variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>-->
<!--          <v-toolbar-title class="toolbarTitleStyle">Questionnaire</v-toolbar-title>-->
<!--          <v-menu width="180px">-->
<!--            <template v-slot:activator="{ props }">-->
<!--              <v-btn-->
<!--                  icon-->
<!--                  :ripple="false"-->
<!--                  v-bind="props">-->
<!--                &lt;!&ndash;            <v-icon style="background-color: white; border-radius: 50%" size="32">mdi-flag</v-icon>&ndash;&gt;-->
<!--                <v-img :src=selectedLanguage width="38" height="38"></v-img>-->
<!--              </v-btn>-->
<!--            </template>-->
<!--            <v-list>-->
<!--              <v-list-item :prepend-avatar="english" title="English" value="English" @click="language('English')"></v-list-item>-->
<!--              <v-list-item :prepend-avatar="spanish" title="Español" value="Spanish" @click="language('Spanish')"></v-list-item>-->
<!--            </v-list>-->
<!--          </v-menu>-->
<!--          <v-menu width="220px">-->
<!--            <template v-slot:activator="{ props }">-->
<!--              <v-btn-->
<!--                  icon-->
<!--                  v-bind="props">-->
<!--                <v-avatar class="accountIcon" size="38"><v-img :src=userProfileImage cover></v-img></v-avatar>-->
<!--              </v-btn>-->
<!--            </template>-->
<!--            <v-list>-->
<!--              <v-list-item>-->
<!--                <v-layout style="justify-content: center">-->
<!--                  <v-avatar-->
<!--                      size="100px"-->
<!--                      style="background-color: #0AFD01"-->
<!--                  >-->
<!--                    <v-img :src=userProfileImage cover></v-img>-->
<!--                  </v-avatar>-->
<!--                </v-layout>-->
<!--                <v-card-title style="text-align: center">{{name}}</v-card-title>-->
<!--              </v-list-item>-->
<!--              <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>-->
<!--            </v-list>-->
<!--          </v-menu>-->
<!--        </v-app-bar>-->
<!--        <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>-->
<!--        &lt;!&ndash;    video and progress steps&ndash;&gt;-->
<!--        <v-main v-if="questionsPending">-->
    <v-layout>
      <v-app-bar
          color="#0AFD01"
          class="top_bar_title"
          prominent
      >
        <v-col>
          <v-btn v-on:click="$router.push('/checklist')" style="font-size: 15px; color: #26225b">
            <v-icon style="font-size: 25px; color: #26225b">mdi-chevron-left</v-icon>
            Checklist
          </v-btn>
          <v-app-bar-nav-icon v-if="is_dlivrd_driver" variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </v-col>
        <v-col>
          <v-toolbar-title class="toolbarTitleStyle">Questionnaire</v-toolbar-title>
        </v-col>
        <v-col style="display: flex; justify-content: right">
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
              <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-app-bar>
<!--      <v-app-bar-->
<!--          color="#0AFD01"-->
<!--          class="top_bar_title"-->
<!--          prominent-->
<!--      >-->
<!--        <v-app-bar-nav-icon variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>-->
<!--        <v-toolbar-title class="toolbarTitleStyle">Questionnaire</v-toolbar-title>-->
<!--        <v-menu width="220px">-->
<!--          <template v-slot:activator="{ props }">-->
<!--            <v-btn-->
<!--                icon-->
<!--                v-bind="props">-->
<!--              <v-avatar class="accountIcon" size="38"><v-img :src=userProfileImage cover></v-img></v-avatar>-->
<!--            </v-btn>-->
<!--          </template>-->
<!--          <v-list>-->
<!--            <v-list-item>-->
<!--              <v-layout style="justify-content: center">-->
<!--                <v-avatar-->
<!--                    size="100px"-->
<!--                    style="background-color: #0AFD01"-->
<!--                >-->
<!--                  <v-img :src=userProfileImage cover></v-img>-->
<!--                </v-avatar>-->
<!--              </v-layout>-->
<!--              <v-card-title style="text-align: center">{{name}}</v-card-title>-->
<!--            </v-list-item>-->
<!--            <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>-->
<!--          </v-list>-->
<!--        </v-menu>-->
<!--      </v-app-bar>-->
      <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>
      <!--    video and progress steps-->
      <v-main v-if="questionsPending">
        <v-dialog
            id="dialogBox"
            v-model="firstTimeQuestionnaireVisitDialog"
            transition="dialog-top-transition"
            max-width="600px"
            persistent
        >
          <v-card>
            <v-card-title class="text-h5 dialogBoxGreenColor">{{ alert_title }}</v-card-title>
            <v-card-text id="dialogDescription" class="dialogBoxDescription" v-html="alert_description"></v-card-text>
            <v-card-actions class="dialogBoxActionButtons">
              <v-spacer></v-spacer>
              <v-btn
                  v-if="agreeButtonText == 'First Visit'"
                  prepend-icon="mdi-check"
                  class="dialogBoxGreenColor"
                  variant="text"
                  @click="firstTimeQuestionnaireVisit"
                  :loading="btnLoading"
              >
                Okay
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-row v-if="session_validated">
          <v-col style="text-align: center;margin-top: 10px">
            <v-layout style="position: fixed;width: 100vw;background-color: white">
              <div style="width: 100vw;text-align: center;">
<!--                <v-overlay :model-value="submitquesitonloading">-->
<!--                  <v-card style="background-color: transparent;width: 100vw;height: 100vh;">-->
<!--                    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>-->
<!--                  </v-card>-->
<!--                </v-overlay>-->
<!--                <atom-spinner v-if="submitquesitonloading" :animation-duration="1000" :size="200" style="top:100%" color="#0AFD01" class="loading_bar" />-->
                <step-progress activeColor='#7EFB01' style="width: 80vw;" :steps="mySteps" :current-step="checkModule" icon-class="fa fa-check"></step-progress>
              </div>
            </v-layout>
            <!--        :options="videoOptions"-->
            <v-col id="video_block" style="margin-top: 150px;">
              <video-player
                  v-if="!loading_video && currentModule == 'Module_1'"
                  :src= "video_src_1"
                  :poster="imageThumb_1"
                  controls
                  :volume="0.6"

                  @ended="checkprogress()"
                  v-model:width="width"
              />
              <video-player
                  v-if="!loading_video  && currentModule == 'Module_2'"
                  :src= "video_src_2"
                  :poster="imageThumb_2"
                  controls
                  :volume="0.6"

                  @ended="checkprogress()"
                  v-model:width="width"
              />
              <video-player
                  v-if="!loading_video  && currentModule == 'Module_3'"
                  :src= "video_src_3"
                  :poster="imageThumb_3"
                  controls
                  :volume="0.6"

                  @ended="checkprogress()"
                  v-model:width="width"
              />
              <video-player
                  v-if="!loading_video  && currentModule == 'Module_4'"
                  :src= "video_src_4"
                  :poster="imageThumb_4"
                  controls
                  :volume="0.6"

                  @ended="checkprogress()"
                  v-model:width="width"
              />
              <h3 style="margin-top: 10px;font-weight: bold;color: red; margin-right: 10px; margin-left: 10px" v-if="is_disabled_radio && checkModule != 4 && !loading_video">{{warningText}}</h3>
            </v-col>
          </v-col>
        </v-row>
        <!--    Questions-->
        <v-col v-if="session_validated" justify="center" align-self="center" class="adjustQuestions" style="text-align: -webkit-center">
<!--          <v-overlay :model-value="!QuestionsIsLoaded">-->
<!--            <v-card style="background-color: transparent;width: 100vw;height: 100vh;">-->
<!--              <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>-->
<!--            </v-card>-->
<!--          </v-overlay>-->
<!--          <atom-spinner  v-if="!QuestionsIsLoaded" :animation-duration="1000" :size="90" color="#0AFD01" />-->
          <v-col v-for="(question, index) in viewedQuestions" :key="index" style="max-width: 1024px " >
            <v-col class="questionCards">
              <h3 style="text-align: justify; margin-bottom: 15px; font-size: 18px">{{index}}</h3>
              <v-radio-group :disabled="is_disabled_radio" hide-details>
                <v-radio v-for="(radioOption, index1) in question['Options']" :id="`_module_${checkModule}_q_${(index)}_i_${(index1)}`" :ref="`_module_${checkModule}_q_${(index)}_i_${(index1)}`" :label=radioOption :value=radioOption name="option" style="margin-bottom: 5px; text-align: left !important;color: #000000DE" @click="selected_option(index,index1)"></v-radio>
              </v-radio-group>
            </v-col>
          </v-col>
        </v-col>
        <!--    Next and Previous Buttons-->
        <v-row v-if="!loading_video" style="text-align: center;margin-bottom: 50px">
          <v-col>
            <div id='next_button'>
              <v-btn class="btn_home_green" prepend-icon="mdi-arrow-left" v-if="onFirstModule" @click="previousForm" :disabled="disablePrev" style="width: auto">Previous</v-btn>
              <v-btn :loading="nextClick" class="btn_home_green" prepend-icon="mdi-arrow-right" v-if="moduleComplete" @click="submitAnswers" :disabled="is_disabled_radio">Next</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>

  </v-card>
</template>

<script>
import axios from 'axios'
import { AtomSpinner } from 'epic-spinners'
import StepProgress from 'vue-step-progress'
import imgUrl from '../assets/thumbnail.png'
import englishImg from '../assets/english.png'
import spanishImg from '../assets/spanish.png'
import module_1_thumb from '../assets/thumbs/Module_1.png'
import module_2_thumb from '../assets/thumbs/Module_2.png'
import module_3_thumb from '../assets/thumbs/Module_3.png'
import module_4_thumb from '../assets/thumbs/Module_4.png'
import NavigationDrawer from "../components/NavigationDrawer.vue"
import loader from "../assets/DlivrdLogo.gif";
import Api from '../config/index'


export default {
  components: {
    'step-progress': StepProgress,
    AtomSpinner,
    NavigationDrawer
  },
  data () {
    return {
      is_dlivrd_driver: false,
      loader: loader,
      disablePrev: true,
      nextClick: false,
      drawer: false,
      selectedLanguage: englishImg,
      width:window.innerWidth * 0.40,
      screenSize: screen.width,
      alert_error:null,
      QuestionsIsLoaded:false,
      language_code:'English',
      session_validated:true,
      video_src_1:'https://www.dlivrd.io/wp-content/uploads/2023/04/Module_1.mp4',
      video_src_2:'https://www.dlivrd.io/wp-content/uploads/2023/04/Module_2.mp4',
      video_src_3:'https://www.dlivrd.io/wp-content/uploads/2023/04/Module_3.mp4',
      video_src_4:'https://www.dlivrd.io/wp-content/uploads/2023/04/Module_4.mp4',
      imageThumb_1: module_1_thumb,
      imageThumb_2: module_2_thumb,
      imageThumb_3: module_3_thumb,
      imageThumb_4: module_4_thumb,
      currentModule:'',
      imageThumb: imgUrl,
      imageVideo: module_4_thumb,
      viewedQuestions: [],
      loading:false,
      loading_video:true,
      checkModule: 0,
      english: englishImg,
      spanish: spanishImg,
      model_otp:'',
      fleet_id: null,
      loadView: false,
      submitquesitonloading:false,
      cancelButtonText: "",
      videoOptions: {
        autoplay: false,
        controls: false,
        textTrackSettings: false,
        tracks:[{
          kind: "",
          src: '../src/assets/intro.vtt',
          srclang: "se",
          label: "Spanish",
        }]
        ,
        sources: [
          {
            src:'https://www.dlivrd.io/wp-content/uploads/2023/04/Module_1.mp4',
            type: 'video/mp4'
          }
        ]
      },
      spanishSubtitle: [{
        kind: "captions",
        src: "myCaptions.vtt",
        srclang: "de",
        label: "german",
      }],
      autocomlete:true,
      counting:false,
      agreeButtonText: "",
      mySteps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Final'],
      currentStep: 2,
      alert_title: '',
      alert_description:'',
      dialog: false,
      is_disabled_radio: true,
      modules:[],
      username:'',
      testing: true,
      moduleComplete: true,
      onFirstModule: true,
      count: 0,
      verifyNumber: false,
      tx_number: null,
      editNumber: true,
      otp: null,
      verifyOTP: false,
      referral: "",
      validationFailed: false,
      name: "",
      questionsPending: true,
      firstTimeQuestionnaireVisitDialog: false,
      btnLoading: false,
      warningText: 'To Unlock Questions Please View The Entire Video'
    }
  },
  beforeMount() {
    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
    // this.sessionValidator();

  },
  mounted() {
    console.log("localStorage.getItem('fleet_id')")
    console.log(localStorage.getItem('fleet_id'))
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
    this.is_dlivrd_driver = localStorage.getItem('is_dlivrd_driver') == 'true'
    this.userProfileImage = localStorage.getItem('userProfileImage')
    if(localStorage.getItem('first_visit_on_tutorials') == 'true'){
      this.firstTimeQuestionnaireVisitDialog = true;
      this.alert_title = "Questionnaires";
      this.alert_description = "Welcome to dlivrd Onboarding Questionnaire module. In this phase, you will be provided with four different informational videos. Please watch the videos on each phase and give answers to the provided questions.";
      this.agreeButtonText = "First Visit";
    }
    // if(localStorage.getItem('new_driver') == 'false'){
    //   this.$router.push('/checklist')
    //   return;
    // }
    this.sessionValidator();
  },
  methods: {
    init(){
      Twilio.FlexWebChat.MessagingCanvas.defaultProps.memberDisplayOptions = {
        yourDefaultName: this.username,
        yourFriendlyNameOverride: false
      }
      this.updateSavedStage(0)
      if(this.screenSize > 1024){
        this.width = window.innerWidth * 0.40;
      }
      else{
        this.width = window.innerWidth * 0.80;
      }
    },
    startCountdown: function () {
      this.counting = true;
    },
    onCountdownEnd: function () {
      this.counting = false;
    },
    updateSavedStage(stage){
      this.currentModule = this.getCurrentModule()
      localStorage.setItem("currentStage",stage)
      if(stage == 0){
        this.onFirstModule = false;
        this.moduleComplete = true;
      }
      else if(stage == this.modules.length){
        this.onFirstModule = true;
        this.moduleComplete = false;
      }
      else{
        this.onFirstModule = true;
        this.moduleComplete = true;
      }
    },
    getQuestions(){
      var url =this.baseurl + 'get_question_stat'
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.get(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
        }
      }).then((response) => {
        if(response.status == 200){
          var checkingModule = localStorage.getItem('stage');
          if(checkingModule == "" || checkingModule == 0){
            this.checkModule = 0;
          }
          else if(checkingModule == 'Completed' || checkingModule == 5){
            this.checkModule = 5
            this.questionnaireModuleComplete();
            this.QuestionsIsLoaded = true
          }
          else{
            checkingModule = checkingModule.split("_",2)
            if(checkingModule.length == 2) {
              checkingModule = checkingModule[1]
              this.checkModule = parseInt(checkingModule)
              this.checkModule -= 1
            }
            else {
              this.checkModule = parseInt(checkingModule)
            }
            if(this.checkModule == 4) {
              this.is_disabled_radio = false;
              this.disablePrev = false
            }
            else {
              this.is_disabled_radio = true
              this.disablePrev = true
            }
            this.modules = response['data'][0]['module_question']
            this.QuestionsIsLoaded = true
            this.loading_video = false
            this.viewedQuestions = this.modules[this.getCurrentModule()][this.language_code]
            this.updateSavedStage(this.checkModule)
          }
        }
      }).catch((e) => {
        this.$router.push('/')
      })
    },
    getCurrentModule(){
      return "Module_"+(this.checkModule+1).toString().replace('0','')
    },
    checkprogress(){
      this.is_disabled_radio = false
      this.disablePrev = false
    },
    selected_option(question,option){
      this.viewedQuestions[question]['selectedAnswer'] = option
    },
    logout(){
      this.verifyOTP = false;
      this.alert_title = "Confirmation";
      this.alert_description = "Are you sure you want to logout? ";
      this.dialog = true;
      this.agreeButtonText = "logout";
      this.cancelButtonText = "Cancel"
      this.alert_error = null;
    },
    logoutOnboarding(){
      var url =this.baseurl + 'onboard_logout'
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('onboard_verifySession', data).then((response) => {
        if(response.status == 200){
          var logoutResponse = response.data;
          if(logoutResponse['Success'] || logoutResponse['Failure']){
            localStorage.setItem('email', '');
            localStorage.setItem('password', '');
            localStorage.setItem('username','')
            localStorage.setItem('stage', '')
            localStorage.setItem('country','')
            localStorage.setItem("currentStage",'')
            this.dialog = false;
            this.$router.push('/');
          }

        }
      }).catch( () => {
        this.$router.push('/');
      })
    },
    language(lang){
      if(lang == "English"){
        this.warningText = 'To Unlock Questions Please View The Entire Video'
        this.language_code = 'English';
        this.selectedLanguage = this.english;
      }else if (lang == "Spanish"){
        this.language_code = 'Spanish';
        this.selectedLanguage = this.spanish;
        this.warningText = 'Para desbloquear preguntas, vea el vídeo completo'
      }
      this.viewedQuestions = this.modules[this.getCurrentModule()][this.language_code]
    },
    previousForm(){
      if(this.checkModule > 0){
        this.checkModule--;
        this.updateSavedStage(this.checkModule)
        this.viewedQuestions = this.modules[this.getCurrentModule()][this.language_code];
      }
      else{
        this.onFirstModule = false
      }
    },
    submitAnswers(){
      this.nextClick = true
      this.disablePrev = true
      var refer = null;
      var all_correct = true

      // Move forward on Module 5 when testing
      // if(this.autocomlete == true){
      //   for ( var i in this.viewedQuestions) {
      //     this.viewedQuestions[i]['selectedAnswer'] = this.viewedQuestions[i]['Answer']
      //   }
      // }
      var Questions_to_submit={}
      for ( var i in this.viewedQuestions) {
        if (this.viewedQuestions[i]['selectedAnswer'] == null) {
          if(!this.testing){
            all_correct = false;
            break;
          }
        } else if (this.viewedQuestions[i]['Answer'] == this.viewedQuestions[i]['selectedAnswer']) {
          this.$refs['_module_' + this.checkModule + '_q_' + i + '_i_' + this.viewedQuestions[i]['Answer']][0].$el.style.color = '#00FF00'
          var ans = this.viewedQuestions[i]['Answer']
          Questions_to_submit[i] = ans
        } else {
          this.$refs['_module_' + this.checkModule + '_q_' + i + '_i_' + this.viewedQuestions[i]['selectedAnswer']][0].$el.style.color = '#FF0000';
          refer = this.$refs['_module_' + this.checkModule + '_q_' + i + '_i_' + this.viewedQuestions[i]['selectedAnswer']][0];
          if (this.viewedQuestions[i]['Answer'] == -1) {
            this.$refs['_module_' + this.checkModule + '_q_' + i + '_i_' + this.viewedQuestions[i]['selectedAnswer']][0].$el.style.color = '#00FF00';
            Questions_to_submit[i] = this.viewedQuestions[i]['Answer']
            continue
          }
          all_correct = false
        }
      }
      var Language = {}
      Language[this.language_code] = Questions_to_submit
      var Module = {}
      Module[this.getCurrentModule()] = Language
      Module['identity'] = this.username
      var saveStage = this.getCurrentModule();
      var data = {
        data_to_verify: Module,
        update_stage_only: true
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      this.submitquesitonloading = true;
      Api.post('onboard_verifyStage', data).then((response) => {
        this.nextClick = false
        this.disablePrev = false
        if(response.status == 200){
          this.verifyNumber = false
          this.submitquesitonloading = false
          var submitModuleAnswers = response.data;
          if(submitModuleAnswers['Failure']){
            if(submitModuleAnswers['Failure'] == 'Session Expired. Please login again.') {
              this.verifyOTP = false;
              this.alert_title = "Warning";
              this.alert_description = "Session Expired.";
              this.alert_error = null;
              this.dialog = true;
              this.agreeButtonText = "logout";
            }
            if(submitModuleAnswers['Failure'] == "Number Already On Hubspot") {
              this.verifyOTP = false;
              this.alert_title = "Warning";
              this.alert_description = "Account already exists.";
              this.alert_error = null;
              this.dialog = true;
              this.agreeButtonText = "logout";
            }
            else{
              this.alert_title = "Warning";
              this.alert_description = "Please answer all the questions correctly.";
              this.alert_error = null;
              this.dialog = true;
              this.agreeButtonText = "Ok";
              this.scrollQuestionIntoView(refer)
            }
          }
          else if(submitModuleAnswers['Success']){
            if(all_correct) {
              this.checkModule++;
              if(this.checkModule < 5){
                this.verifyNumber = false
                this.viewedQuestions = []

                this.updateSavedStage(this.checkModule)
                this.viewedQuestions = this.modules[this.getCurrentModule()][this.language_code];
                this.questionsScrollToTop()
                if(this.checkModule != 4) {
                  this.is_disabled_radio = true
                  this.disablePrev = true
                }
                else{
                  this.is_disabled_radio = false
                  this.disablePrev = false
                }
              }else{
                  this.questionnaireModuleComplete();
              }
            }
          }
        }
      }).catch( () => {
        // this.$router.push('/')
      })
    },
    questionnaireModuleComplete(){
      localStorage.setItem('questionnaire', false)

      this.alert_title = "Completed"
      this.alert_description = "You have answered all the questions successfully.";
      this.dialog = true;
      this.agreeButtonText = 'Okay';
      this.questionsPending = false;
    },
    questionnaireSolved(){
      // this.$router.push('/analytics');
      this.$router.push('/checklist');
    },
    clearSavedFields(){
      localStorage.setItem('email', '');
      localStorage.setItem('password', '');
      localStorage.setItem('username','')
      localStorage.setItem('stage', '')
      localStorage.setItem('country','')
      localStorage.setItem("currentStage",'')
    },
    sessionValidator(){
      this.loading = false
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('onboard_verifySession', data).then((response) => {
        this.loading = true
        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            if(verifySession['plaid_verification_complete'] == 'success' && verifySession['banking_info_verified'] == true){
              this.validationFailed = false;
            }
            else{
              this.validationFailed = true;
            }
            localStorage.setItem('phoneverified', verifySession['phone_verified'])
            localStorage.setItem('stage', verifySession['stage'])
            this.init()
            this.session_validated = true
            this.loadView = true;
            // this.userProfileImage = this.baseImageurl + verifySession['profile_image'];
            if(localStorage.getItem('stage') == 'Completed'){
              this.questionnaireModuleComplete();
              return;
            }
            else{
              this.getQuestions()
            }
          }
          else if(verifySession['Failure'] == 'OnBoarding Not Allowed In Your Region'){
            this.alert_title = "Update";
            this.alert_description = "Hey it looks like we have a lot of drivers in this market right now. Don’t worry we’ve added you to the waitlist and when have some more room we’ll reach out and get you signed up";
            this.alert_error = null;
            this.dialog = true;
            this.agreeButtonText = "logout";
          }
          else if(verifySession['Failure']){
            this.clearSavedFields();
            this.$router.push('/');
          }
        }
      }).catch(() => {
        this.$router.push('/')
      })
    },
    get_otp(){
      this.loading = false
      var data = {
        identity: this.username,
        mobile_number: this.tx_number,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('mobile_code_generator', data).then((response) => {
        this.loading = true
        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            this.checkOTP()
          }
          else if(verifySession['Failure'] == 'session Expired'){
            this.alert_title = "Warning";
            this.alert_description = "Session Expired";
            this.agreeButtonText = "logout";
            this.alert_error = null;
            this.dialog = true;
            this.verifyOTP = false;
          }
          else{
            this.alert_error = verifySession['Failure'];
          }
        }
      }).catch(() => {
        this.alert_title = "Warning";
        this.alert_description = "Password not updated/ Try Again!";
        this.dialog = true;
        this.alert_error = null;
        this.agreeButtonText = "Ok";
      })
    },
    verify_otp_code(){
      this.loading = false
      var data = {
        identity: this.username,
        verification_code: this.model_otp,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('mobile_code_verifier', data).then((response) => {
        this.loading = true
        if(response.status == 200){
          var verifySession = response.data;
          if(verifySession['Success']){
            this.OnboardComplete()
          }
          else if(verifySession['Failure'] == 'session Expired'){
            this.alert_title = "Warning";
            this.alert_description = "Session Expired";
            this.agreeButtonText = "logout";
            this.alert_error = null;
            this.dialog = true;
            this.verifyOTP = false;
          }
          else{
            this.alert_error = verifySession['Failure'];
          }
        }
      }).catch(() => {
        this.alert_title = "Warning";
        this.alert_description = "Password not updated/ Try Again!";
        this.agreeButtonText = "Ok";
        this.dialog = true;
        this.alert_error = null;
      })
    },
    contactNumberVerification(){
      this.editNumber = !this.editNumber
      if(this.editNumber == false){
        this.$refs.tf_contact.focus()
      }
    },
    checkOTP(){
      this.verifyNumber = false
      this.alert_title = "Verify Number";
      this.alert_description = "Please enter the code sent to your phone below to verify.";
      this.verifyOTP = true;
      this.alert_error = null;
      this.agreeButtonText = "Verify"

      this.startCountdown()
    },
    OnboardComplete(){
      this.verifyNumber = false
      this.alert_title = "Congratulations !!!";
      this.alert_description = "You have successfully onboarded the dlivrd Driver Portal.";
      this.verifyOTP = true;
      this.alert_error = null;
      this.agreeButtonText = "logout"
      this.verifyOTP=false
      this.startCountdown()
    },
    optVerification() {
      if(this.model_otp  == ''){
      }else{
        this.verify_otp_code()
      }
    },
    scrollQuestionIntoView(q){
      q.scrollIntoView({behavior: "smooth"});
    },
    questionsScrollToTop(){
      var questionsElement = document.getElementById('video_block');
      questionsElement.scrollIntoView()
    },
    closeDrawer(){
      this.drawer = false;
    },
    firstTimeQuestionnaireVisit(){
      this.btnLoading = true;
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      Api.post('mark_first_visit_on_tutorials', data).then((response) => {
        if(response.status == 200){
          if(response.data['Success']){
            this.btnLoading = false;
            localStorage.setItem('first_visit_on_tutorials', false);
            this.firstTimeQuestionnaireVisitDialog = false;
          }
        }
      }).catch(() => {

      })
    },
  }
}

</script>

<style>
.questionCards{
  border-radius: 5px
}
.vjs-icon-placeholder{
  position: static;
}
.v-btn__overlay{
  display: none;
}

.v-btn__underlay{
  display: none;
}
.v-selection-control{
  align-items: start;
}
.v-selection-control__input::before{
  background-color: transparent !important;
}
.step-progress__step-label{
  top: 110% !important;
}
.loading_bar{
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top:50%;
  z-index: 100;
  text-align: center;
}
</style>
