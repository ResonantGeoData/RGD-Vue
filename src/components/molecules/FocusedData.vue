<script lang="ts">

import { defineComponent } from '@vue/composition-api';
import { updateTileLayer, updateTileLayerOpacity, tileImageParams } from '@/store/cesium/layers';
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
    const update = () => {
      updateTileLayer(props.focusedData.spatialId);
    };

    const updateOpacity = () => {
      updateTileLayerOpacity(
        props.focusedData.spatialId,
        tileImageParams[props.focusedData.spatialId].opacity as number,
      );
    };

    return {
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
          v-model="tileImageParams[focusedData.spatialId].image"
          label="Image"
          :items="focusedData.images"
          :item-value="'id'"
          :item-text="'name'"
          item-disabled="disabled"
          return-object
          outlined
          @input="$emit('input', tileImageParams[focusedData.spatialId].image), update()"
        />
        <v-select
          v-if="focusedData.bandsList"
          v-model="tileImageParams[focusedData.spatialId].index"
          label="Bands"
          clearable
          :items.sync="focusedData.bandsList"
          :item-text="'bandName'"
          :item-value="'index'"
          outlined
          @input="$emit('input', tileImageParams[focusedData.spatialId].index), update()"
        />
        <v-slider
          v-model="tileImageParams[focusedData.spatialId].opacity"
          label="Opacity"
          :step=".1"
          min="0"
          max="1"
          thumb-label
          track-color="#8EC13F"
          @input="$emit('input', tileImageParams[focusedData.spatialId].opacity), updateOpacity()"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
