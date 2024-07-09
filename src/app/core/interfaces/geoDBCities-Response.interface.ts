export interface GeoDBCities {
  data:     Datum[];
  links:    Link[];
  metadata: Metadata;
}

export interface Datum {
  id:          number;
  wikiDataId:  string;
  city:        string;
  name:        string;
  country:     string;
  countryCode: string;
  region:      string;
  regionCode:  string;
  regionWdId:  string;
  latitude:    number;
  longitude:   number;
  population:  number;
}


export interface Link {
  rel:  string;
  href: string;
}

export interface Metadata {
  currentOffset: number;
  totalCount:    number;
}