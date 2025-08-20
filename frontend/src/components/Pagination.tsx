import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageButtons = () => {
    const pageButtons = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else {
     if (currentPage < 3) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pageButtons.push(i);
     }

      } else if (currentPage >= 3 && currentPage <= 8) {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          if (i >= 1 && i <= totalPages) {
            pageButtons.push(i);
          }
        }
      } else {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageButtons.push(i);
        }
      }
    }

    return pageButtons;
  };

  return (
    <div className="pagination">
      <button name="first" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        First
      </button>
      <button name="previous" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>

      {generatePageButtons().map((page) => (
        <button
          key={page}
          name={`page-${page}`}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}

      <button name="next" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
      <button name="last" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        Last
      </button>
    </div>
  );
};

export default Pagination;
