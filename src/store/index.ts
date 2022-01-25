import { ref } from '@vue/composition-api';
import {
  rgdImagery, rgdFootprint, rgdSearch, basicRegionList,
} from '@/api/rest';
import Vue from 'vue';
import {
  GeoJsonShape, RGDResultList, SearchParameters, ResultsFilter, RegionResult,
} from './types';

export const selectedTab = ref('search');

export const useMap = ref(false);

export const geoJsonShape = ref();

export const rasterArray = ref();

export const footprintIds = ref();

export const visibleFootprints = ref<Record<string, GeoJsonShape>>({});

export const visibleOverlayIds = ref();

export const specifiedShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const drawnShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const drawerContents = ref();

export const regionsList = ref<RegionResult[]>();

export const regionsTotal = ref<number>();

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

export const addFootprint = async (spatialId: number, region?: boolean) => {
  let key;
  let footprint;
  if (!region) {
    footprint = (await rgdFootprint(spatialId)).footprint;
    key = `result_${spatialId}`;
  } else {
    footprint = regionsList.value?.find((reg) => reg.id === spatialId)?.footprint;
    key = `region_${spatialId}`;
  }
  if (key && footprint) {
    visibleFootprints.value = { [key]: footprint, ...visibleFootprints.value };
  }
};

export const removeFootprint = (spatialId: number, region?: boolean) => {
  let key: string;
  if (!region) {
    key = `result_${spatialId}`;
  } else {
    key = `region_${spatialId}`;
  }
  if (visibleFootprints.value[key]) {
    visibleFootprints.value = Object.fromEntries(
      Object.entries(visibleFootprints.value).filter(([k]) => k !== key),
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addVisibleOverlay = (spatialId: number, region?: boolean) => {
  if (visibleOverlayIds.value === undefined) {
    visibleOverlayIds.value = [];
  }
  visibleOverlayIds.value.push(spatialId);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeVisibleOverlay = (spatialId: number, region?: boolean) => {
  visibleOverlayIds.value = visibleOverlayIds.value.filter((obj: number) => obj !== spatialId);
};

export const selectResultForMetadataDrawer = async (spatialId: number, region?: boolean) => {
  if (searchResults.value) {
    searchResults.value = searchResults.value.map(
      // eslint-disable-next-line @typescript-eslint/camelcase
      (entry) => Object.assign(entry, { show_metadata: false }),
    );
    if (!region) {
      const res = await rgdImagery(spatialId);
      drawerContents.value = res;
    }
  } if (regionsList.value) {
    regionsList.value = regionsList.value.map(
      // eslint-disable-next-line @typescript-eslint/camelcase
      (entry) => Object.assign(entry, { show_metadata: false }),
    );
    if (region) {
      drawerContents.value = regionsList.value.filter(
        (entry) => entry.id === spatialId,
      )[0].properties;
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const clearMetaDataDrawer = (_spatialId: number, _region?: boolean) => {
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

export const updateRegions = async () => {
  const res = await basicRegionList();
  regionsList.value = res.results;
  regionsTotal.value = res.count;
};

export const searchByRegion = async (region: RegionResult) => {
  console.log('SEARCH BY', region);
  await updateResults();
  selectedTab.value = 'results';
};
