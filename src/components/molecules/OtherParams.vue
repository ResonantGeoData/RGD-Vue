<script lang="ts">
import {
  defineComponent, reactive, ref,
} from '@vue/composition-api';

export default defineComponent({
  name: 'OtherParams',
  setup() {
    const predicate = [
      'within',
      'contains',
      'crosses',
      'disjoint',
      'equals',
      'intersects',
      'overlaps',
      'touches',
    ];

    const dateAndTime = reactive({
      startDate: '',
      startDateModal: false,
      endDate: '',
      endDateModal: false,
      startTime: '',
      startTimeModal: false,
      endTime: '',
      endTimeModal: false,
    });

    const distance = reactive({
      min: '',
      max: '',
    });

    const instrumentation = ref('');

    return {
      predicate,
      dateAndTime,
      distance,
      instrumentation,
    };
  },
});

</script>
<template>
  <v-row
    justify="center"
  >
    <v-col
      cols="11"
      class="mt-3"
    >
      <v-select
        :items="predicate"
        label="Predicate"
        outlined
        dense
      />
      <v-text-field
        v-model="distance.min"
        label="Distance(min)"
        outlined
        dense
      />
      <v-text-field
        v-model="distance.max"
        label="Distance(max)"
        outlined
        dense
      />
      <v-text-field
        v-model="instrumentation"
        label="Instrumentation"
        outlined
        dense
      />
      <div>
        Acquired
      </div>
      <v-row>
        <v-dialog
          ref="dateAndTime.startDate"
          v-model="dateAndTime.startDateModal"
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-col
              cols="6"
            >
              <v-text-field
                :value.sync="dateAndTime.startDate"
                prepend-icon="mdi-calendar"
                clearable
                readonly
                dense
                v-bind="attrs"
                v-on="on"
              />
            </v-col>
          </template>
          <v-date-picker
            v-model="dateAndTime.startDate"
            scrollable
          >
            <v-btn
              text
              color="primary"
              @click="dateAndTime.startDateModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="dateAndTime.startDateModal = false"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-dialog
          v-model="dateAndTime.endDateModal"
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-col
              cols="6"
            >
              <v-text-field
                :value.sync="dateAndTime.endDate"
                prepend-icon="mdi-calendar"
                clearable
                readonly
                dense
                v-bind="attrs"
                v-on="on"
              />
            </v-col>
          </template>
          <v-date-picker
            v-model="dateAndTime.endDate"
            scrollable
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="dateAndTime.endDateModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="dateAndTime.endDateModal = false"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-row>
      <div>
        Time Range
      </div>
      <v-row>
        <v-dialog
          v-model="dateAndTime.startTimeModal"
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-col
              cols="6"
            >
              <v-text-field
                :value.sync="dateAndTime.startTime"
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
            v-if="dateAndTime.startTimeModal"
            v-model="dateAndTime.startTime"
            ampm-in-title
            format="ampm"
            use-seconds
            full-width
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="dateAndTime.startTimeModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="dateAndTime.startTimeModal = false"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-dialog
          v-model="dateAndTime.endTimeModal"
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-col
              cols="6"
            >
              <v-text-field
                :value.sync="dateAndTime.endTime"
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
            v-if="dateAndTime.endTimeModal"
            v-model="dateAndTime.endTime"
            ampm-in-title
            format="ampm"
            use-seconds
            full-width
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="dateAndTime.endTimeModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="dateAndTime.endTimeModal = false"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
      </v-row>
    </v-col>
  </v-row>
</template>
