"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchControlsProps = {
  onSearch: (jobTitle: string, location: string) => void;
  isSearching: boolean;
  searchResult: { jobsFound: number; strongMatches: number } | null;
  error?: string | null;
};

export function SearchControls({
  onSearch,
  isSearching,
  searchResult,
  error,
}: SearchControlsProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (jobTitle.trim()) {
      onSearch(jobTitle.trim(), location.trim());
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
              JOB TITLE
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                type="text"
                placeholder="Frontend Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
              LOCATION
            </label>
            <Input
              type="text"
              placeholder="Remote, New York..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              disabled={!jobTitle.trim() || isSearching}
              className="bg-accent text-accent-foreground hover:bg-accent-dark rounded-md px-6 py-2 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              {isSearching ? "Searching..." : "Find Jobs"}
            </Button>
          </div>
        </div>
      </form>

      {searchResult && (
        <div className="mt-4 flex items-center gap-2 bg-success-lightest border border-success/20 rounded-lg px-4 py-3">
          <Sparkles className="w-4 h-4 text-success" />
          <span className="text-success-dark text-sm font-medium">
            Found {searchResult.jobsFound} jobs and saved{" "}
            {searchResult.strongMatches} strong matches.
          </span>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 bg-error/10 border border-error/20 rounded-lg px-4 py-3">
          <span className="text-error text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
