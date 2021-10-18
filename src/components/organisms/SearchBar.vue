<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api';
import ToolBar from '../molecules/ToolBar.vue';
import TabToolBar from '../molecules/TabToolBar.vue';
import GeoJsonForm from '../molecules/GeoJsonForm.vue';
import BoundingBoxForm from '../molecules/BoundingBoxForm.vue';
import LatLongForm from '../molecules/LatLongForm.vue';

export default defineComponent({
  name: 'SearchBar',
  components: {
    ToolBar,
    TabToolBar,
    GeoJsonForm,
    BoundingBoxForm,
    LatLongForm,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const tabData = ['LatLong', 'Bounding Box', 'GeoJson'];
    const text = 'Other Params';
    const activeTab = ref(0);

    const geoJson = ref();
    const predicate = [
      'within',
      'contains',
      'crosses',
      'disjoint',
      'equals',
      'intersects',
      'overlaps',
      'touches',
    ];

    return {
      tabData,
      text,
      activeTab,
      geoJson,
      predicate,
    };
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
    <TabToolBar
      v-model="activeTab"
      :items="tabData"
      color="blue-grey darken-2"
      flat
    />
    <v-form @submit.prevent="$emit('input', inputs)">
      <LatLongForm
        v-if="activeTab === 0"
      />
      <BoundingBoxForm
        v-if="activeTab === 1"
      />
      <GeoJsonForm
        v-if="activeTab === 2"
      />
    </v-form>
    <ToolBar
      :text="text"
      color="blue-grey darken-2"
      flat
    />
    <v-row
      justify="center"
    >
      <v-col
        cols="11"
        class="mt-3"
      >
        <v-select
          :items="predicate"
          label="Predicate"
          outlined
        />
      </v-col>
    </v-row>
  </v-card>
</template>
