export interface IAppConfig {
	ParcelsPerQuery: number,
}

// @NOTE(mzalla) To call `api.thegraph.com`, we can only fetch up to a maximum
// of 1,000 items per query; by choosing a large parcel block size (30), we get
// close to 1,000 parcels per block query without going over this limit;
const ParcelBlockWidth = 4

const AppConfig: IAppConfig = {
	ParcelsPerQuery: ParcelBlockWidth * ParcelBlockWidth,
}

export default AppConfig
