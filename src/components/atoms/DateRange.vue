<script lang="ts">
import {
  defineComponent, ref,
} from '@vue/composition-api';

import { searchParameters } from '@/store';

export default defineComponent({
  name: 'DateRange',
  setup() {
    const startDate = ref('');
    const startTime = ref('');
    const endDate = ref('');
    const endTime = ref('');

    const updateInput = () => {
      if (startDate.value) {
        searchParameters.value.acquired.startDate = `${startDate.value}T${startTime.value}`;
      }
      if (endDate.value) {
        searchParameters.value.acquired.endDate = `${endDate.value}T${endTime.value}`;
      }
    };

    return {
      searchParameters,
      startTime,
      startDate,
      endTime,
      endDate,
      updateInput,
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
      v-model="searchParameters.acquired.startDateModal"
      width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-col
          cols="6"
          class="pr-3"
        >
          <v-text-field
            :value.sync="searchParameters.acquired.startDate"
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
          v-model="startDate"
          scrollable
        />
        <v-time-picker
          v-model="startTime"
        />
      </div>
      <div class="d-flex justify-space-between blue-grey darken-4">
        <v-btn
          text
          color="primary"
          @click="searchParameters.acquired.startDateModal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="searchParameters.acquired.startDateModal = false, updateInput()"
        >
          OK
        </v-btn>
      </div>
    </v-dialog>
    <v-dialog
      v-model="searchParameters.acquired.endDateModal"
      width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-col
          cols="5"
        >
          <v-text-field
            :value.sync="searchParameters.acquired.endDate"
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
          v-model="endDate"
          scrollable
        />
        <v-time-picker
          v-model="endTime"
        />
      </div>
      <div class="d-flex justify-space-between blue-grey darken-4">
        <v-btn
          text
          color="primary"
          @click="searchParameters.acquired.endDateModal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="searchParameters.acquired.endDateModal = false, updateInput()"
        >
          OK
        </v-btn>
      </div>
    </v-dialog>
  </v-row>
</template>
