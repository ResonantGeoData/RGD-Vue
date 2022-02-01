<script lang="ts">
import {
  defineComponent, ref, watch,
} from '@vue/composition-api';
import { selectedTab } from '@/store';
import {
  drawnShape,
  searchResults,
  specifiedShape,
  updateResults,
  updateRegions,
} from '@/store/search';
import ToolBar from '../molecules/ToolBar.vue';
import TabToolBar from '../molecules/TabToolBar.vue';
import GeoJsonForm from '../molecules/GeoJsonForm.vue';
import BoundingBoxForm from '../molecules/BoundingBoxForm.vue';
import LatLongForm from '../molecules/LatLongForm.vue';
import Results from './Results.vue';
import Predicate from '../atoms/Predicate.vue';
import DateRange from '../atoms/DateRange.vue';
import Regions from './Regions.vue';

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
    Regions,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const reveal = ref(false);
    watch(drawnShape, () => {
      if (drawnShape.value.type) {
        specifiedShape.value = drawnShape.value;
      }
    }, { deep: true });
    watch(searchResults, (newValue, oldValue) => {
      if (oldValue?.length !== newValue?.length) {
        reveal.value = true;
        selectedTab.value = 'results';
      }
    });

    // call updateRegions immediately so the list is ready
    // and no delay is introduced  when the regions tab is selected
    updateRegions();

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
    class="overflow-auto"
  >
    <v-tabs
      v-model="selectedTab"
      grow
      background-color="blue-grey darken-2 large-text"
      style="z-index: 2"
    >
      <v-tab href="#regions">
        Regions
      </v-tab>
      <!-- <v-tab href="#search">
        SEARCH
      </v-tab> -->
      <v-tab
        href="#results"
      >
        Imagery
      </v-tab>
    </v-tabs>
    <v-tabs-items
      v-model="selectedTab"
      color="blue-grey darken-4"
    >
      <v-tab-item
        value="regions"
      >
        <v-card flat>
          <Regions regions />
        </v-card>
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
            <v-row justify="center">
              <v-col cols="11">
                <v-card-subtitle>Specify search area</v-card-subtitle>
                <GeoJsonForm />
                <v-card-subtitle>Apply search logic</v-card-subtitle>
                <Predicate />
                <v-card-subtitle>Acquired date range</v-card-subtitle>
                <DateRange />

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
          <Results />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
