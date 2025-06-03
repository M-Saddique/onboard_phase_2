<template>
  <v-col v-if="cateringBags"  :style="{'background-color':primary_color, 'color': secondary_color}"  >
    <!-- Image of Catering Bags -->
    <v-row v-on:click="selectBagsImage()" class="image_block" :style="{'border-color': secondary_color}">
      <v-icon>mdi-image-multiple</v-icon>
      <v-card-subtitle style="font-weight: bold">
        Upload Delivery Photos
      </v-card-subtitle>
    </v-row>
    <v-row :style="{'background-color':primary_color, 'color': secondary_color}" cols="12" style="display: grid; justify-content: center;">
      <div class="bagsImagesMainBlock">
        <div
            v-for="(item, index) in bagsImagesList"
            :key=index
            class="imagePreviewBlockBags"
            :style="{'background-color':primary_color}"
        >
          <v-badge style="z-index: 100" icon="mdi-close" @click="removeBagsImage(index,item)"></v-badge>
          <v-img
              width="370px"
              aspect-ratio="1/1"
              :src=item
              :lazy-src='item'
              class="bg-grey-lighten-2 imagePreviewWrapperBags"
          />
        </div>
      </div>
    </v-row>
    <!--Add New Image-->
    <v-file-input
        ref="bagsFileInputData"
        type="file"
        accept="image/*"
        v-model="fileBags"
        @emptied="fileBags = null"
        @input="pickBagsFile"
        style="display: none"
    ></v-file-input>
<!--    Dialog box-->
    <v-dialog
        id="dialogBox"
        v-model="dialog"
        transition="dialog-top-transition"
        max-width="300px"
        persistent
    >
      <v-card>
        <v-card-title class="text-h5" :style="{'background-color':primary_color, 'color': text_color}">{{alert_title}}</v-card-title>
        <v-card-text id="dialogDescription" style="overflow-y: scroll; text-align: justify" v-html="alert_description"></v-card-text>
        <v-card-actions style="align-self: end; margin-top: 30px">
          <v-spacer></v-spacer>
          <v-btn
              theme="dark"
              class="btnDialog"
              prepend-icon="mdi-close"
              style="pointer-events: visible; cursor: pointer"
              :style="{'background-color':primary_color, 'color': text_color}"
              variant="outlined"
              @click="dialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script>

import uploadImage from '../assets/Upload.png';
import axios from "axios";

