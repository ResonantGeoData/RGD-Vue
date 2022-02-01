<script lang="ts">
import {
  defineComponent,
} from '@vue/composition-api';
import { selectedTab } from '@/store';
import {
  resultsFilter,
  updateResults,
  sitesFilter,
  updateSites,
} from '@/store/search';
import TimeRange from '../atoms/TimeRange.vue';
import DistanceRange from '../atoms/DistanceRange.vue';
import Instrumentation from '../atoms/Instrumentation.vue';
import DateRange from '../atoms/DateRange.vue';
import Predicate from '../atoms/Predicate.vue';
import GeoJsonForm from './GeoJsonForm.vue';

export default defineComponent({
  name: 'FilterMenu',
  components: {
    TimeRange,
    DistanceRange,
    Instrumentation,
    Predicate,
    GeoJsonForm,
    DateRange,
  },
  setup() {
    const clearFilters = () => {
      resultsFilter.value.distance.min = null;
      resultsFilter.value.distance.max = null;
      resultsFilter.value.instrumentation = null;
      resultsFilter.value.collections = null;
      resultsFilter.value.time.startTime = null;
      resultsFilter.value.time.endTime = null;
      updateResults();
    };

    return {
      updateResults,
      clearFilters,
      selectedTab,
      sitesFilter,
      updateSites,
      resultsFilter,
    };
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
          <v-icon
            small
            @click="updateResults()"
          >
            mdi-refresh
          </v-icon>
          Filters
          <v-icon
            small
          >
            mdi-filter
          </v-icon>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content
        color="blue-grey darken-3"
      >
        <DistanceRange />
        <Instrumentation />
        <v-text-field
          v-model="resultsFilter.collections"
          label="Collections"
          outlined
          dense
          @input="$emit('input', resultsFilter)"
        />
        <DateRange />
        <TimeRange />
        <v-row>
          <v-col
            cols="6"
          >
            <v-btn
              color="#188DC8"
              outlined
              large
              width="100%"
              @click="updateResults()"
            >
              <div
                class="white--text"
              >
                Apply Filters
              </div>
            </v-btn>
          </v-col>
          <v-col
            cols="6"
          >
            <v-btn
              color="#188DC8"
              outlined
              large
              width="100%"
              @click="clearFilters"
            >
              <div
                class="white--text"
              >
                Clear Filters
              </div>
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
