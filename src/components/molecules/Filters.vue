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
import Collections from '../atoms/Collections.vue';

export default defineComponent({
  name: 'FilterMenu',
  components: {
    TimeRange,
    DistanceRange,
    Instrumentation,
    Predicate,
    GeoJsonForm,
    DateRange,
    Collections,
  },
  setup() {
    const clearFilters = () => {
      resultsFilter.value.distance.min = null;
      resultsFilter.value.distance.max = null;
      resultsFilter.value.instrumentation = null;
      resultsFilter.value.collections = [];
      resultsFilter.value.acquired.startDate = null;
      resultsFilter.value.acquired.endDate = null;
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
            @click.native.stop="updateResults()"
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
        <Collections />
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
