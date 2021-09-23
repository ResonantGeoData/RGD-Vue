<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;1,200;1,300;1,400;1,600;1,700&display=swap');

$body-font-family: 'Nunito Sans';
$title-font: 'Nunito Sans';

.v-application{
  font-family: $body-font-family !important;
    .title{
      font-family: $title-font !important;
    }
}
</style>
