export interface ProductAvailability {
  availableAtLocation: boolean;
  currentlySellable: boolean;
}

export interface LocationProducts {
  meetingRoom: ProductAvailability;
  coworkingDayPass: ProductAvailability;
  dedicatedOffice?: ProductAvailability;
}

export interface Location {
  _id: string;
  sfId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  products: LocationProducts;
}
