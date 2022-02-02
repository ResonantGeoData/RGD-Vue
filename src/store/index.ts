import { ref } from '@vue/composition-api';

export const selectedTab = ref('regions');

export const drawerContents = ref();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clearMetaDataDrawer = (_spatialId?: number, _region?: boolean) => {
  drawerContents.value = undefined;
};
