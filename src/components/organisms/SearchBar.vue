<script lang="ts">
import { defineComponent } from '@vue/composition-api';
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
    // Will be needed in second iteration
    // const tabData = ['LatLong', 'Bounding Box', 'GeoJson'];
    // const activeTab = ref(0);
  },
});
</script>
<template>
  <v-card
    color="blue-grey darken-4"
    height="1200px"
  >
    <ToolBar
      color="blue-grey darken-2"
      flat
    />
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
    </v-form>
    <ToolBar
      text="Other Params"
      color="blue-grey darken-2"
      flat
    />
    <OtherParams />
  </v-card>
</template>
