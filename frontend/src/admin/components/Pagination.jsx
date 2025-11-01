import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  showingCount,
}) => {
    console.log({ currentPage, totalPages, totalCount });
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center p-4 text-secondary/70 text-sm bg-accent/40 border-t border-accent/30 rounded-b-lg">
      <p>
        Showing{" "}
        <span className="font-semibold">{showingCount}</span> /{" "}
        <span className="font-semibold">{totalCount}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`p-2 rounded-lg transition-all ${
            currentPage === 1
              ? "text-secondary/40 cursor-not-allowed"
              : "text-secondary/80 hover:text-secondary hover:bg-primary/30"
          }`}
        >
          <FaChevronLeft />
        </button>

        <span className="text-secondary/80 font-medium">
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`p-2 rounded-lg transition-all ${
            currentPage === totalPages
              ? "text-secondary/40 cursor-not-allowed"
              : "text-secondary/80 hover:text-secondary hover:bg-primary/30"
          }`}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
