// break up other params and import here.
// wrap in expandable menu
<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';

import TimeRange from '../atoms/TimeRange.vue';
import DistanceRange from '../atoms/DistanceRange.vue';
import Instrumentation from '../atoms/Instrumentation.vue';

export default defineComponent({
  name: 'FilterMenu',
  components: {
    TimeRange,
    DistanceRange,
    Instrumentation,
  },
});

</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header
        color="blue-grey darken-3"
      >
        <div>
          Filters
          <v-icon
            small
          >
            mdi-filter
          </v-icon>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content
        color="#8999A0"
      >
        <DistanceRange
          class="mt-3"
        />
        <Instrumentation />
        <TimeRange />
        <v-btn
          color="#188DC8"
          outlined
          large
          width="100%"
        >
          <div
            class="white--text"
          >
            Apply Filters
          </div>
        </v-btn>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
