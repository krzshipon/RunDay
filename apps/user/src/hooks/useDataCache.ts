'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    key: string;
}

interface UseCacheOptions {
    cacheTime?: number; // Cache time in milliseconds (default: 5 minutes)
    staleTime?: number; // Stale time in milliseconds (default: 1 minute)
    persistToStorage?: boolean; // Whether to persist to localStorage
}

/**
 * Global data cache to prevent unnecessary API calls on tab switches
 * Maintains data state across component re-renders and tab switches
 */
class DataCache {
    private cache = new Map<string, CacheEntry<any>>();
    private subscribers = new Map<string, Set<() => void>>();
    private storagePrefix = 'runday_user_cache_';

    // Get cached data
    get<T>(key: string): CacheEntry<T> | null {
        // First check memory cache
        let entry = this.cache.get(key);
        
        // If not in memory, try localStorage
        if (!entry) {
            try {
                const stored = localStorage.getItem(this.storagePrefix + key);
                if (stored) {
                    entry = JSON.parse(stored);
                    // Restore to memory cache
                    if (entry) {
                        this.cache.set(key, entry);
                    }
                }
            } catch (error) {
                console.warn('Failed to load cache from localStorage:', error);
            }
        }

        return entry || null;
    }

    // Set cached data
    set<T>(key: string, data: T, persistToStorage = true): void {
        const entry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            key
        };

        this.cache.set(key, entry);

        // Persist to localStorage if requested
        if (persistToStorage) {
            try {
                localStorage.setItem(this.storagePrefix + key, JSON.stringify(entry));
            } catch (error) {
                console.warn('Failed to save cache to localStorage:', error);
            }
        }

        // Notify subscribers
        const subs = this.subscribers.get(key);
        if (subs) {
            subs.forEach(callback => callback());
        }
    }

    // Check if data is fresh
    isFresh(key: string, staleTime: number): boolean {
        const entry = this.get(key);
        if (!entry) return false;
        
        return Date.now() - entry.timestamp < staleTime;
    }

    // Check if data exists (even if stale)
    has(key: string): boolean {
        return this.get(key) !== null;
    }

    // Subscribe to cache changes
    subscribe(key: string, callback: () => void): () => void {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        
        this.subscribers.get(key)!.add(callback);

        // Return unsubscribe function
        return () => {
            const subs = this.subscribers.get(key);
            if (subs) {
                subs.delete(callback);
                if (subs.size === 0) {
                    this.subscribers.delete(key);
                }
            }
        };
    }

    // Clear specific key
    clear(key: string): void {
        this.cache.delete(key);
        try {
            localStorage.removeItem(this.storagePrefix + key);
        } catch (error) {
            console.warn('Failed to clear cache from localStorage:', error);
        }
    }

    // Clear all cache
    clearAll(): void {
        this.cache.clear();
        // Clear localStorage items with our prefix
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.storagePrefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Failed to clear cache from localStorage:', error);
        }
    }
}

// Global cache instance
const globalCache = new DataCache();

/**
 * Hook to use cached data with automatic refresh prevention on tab switches
 */
export function useDataCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: UseCacheOptions = {}
) {
    const {
        cacheTime = 300000, // 5 minutes
        staleTime = 60000,  // 1 minute
        persistToStorage = true
    } = options;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const isMountedRef = useRef(true);
    const isTabVisibleRef = useRef(true);

    // Handle tab visibility to prevent updates on tab switches
    useEffect(() => {
        const handleVisibilityChange = () => {
            isTabVisibleRef.current = !document.hidden;
            console.log(`[DataCache] Tab visibility changed for ${key}:`, isTabVisibleRef.current ? 'visible' : 'hidden');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [key]);

    // Load data function
    const loadData = useCallback(async (force = false) => {
        // Skip loading if tab switching prevention is active and not forced
        if (!force && !isTabVisibleRef.current) {
            console.log(`[DataCache] Skipping load for ${key} - tab not visible`);
            return;
        }

        // Check if we have fresh cached data
        if (!force && globalCache.isFresh(key, staleTime)) {
            const cached = globalCache.get<T>(key);
            if (cached) {
                console.log(`[DataCache] Using fresh cached data for ${key}`);
                setData(cached.data);
                setLoading(false);
                setError(null);
                return;
            }
        }

        // Check if we have any cached data (even if stale) to show while loading
        const cachedEntry = globalCache.get<T>(key);
        if (cachedEntry && !force) {
            console.log(`[DataCache] Using stale cached data for ${key} while refreshing`);
            setData(cachedEntry.data);
            setError(null);
        }

        try {
            setLoading(true);
            console.log(`[DataCache] Fetching fresh data for ${key}`);
            
            const freshData = await fetcher();
            
            if (isMountedRef.current) {
                setData(freshData);
                setError(null);
                globalCache.set(key, freshData, persistToStorage);
                console.log(`[DataCache] Fresh data cached for ${key}`);
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch data');
            console.error(`[DataCache] Error fetching data for ${key}:`, error);
            
            if (isMountedRef.current) {
                setError(error);
                // If we have cached data, keep showing it despite the error
                if (!cachedEntry) {
                    setData(null);
                }
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, [key, fetcher, staleTime, persistToStorage]);

    // Initial load
    useEffect(() => {
        // Try to load from cache first
        const cachedEntry = globalCache.get<T>(key);
        if (cachedEntry) {
            console.log(`[DataCache] Initial load from cache for ${key}`);
            setData(cachedEntry.data);
            setLoading(false);
            
            // If cache is stale, refresh in background
            if (!globalCache.isFresh(key, staleTime)) {
                console.log(`[DataCache] Cache stale for ${key}, refreshing in background`);
                loadData(false);
            }
        } else {
            // No cache, load fresh data
            loadData(true);
        }

        // Subscribe to cache changes
        const unsubscribe = globalCache.subscribe(key, () => {
            const entry = globalCache.get<T>(key);
            if (entry && isMountedRef.current) {
                setData(entry.data);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [key, loadData, staleTime]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Manual refresh function
    const refresh = useCallback(() => {
        return loadData(true);
    }, [loadData]);

    // Clear cache function
    const clearCache = useCallback(() => {
        globalCache.clear(key);
        setData(null);
        setLoading(true);
        setError(null);
    }, [key]);

    return {
        data,
        loading,
        error,
        refresh,
        clearCache,
        isStale: !globalCache.isFresh(key, staleTime),
        isCached: globalCache.has(key)
    };
}

// Export cache instance for direct access
export { globalCache };

// Helper function to clear all cache (useful for logout)
export function clearAllCache(): void {
    globalCache.clearAll();
}