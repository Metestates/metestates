import { Coordinate } from '../types/coordinate'

export interface IAppConfig {
	ParcelPixelWidth: number;
	ParcelPixelMinWidth: number;
	ParcelPixelMaxWidth: number;
	ParcelBlockWidth: number,
	ParcelsPerQuery: number,
	Origin: Coordinate;
	PanningStep: number;
}

// @NOTE(mzalla) To call `api.thegraph.com`, we can only fetch up to a maximum
// of 1,000 items per query; by choosing a large parcel block size (30), we get
// close to 1,000 parcels per block query without going over this limit;
const ParcelBlockWidth = 30

const AppConfig: IAppConfig = {
	ParcelPixelWidth: 32,
	ParcelPixelMinWidth: 14,
	ParcelPixelMaxWidth: 80,
	ParcelBlockWidth,
	ParcelsPerQuery: ParcelBlockWidth * ParcelBlockWidth,
	Origin: { x: 0, y: 0 },
	PanningStep: 3,
}

export default AppConfig
