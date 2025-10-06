'use client';

import { useState, ChangeEvent } from 'react';
import { Search, Filter, Calendar, MapPin } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';

interface EventSearchBarProps {
    onSearch?: (query: string) => void;
    onFilter?: (filters: EventFilters) => void;
    placeholder?: string;
    className?: string;
}

interface EventFilters {
    status?: 'all' | 'upcoming' | 'completed' | 'cancelled';
    location?: string;
    dateRange?: {
        start?: Date;
        end?: Date;
    };
}

export function EventSearchBar({
    onSearch,
    onFilter,
    placeholder = "Search events...",
    className = ""
}: EventSearchBarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<EventFilters>({
        status: 'all'
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    const handleFilterChange = (newFilters: Partial<EventFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFilter?.(updatedFilters);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8D99AE]" />
                    <Input
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    variant={showFilters ? "primary" : "ghost"}
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                >
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <Card>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                                    Status
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterChange({
                                        status: e.target.value as EventFilters['status']
                                    })}
                                    className="w-full px-3 py-2 border border-[#8D99AE]/20 rounded-lg bg-white text-[#2B2D42] focus:outline-none focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                                >
                                    <option value="all">All Events</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Location Filter */}
                            <div>
                                <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                                    <MapPin className="inline h-4 w-4 mr-1" />
                                    Location
                                </label>
                                <Input
                                    placeholder="Enter location..."
                                    value={filters.location || ''}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleFilterChange({ location: e.target.value })}
                                />
                            </div>

                            {/* Date Filter */}
                            <div>
                                <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                                    <Calendar className="inline h-4 w-4 mr-1" />
                                    Date Range
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        placeholder="Start date"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFilterChange({
                                            dateRange: {
                                                ...filters.dateRange,
                                                start: e.target.value ? new Date(e.target.value) : undefined
                                            }
                                        })}
                                        className="text-sm"
                                    />
                                    <Input
                                        type="date"
                                        placeholder="End date"
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFilterChange({
                                            dateRange: {
                                                ...filters.dateRange,
                                                end: e.target.value ? new Date(e.target.value) : undefined
                                            }
                                        })}
                                        className="text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#8D99AE]/20">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    const resetFilters = { status: 'all' as const };
                                    setFilters(resetFilters);
                                    onFilter?.(resetFilters);
                                }}
                                className="text-sm"
                            >
                                Clear Filters
                            </Button>
                            <Button
                                onClick={() => setShowFilters(false)}
                                className="text-sm"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}