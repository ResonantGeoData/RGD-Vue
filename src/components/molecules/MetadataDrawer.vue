<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import {
  defineComponent,
} from '@vue/composition-api';

import { drawerContents } from '@/store';

export default defineComponent({
  name: 'MetadataDrawer',
  setup() {
    const fieldsShown = {
      spatial_id: 'Spatial ID',
      subentry_type: 'Data type',
      acquisition_date: 'Date Acquired',
      modified: 'Date Last Modified',
      parent_raster: 'Parent Raster ID',
      area: 'Area (km)',
      instrumentation: 'Instrumentation',
      num_bands: 'Number of Bands',
      resolution: 'Resolution',
      origin: 'Origin Coordinates',
      extent: 'Extent Coordinates',
      transform: 'Transform Matrix',
      cloud_cover: 'Cloud Coverage',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modifyValueByKey = (value: any, key: string) => {
      if (key === 'parent_raster') {
        return value.id;
      } if (Date.parse(value)) {
        return new Date(Date.parse(value)).toDateString();
      } if (typeof value === 'string') {
        return value;
      }
      return JSON.stringify(value, null, ' ');
    };

    const headers = [
      { text: 'Field name', value: 'key' },
      { text: 'Value', value: 'value' },
    ];
    const metadata = Object.entries(fieldsShown).map(([keyName, label]) => {
      if (drawerContents.value[keyName]) {
        return {
          key: label,
          value: modifyValueByKey(drawerContents.value[keyName], keyName),
        };
      } if (drawerContents.value[keyName] === null) {
        return {
          key: label,
          value: 'None',
        };
      }
      return undefined;
    }).filter((row) => row !== undefined);

    return {
      drawerContents,
      headers,
      metadata,
    };
  },
});

</script>

<template>
  <v-navigation-drawer
    class="drawer"
    width="500px"
    :value="drawerContents !== undefined"
  >
    Metadata for {{ drawerContents.subentry_name }}
    <v-data-table
      :headers="headers"
      :items="metadata"
      hide-default-footer
    />
  </v-navigation-drawer>
</template>

<style scoped>
.drawer {
  position: absolute;
  left: calc(25vw - 5px);
  z-index: 1;
  padding: 75px 20px;
}
</style>
