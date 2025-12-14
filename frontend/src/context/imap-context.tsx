"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// Updated Interface including Password
export interface ImapConfig {
  id: number;
  provider: string;
  email: string;
  password?: string; // Included as per your requirement
}

interface ImapContextType {
  activeAccount: ImapConfig | null;
  setActiveAccount: (account: ImapConfig | null) => void;
  isLoading: boolean;
}

const ImapContext = createContext<ImapContextType | undefined>(undefined)

export function ImapProvider({ children }: { children: React.ReactNode }) {
  const [activeAccount, setActiveAccountState] = useState<ImapConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 1. Load from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mailhub_active_account")
    if (stored) {
      try {
        setActiveAccountState(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse stored account", e)
      }
    }
    setIsLoading(false)
  }, [])

  // 2. Intercept set state to also save to LocalStorage
  const setActiveAccount = (account: ImapConfig | null) => {
    setActiveAccountState(account)
    if (account) {
      localStorage.setItem("mailhub_active_account", JSON.stringify(account))
    } else {
      localStorage.removeItem("mailhub_active_account")
    }
  }

  return (
    <ImapContext.Provider value={{ activeAccount, setActiveAccount, isLoading }}>
      {children}
    </ImapContext.Provider>
  )
}

export function useImap() {
  const context = useContext(ImapContext)
  if (context === undefined) {
    throw new Error("useImap must be used within an ImapProvider")
  }
  return context
}
