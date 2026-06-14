"use client";

import { Search, ChevronDown } from "lucide-react";

type JobFiltersProps = {
  filterText: string;
  onFilterTextChange: (value: string) => void;
  matchFilter: "all" | "high" | "low";
  onMatchFilterChange: (value: "all" | "high" | "low") => void;
  sortBy: "score" | "newest" | "oldest";
  onSortByChange: (value: "score" | "newest" | "oldest") => void;
};

export function JobFilters({
  filterText,
  onFilterTextChange,
  matchFilter,
  onMatchFilterChange,
  sortBy,
  onSortByChange,
}: JobFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Filter by company or role..."
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
          className="w-full bg-surface border border-border rounded-md pl-10 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={matchFilter}
            onChange={(e) =>
              onMatchFilterChange(
                e.target.value as "all" | "high" | "low"
              )
            }
            className="appearance-none bg-surface border border-border rounded-md px-3 py-2 pr-8 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none cursor-pointer"
          >
            <option value="all">All Matches</option>
            <option value="high">High Match</option>
            <option value="low">Low Match</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) =>
              onSortByChange(
                e.target.value as "score" | "newest" | "oldest"
              )
            }
            className="appearance-none bg-surface border border-border rounded-md px-3 py-2 pr-8 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none cursor-pointer"
          >
            <option value="score">Match Score</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
