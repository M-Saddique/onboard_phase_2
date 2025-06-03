<template>
  <v-navigation-drawer
      v-model="drawerNavigation"
      location="left"
      temporary
      width="320"
      class="drawerStyle"
  >
    <v-list style="overflow-y: scroll !important; height: 90vh !important;" v-click-outside="{handler: onClickOutside}">
      <v-list-item
          :class="[index == page ? 'activePage' : '',
          index == 0 ? 'checklist':'',
          is_dlivrd_driver &&(index == 0|| index == 1) ? 'no_view':'',
          !is_dlivrd_driver && (index == 2) ?'no_view':'',
          (index == 10 || index == 6) ?'no_view':'',
          !is_dlivrd_driver && index === 13 ? 'no_view':'']"
          v-for="(item, index) in items"
          :key="index"
          @click="viewDetails(index)">
        <v-list-item-title v-if="item == 'Account Setup'">
          <v-icon class="menuIcon">{{icons[index]}}</v-icon>
          {{item}}
          <v-icon v-if="badge" class="" style="color: red; margin-left: 35%">mdi-alert-circle</v-icon>
        </v-list-item-title>
        <v-list-item-title style="display: flex; align-items: center" v-else-if="item == 'dlivrd Announcements'">
          <v-row style="margin: 0">
            <v-icon class="menuIcon">{{icons[index]}}</v-icon>
            {{item}}
          </v-row>
          <v-badge class="anouncmentBadge" :content="unreadNotifications" color="#FF0000" style="margin-right: 20px; height: 3px"></v-badge>
        </v-list-item-title>
        <v-list-item-title v-else>
          <v-icon class="menuIcon">{{icons[index]}}</v-icon>{{item}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

export default {
  data () {
    return {
      unreadNotifications: 3,
      newDriver: true,
      is_dlivrd_driver: false,
      drawerNavigation: false,
      checkDrawer: true,
      currentAddress: "",
      page: null,
      items: [
        'Checklist',
        'Questionnaire',
        'Analytics',
        'dlivrd Announcements',
        'Personal Information',
        'Documents',
        'Account Setup',
        'Delivery Location',
        'Preferred Availability',
        'Vehicle & Bag',
        'Everee Pay Card',
        'LLC',
        'Training Video',
        'Open Opportunity Board',
        'FAQs',
      ],
      icons: [
        'mdi-format-list-checks',
        'mdi-comment-question',
        'mdi-google-analytics',
        'mdi-bullhorn',
        'mdi-account',
        'mdi-file-document',
        'mdi-account-credit-card',
        'mdi-map-marker',
        'mdi-clock-time-four',
        'mdi-car-estate',
        'mdi-credit-card-outline',
        'mdi-video-account',
        'mdi-video',
        'mdi-bulletin-board',
        'mdi-frequently-asked-questions',
      ],
      resources: [],
      resourcesIcon: [],
    }
  },
  props: {
    drawer: {
      type:Boolean
    },
    badge: {
      type: Boolean
    }
  },
  watch:{

  },
  mounted() {
    this.newDriver = localStorage.getItem('new_driver') == 'true'
    this.is_dlivrd_driver = localStorage.getItem('is_dlivrd_driver') == 'true'
    this.currentAddress = window.location.pathname
    this.drawerNavigation = this.drawer;
    this.checkCurrentPage();
  },
  methods: {
    viewDetails(option){
      if(option == 0) {
        this.$router.push('/checklist')
      }
      else if(option == 1) {
        this.$router.push('/educate')
      }
      else if(option == 2) {
        this.$router.push('/analytics')
      }
      else if(option == 3) {
        this.$router.push('/announcements')
      }
      else if(option == 4) {
        this.$router.push('/personalDetails')
      }
      else if(option == 5) {
        this.$router.push('/documents')
      }
      else if(option == 6) {
        this.$router.push('/validation')
      }
      else if(option == 7) {
        this.$router.push('/deliverylocation')
      }
      else if(option == 8) {
        this.$router.push('/availability')
      }
      else if (option == 9) {
        this.$router.push('/vehicleandbagdetails')
      }
      else if(option == 10) {

      }
      else if(option == 11) {
        this.$router.push('/llc')
      }
      else if(option == 12) {
        this.$router.push('/training')
      }
      else if(option == 13) {
        this.$router.push('/open-opportunity-board')
      }
      else if(option == 14) {
        this.$router.push('/faq')
      }
    },
    checkCurrentPage(){
      if(this.currentAddress == '/checklist'){
        this.page = 0
      }
      else if(this.currentAddress == '/educate'){
        this.page = 1
      }
      else if(this.currentAddress == '/analytics'){
        this.page = 2
      }
      else if(this.currentAddress == '/announcements'){
        this.page = 3
      }
      else if(this.currentAddress == '/personalDetails'){
        this.page = 4
      }
      else if(this.currentAddress == '/documents'){
        this.page = 5
      }
      else if(this.currentAddress == '/validation'){
        this.page = 6
      }
      else if(this.currentAddress == '/deliverylocation'){
        this.page = 7
      }
      else if(this.currentAddress == '/availability'){
        this.page = 8
      }
      else if(this.currentAddress == '/vehicleandbagdetails'){
        this.page = 9
      }
      else if(this.currentAddress == ''){
        this.page = 10
      }
      else if(this.currentAddress == '/llc'){
        this.page = 11
      }
      else if(this.currentAddress == '/training'){
        this.page = 12
      }
      else if(this.currentAddress == '/open-opportunity-board'){
        this.page = 13
      }
      else if(this.currentAddress == '/faq'){
        this.page = 14
      }

    },
    onClickOutside(){
      if(this.checkDrawer == true){
        this.$emit('closeNavigationDrawer');
        this.checkDrawer = false;
      }
      else{
        this.checkDrawer = true
      }
    }
  }
}
</script>

<style scoped>
.checklist{
  border-bottom: 1px solid #0adf01;
}
.activePage{
  background-color: #0afd01;
}
.no_view{
  display: none !important;
}
</style>
