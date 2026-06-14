"use client";

import { cn } from "@/lib/utils";

type JobsPaginationProps = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function JobsPagination({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
}: JobsPaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalResults);

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-text-secondary">
        Showing <span className="font-semibold text-text-primary">{start}</span>{" "}
        to <span className="font-semibold text-text-primary">{end}</span> of{" "}
        <span className="font-semibold text-text-primary">{totalResults}</span>{" "}
        results
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-medium text-text-secondary border border-border rounded-md bg-surface hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          Previous
        </button>

        {pages.map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 py-1.5 text-sm text-text-muted"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 text-sm font-medium rounded-md transition-colors",
                page === currentPage
                  ? "bg-accent text-accent-foreground"
                  : "text-text-secondary border border-border bg-surface hover:bg-surface-secondary"
              )}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm font-medium text-text-secondary border border-border rounded-md bg-surface hover:bg-surface-secondary transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}
