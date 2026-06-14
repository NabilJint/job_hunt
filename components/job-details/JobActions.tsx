type Props = {
  externalApplyUrl: string | null;
};

export function JobActions({ externalApplyUrl }: Props) {
  if (!externalApplyUrl) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <a
        href={externalApplyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent-dark transition-colors"
      >
        Apply Now
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  );
}
