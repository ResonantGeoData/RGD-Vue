<script lang="ts">
import {
  defineComponent, ref,
} from '@vue/composition-api';

import { timeLineStartDate, timeLineEndDate } from '@/store/cesium/search';

export default defineComponent({
  name: 'TimeSliderRange',
  setup() {
    const timeLineStartDateModal = ref(false);
    const timeLineEndDateModal = ref(false);

    return {
      timeLineStartDate,
      timeLineEndDate,
      timeLineStartDateModal,
      timeLineEndDateModal,
    };
  },
});

</script>

<template>
  <v-row
    no-gutters
    justify="center"
  >
    <v-dialog
      v-model="timeLineStartDateModal"
      width="300px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-col
          cols="6"
          class="pr-3"
        >
          <v-text-field
            :value.sync="timeLineStartDate"
            prepend-icon="mdi-calendar"
            append-outer-icon="mdi-minus"
            clearable
            readonly
            dense
            v-bind="attrs"
            v-on="on"
          />
        </v-col>
      </template>
      <div class="d-flex justify-space-between blue-grey darken-4">
        <v-date-picker
          v-model="timeLineStartDate"
          scrollable
        />
      </div>
      <div class="d-flex justify-space-between blue-grey darken-4">
        <v-btn
          text
          color="primary"
          @click="timeLineStartDateModal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="timeLineStartDateModal = false"
        >
          OK
        </v-btn>
      </div>
    </v-dialog>
    <v-dialog
      v-model="timeLineEndDateModal"
      width="300px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-col
          cols="5"
        >
          <v-text-field
            :value.sync="timeLineEndDate"
            prepend-icon="mdi-calendar"
            clearable
            readonly
            dense
            v-bind="attrs"
            v-on="on"
          />
        </v-col>
      </template>
      <div class="d-flex justify-space-between blue-grey darken-4">
        <v-date-picker
          v-model="timeLineEndDate"
          scrollable
        />
      </div>
      <div class="d-flex justify-space-between blue-grey darken-4">
        <v-btn
          text
          color="primary"
          @click="timeLineEndDateModal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="timeLineEndDateModal = false"
        >
          OK
        </v-btn>
      </div>
    </v-dialog>
  </v-row>
</template>
