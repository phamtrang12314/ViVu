// (1) THÊM IMPORT: useEffect
import React, { createContext, useState, useEffect } from "react";
// (2) THÊM IMPORT: useQueryClient
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccessTokenFromLS, getProfileFromLS } from "../utils/auth";
import type { SimpleProfile } from "../types/user.type";
import { favoriteApi } from "../apis/favorite.api";

interface AppContextInterface {
    isAuthenticated: boolean;
    // (3) SỬA LỖI 1: Cập nhật chữ ký (signature) để khớp với hàm handleSetIsAuthenticated
    setIsAuthenticated: (value: boolean) => void;
    profile: SimpleProfile | null;
    // (4) SỬA LỖI 2: Cập nhật chữ ký để khớp với hàm handleSetProfile
    setProfile: (profile: SimpleProfile | null) => void;

    favoriteIds: Set<string>;
    addFavoriteId: (tourId: string) => void;
    removeFavoriteId: (tourId: string) => void;
}

const initialAppContext: AppContextInterface = {
    isAuthenticated: Boolean(getAccessTokenFromLS()),
    setIsAuthenticated: () => null,
    profile: getProfileFromLS(),
    setProfile: () => null,
    favoriteIds: new Set<string>(),
    addFavoriteId: () => null,
    removeFavoriteId: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        initialAppContext.isAuthenticated
    );
    const [profile, setProfile] = useState<SimpleProfile | null>(initialAppContext.profile);
    const [favoriteIds, setFavoriteIds] = useState(new Set<string>());
    const queryClient = useQueryClient();

    // (5) SỬA LỖI 3: Tách onSuccess ra khỏi useQuery
    const { data: favoriteIdData } = useQuery({
        queryKey: ["my-favorites-ids"],
        queryFn: async () => {
            const res = await favoriteApi.getMyFavoriteIds();
            return res.data;
        },
        enabled: isAuthenticated,
        staleTime: 300000,
        // onSuccess: (data: string[]) => { ... }, // Lỗi v5 nằm ở đây
    });

    // (6) THÊM useEffect để xử lý logic "onSuccess" cho React Query v5
    useEffect(() => {
        // Khi query thành công và favoriteIdData có dữ liệu
        if (favoriteIdData) {
            setFavoriteIds(new Set(favoriteIdData));
        }
    }, [favoriteIdData]); // Chạy mỗi khi data từ query thay đổi

    // (Code các hàm helper giữ nguyên)
    const addFavoriteId = (tourId: string) => {
        setFavoriteIds((prevSet) => new Set(prevSet).add(tourId));
    };

    const removeFavoriteId = (tourId: string) => {
        setFavoriteIds((prevSet) => {
            const newSet = new Set(prevSet);
            newSet.delete(tourId);
            return newSet;
        });
    };

    const handleSetIsAuthenticated = (value: boolean) => {
        setIsAuthenticated(value);
        if (value === false) {
            setProfile(null);
            setFavoriteIds(new Set<string>());
            queryClient.clear();
        }
    };

    const handleSetProfile = (profile: SimpleProfile | null) => {
        setProfile(profile);
        if (profile) {
            queryClient.invalidateQueries({ queryKey: ["my-favorites-ids"] });
        }
    };

    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated: handleSetIsAuthenticated, // Giờ đã khớp type
                profile,
                setProfile: handleSetProfile, // Giờ đã khớp type
                favoriteIds,
                addFavoriteId,
                removeFavoriteId,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

