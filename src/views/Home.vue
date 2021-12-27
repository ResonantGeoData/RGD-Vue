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
        window.location.reload();
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
      <v-img
        src="RGD_Logo.png"
        height="calc(100% - 5px)"
        contain
        class="flex-shrink-1 ml-5"
        position="left"
      />
      <v-spacer />
      <v-btn
        v-if="oauthClient.isLoggedIn"
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
      <v-overlay
        :absolute="true"
        :value="!oauthClient.isLoggedIn"
        :opacity="0.8"
        style="margin-top: -30vh"
      >
        <v-btn
          color="teal accent-4"
          @click="logInOrOut"
        >
          Log in to Continue
        </v-btn>
      </v-overlay>
    </v-container>
  </v-main>
</template>
