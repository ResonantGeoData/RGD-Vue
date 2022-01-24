<script lang="ts">
import {
  defineComponent, ref, watch,
} from '@vue/composition-api';
import {
  drawnShape,
  searchResults,
  geoJsonShape,
  specifiedShape,
  updateResults,
} from '@/store';
import ToolBar from '../molecules/ToolBar.vue';
import TabToolBar from '../molecules/TabToolBar.vue';
import GeoJsonForm from '../molecules/GeoJsonForm.vue';
import BoundingBoxForm from '../molecules/BoundingBoxForm.vue';
import LatLongForm from '../molecules/LatLongForm.vue';
import Results from './Results.vue';
import Predicate from '../atoms/Predicate.vue';
import DateRange from '../atoms/DateRange.vue';

export default defineComponent({
  name: 'SearchBar',
  components: {
    ToolBar,
    TabToolBar,
    GeoJsonForm,
    BoundingBoxForm,
    LatLongForm,
    Predicate,
    DateRange,
    Results,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const selectedTab = ref('search');
    const reveal = ref(false);
    watch(drawnShape, () => {
      if (drawnShape.value.type) {
        geoJsonShape.value = JSON.stringify(drawnShape.value);
      }
    }, { deep: true });
    watch(specifiedShape, () => {
      if (specifiedShape.value.type) {
        geoJsonShape.value = JSON.stringify(specifiedShape.value);
      }
    }, { deep: true });
    watch(searchResults, () => {
      reveal.value = true;
      selectedTab.value = 'results';
    });
    return {
      selectedTab,
      searchResults,
      updateResults,
      reveal,
    };
  },
});
</script>
<template>
  <v-card
    color="blue-grey darken-4"
    height="calc(100vh - 48px)"
  >
    <v-tabs
      v-model="selectedTab"
      grow
      background-color="blue-grey darken-2 large-text"
      style="z-index: 2"
    >
      <v-tab href="#regions">
        REGIONS
      </v-tab>
      <v-tab href="#search">
        SEARCH
      </v-tab>
      <v-tab
        v-if="reveal"
        href="#results"
      >
        RESULTS
      </v-tab>
    </v-tabs>
    <v-tabs-items
      v-model="selectedTab"
      color="blue-grey darken-4"
    >
      <v-tab-item
        value="regions"
      >
        <v-card
          flat
        />
      </v-tab-item>
      <v-tab-item
        value="search"
      >
        <v-card
          flat
          color="blue-grey darken-4"
        >
          <v-form
            @submit.prevent="updateResults()"
          >
            <v-card-subtitle>Specify search area</v-card-subtitle>
            <GeoJsonForm />
            <v-card-subtitle>Apply search logic</v-card-subtitle>
            <Predicate />
            <v-card-subtitle>Acquired date range</v-card-subtitle>
            <DateRange />

            <v-row justify="center">
              <v-col cols="11">
                <v-btn
                  color="primary"
                  block
                  x-large
                  type="submit"
                >
                  Search
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-tab-item>
      <v-tab-item
        value="results"
      >
        <v-card
          flat
          color="blue-grey darken-4"
        >
          <Results
            v-if="reveal"
          />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
