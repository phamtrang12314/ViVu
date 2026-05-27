import http from "../../utils/http";
import type { ContactMessageListParams, ContactMessageListResponse } from "../types/contactAdmin.type";

const URL = "/admin/contact-messages";

export const contactAdminApi = {
  getAllMessages: (params: ContactMessageListParams) => {
    return http.get<ContactMessageListResponse>(URL, {
      params: {
        page: params.page,
        size: params.size,
        search: params.search || undefined,
      },
    });
  },
};
