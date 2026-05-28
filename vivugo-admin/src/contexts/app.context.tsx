import React, { createContext, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getAccessTokenFromLS, getProfileFromLS } from '../utils/auth'
import type { SimpleProfile } from '../types/user.type'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  profile: SimpleProfile | null
  setProfile: (profile: SimpleProfile | null) => void
  favoriteIds: Set<string>
  addFavoriteId: (tourId: string) => void
  removeFavoriteId: (tourId: string) => void
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  favoriteIds: new Set<string>(),
  addFavoriteId: () => null,
  removeFavoriteId: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<SimpleProfile | null>(initialAppContext.profile)
  const [favoriteIds, setFavoriteIds] = useState(new Set<string>())
  const queryClient = useQueryClient()

  const handleSetIsAuthenticated = (value: boolean) => {
    setIsAuthenticated(value)
    if (!value) {
      setProfile(null)
      setFavoriteIds(new Set<string>())
      queryClient.clear()
    }
  }

  const addFavoriteId = (tourId: string) => {
    setFavoriteIds((prevSet) => new Set(prevSet).add(tourId))
  }

  const removeFavoriteId = (tourId: string) => {
    setFavoriteIds((prevSet) => {
      const newSet = new Set(prevSet)
      newSet.delete(tourId)
      return newSet
    })
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated: handleSetIsAuthenticated,
        profile,
        setProfile,
        favoriteIds,
        addFavoriteId,
        removeFavoriteId
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
