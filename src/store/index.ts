import { ref } from '@vue/composition-api';
import { rgdImagery, rgdSearch } from '@/api/rest';
import {
  GeoJsonShape, RGDResultList, SearchParameters, ResultsFilter, ImageryResult,
} from './types';

export const useMap = ref(false);

export const geoJsonShape = ref();

export const rasterArray = ref();

export const footprintIds = ref();

export const visibleOverlayIds = ref();

export const specifiedShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const drawnShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const drawerContents = ref();

export const searchResults = ref<RGDResultList>();

export const searchLimit = ref<number>(10);

export const searchOffset = ref<number>(0);

export const searchResultsTotal = ref<number>();

export const searchInstrumentation = ref<string|null>('');

export const searchParameters = ref<SearchParameters>({
  predicate: 'intersects',
  acquired: {
    startDate: null,
    endDate: null,
    startDateModal: false,
    endDateModal: false,
  },
});

export const resultsFilter = ref<ResultsFilter>({
  distance: {
    min: null,
    max: null,
  },
  instrumentation: null,
  time: {
    startTime: null,
    endTime: null,
    startTimeModal: false,
    endTimeModal: false,
  },
});

export const addFootprint = (spatialId: number) => {
  if (footprintIds.value === undefined) {
    footprintIds.value = [];
  }
  footprintIds.value.push(spatialId);
};

export const removeFootprint = (spatialId: number) => {
  footprintIds.value = footprintIds.value.filter((obj: number) => obj !== spatialId);
};

export const addVisibleOverlay = (spatialId: number) => {
  if (visibleOverlayIds.value === undefined) {
    visibleOverlayIds.value = [];
  }
  visibleOverlayIds.value.push(spatialId);
};

export const removeVisibleOverlay = (spatialId: number) => {
  visibleOverlayIds.value = visibleOverlayIds.value.filter((obj: number) => obj !== spatialId);
};


export const selectResultForMetadataDrawer = async (spatialId: number) => {
  if (searchResults.value) {
    searchResults.value = searchResults.value.map(
      // eslint-disable-next-line @typescript-eslint/camelcase
      (entry) => Object.assign(entry, { show_metadata: false }),
    );
  }
  const res = await rgdImagery(spatialId);
  drawerContents.value = res;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clearMetaDataDrawer = (_spatialId: number) => {
  drawerContents.value = undefined;
};


export const updateResults = async () => {
  const res = await rgdSearch(
    searchLimit.value,
    searchOffset.value,
    geoJsonShape.value,
    searchParameters.value.predicate,
    searchParameters.value.acquired.startDate,
    searchParameters.value.acquired.endDate,
    resultsFilter.value.distance.min,
    resultsFilter.value.distance.max,
    resultsFilter.value.instrumentation,
    resultsFilter.value.time.startTime,
    resultsFilter.value.time.endTime,

  );
  searchResults.value = res.data.results;
  searchResultsTotal.value = res.data.count;
};

export const createRasterArray = async () => {
  // const resArr: any[] = [];
  // const getRasterImagery = async (current: { spatial_id: number }) => {
  //   const res = await rgdImagery(current.spatial_id);
  //   resArr.push(res.data);
  //   rasterArray.value = resArr;
  // };
  // if (searchResults.value) {
  //   for (let i = 0; i < searchResults.value?.length; i += 1) {
  //     const currentRequest = searchResults.value[i];
  //     getRasterImagery(currentRequest);
  //   }
  // }
};
