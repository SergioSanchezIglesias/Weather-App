export interface WeatherResponse {
  city_name:    string;
  country_code: string;
  data:         DatumWeather[];
  lat:          number;
  lon:          number;
  state_code:   string;
  timezone:     string;
}

export interface DatumWeather {
  app_temp:        number;
  clouds:          number;
  clouds_hi:       number;
  clouds_low:      number;
  clouds_mid:      number;
  datetime:        string;
  dewpt:           number;
  dhi:             number;
  dni:             number;
  ghi:             number;
  ozone:           number;
  pod:             string;
  pop:             number;
  precip:          number;
  pres:            number;
  rh:              number;
  slp:             number;
  snow:            number;
  snow_depth:      number;
  solar_rad:       number;
  temp:            number;
  timestamp_local: Date;
  timestamp_utc:   Date;
  ts:              number;
  uv:              number;
  vis:             number;
  weather:         Weather;
  wind_cdir:       string;
  wind_cdir_full:  string;
  wind_dir:        number;
  wind_gust_spd:   number;
  wind_spd:        number;
}

export interface Weather {
  icon:        string;
  description: string;
  code:        number;
}