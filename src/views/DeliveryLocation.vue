<template>

  <v-card v-if="!mapbox_ref" style="background-color: #ffffff;width: 100vw;height: 100vh;">
    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
  </v-card>
  <v-card
      color="grey-lighten-4"
      flat
      :class="mapbox_ref ? 'mainView' : 'nomainView'"
      rounded="0"
      v-if="loadView"
  >
    <img  alt="Vue logo" class="logo bgImage" src="../assets/dlivrdlogo.png"  />

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
                @click="btnOkayClick"
            >
              Okay
            </v-btn>
            <v-btn
                v-if="agreeButtonText == 'Yes'"
                prepend-icon="mdi-check"
                class="dialogBoxGreenColor"
                variant="text"
                @click="btnYesClick"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-container fluid class="mainContainerView">
      <v-layout id="dashboardView">
        <v-app-bar
            color="#0AFD01"
            class="top_bar_title"
            prominent
        >
          <v-col>
            <v-btn v-if="!is_dlivrd_driver" v-on:click="$router.push('/checklist')" style="font-size: 15px; color: #26225b">
              <v-icon style="font-size: 25px; color: #26225b">mdi-chevron-left</v-icon>
              Checklist
            </v-btn>
            <v-app-bar-nav-icon v-if="is_dlivrd_driver" variant="text"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          </v-col>
          <v-col>
            <v-toolbar-title class="toolbarTitleStyle">Delivery Location</v-toolbar-title>
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
                <!--              <v-list-item prepend-icon="mdi-account-cog-outline" title="Settings" value="settings" @click="openSettings"></v-list-item>-->
                <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout" @click="logout"></v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-app-bar>
        <NavigationDrawer :badge="validationFailed" :drawer=drawer :key="drawer" @closeNavigationDrawer="closeDrawer"></NavigationDrawer>
        <v-main class="mainViewStyle">
          <v-row class="mainBlockStyle">
            <v-col>
              <v-card-title class="pageHeading">Mark Delivery Area On The Map</v-card-title>
              <v-layout id="mapContainerBlock" class="mapStyle">
                <v-btn variant="flat" v-on:click="removeMarkers" style="position: absolute; right: 0; margin: 10px; z-index: 1; opacity: 0.8">
                  <v-icon>mdi-delete</v-icon>
                  Clear
                </v-btn>
                <v-col variant="flat" style="position: absolute; margin: 10px; z-index: 1; bottom: 0; right: 0; opacity: 0.8;background-color: #eeeeee; width: fit-content">
                  <v-row style="margin: 0; display: flex; align-content: center; align-items: center; width: 100%">
                    <v-icon style="color: red">
                      mdi-checkbox-blank
                    </v-icon>
                    <v-card-subtitle style="padding: 0">
                      High order count
                    </v-card-subtitle>
                  </v-row>
                  <v-row style="margin: 0; display: flex; width: 100%">
                    <v-icon style="color: #ff0000; opacity: 0.1">
                      mdi-checkbox-blank
                    </v-icon>
                    <v-card-subtitle style="padding: 0">
                      Low Order count
                    </v-card-subtitle>
                  </v-row>
                </v-col>
              </v-layout>



              <v-card-text v-if="warning && mapbox_ref" class="warningMessage">Note: Please click on the map to select your preferred Delivery Area.</v-card-text>





              <v-app class="appView">
                <v-card
                    class="mx-auto radiusCardStyle"
                    max-width="760"
                >
                  <v-card-title class="deliveryRadiusSliderTitle">Deliver Outside Area</v-card-title>
                  <v-card-text class="deliveryRadiusSliderText">Willing to travel outside the defined delivery radius if the earning opportunity is greater than or equal to:</v-card-text>
                  <v-slider
                      v-model="radiusSlider"
                      :ticks="tickLabels"
                      thumb-color="red"
                      show-ticks="always"
                      :thumb-size="26"
                      step="10"
                      :max="90"
                      :min="30"
                      class="sliderStyle"
                  >
                  </v-slider>
                </v-card>
              </v-app>
              <v-col class="fileUploadBlock">
                <v-overlay :model-value="updating">
                  <v-card style="background-color: transparent;width: 100vw;height: 100vh;">
                    <v-img :width="400" :src="loader" style="margin: auto; margin-top: 100px"/>
                  </v-card>
                </v-overlay>
