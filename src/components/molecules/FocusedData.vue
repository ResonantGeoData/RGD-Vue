<script lang="ts">

import { defineComponent, ref, watch } from '@vue/composition-api';
import { updateTileLayer, updateTileLayerOpacity } from '@/store/cesium';
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
      updateTileLayer(
        props.focusedData.spatialId,
        dataInfo.value.imageSelection.id,
        dataInfo.value.bandSelection.index,
      );
    };

    const updateOpacity = () => {
      updateTileLayerOpacity(props.focusedData.spatialId, dataInfo.value.opacity);
    };

    watch(props, () => {
      dataInfo.value.imageSelection.name = props.focusedData.images[0].name as string;
      dataInfo.value.imageSelection.id = props.focusedData.images[0].id as unknown as number;
      update();
    }, { deep: true });

    return {
      dataInfo,
      update,
      updateOpacity,
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
          v-model="dataInfo.imageSelection"
          label="Image"
          clearable
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
          v-model="dataInfo.bandSelection"
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
          @input="update()"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
