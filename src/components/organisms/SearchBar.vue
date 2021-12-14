<script lang="ts">
import {
  defineComponent, Ref, ref, reactive, watch,
} from '@vue/composition-api';
import { Parameters } from '@/store/types';
import { geoShape, searchResults } from '@/store';
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
    const geoJsonShape = ref();

    // const searchResults = ref();

    const reveal = false;

    const baseLink = `${process.env.VUE_APP_API_ROOT}rgd/spatial_entries/`;

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

    const tableOptions = reactive({
      page: 1,
      sortBy: ['spatial_id'],
      sortDesc: [true],
    } as DataOptions);

    const headers = [
      { text: 'ID-Name', value: 'id-name' },
      { text: 'Data Type', value: 'subentry_type' },
    ];

    watch(geoShape, () => {
      if (geoShape.value.type) {
        geoJsonShape.value = JSON.stringify(geoShape.value);
      }
    }, { deep: true });
    return {
      params,
      tableOptions,
      headers,
      searchResults,
      updateResults,
      reveal,
      baseLink,
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
          @click="reveal=true"
        >
          Show Results
        </v-btn>
      </v-card-actions>
    </v-card-title>
    <v-expand-transition>
      <template>
        <v-card
          v-if="reveal"
          class="transition-fast-in-fast-out v-card--reveal"
          style="height: 100%;"
        >
          <v-data-table
            :headers="headers"
            :items="searchResults"
            class="resultsTable"
          >
            <!-- eslint-disable-next-line -->
            <template #item.id-name="{item}">
              <a :href="`${baseLink}${item.spatial_id}`">
                {{ item.spatial_id }} - {{ item.subentry_name }}
              </a>
            </template>
          </v-data-table>
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
      </template>
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
.resultsTable td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 75px;
}
</style>