<!--                <atom-spinner v-if="updating" :animation-duration="1000" :size="90" color="#0afd01"/>-->
                <v-btn
                    v-if="!skipped"
                    prepend-icon="mdi-skip-next"
                    variant="text"
                    @click="skipDeliveryDetails"
                    style="background-color: #26225b; color: #0adf01 !important;"
                >
                  Skip
                </v-btn>
                <v-btn
                    :disabled="(radiusSlider == copyRadiusSlider) && (JSON.stringify(markerInitial) === JSON.stringify(selection_markers))"
                    style="margin-left: 10px;"
                    prepend-icon="mdi-content-save-check"
                    class="buttonView"
                    variant="text"
                    @click="saveDeliveryDetails"
                >
                  Save
                </v-btn>

              </v-col>
            </v-col>
          </v-row>
        </v-main>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { AtomSpinner } from 'epic-spinners'
import mapboxgl from "mapbox-gl";
import axios from "axios";
import NavigationDrawer from "../components/NavigationDrawer.vue";
import englishImg from '../assets/english.png'
import spanishImg from '../assets/spanish.png'
import loader from "../assets/DlivrdLogo.gif";

export default {
  components: {
    AtomSpinner,
    NavigationDrawer
  },
  data () {
    return {
      changes: false,
      skipped: false,
      skip: false,
      markers: [],
      markerInitial: [],
      selection_markers: [],
      is_dlivrd_driver: false,
      loader: loader,
      warning: true,
      languages: ['English', 'Spanish'],
      selectedLanguage: englishImg,
      english: englishImg,
      spanish: spanishImg,
      drawer: false,
      agreeButtonText: null,
      mapbox_ref:null,
      get_current_location: [74.333454, 31.513394 ],
      mapbox_ref_click_log:null,
      cancelButtonText: null,
      alert_title: '',
      alert_description: '',
      dialog: false,
      errorMessage: false,
      showError: false,
      username: "",
      updating: false,
      loading: true,
      copyRadiusSlider: 30,
      radiusSlider: 30,
      showMessage: false,
      datapoint: null,
      loadView: false,
      zoom: null,
      boundaryBox: null,
      northEastLat: "",
      northEastLng: "",
      southWestLat: "",
      southWestLng: "",
      fleet_id: null,
      name: "",
      validationFailed: false,
      boundaryCoord: null,
      tickLabels: {
        0: '',
        40: '$40',
        50: '$50',
        60: '$60',
        70: '$70',
        80: '$80+',
      },
      accessToken:'pk.eyJ1IjoibWluZ3lhbjIxNCIsImEiOiJja2h4Y2xiajAwMTBsMnZuNHBzMjVmYjlsIn0.w7Wxvvi2i4olHVL2gE1zkQ',
    }
  },
  beforeMount() {
    this.username = localStorage.getItem('username')
    this.name = localStorage.getItem('name')
  },
  mounted() {
    if(localStorage.getItem('fleet_id'))
      this.fleet_id = localStorage.getItem('fleet_id')
    this.is_dlivrd_driver = localStorage.getItem('is_dlivrd_driver') == 'true'
    this.userProfileImage = localStorage.getItem('userProfileImage')
    mapboxgl.accessToken = "pk.eyJ1IjoibWluZ3lhbjIxNCIsImEiOiJja2h4Y2xiajAwMTBsMnZuNHBzMjVmYjlsIn0.w7Wxvvi2i4olHVL2gE1zkQ";
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
    btnOkayClick(){
      if(this.alert_title == "Success") {
        this.$router.push('/checklist')
      }
      this.dialog = false
    },
    btnYesClick(){
      this.skip = true
      this.dialog = false
      this.saveDeliveryDetails()
    },
    loadmap(){
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          // this.get_current_location = [ position.coords.longitude,position.coords.latitude]
          this.get_current_location = [this.mapbox_ref_click_log.lng, this.mapbox_ref_click_log.lat]
          this.generate_map();
        });
      } else {
        this.generate_map();
      }
    },
    generate_map(){
      const bounds = [
        [this.southWestLng, this.southWestLat],   //southWest
        [this.northEastLng, this.northEastLat] ,  //northEast
      ];
      this.mapbox_ref = new mapboxgl.Map({
        container: "mapContainerBlock",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [this.mapbox_ref_click_log.lng, this.mapbox_ref_click_log.lat],
        zoom: this.zoom,
        maxBounds:bounds,
      });
      if(this.markers.length == 4){
        this.generateSelectionLayer()
        this.warning = false
      }
      this.mapbox_ref.on('click', this.addMarker);

// Mapbox Polygon
      this.mapbox_ref.on('load', () => {
        var blockOpacity = ""
        for(var i=0; i<this.boundaryCoord['boundaries'].length;i++){
          // var intensity = (parseInt(this.boundaryCoord['boundaries'][i]['intensity'])/parseInt(this.boundaryCoord['_id']['total_orders_in_region']))*100
          var intensity = this.boundaryCoord['boundaries'][i]['intensity']
          // if(intensity <= 20){
          //
          //   blockOpacity = 0.1
          // }
          // else if(intensity > 20 && intensity <= 40){
          //   blockOpacity = 0.3
          // }
          // else if(intensity > 40 && intensity <= 60){
          //   blockOpacity = 0.45
          // }
          // else if(intensity > 60 && intensity <= 80){
          //   blockOpacity = 0.65
          // }
          // else if(intensity > 80){
          //   blockOpacity = 0.8
          // }
        // Add a data source containing GeoJSON data.
        this.mapbox_ref.addSource(`maine${i}`, {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              // These coordinates outline.
              'coordinates': [
                [
                    [parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['bottom_left']['long']),parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['bottom_left']['lat'])],
                    [parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['bottom_right']['long']),parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['bottom_right']['lat'])],
                    [parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['top_right']['long']),parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['top_right']['lat'])],
                    [parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['top_left']['long']),parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['top_left']['lat'])],
                    [parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['bottom_left']['long']),parseFloat(this.boundaryCoord['boundaries'][i]['boundary']['bottom_left']['lat'])],
                ]
              ]
            }
          }
        });

