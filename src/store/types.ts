export type GeoJsonShape = {
  type: string;
  coordinates: Array<Array<number>>;
}

export type RGDResultList = Array<{
  spatial_id: number;
  acquisition_date: string | null;
  instrumentation: string | null;
  outline: {
    type: string;
    coordinates: Array<Array<number>>;
  };
  subentry_type: string;
  subentry_name: string;
  show_footprint: boolean;
}>

export interface SearchParameters {
  predicate: string | null;
  acquired: {
    startDate: string | null;
    endDate: string | null;
    startDateModal?: boolean;
    endDateModal?: boolean;
  };
}

export interface ResultsFilter {
  distance: {
    min: string | null;
    max: string | null;
  };
  instrumentation: string | null;
  time: {
    startTime: string | null;
    endTime: string | null;
    startTimeModal?: boolean;
    endTimeModal?: boolean;
  };
}
