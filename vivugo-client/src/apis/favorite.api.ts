import http from "../utils/http";

export const favoriteApi = {
  getMyFavoriteIds: () => http.get<string[]>("favorites/my-ids"),
};
