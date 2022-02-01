<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import {
  defineComponent, watch, ref,
} from '@vue/composition-api';
import { rgdImagerySTAC } from '@/api/rest';
import { drawerContents } from '@/store';

export default defineComponent({
  name: 'MetadataDrawer',
  setup() {
    const fieldsShown = {
      spatial_id: 'Spatial ID',
      region_id: 'Region ID',
      subentry_type: 'Data type',
      type: 'Data type',
      mgrs: 'MGRS',
      model_content: 'Model Content',
      acquisition_date: 'Date Acquired',
      modified: 'Date Last Modified',
      created: 'Date Created in Database',
      start_date: 'Start Date',
      end_date: 'End Date',
      parent_raster: 'Parent Raster ID',
      area: 'Area (km)',
      instrumentation: 'Instrumentation',
      originator: 'Originator',
      num_bands: 'Number of Bands',
      resolution: 'Resolution',
      origin: 'Origin Coordinates',
      extent: 'Extent Coordinates',
      transform: 'Transform Matrix',
      cloud_cover: 'Cloud Coverage',
      comments: 'Comments',
      version: 'Version',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modifyValueByKey = (value: any, key: string) => {
      if (value === null) {
        return 'None';
      } if (key === 'parent_raster') {
        return value.id;
      } if (['acquisition_date', 'modified', 'created', 'start_date', 'end_date'].includes(key)) {
        return new Date(Date.parse(value)).toDateString();
      } if (typeof value === 'string') {
        return value;
      }
      return JSON.stringify(value, null, ' ');
    };

    const showDrawer = ref(false);
    const headers = ref([
      { text: 'Field name', value: 'key' },
      { text: 'Value', value: 'value' },
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metadata = ref<{ key: string; value: any }[]>([]);
    const copiedStac = ref(false);
    const stac = ref();

    watch(drawerContents, async () => {
      showDrawer.value = drawerContents.value !== undefined;
      if (showDrawer.value) {
        metadata.value = Object.entries(fieldsShown).filter(
          ([keyName]) => drawerContents.value[keyName] !== undefined,
        ).map(
          ([keyName, label]) => ({
            key: label,
            value: modifyValueByKey(drawerContents.value[keyName], keyName),
          }),
        );
        if (drawerContents.value.spatial_id) {
          stac.value = await rgdImagerySTAC(drawerContents.value.spatial_id);
          copiedStac.value = false;
        }
      }
    });

    return {
      showDrawer,
      drawerContents,
      headers,
      metadata,
      copiedStac,
      stac,
    };
  },
});

</script>

<template>
  <v-navigation-drawer
    v-if="showDrawer"
    class="drawer"
    width="350px"
    :value="showDrawer"
    color="blue-grey darken-4"
  >
    Metadata for {{ drawerContents.subentry_name || drawerContents.region_id }}
    <v-data-table
      :headers="headers"
      :items="metadata"
      hide-default-footer
      class="px-5"
    />
    <v-btn
      v-if="drawerContents.spatial_id"
      v-clipboard="() => stac"
      v-clipboard:success="() => copiedStac = true"
      block
      class="mt-5"
    >
      <v-icon>{{ copiedStac ?"mdi-check" :"mdi-content-copy" }}</v-icon>
      {{ copiedStac ?"STAC Copied" :"Copy STAC" }}
    </v-btn>
  </v-navigation-drawer>
</template>

<style scoped>
.drawer {
  position: absolute;
  left: calc(25vw - 5px);
  z-index: 1;
  padding: 30px 20px;
}
</style>
