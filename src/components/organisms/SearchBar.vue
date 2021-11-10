<script lang="ts">
import {
  defineComponent, Ref, ref, reactive,
} from '@vue/composition-api';
import { Parameters } from '@/store/types';
import { rgdSearch } from '@/api/rest';
import type { DataOptions } from 'vuetify';
import ToolBar from '../molecules/ToolBar.vue';
import TabToolBar from '../molecules/TabToolBar.vue';
import GeoJsonForm from '../molecules/GeoJsonForm.vue';
import BoundingBoxForm from '../molecules/BoundingBoxForm.vue';
import LatLongForm from '../molecules/LatLongForm.vue';
import OtherParams from '../molecules/OtherParams.vue';

export default defineComponent({
  name: 'SearchBar',
  components: {
    ToolBar,
    TabToolBar,
    GeoJsonForm,
    BoundingBoxForm,
    LatLongForm,
    OtherParams,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const params: Ref<Parameters> = ref({
      predicate: null,
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
    const tableOptions = reactive({
      page: 1,
      sortBy: ['spatial_id'],
      sortDesc: [true],
    } as DataOptions);

    const headers = [
      { text: 'ID-Name', value: 'spatial_id' },
      // { text: 'Area', value: '' },
      { text: 'Data Type', value: 'subentry_type' },
    ];

    const searchResults = ref();

    const reveal = false;

    const updateResults = async () => {
      const res = await rgdSearch();
      searchResults.value = res.data.results;
      console.log(searchResults.value);
    };
    console.log(reveal);
    // updateResults();

    return {
      params,
      tableOptions,
      headers,
      searchResults,
      updateResults,
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
    height="900px"
  >
    <v-card-title>
      Sample Project
      <v-spacer />
      <v-card-actions>
        <v-btn
          v-if="searchResults"
          plain
          @click="reveal=true"
        >
          Show Results
        </v-btn>
      </v-card-actions>
    </v-card-title>
    <v-expand-transition>
      <v-card
        v-if="reveal"
        class="transition-fast-in-fast-out v-card--reveal"
        style="height: 100%;"
      >
        <v-data-table
          :headers="headers"
          :items="searchResults"
        />
        <v-card-actions class="pt-0">
          <v-btn
            text
            color="teal accent-4"
            @click="reveal = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Will be needed in second iteration -->
      <!-- <TabToolBar
      v-model="activeTab"
      :items="tabData"
      color="blue-grey darken-2"
      flat
    /> -->
      <v-form
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
    </v-expand-transition>
  </v-card>
</template>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
