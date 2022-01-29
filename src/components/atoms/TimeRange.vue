<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';

import { resultsFilter } from '@/store/search';

export default defineComponent({
  name: 'TimeRange',
  setup() {
    return {
      resultsFilter,
    };
  },
});

</script>

<template>
  <div>
    <div>
      Time Range
    </div>
    <v-row>
      <v-dialog
        v-model="resultsFilter.time.startTimeModal"
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-col
            cols="6"
          >
            <v-text-field
              :value.sync="resultsFilter.time.startTime"
              prepend-icon="mdi-clock-time-four-outline"
              clearable
              readonly
              dense
              v-bind="attrs"
              v-on="on"
            />
          </v-col>
        </template>
        <v-time-picker
          v-if="resultsFilter.time.startTimeModal"
          v-model="resultsFilter.time.startTime"
          ampm-in-title
          format="ampm"
          full-width
        >
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="resultsFilter.time.startTimeModal = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="resultsFilter.time.startTimeModal = false, $emit('input', resultsFilter)"
          >
            OK
          </v-btn>
        </v-time-picker>
      </v-dialog>
      <v-dialog
        v-model="resultsFilter.time.endTimeModal"
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-col
            cols="6"
          >
            <v-text-field
              :value.sync="resultsFilter.time.endTime"
              prepend-icon="mdi-clock-time-four-outline"
              clearable
              readonly
              dense
              v-bind="attrs"
              v-on="on"
            />
          </v-col>
        </template>
        <v-time-picker
          v-if="resultsFilter.time.endTimeModal"
          v-model="resultsFilter.time.endTime"
          ampm-in-title
          format="ampm"
          full-width
        >
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="resultsFilter.time.endTimeModal = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="resultsFilter.time.endTimeModal = false, $emit('input', resultsFilter)"
          >
            OK
          </v-btn>
        </v-time-picker>
      </v-dialog>
    </v-row>
  </div>
</template>