export default {
  name: "ImgUpload",
  props:{
    primary_color:{
      type: String
    },
    secondary_color:{
      type: String
    },
    text_color:{
      type: String
    },
  },
  data(){
    return{
      alert_title: "",
      alert_description: "",
      dialog: false,
      buttonAction: false,
      showBagsWarning: false,
      quantityOfBags: ['1','2','3','4','5','6','7','8','9','10','10+'],
      uploadImageDefault: uploadImage,
      numberOfBags: 3,
      cateringBags: true,
      // Bags Image
      bagsImage: null,
      bagsImageFile: null,
      lazy_load_bags_image: '',
      loadingBagsImage: true,
      fileBags: null,
      bagsImagesList: [],
      existingBagImages: [],
      bagsImageFileList: [],
      NumberOfBagsImages: 0,
      addNewBagsImage: true,

    }
  },
  emits:["upload"],
  methods:{
    selectBagsImage() {
      if(this.bagsImagesList.length >= this.numberOfBags){
        this.alert_title = "Image Limit Reached";
        this.alert_description = "Maximum number of images uploaded!";
        this.dialog = true;
        this.agreeButtonText = "Okay";
        return;
      }
      this.$refs.bagsFileInputData.click()
    },
    removeBagsImage(index, item){
      if(this.bagsImagesList.includes(item)){
        if(item.includes(this.baseImageurl)){
          var referenceSplit = item.split(this.baseImageurl)
          item = referenceSplit[1]
        }
        if(this.existingBagImages.includes(item)){
          this.bagsImagesList.splice(this.bagsImagesList.indexOf(item),1)
          this.existingBagImages.splice(this.existingBagImages.indexOf(item),1)
        }
        else{
          this.bagsImagesList.splice(this.bagsImagesList.indexOf(item),1)
          this.bagsImageFileList.splice(this.bagsImageFileList.indexOf(item),1)
        }
      }
      this.numberOfBagsImages = this.numberOfBagsImages -1
      if(this.numberOfBagsImages < 3){
        this.addNewBagsImage = true;
      }
      this.$emit('upload', this.bagsImageFileList)
    },
    pickBagsFile(e) {
      this.bagsImageFile = e.target.files[0]
      this.lazy_load_bags_image = ''
      let input = this.$refs.bagsFileInputData
      let file = input.files
      if (file && file[0]) {
        let reader = new FileReader
        reader.onload = e => {
          this.bagsImage = e.target.result
          if(!this.existingBagImages.includes(this.bagsImage)){
            this.bagsImagesList.push(this.bagsImage)
            this.bagsImageFileList.push(this.bagsImageFile)
            this.existingBagImages.push(this.bagsImage)
          }
          this.fileBags = null
        }
        reader.readAsDataURL(file[0])
      }
      this.numberOfBagsImages = this.numberOfBagsImages + 1;
      // console.log("this.numberOfBagsImages")
      // console.log(this.numberOfBagsImages)
      if(this.numberOfBagsImages == 3){
        this.addNewBagsImage = false;

        // console.log("this.addNewBagsImage")
        // console.log(this.addNewBagsImage)
      }
      this.$emit('upload', this.bagsImageFileList)
    },

    saveVehicleAndBagDetails(){
      if(this.bagsImageFileList.length < 1)
      {
        this.alert_title = "No images uploaded"
        this.alert_description = "Please upload the Dropoff images first."
        this.dialog = true
        return
      }
      this.showBagsWarning = false;
      var url = this.baseurl + 'update_rider_vehicle_bag_details';
      this.buttonAction = false;
      var data = new FormData();
      for(var i = 0; i < this.bagsImageFileList.length; i++){
        data.append('drop_image_'+i, this.bagsImageFileList[i])
      }
      axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "session":localStorage.getItem('session_id')
        }
      }).then(response => {
        console.log("Save vehicle and Bag Details API response")
        console.log(response)
        this.processingDetails = false;
        this.buttonAction = false;
        if(response.data['Success']){
          this.alert_title = "Update Successful";
          this.alert_description = "dlivrd Driver vehicle and bag details updated.";
          this.$emit('upload')
        }
        else{
          this.alert_title = "Update Failed";
          this.alert_description = "Vehicle and bag details not updated. Try Again!";
        }
        this.dialog = true;
        this.agreeButtonText = "Okay";
      }).catch(() => {
      })
    },
  },
}
</script>

<style scoped>
.order_view_web {
  min-height: 80%;
  height: fit-content;
  background-color: #ffffff;
  max-width: 400px;
  margin: 0 auto;
  padding: 0;
  /*padding-left: 10px;*/
  /*padding-right: 10px;*/
  padding-bottom: 10px;
}
.imagePreviewWrapperBags {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 0px;
  cursor: pointer;
  border: 1px solid #0AFD01;
  background-repeat: no-repeat;
  background-position: center center;
}
.note{
  padding: 0 !important;
  /*padding-bottom: 20px !important;*/
  color: red;
}
.bagsImagesMainBlock{
  width: 100%;
  display: flex;
  flex-wrap: wrap !important;
  justify-content: space-evenly;
  padding: 5px;
}
.imagePreviewBlockBags {
  aspect-ratio: 1/1;
  width: 30%;
  height: auto;
  display: block;
  border-radius: 0px;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  border: 0;
  background-repeat: no-repeat;
  background-position: center center;
  margin-right: 0px;
  justify-self: center;
}
.image_block{
  border-radius: 5px;
  border: dashed 2px;
  display: flex;
  justify-content: center;
  align-content: center;
  padding-top: 20px;
  padding-bottom: 18px;
  cursor: grab
}
</style>