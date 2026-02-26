import React from 'react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange, className = '' }) => {
    if (totalPages <= 1) return null;

    return (
        <div className={`flex justify-center items-center gap-2 ${className}`}>
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-slate-800 text-white disabled:opacity-50"
            >
                Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => onPageChange(idx + 1)}
                    className={`px-3 py-1 rounded ${page === idx + 1 ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                    {idx + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded bg-slate-800 text-white disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
