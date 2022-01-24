<script lang="ts">

import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'DrawingMenu',
  props: {
    text: {
      type: String,
      required: false,
    },
  },
  inheritAttrs: false,
});

</script>

<template>
    <v-toolbar
      dense
      rounded
      floating
      absolute
      min-width="100px"
    >

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon small>mdi-cursor-default-outline</v-icon>
          </v-btn></template>
        <span>Exit Draw Mode</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon small>mdi-vector-square-edit</v-icon>
          </v-btn>
        </template>
        <span>Draw Polygon</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <v-icon small>mdi-trash-can-outline</v-icon>
        </v-btn>
        </template>
        <span>Delete Polygon</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon small>mdi-vector-polygon</v-icon>
          </v-btn>
        </template>
        <span>Toggle Search Polygon</span>
      </v-tooltip>

      <v-tooltip bottom>
       <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <v-icon small>mdi-content-copy</v-icon>
        </v-btn>
       </template>
       <span>Copy GeoJSON to Clipboard</span>
      </v-tooltip>

      <v-tooltip bottom>
       <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <v-icon small>mdi-magnify-plus-outline</v-icon>
        </v-btn>
       </template>
       <span>Zoom in</span>
      </v-tooltip>

      <v-tooltip bottom>
       <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <v-icon small>mdi-magnify-minus-outline</v-icon>
        </v-btn>
       </template>
       <span>Zoom out</span>
      </v-tooltip>

    </v-toolbar>
</template>

<style scoped>
  .v-toolbar {
    justify: center!important;
    margin: 4px 4px;
    background: rgba(15,15,15,0.3)!important;
  }
  .v-btn {
    color: #188DC8!important;
    background: white!important;
    margin: 0px 4px;
    min-width: 16px!important;
    padding: 0px 12px!important;
  }
</style>
