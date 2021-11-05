<script lang="ts">
import {
  defineComponent, ref,
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
    const parameters = ref({
      predicate: '',
      dateAndTime: {
        startDate: '',
        startDateModal: false,
        endDate: '',
        endDateModal: false,
        startTime: '',
        startTimeModal: false,
        endTime: '',
        endTimeModal: false,
      },
      distance: {
        min: '',
        max: '',
      },
      instrumentation: '',
    });

    return {
      predicate,
      parameters,
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
        v-model="parameters.predicate"
        :items="predicate"
        label="Predicate"
        outlined
        dense
        value=""
        @input="$emit('input', parameters)"
      />
      <v-text-field
        v-model="parameters.distance.min"
        label="Distance(min)"
        outlined
        dense
        @input="$emit('input', parameters)"
      />
      <v-text-field
        v-model="parameters.distance.max"
        label="Distance(max)"
        outlined
        dense
        @input="$emit('input', parameters)"
      />
      <v-text-field
        v-model="parameters.instrumentation"
        label="Instrumentation"
        outlined
        dense
        @input="$emit('input', parameters)"
      />
      <div>
        Acquired
      </div>
      <v-row>
        <v-dialog
          v-model="parameters.dateAndTime.startDateModal"
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-col
              cols="6"
            >
              <v-text-field
                :value.sync="parameters.dateAndTime.startDate"
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
            v-model="parameters.dateAndTime.startDate"
            scrollable
          >
            <v-btn
              text
              color="primary"
              @click="parameters.dateAndTime.startDateModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="parameters.dateAndTime.startDateModal = false, $emit('input', parameters)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <v-dialog
          v-model="parameters.dateAndTime.endDateModal"
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-col
              cols="6"
            >
              <v-text-field
                :value.sync="parameters.dateAndTime.endDate"
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
            v-model="parameters.dateAndTime.endDate"
            scrollable
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="parameters.dateAndTime.endDateModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="parameters.dateAndTime.endDateModal = false, $emit('input', parameters)"
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
          v-model="parameters.dateAndTime.startTimeModal"
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-col
              cols="6"
            >
              <v-text-field
                :value.sync="parameters.dateAndTime.startTime"
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
            v-if="parameters.dateAndTime.startTimeModal"
            v-model="parameters.dateAndTime.startTime"
            ampm-in-title
            format="ampm"
            use-seconds
            full-width
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="parameters.dateAndTime.startTimeModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="parameters.dateAndTime.startTimeModal = false, $emit('input', parameters)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
        <v-dialog
          v-model="parameters.dateAndTime.endTimeModal"
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-col
              cols="6"
            >
              <v-text-field
                :value.sync="parameters.dateAndTime.endTime"
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
            v-if="parameters.dateAndTime.endTimeModal"
            v-model="parameters.dateAndTime.endTime"
            ampm-in-title
            format="ampm"
            use-seconds
            full-width
          >
            <v-spacer />
            <v-btn
              text
              color="primary"
              @click="parameters.dateAndTime.endTimeModal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="parameters.dateAndTime.endTimeModal = false, $emit('input', parameters)"
            >
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
      </v-row>
    </v-col>
  </v-row>
</template>
