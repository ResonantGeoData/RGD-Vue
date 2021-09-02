<script lang="ts">
import { defineComponent, inject } from '@vue/composition-api';
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
    if (oauthClient === undefined) {
      throw new Error('Must provide "oauthClient" into component.');
    }

    return { oauthClient };
  },
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
      light
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
      pt-0
      fluid
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-col
          cols="2"
        >
          <SearchBar />
        </v-col>
        <v-col cols="7">
          <CesiumViewer />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