// Add a new layer to visualize the polygon.
        this.mapbox_ref.addLayer({
          'id': `maine${i}`,
          'type': 'fill',
          'source': `maine${i}`,
          'layout': {},
          'paint': {
            'fill-color': '#ff0000',
            'fill-opacity': intensity
          }
        });
        }
      });

      this.mapbox_ref.on('load', () => {
        this.test()
// Add a new layer to visualize the polygon.
//         var addCircle = {
//           "id": "point0",
//           "type": "circle",
//           "paint": {
//             "circle-opacity" : 0.4,
//             "circle-radius": 100,
//             "circle-color": '#01fde8'
//           },
//           "source": {
//             "type": "geojson",
//             "data": {
//               "type": "FeatureCollection",
//               "features": [{
//                 "type": "Feature",
//                 "properties": {
//                   "field": [-121.98053385676614, 47.55939393565585]
//                 },
//                 "geometry": {
//                   "type": "Point",
//                   "coordinates": [-121.98053385676614, 47.55939393565585]
//                 }
//               }]
//             }
//           }
//         };
//         this.mapbox_ref.addLayer(addCircle)
      });
    },
    generateSelectionLayer(){
      var top_left = this.markers[0]._lngLat
      var bottom_right = this.markers[1]._lngLat
      var bottom_left = this.markers[2]._lngLat
      var top_right = this.markers[3]._lngLat
      var change = true

      while (change){
        change = false
        if(bottom_left.lng > bottom_right.lng){
          var temp = bottom_left
          bottom_left = bottom_right
          bottom_right = temp
          change = true
        }
        else if(top_left.lng > top_right.lng){
          var temp = top_left
          top_left = top_right
          top_right = temp
          change = true
        }
        else if(top_left.lat < bottom_left.lat){
          var temp = top_left
          top_left = bottom_left
          bottom_left = temp
          change = true
        }
        else if(top_right.lat < bottom_right.lat){
          var temp = top_right
          top_right = bottom_right
          bottom_right = temp
          change = true
        }
      }
      // console.log("||||||||||||||||||||||||||||||||||||||||||")
      // console.log(top_left.lng < top_right.lng)
      // console.log(bottom_left.lng < bottom_right.lng)
      // console.log(top_left.lat > bottom_left.lat)
      // console.log(top_right.lat > bottom_right.lat)
      // console.log("||||||||||||||||||||||||||||||||||||||||||")
      // console.log(top_left.lat > bottom_right.lat)
      // console.log(top_right.lat > bottom_left.lat)
      //
      // console.log(top_left.lng < bottom_right.lng)
      // console.log(top_right.lng > bottom_left.lng)

      // if(bottom_left.lat < bottom_right.lat){
      //   var temp = bottom_left
      //   bottom_left = bottom_right
      //   bottom_right = temp
      // }

      this.selection_markers = []
      this.selection_markers.push({'index': 1, 'lat': top_left.lat, 'lng': top_left.lng})
      this.selection_markers.push({'index': 2, 'lat': top_right.lat, 'lng': top_right.lng})
      this.selection_markers.push({'index': 3, 'lat': bottom_right.lat, 'lng': bottom_right.lng})
      this.selection_markers.push({'index': 4, 'lat': bottom_left.lat, 'lng': bottom_left.lng})

      if(this.mapbox_ref.getLayer('selection')){
        this.mapbox_ref.removeLayer('selection')
      }
      if(this.mapbox_ref.getSource('selection'))
        this.mapbox_ref.removeSource('selection')
      this.mapbox_ref.addSource(`selection`, {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            // These coordinates outline.
            'coordinates': [
              [
                [parseFloat(top_left.lng),parseFloat(top_left.lat)],
                [parseFloat(top_right.lng),parseFloat(top_right['lat'])],
                [parseFloat(bottom_right.lng),parseFloat(bottom_right['lat'])],
                [parseFloat(bottom_left.lng),parseFloat(bottom_left['lat'])],
                [parseFloat(top_left.lng),parseFloat(top_left.lat)],
              ]
            ]
          }
        }
      });
      this.mapbox_ref.addLayer({
        'id': `selection`,
        'type': 'fill',
        'source': `selection`,
        'layout': {},
        'paint': {
          'fill-color': '#0AFD01',
          'fill-opacity': 0.6,
        }
      });
      this.warning = false
      console.log("this.mapbox_ref.getSource('selection')")
      console.log(this.mapbox_ref.getSource('selection'))
      console.log("this.mapbox_ref.getLayer('selection')")
      console.log(this.mapbox_ref.getLayer('selection'))
    },
    addMarker(e){
      console.log("this.radiusSlider")
      console.log(this.radiusSlider)
      console.log(this.copyRadiusSlider)
      try {
        if(this.circle_layer != null) {
          this.mapbox_ref.removeLayer('point');
          this.mapbox_ref.removeSource('point');
          this.getSelectedLoc()
        }
      }
      catch(err) {
      }
      this.mapbox_ref_click_log = e.lngLat
      if(this.markers.length < 4){
        const marker = new mapboxgl.Marker({
          color: "#0AFD01",
          draggable: true
        })
            .setLngLat([this.mapbox_ref_click_log.lng, this.mapbox_ref_click_log.lat])
            .addTo(this.mapbox_ref);
        marker.on('dragend', this.onDragEnd);
        // marker.on('drag', this.onDragEnd);
        this.markers.push(marker)
        if(this.markers.length == 4){
          this.generateSelectionLayer()
        }
        console.log("this.markers")
        console.log(this.markers)
        // console.log(this.markers[0]._lngLat.lng < this.markers[1]._lngLat.lng)
        console.log(this.markers[0]._lngLat.lat > this.markers[1]._lngLat.lat)
      }
      // this.generateGeoCircle()
    },
    generateGeoCircle(){
      // this.circle_layer = {
      //   "id": "point",
      //   "type": "circle",
      //   "paint": {
      //     "circle-opacity" : 0.4,
      //     "circle-radius": 200,
      //     "circle-color": '#0AFD01' //'#' + (Math.random().toString(16) + "000000").substring(2, 8)
      //   },
      //   "source": {
      //     "type": "geojson",
      //     "data": {
      //       "type": "FeatureCollection",
      //       "features": [{
      //         "type": "Feature",
      //         "properties": {
      //           "field": this.mapbox_ref_click_log
      //         },
      //         "geometry": {
      //           "type": "Point",
      //           "coordinates": [this.mapbox_ref_click_log.lng, this.mapbox_ref_click_log.lat]
      //         }
      //       }]
      //     }
      //   }
      // }


      this.mapbox_ref.on('styledata',this.test);
      // this.mapbox_ref.addLayer(this.circle_layer);
    },
    onDragEnd(){
      this.generateSelectionLayer()
    },
    test(){
      if(this.selection_markers.length == 4){
        for(var i = 0; i < this.selection_markers.length; i++){
          console.log(i)
          const marker = new mapboxgl.Marker({
            color: "#0AFD01",
            draggable: true
          })
              .setLngLat([this.selection_markers[i].lng, this.selection_markers[i].lat])
              .addTo(this.mapbox_ref);
          marker.on('dragend', this.onDragEnd);
          this.markers.push(marker)
        }
        console.log("2")
        this.generateSelectionLayer()
        console.log("3")
        this.mapbox_ref_click_log = {lat:(this.markers[0]._lngLat.lat + this.markers[1]._lngLat.lat)/2,lng:(this.markers[0]._lngLat.lng + this.markers[1]._lngLat.lng)/2}
      }
    },
    removeMarkers(){
      this.selection_markers = []
      if(this.radiusSlider == 0){
        this.changes = false
      }
      for(var i = 0; i < this.markers.length; i++)
        this.markers[i].remove()
      this.markers = []
      if(this.mapbox_ref.getLayer('selection'))
        this.mapbox_ref.removeLayer('selection')
      this.warning = true
    },
    getSelectedLoc(){
      if(this.circle_layer == null) {
        return {'lat':0,'lng':0,'radius':0}
      }
      const circleRadiusInPixels = 200; // Example radius in pixels
      const zoom = this.mapbox_ref.getZoom();
      const metersPerPixel = (156543.03392 * Math.cos(this.mapbox_ref_click_log.lat * Math.PI / 180)) / Math.pow(2, zoom);
      const circleRadiusInMeters = circleRadiusInPixels * metersPerPixel;
      this.datapoint = {'lat':this.mapbox_ref_click_log.lat,'lng':this.mapbox_ref_click_log.lng,'radius':circleRadiusInMeters,'zoom':zoom}
      return this.datapoint
    },
    getZoomLoc(meters){

      let zoom = 0;
      // let tolerance = 0.1; // Tolerance for the desired distance in meters
      // let distance = 0;
      //
      // while (distance < meters - tolerance || distance > meters + tolerance) {
      //   this.mapbox_ref.setZoom(zoom);
      //   const bounds = this.mapbox_ref.getBounds();
      //   const ne = bounds.getNorthEast();
      //   const sw = bounds.getSouthWest();
      //   const center = bounds.getCenter();
      //   const meterDistance = center.distanceTo(ne) * 1000; // Distance between center and northeast point in meters
      //   distance = meterDistance;
      //   if (distance < meters - tolerance) {
      //     zoom++;
      //   } else if (distance > meters + tolerance) {
      //     zoom--;
      //   } else {
      //     break;
      //   }
      // }

      return zoom;

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
        this.$router.push('/');
      })
    },
    sessionValidator(){
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
            this.getDeliveryLocationDetails();
            // this.loadmap();

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
    saveDeliveryDetails(){
      this.updating = true;
      this.currentLocation = this.getSelectedLoc();
      var url = this.baseurl + 'update_rider_delivery_area_and_tip_pref'
      var data = {
        identity: this.username,
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      if(this.skip){
         data['skip'] = true
      }
      else{
        data['skip'] = true
        if(this.radiusSlider == 30){
          data["tip_pref"] = 0
        }
        else{
          data["tip_pref"] = this.radiusSlider
        }
        data["selection_markers"] =  this.selection_markers
        data["zoom"] = this.currentLocation['zoom']
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
        console.log("location save response")
        console.log(response)
        this.updating = false;
        if(response.data['Success']){
          this.dialog = true;
          this.alert_title = "Success";
          this.alert_description = "Your delivery location details have been updated.";
          this.agreeButtonText = "Okay";
          this.cancelButtonText = null
        }
        else {
          if(response.data['Failure'] == 'Session Expired. Please login again.'){
            this.clearFields();
            this.$router.push('/')
          }
          else{
            this.dialog = true;
            this.alert_title = "Warning";
            this.alert_description = "Your delivery location details were not saved. Please Try again!";
            this.agreeButtonText = "Okay";
          }

        }
      }).catch( () => {
        this.clearFields();
        this.$router.push('/')
      })
    },
    skipDeliveryDetails(){
      this.alert_title = "Confirmation";
      this.alert_description = "Are you sure you want to skip this part? ";
      this.dialog = true;
      this.agreeButtonText = "Yes";
      this.cancelButtonText = "Cancel"
    },
    getDeliveryLocationDetails(){
      console.log('get delivery details response')
      var url = this.baseurl + 'get_rider_delivery_area_and_tip_pref'
      var data = {
        identity: this.username
      }
      if(this.fleet_id != null){
        data["fleet_id"] = this.fleet_id
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
        console.log("Get delivery response")
        console.log(response)
        if(response.data['Success']){
          var loc = response.data.data;
          this.radiusSlider = loc['tip_pref'];
          if(this.radiusSlider == 0){
            this.radiusSlider = 30
          }
          this.copyRadiusSlider = this.radiusSlider
          // if(loc['center']['lat'] == null){
          //   loc['center']['lat'] = 0
          // }
          // if(loc['center']['long'] == null){
          //   loc['center']['long'] = 0
          // }
          this.northEastLat = loc['boundary']['northEast']['lat']
          this.northEastLng = loc['boundary']['northEast']['long']
          this.southWestLat = loc['boundary']['southWest']['lat']
          this.southWestLng = loc['boundary']['southWest']['long']
          this.boundaryCoord = loc['boundaries_intensities'];
          this.selection_markers = loc['selection_markers']
          this.markerInitial = this.selection_markers
          if(loc['skip']){
            this.skipped = loc['skip']
          }
          // this.mapbox_ref_click_log = {lat:loc['center']['lat'],lng:loc['center']['long']}
          this.mapbox_ref_click_log = {lat:(this.northEastLat + this.southWestLat)/2,lng:(this.northEastLng + this.southWestLng)/2}
          this.zoom = loc['zoom'];
          // this.generateGeoCircle()
          // this.mapbox_ref.setZoom(loc['zoom'])
          // this.mapbox_ref.setCenter([loc['center']['long'], loc['center']['lat']]);
          // this.mapbox_ref.setCenter([, ]);
          // this.get_current_location = [loc['center']['long'], loc['center']['lat']]

          this.loadmap()

        }
      }).catch( () => {
        // this.clearFields();
        // this.$router.push('/');
      })
    },
    closeDrawer(){
      this.drawer = false;
    },
  }
}
</script>
<style>
.mapStyle .mapboxgl-ctrl-bottom-right{
  visibility: hidden;
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
  height: 100%;
  padding-top: 30px;
  padding-bottom: 100px !important;
}
.mainContainerView{
  text-align:-webkit-center;
}
.buttonView{
  background-color: #0AFD01 !important;
}
.appView{
  padding: 10px !important;
  background-color: transparent !important;
  height: 330px !important;
  width: 100% !important;
}
.fileUploadBlock{
  padding: 0 !important;
  padding-bottom: 60px !important;
  width: 60%;
}
.mapStyle{
  height: 500px;
  width: 70%;
  display: flex;
  justify-content: center;
}
.radiusCardStyle{
  margin-top: 40px;
  align-self: center;
  padding-bottom: 30px !important;
}
.deliveryRadiusSliderTitle{
  background-color: #0AFD01;
  margin-bottom: 30px
}
.deliveryRadiusSliderText{
  padding-bottom: 40px !important;
}
.sliderStyle {
  padding-right: 40px;
  padding-left: 40px;
}
.mainView{
  min-height: 100vh;
}
.nomainView{
  max-height: 0;
}
.dialogBoxDescription{
  overflow-y: scroll;
  text-align: justify;
}
.dialogBoxActionButtons{
  align-self: end;
  margin-top: 30px;
}
.accountIcon{
  background-color: white;
  border-radius: 50%;
}
.pageHeading{
  font-weight: bold !important;
  padding-bottom: 10px !important;
}
@media (max-width: 800px){
  .mapStyle{
    width: 100% !important;
  }
  .pageHeading{
    /*font-size: 3vw !important;*/
  }
}
.sliderStyle .v-slider-track__tick-label{
  margin-top: 15px !important;
}
</style>
