<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
} from '@vue/composition-api';
import OAuthClient from '@girder/oauth-client';
import CesiumViewer from '../components/organisms/CesiumViewer.vue';
import SearchBar from '../components/organisms/SearchBar.vue';

export default defineComponent({
  components: {
    CesiumViewer,
    SearchBar,
  },
  setup() {
    const oauthClient = inject<OAuthClient>('oauthClient');
    const params = ref({
      latitude: null as number | null,
      longitude: null as number | null,
      height: null as number | null,
    });

    if (oauthClient === undefined) {
      throw new Error('Must provide "oauthClient" into component.');
    }

    return {
      oauthClient,
      params,
    };
  },
  // TODO covert to full composition API
  computed: {
    loginText(): string {
      return this.oauthClient.isLoggedIn ? 'Logout' : 'Login';
    },
  },
  methods: {
    logInOrOut(): void {
      if (this.oauthClient.isLoggedIn) {
        this.oauthClient.logout();
      } else {
        this.oauthClient.redirectToLogin();
      }
    },
  },
});
</script>

<template>
  <v-main>
    <v-app-bar
      app
      dense
    >
      <v-spacer />
      <v-btn
        text
        @click="logInOrOut"
      >
        {{ loginText }}
      </v-btn>
    </v-app-bar>
    <v-container
      pa-0
      fluid
      fill-height
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-col
          cols="3"
        >
          <SearchBar
            v-model="params"
          />
        </v-col>
        <v-col
          cols="9"
        >
          <CesiumViewer
            :location="params"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
