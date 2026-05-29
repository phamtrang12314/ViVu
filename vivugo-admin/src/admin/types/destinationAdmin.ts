
export type DestinationAdmin = {
  destinationID: string;
  nameDes: string;
  region: string;
  location: string;
  country: string;
  imageUrl?: string;
};


export type DestinationAdminListParams = {
  page: number;
  size: number;
  search?: string;
  region?: string;
  location?: string;
};

export type DestinationDetailAdmin = {
  destinationID: string;
  nameDes: string;
  region: string;
  location: string;
  country: string;
  description?: string;
  images: string[];

  totalTours: number;
  activeTours: number;
  completedTours: number;
  upcomingTours: number;
  lastUsedDate?: string | null;
};

export type DestinationSave = {
  nameDes: string;
  region: string;
  location: string;
  country: string;
  imageUrls: string[];  
};
