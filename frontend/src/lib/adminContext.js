"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuthStore } from "./authStore";
import { api } from "./api";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState("draft"); // 'draft' | 'my-posts'
  const [myPosts, setMyPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [startNewDraftCallback, setStartNewDraftCallback] = useState(null);

  const fetchMyPosts = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoadingPosts(true);
    try {
      const data = await api.getMyPosts();
      if (data && data.posts) {
        setMyPosts(data.posts);
      }
    } catch (err) {
      console.error("Failed to fetch author posts in context:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyPosts();
    }
  }, [isAuthenticated, fetchMyPosts]);

  const selectDraftTab = useCallback(() => {
    setActiveTab("draft");
    if (startNewDraftCallback) {
      startNewDraftCallback();
    }
  }, [startNewDraftCallback]);

  const selectMyPostsTab = useCallback(() => {
    setActiveTab("my-posts");
    fetchMyPosts();
  }, [fetchMyPosts]);

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        myPosts,
        setMyPosts,
        myPostsCount: myPosts.length,
        isLoadingPosts,
        fetchMyPosts,
        selectDraftTab,
        selectMyPostsTab,
        registerStartNewDraftCallback: setStartNewDraftCallback,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    // Return a safe fallback if accessed outside provider
    return {
      activeTab: "draft",
      setActiveTab: () => {},
      myPosts: [],
      setMyPosts: () => {},
      myPostsCount: 0,
      isLoadingPosts: false,
      fetchMyPosts: () => {},
      selectDraftTab: () => {},
      selectMyPostsTab: () => {},
      registerStartNewDraftCallback: () => {},
    };
  }
  return context;
}
