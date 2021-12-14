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
}>

export interface Parameters {
  predicate: string | null;
  distance: {
    min: string | null;
    max: string | null;
  };
  instrumentation: string | null;
  dateAndTime: {
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    startDateModal?: boolean;
    endDateModal?: boolean;
    startTimeModal?: boolean;
    endTimeModal?: boolean;
  };
}
