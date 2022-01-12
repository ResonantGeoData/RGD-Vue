<script lang="ts">
import { defineComponent, watch, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'FocusedData',
  props: {
    imageList: {
      type: Array,
    },
    bands: {
      type: Object,
    },
    rasterTitle: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const bandList: any[] = [];
    const currentBand = ref();
    const bandSelection = ref();

    watch(props, () => {
      currentBand.value = props.bands;
      console.log(currentBand);
      console.log(props.bands);
      // eslint-disable-next-line no-unused-expressions
      Object.keys(currentBand.value).forEach((key) => {
        bandList.push(currentBand.value[key].interpretation);
      });
      console.log(bandList);
    }, { deep: true });

    return {
      bandList,
      bandSelection,
    };
  },

});

</script>

<template>
  <v-card>
    <v-card-title>
      {{ rasterTitle }}
    </v-card-title>
    <v-row
      justify="center"
    >
      <v-col
        cols="10"
      >
        <v-select
          label="Image"
          outlined
        />
        <v-select
          v-model="bandSelection"
          label="Bands"
          :items.sync="bandList"
          outlined
        />
        <v-slider
          label="Opacity"
          track-color="#8EC13F"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
