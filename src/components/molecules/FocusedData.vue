<script lang="ts">

import { defineComponent, ref } from '@vue/composition-api';
import { updateTileLayer, updateTileLayerOpacity, tileImageParams } from '@/store/cesium';
import { FocusedDataType } from '@/store/types';

export default defineComponent({
  name: 'FocusedData',
  props: {
    focusedData: {
      type: Object as () => FocusedDataType,
      required: true,
    },
  },
  setup(props) {
    const dataInfo = ref({
      bandSelection: {
        index: 0,
      },
      imageSelection: {
        id: 0,
        name: '',
      },
      opacity: 1,
    });

    const update = () => {
      updateTileLayer(props.focusedData.spatialId);
    };

    const updateOpacity = () => {
      updateTileLayerOpacity(props.focusedData.spatialId, dataInfo.value.opacity);
    };

    return {
      dataInfo,
      update,
      updateOpacity,
      tileImageParams,
    };
  },

});

</script>

<template>
  <v-card>
    <v-card-title>
      {{ focusedData.title }}
    </v-card-title>
    <v-row
      justify="center"
    >
      <v-col
        cols="10"
      >
        <v-select
          v-if="focusedData.images"
          v-model="tileImageParams[focusedData.spatialId]"
          label="Image"
          :items="focusedData.images"
          :item-value="'id'"
          :item-text="'name'"
          item-disabled="disabled"
          return-object
          outlined
          @input="update()"
        />
        <v-select
          v-if="focusedData.bandsList && focusedData.bandsList.length !==0"
          v-model="tileImageParams[focusedData.spatialId]"
          label="Bands"
          clearable
          :items.sync="focusedData.bandsList"
          :item-text="'name'"
          :item-value="'index'"
          outlined
          return-object
          @input="update()"
        />
        <v-slider
          v-model="dataInfo.opacity"
          label="Opacity"
          :step=".1"
          min="0"
          max="1"
          thumb-label
          track-color="#8EC13F"
          @input="updateOpacity()"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
