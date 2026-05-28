export interface TourTypeAdminParams {
  id?: string;
  name?: string;

}

export interface TourTypeAdmin {
  tourTypeID: string;
  nameType: string;
  description?: string | null;
  totalTours: number;
}

export interface TourTypeDetailAdmin extends TourTypeAdmin {
  createdAt: string;
  updateDate: string;
  // option: danh sách tên tour dùng loại tour này
  tourTitles: string[];
}

export interface TourTypeSave {
  nameType: string;
  description?: string;
}

export interface TourTypeAdminListParams {
  page: number;
  size: number;
  search?: string; // tìm theo nameType
}

