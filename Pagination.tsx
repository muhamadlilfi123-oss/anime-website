'use client';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
}

export default function Pagination({ currentPage, onPageChange, hasNext = true }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-5 py-2.5 rounded-xl bg-card border border-primary/30 text-sm font-medium text-gray-300 hover:bg-primary/20 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        ← Prev
      </button>
      <span className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">
        {currentPage}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="px-5 py-2.5 rounded-xl bg-card border border-primary/30 text-sm font-medium text-gray-300 hover:bg-primary/20 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next →
      </button>
    </div>
  );
}
