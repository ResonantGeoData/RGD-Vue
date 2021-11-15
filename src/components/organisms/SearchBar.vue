<script lang="ts">
import {
  defineComponent, Ref, ref,
} from '@vue/composition-api';
import { Parameters } from '@/store/types';
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

    return {
      params,
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
    </v-card-title>
    <!-- Will be needed in second iteration -->
    <!-- <TabToolBar
      v-model="activeTab"
      :items="tabData"
      color="blue-grey darken-2"
      flat
    /> -->
    <v-form @submit.prevent="$emit('input', inputs)">
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
            class="mt-3"
          >
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
