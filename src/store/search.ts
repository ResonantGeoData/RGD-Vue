import { ref } from '@vue/composition-api';
import {
  rgdImagery, rgdSearch, basicRegionList,
} from '@/api/rest';
// eslint-disable-next-line import/no-unresolved
import { Polygon, MultiPolygon } from 'geojson';  // eslint-disable-line
import { drawerContents } from '@/store';
import {
  RGDResultList, SearchParameters, ResultsFilter, RegionResult,
} from './types';

export const regionsList = ref<RegionResult[]>();

export const regionsTotal = ref<number>();

export const geometryInputSelection = ref();

export const specifiedShape = ref<Polygon | MultiPolygon>({ type: 'Polygon', coordinates: [] });

export const drawnShape = ref<Polygon | MultiPolygon>({ type: 'Polygon', coordinates: [] });

export const searchResults = ref<RGDResultList>();

export const searchLimit = ref<number>(10);

export const searchOffset = ref<number>(0);

export const searchResultsTotal = ref<number>();

export const searchInstrumentation = ref<string|null>('');

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

export const searchParameters = ref<SearchParameters>({
  predicate: 'intersects',
  acquired: {
    startDate: null,
    endDate: null,
    startDateModal: false,
    endDateModal: false,
  },
});

export const updateResults = async () => {
  const res = await rgdSearch(
    searchLimit.value,
    searchOffset.value,
    specifiedShape.value,
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
  const res = await basicRegionList(searchLimit.value,
    searchOffset.value);
  regionsList.value = res.results;
  regionsTotal.value = res.count;
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