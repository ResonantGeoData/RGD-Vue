import { ref } from '@vue/composition-api';
import { rgdFootprint, rgdSearch } from '@/api/rest';
import {
  GeoJsonShape, RGDResultList, SearchParameters, ResultsFilter,
} from './types';

export const useMap = ref(false);

export const geoJsonShape = ref();

export const footPrints = ref();

export const footPrintFlag = ref(false);

export const specifiedShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const drawnShape = ref<GeoJsonShape>({ type: '', coordinates: [] });

export const searchResults = ref<RGDResultList>();

export const searchLimit = ref<number>(10);

export const searchOffset = ref<number>(0);

export const searchResultsTotal = ref<number>();

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

const footPrintFlagToggle = () => {
  if (footPrintFlag.value === true) {
    footPrintFlag.value = false;
  } else {
    footPrintFlag.value = true;
  }
};

export const updateFootPrints = async () => {
  const resArray: any[] = [];
  const promiseList: Promise<unknown>[] = [];
  const getFootPrints = async (current: { spatial_id: number }) => {
    const res = await rgdFootprint(current.spatial_id);
    resArray.push(res.data.footprint);
    footPrints.value = resArray;
  };
  if (searchResults.value) {
    for (let i = 0; i < searchResults.value?.length; i += 1) {
      const currentRequest = searchResults.value[i];
      promiseList.push(getFootPrints(currentRequest));
    }
  }
  await Promise.all(promiseList);
  footPrintFlagToggle();
};

export const updateResults = async () => {
  const res = await rgdSearch(
    searchLimit.value,
    searchOffset.value,
    geoJsonShape.value,
    searchParameters.value.predicate,
    searchParameters.value.acquired.startDate,
    searchParameters.value.acquired.endDate,

  );
  searchResults.value = res.data.results;
  searchResultsTotal.value = res.data.count;
  updateFootPrints();
};
