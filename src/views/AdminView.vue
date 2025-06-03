<style>
.questionCards{
  /*background-color: #fafafa;*/
  /*background-color: rgba(250, 250, 250, 0.99);*/
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
  top: 110%;
}
</style>


<template>
  <v-card
      color="grey-lighten-4"
      flat
      rounded="0"
  >
    <!--    <v-layout  style="position: absolute; width:100vw;height: 70vh;z-index: -199;margin-top: 200px"  >-->
    <!--      <img  alt="Vue Image 1" style="width: 100%;opacity: 0.70;object-fit: none" src="../assets/imageHeaderLeft.png" />-->
    <!--    </v-layout>-->
    <img  alt="Vue logo" class="logo" style="object-fit: contain;width: 80vw; position: fixed; top:40%; left: 7%; opacity: 0.1;" src="../assets/dlivrdlogo.png"  />

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
          <v-card-actions style="align-self: end">
            <v-spacer></v-spacer>
            <v-btn
                color="green-darken-1"
                variant="text"
                @click="dialog = false"
            >
              {{ cancelButtonText }}
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Logout'"
                color="green-darken-1"
                variant="text"
                @click="logoutOnboarding"
            >
              {{ agreeButtonText }}
            </v-btn>
            <v-btn
                v-else-if="agreeButtonText == 'Go to Dashboard'"
                color="green-darken-1"
                variant="text"
                @click="formSubmit">
              {{ agreeButtonText }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-toolbar density="compact" style="background-color: #7efb01; position: fixed; top: 0; z-index: 10">
      <!--      <v-app-bar-nav-icon  @click.stop="drawer = drawer" style=""></v-app-bar-nav-icon>-->
      <v-toolbar-title style="width: 10px">Hi, Dlivrd</v-toolbar-title>
      <!--      <v-toolbar-title style="position: absolute;width: 100vw;text-align: center;margin-left: 0px; font-size: 18px">-->
      <!--        <img alt="Vue logo" class="logo" style="object-fit: contain;" src="../assets/dlivrdlogo.png" width="90" height="90" />-->
      <!--      </v-toolbar-title>-->
      <v-toolbar-title style="position: absolute;width: 100VW;text-align: center;margin-left: 0px">On Boarding</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu width="180px">
        <template v-slot:activator="{ props }">
          <v-btn
              icon
              :ripple="false"
              v-bind="props">
            <!--            <v-icon style="background-color: white; border-radius: 50%" size="32">mdi-flag</v-icon>-->
            <v-img :src=selectedLanguage width="32" height="32"></v-img>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :prepend-avatar="english" title="English" value="English" @click="language('English')"></v-list-item>
          <v-list-item :prepend-avatar="spanish" title="Español" value="Spanish" @click="language('Spanish')"></v-list-item>
        </v-list>
      </v-menu>
      <v-menu width="180px">
        <template v-slot:activator="{ props }">
          <v-btn
              icon
              v-bind="props">
            <v-icon style="background-color: white; border-radius: 50%" size="32">mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-layout>

      <!--      <v-navigation-drawer-->
      <!--          expand-on-hover-->
      <!--          v-model="drawer"-->
      <!--          rail-->
      <!--      >-->
      <!--        <v-list>-->
      <!--          <v-list-item-->
      <!--              prepend-icon="mdi-account"-->
      <!--              title="Dlivrd Driver"-->
      <!--              subtitle="driver@dlivrd.com"-->
      <!--          ></v-list-item>-->
      <!--        </v-list>-->

      <!--        <v-divider></v-divider>-->

      <!--        <v-list density="compact" nav>-->
      <!--          <v-list-item prepend-icon="mdi-folder" active-color="#7efb01" title="Module 1" :ripple="false" value="Module 1" @click="loadModule(1)"></v-list-item>-->
      <!--          <v-list-item prepend-icon="mdi-folder" active-color="#7efb01" title="Module 2" :ripple="false" value="Module 2" @click="loadModule(2)"></v-list-item>-->
      <!--          <v-list-item prepend-icon="mdi-folder" active-color="#7efb01" title="Module 3" :ripple="false" value="Module 3" @click="loadModule(3)"></v-list-item>-->
      <!--          <v-list-item prepend-icon="mdi-folder" active-color="#7efb01" title="Module 4" :ripple="false" value="Module 4" @click="loadModule(4)"></v-list-item>-->
      <!--          <v-list-item prepend-icon="mdi-folder" active-color="#7efb01" title="Final Stage" :ripple="false" value="Module 5" @click="loadModule(5)"></v-list-item>-->

      <!--        </v-list>-->
      <!--      </v-navigation-drawer>-->

    </v-layout>
    <!--    <router-view></router-view>-->

    <v-row>


      <v-col style="text-align: center;margin-top: 72px" >
        <v-layout  style="position: fixed;width: 100vw;background-color: white" >
          <div style="width: 100vw;text-align: center;" >
            <step-progress  activeColor='#7EFB01' style="width: 80vw;" :steps="mySteps" :current-step="checkAnswers" icon-class="fa fa-check"></step-progress>
          </div>
        </v-layout>
        <video-player
            :src="imageVideo"
            :poster="imageThumb"
            type="video/mp4"
            controls
            :volume="0.6"
            style="margin-top: 150px;"
            @ended="checkprogress()"
            v-model:width="width"
        />
        <h3 style="margin-top: 10px;font-weight: bold;color: red; margin-right: 10px; margin-left: 10px" v-if="is_disabled_radio">To Unlock Questions Please View The Entire Video </h3>
      </v-col>
    </v-row>

    <v-col justify="center" align-self="center" class="adjustQuestions" style="height: 100%;text-align: -webkit-center">
      <v-overlay :model-value="!QuestionsIsLoaded">
        <v-card style="background-color: transparent;width: 100vw;height: 100vh;">
          <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
        </v-card>
      </v-overlay>
<!--      <atom-spinner v-if="!QuestionsIsLoaded" :animation-duration="1000" :size="90" color="#0AFD01" />-->
      <v-col v-for="(question, index) in viewedQuestions" :key="index" style="max-width: 1024px ">
        <v-col class="questionCards">
          <h3 style="text-align: justify; margin-bottom: 15px; font-size: 18px">{{question['Query'+language_code]}}</h3>
          <v-radio-group :disabled="is_disabled_radio" hide-details>
            <v-radio  v-for="(radioOption, index1) in question['Options'+language_code]" :id="`_module_${checkAnswers}_q_${(index)}_i_${(index1)}`" :ref="`_module_${checkAnswers}_q_${(index)}_i_${(index1)}`" :label=radioOption :value=radioOption name="option" style="margin-bottom: 5px; text-align: left !important;color: #000000DE" @click="selected_option(index,index1)"></v-radio>
          </v-radio-group>
        </v-col>
      </v-col>
    </v-col>

    <v-row align="center" justify="center" style="margin-bottom: 50px">
      <v-col align="center">
        <v-btn class="btn_home_green" @click="previousForm" :disabled="is_disabled_radio">Previous</v-btn>
        <v-btn class="btn_home_green" @click="submitAnswers" :disabled="is_disabled_radio">Next</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>


<script>
import StepProgress from 'vue-step-progress';
import imgUrl from '../assets/thumbnail.png'
import imgVideo from '../assets/intro.mp4'
import englishImg from '../assets/english.png'
import spanishImg from '../assets/spanish.png'
import axios from 'axios'
import { AtomSpinner } from 'epic-spinners'


export default {
  components: {
    'step-progress': StepProgress,AtomSpinner
  },
  data () {
    return {
      drawer: false,
      selectedLanguage: englishImg,
      width:window.innerWidth * 0.40,
      screenSize: screen.width,
      resubmit: 0,
      QuestionsIsLoaded:false,
      language_code:'',
      imageThumb: imgUrl, //new URL('../src/assets/thumbnail.png', import.meta.url).href,
      imageVideo: imgVideo, //new URL('../src/assets/thumbnail.png', import.meta.url).href,
      viewedQuestions: [],
      checkAnswers: 0,
      english: englishImg,
      spanish: spanishImg,
      cancelButtonText: "",
      agreeButtonText: "",
      mySteps:['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Final'],
      currentStep:2,
      alert_title:'',
      maintainHistory: [],
      checkSubmittedAnswers: 0,
      alert_description:'',
      dialog :false,
      is_disabled_radio:true,
      modules:[],
      username:'',
    }
  },
  beforeMount() {
    //localStorage.setItem('username','tabish')
    this.username = localStorage.getItem('username')
    Twilio.FlexWebChat.MessagingCanvas.defaultProps.memberDisplayOptions = {
      yourDefaultName: this.username,
      yourFriendlyNameOverride: false,
      theirFriendlyNameOverride: false,
      theirDefaultName: 'Agent',
    }

    this.updateSavedStage(0)
    if(this.screenSize > 1024){
      this.width = window.innerWidth * 0.40;
    }
    else{
      this.width = window.innerWidth * 0.80;
    }
    // let recaptchaScript = document.createElement('script')
    // recaptchaScript.setAttribute('src','https://assets.flex.twilio.com/releases/flex-webchat-ui/2.9.1/twilio-flex-webchat.min.js' )
    // recaptchaScript.setAttribute('integrity','sha512-yBmOHVWuWT6HOjfgPYkFe70bboby/BTj9TGHXTlEatWnYkW5fFezXqW9ZgNtuRUqHWrzNXVsqu6cKm3Y04kHMA==' )
    // recaptchaScript.setAttribute('crossorigin','' )
    // document.head.appendChild(recaptchaScript)

  },
  mounted() {
    this.getQuestions()
    /* const appConfig = {
       accountSid:"AC4ccca83cec05e9642dffab547274c9ec",
       flexFlowSid:"FO1301cf4cafc4dbde58289b1ff4fa52d9"
     };
     Twilio.FlexWebChat.renderWebChat(appConfig);*/
  },
  methods: {
    updateSavedStage(stage){
      localStorage.setItem("currentStage",stage)
    },
    getQuestions(){
      var auth_token = ''//localStorage.getItem("auth_token")
      var url =this.baseurl + 'get_question_stat'
      const data = {}
      axios.get(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
          authorization : auth_token,
          uuid:''//localStorage.getItem("uuid")
        }
      }).then((response) => {
        if(response.status == 200){
          this.checkAnswers = localStorage.getItem('currentStage');
          if(this.checkAnswers == null)
            this.checkAnswers = 0
          this.modules = response['data'][0]['module_question']
          this.QuestionsIsLoaded = true
          this.viewedQuestions = this.modules[this.checkAnswers].questions
        }
      }).catch(() => {
        this.message = "Not liked!";
      })
    },
    checkprogress(){
      this.is_disabled_radio = false
    },
    loadModule(moduleNumber){
      if(moduleNumber == 1){
        this.viewedQuestions = this.modules[0].questions
      }
      else if(moduleNumber == 2){
        this.viewedQuestions = this.modules[1].questions
      }
      else if(moduleNumber == 3){
        this.viewedQuestions = this.modules[2].questions
      }
      else if(moduleNumber == 4){
        this.viewedQuestions = this.modules[3].questions
      }
      else if(moduleNumber == 5){
        this.viewedQuestions = this.modules[4].questions
      }
    },
    selected_option(question,option){
      this.viewedQuestions[question]['selectedAnswer'] = option
    },
    logout(){
      this.alert_title = "Warning";
      this.alert_description = "Please Answer all the questions correctly? ";
      this.dialog = true;
      this.agreeButtonText = "Logout";
      this.cancelButtonText = "Ok"
      // this.$router.push('/')
    },
    logoutOnboarding(){
      this.dialog = false;
      this.$router.push('/');
    },
    language(lang){
      if(lang == "English"){
        this.language_code = '';
        this.selectedLanguage = this.english;
      }else if (lang == "Spanish"){
        this.language_code = '_spain';
        this.selectedLanguage = this.spanish;
      }
    },
    previousForm(){
      if(this.checkAnswers>0){
        this.checkAnswers--;
        this.updateSavedStage(this.checkAnswers)
        this.viewedQuestions = this.modules[this.checkAnswers].questions;
      }
    },
    submitAnswers(){
      this.checkSubmittedAnswers = 0;
      if(this.checkAnswers == this.modules.length){
        this.alert_title = "Phone Verification";
        this.alert_description = "You have Answered all the questions correctly.";
        this.dialog = true;
        this.agreeButtonText = "Go to dashboard";
        this.cancelButtonText = "Cancel"
        return
      }
      for( var i = 0; i < this.viewedQuestions.length; i++){
        if(this.viewedQuestions[i]['selectedAnswer'] == null){
          return
        }
        else if(this.viewedQuestions[i]['Answer'] == this.viewedQuestions[i]['selectedAnswer']){
          this.$refs['_module_'+this.checkAnswers+'_q_'+i+'_i_'+this.viewedQuestions[i]['Answer']][0].$el.style.color ='#00FF00'
          this.checkSubmittedAnswers++;
        }
        else{
          this.$refs['_module_'+this.checkAnswers+'_q_'+i+'_i_'+this.viewedQuestions[i]['selectedAnswer']][0].$el.style.color ='#FF0000';
          if(this.viewedQuestions[i]['Answer'] == -1){
            this.$refs['_module_'+this.checkAnswers+'_q_'+i+'_i_'+this.viewedQuestions[i]['selectedAnswer']][0].$el.style.color ='#00FF00';
            this.checkSubmittedAnswers++;
          }
        }
      }
      if(this.checkSubmittedAnswers == this.viewedQuestions.length){
        this.viewedQuestions = []
        // for( var i = 0; i < this.viewedQuestions.length; i++){
        //   // this.$refs['q_'+i+'_i_'+this.viewedQuestions[i]['selectedAnswer']][0].$el.style.color ='#000000DE'
        //   this.$refs['_module_'+this.checkAnswers+'q_'+i+'_i_'+this.viewedQuestions[i]['selectedAnswer']][0].$el.style.color ='#000000DE'
        //   console.log(i);
        // }
        this.checkAnswers++;
        this.updateSavedStage(this.checkAnswers)
        this.viewedQuestions = this.modules[this.checkAnswers].questions;
      }
      else{
        this.alert_title = "Warning";
        this.alert_description = "Please Answer all the questions correctly? ";
        this.dialog = true;
        this.agreeButtonText = "Ok";
        this.cancelButtonText = "Ok"
      }
    }
  }
}

</script>

