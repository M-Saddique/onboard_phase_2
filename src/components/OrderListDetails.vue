<template>
  <v-card>
    <v-layout>
      <v-row class="orderDetailsCard">
        <v-col>
          <v-card-text>July 2,2023, 12:00 AM</v-card-text>
        </v-col>
        <v-col>
          <v-card-text>
            The Juicy Crab
            2670 E College Ave, Decatur, GA 30030, USA
          </v-card-text>
        </v-col>
        <v-col>
          <v-card-text>
            Myra’s party
            3199 Walnut Rdg, Atlanta, GA 30349, USA
          </v-card-text>
        </v-col>
        <v-col>
          <v-card-text>
            Carhops (ezCater)<br>
            Tameshia Weaver
          </v-card-text>
        </v-col>
        <v-col>
          <v-card-text>July 2,2023, 12:00 AM</v-card-text>
        </v-col>
        <v-col>
          <v-card-text>Dropoff Complete</v-card-text>
        </v-col>
        <v-col md="1">
          <v-btn icon="mdi-dots-vertical" size="36"></v-btn>
          <v-btn icon="mdi-chevron-right" size="36" style="margin-left: 10px"></v-btn>
        </v-col>
      </v-row>
    </v-layout>
  </v-card>
</template>


<script>

import { AtomSpinner } from 'epic-spinners'
import DatePicker from 'vue-datepicker-next';

export default {
  components: {
    AtomSpinner,
    DatePicker
  },
  data () {
    return {

    }
  },
  watch:{

  },
  mounted() {

  },
  methods: {

  },
}
</script>
<style>
.orderDetailsCard{
  align-items: center !important;
;
}
.orderDetailsCard:hover {
  background-color: #0AFD01;
}
</style>
