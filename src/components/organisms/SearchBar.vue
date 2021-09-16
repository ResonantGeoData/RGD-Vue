<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api';
import ToolBar from '../molecules/ToolBar.vue';

export default defineComponent({
  name: 'SearchBar',
  components: {
    ToolBar,
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
    const inputs = reactive({
      longitude: null,
      latitude: null,
      height: null,
    });

    return {
      tabData,
      text,
      activeTab,
      inputs,
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
    <ToolBar
      v-model="activeTab"
      :items="tabData"
      color="blue-grey darken-2"
      flat
    />
    <v-form @submit.prevent="$emit('input', inputs)">
      <v-row
        v-if="activeTab === 0"
        no-gutters
        justify="center"
      >
        <v-col
          cols="5"
          class="mr-3 mt-3"
        >
          <v-text-field
            v-model.number="inputs.longitude"
            label="Longitude(deg)"
            outlined
          />
        </v-col>
        <v-col
          cols="5"
          class="ml-3 mt-3"
        >
          <v-text-field
            v-model.number="inputs.latitude"
            label="Latitude(deg)"
            outlined
          />
        </v-col>
        <v-col
          cols="9"
          class="pl-1 pr-4"
        >
          <v-text-field
            v-model.number="inputs.height"
            label="Height (m)"
            outlined
          />
        </v-col>
        <v-btn
          type="submit"
          color="teal accent-4"
          min-height="56px"
          max-width="56px"
          min-width="unset"
        >
          <v-icon
            large
          >
            mdi-crosshairs-gps
          </v-icon>
        </v-btn>
      </v-row>
    </v-form>
    <ToolBar
      :text="text"
      color="blue-grey darken-2"
      flat
    />
  </v-card>
</template>
