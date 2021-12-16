<script lang="ts">
import {
  defineComponent, Ref, ref, watch,
} from '@vue/composition-api';
import { Parameters } from '@/store/types';
import { geoShape, searchResults } from '@/store';
import { rgdSearch } from '@/api/rest';
import ToolBar from '../molecules/ToolBar.vue';
import TabToolBar from '../molecules/TabToolBar.vue';
import GeoJsonForm from '../molecules/GeoJsonForm.vue';
import BoundingBoxForm from '../molecules/BoundingBoxForm.vue';
import LatLongForm from '../molecules/LatLongForm.vue';
import OtherParams from '../molecules/OtherParams.vue';
import Results from '../molecules/Results.vue';

export default defineComponent({
  name: 'SearchBar',
  components: {
    ToolBar,
    TabToolBar,
    GeoJsonForm,
    BoundingBoxForm,
    LatLongForm,
    OtherParams,
    Results,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const geoJsonShape = ref();

    const reveal = ref(false);
    const buttonText = ref('Show Results');

    const toggle = () => {
      if (reveal.value) {
        reveal.value = false;
        buttonText.value = 'Show Results';
        return;
      }
      reveal.value = true;
      buttonText.value = 'Close';
    };

    const params: Ref<Parameters> = ref({
      predicate: 'intersects',
      distance: {
        min: null,
        max: null,
      },
      instrumentation: null,
      dateAndTime: {
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
      },
    });

    const updateResults = async () => {
      const res = await rgdSearch(
        geoJsonShape.value,
        params.value.predicate,
        params.value.distance.min,
        params.value.distance.max,
        params.value.instrumentation,
        params.value.dateAndTime.startDate,
        params.value.dateAndTime.endDate,
        params.value.dateAndTime.startTime,
        params.value.dateAndTime.endTime,

      );
      searchResults.value = res.data.results;
    };

    watch(geoShape, () => {
      if (geoShape.value.type) {
        geoJsonShape.value = JSON.stringify(geoShape.value);
      }
    }, { deep: true });
    return {
      params,
      searchResults,
      updateResults,
      toggle,
      buttonText,
      reveal,
    };

    // Will be needed in second iteration
    // const tabData = ['LatLong', 'Bounding Box', 'GeoJson'];
    // const activeTab = ref(0);
  },
});
</script>
<template>
  <v-card
    color="blue-grey darken-4"
    height="calc(100vh - 48px)"
  >
    <v-card-title>
      Sample Project
      <v-spacer />
      <v-card-actions>
        <v-btn
          v-if="searchResults"
          plain
          right
          color="blue"
          @click="toggle"
          v-text="buttonText"
        >
          Show Results
        </v-btn>
      </v-card-actions>
    </v-card-title>
    <Results
      v-if="reveal==true"
    />
    <!-- Will be needed in second iteration -->
    <!-- <TabToolBar
      v-model="activeTab"
      :items="tabData"
      color="blue-grey darken-2"
      flat
    /> -->
    <v-form
      v-if="reveal==false"
      @submit.prevent="updateResults"
    >
      <!-- Will be needed in second iteration -->
      <!-- <LatLongForm
        v-if="activeTab === 0"
      />
      <BoundingBoxForm
        v-if="activeTab === 1"
      /> -->
      <ToolBar
        text="Geo Json"
        color="blue-grey darken-2"
        flat
      />
      <GeoJsonForm />
      <ToolBar
        text="Other Params"
        color="blue-grey darken-2"
        flat
      />
      <OtherParams
        v-model="params"
      />
      <v-row
        no-gutters
        justify="center"
      >
        <v-col
          cols="11"
        >
          <v-btn
            color="teal accent-4"
            block
            x-large
            type="submit"
            class="mt-3"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
