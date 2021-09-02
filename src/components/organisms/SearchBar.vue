<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import ToolBar from '../molecules/ToolBar.vue';

export default defineComponent({
  name: 'SearchBar',
  components: {
    ToolBar,
  },
  setup() {
    const tabData = ['LatLong', 'Bounding Box', 'GeoJson'];
    const text = 'Other Params';

    return {
      tabData,
      text,
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
      :items="tabData"
      color="blue-grey darken-2"
      flat
    />
    <v-row no-gutters>
      <v-col class="ma-1">
        <v-text-field
          label="Longitude(deg)"
          outlined
        />
      </v-col>
      <v-col class="ma-1">
        <v-text-field
          label="Latitdue(deg)"
          outlined
        />
      </v-col>
      <v-col
        cols="10"
        class="pl-1 pr-4"
      >
        <v-text-field
          label="Radius (m)"
          outlined
        />
      </v-col>
    </v-row>
    <ToolBar
      :text="text"
      color="blue-grey darken-2"
      flat
    />
  </v-card>
</template>
