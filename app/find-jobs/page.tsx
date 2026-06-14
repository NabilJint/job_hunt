"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SearchControls } from "@/components/find-jobs/SearchControls";
import { JobFilters } from "@/components/find-jobs/JobFilters";
import { JobsTable, type Job } from "@/components/find-jobs/JobsTable";
import { JobsPagination } from "@/components/find-jobs/JobsPagination";

const PAGE_SIZE = 20;

export default function FindJobsPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    jobsFound: number;
    strongMatches: number;
  } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const [filterText, setFilterText] = useState("");
  const [matchFilter, setMatchFilter] = useState<"all" | "high" | "low">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"score" | "newest" | "oldest">("score");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      setIsLoadingJobs(true);
      try {
        const params = new URLSearchParams({
          matchFilter,
          sortBy,
          page: String(currentPage),
          pageSize: String(PAGE_SIZE),
        });
        if (filterText.trim()) {
          params.set("q", filterText.trim());
        }

        const response = await fetch(`/api/agent/jobs?${params}`);
        const result = await response.json();

        if (cancelled) return;

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch jobs");
        }

        if (Array.isArray(result.data)) {
          setJobs(
            result.data.map(
              (job: {
                id: string;
                company: string;
                title: string;
                match_score: number;
                salary: string | null;
                found_at: string;
              }) => ({
                id: job.id,
                company: job.company,
                title: job.title,
                matchScore: job.match_score,
                salary: job.salary || "Not specified",
                foundAt: job.found_at,
              }),
            ),
          );
          setTotalResults(result.total || 0);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[FindJobsPage] loadJobs error:", err);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingJobs(false);
        }
      }
    }

    loadJobs();
    return () => {
      cancelled = true;
    };
  }, [matchFilter, sortBy, currentPage, filterText, refreshKey]);

  function handleFilterTextChange(value: string) {
    setFilterText(value);
    setCurrentPage(1);
  }

  function handleMatchFilterChange(value: "all" | "high" | "low") {
    setMatchFilter(value);
    setCurrentPage(1);
  }

  function handleSortByChange(value: "score" | "newest" | "oldest") {
    setSortBy(value);
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  async function handleSearch(jobTitle: string, location: string) {
    setIsSearching(true);
    setError(null);
    setSearchResult(null);

    try {
      const response = await fetch("/api/agent/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, location }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Search failed. Please try again.");
        setIsSearching(false);
        return;
      }

      setSearchResult({
        jobsFound: result.data.jobsFound,
        strongMatches: result.data.strongMatches,
      });

      setCurrentPage(1);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Search failed. Please try again.",
      );
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-8 py-8 flex flex-col gap-6">
        <SearchControls
          onSearch={handleSearch}
          isSearching={isSearching}
          searchResult={searchResult}
          error={error}
        />

        <div className="flex flex-col gap-4">
          <JobFilters
            filterText={filterText}
            onFilterTextChange={handleFilterTextChange}
            matchFilter={matchFilter}
            onMatchFilterChange={handleMatchFilterChange}
            sortBy={sortBy}
            onSortByChange={handleSortByChange}
          />

          <JobsTable jobs={jobs} isLoading={isLoadingJobs} />

          <JobsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}
