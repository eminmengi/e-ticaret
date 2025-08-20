export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];

  // Başlangıç: 1 ve 2
  pageNumbers.push(1);
  if (totalPages > 1) pageNumbers.push(2);

  // Ortadaki sayfa ve "..." mantığı
  if (currentPage > 3 && currentPage < totalPages - 2) {
    pageNumbers.push("...");
    pageNumbers.push(currentPage);
    pageNumbers.push("...");
  } else if (currentPage === 3) {
    pageNumbers.push(3);
    pageNumbers.push("...");
  } else if (currentPage === totalPages - 2) {
    pageNumbers.push("...");
    pageNumbers.push(totalPages - 2);
  } else {
    pageNumbers.push("...");
  }

  // Son iki sayfa
  if (totalPages > 3) pageNumbers.push(totalPages - 1);
  if (totalPages > 2) pageNumbers.push(totalPages);

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="flex border border-[#a5a3a3] rounded shadow text-sm font-medium overflow-x-auto text-nowrap">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 min-w-[60px] h-[74px] border-r border-[#a5a3a3] ${
            currentPage === 1
              ? "text-[#BDBDBD] bg-[#f0f0f0] cursor-not-allowed font-bold"
              : "text-[#00aaff] hover:bg-[#f0faff]"
          }`}
        >
          First
        </button>

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={index}
              className="flex justify-center items-center px-3 py-2 min-w-[46px] border-r border-[#a5a3a3] text-gray-400 bg-white"
            >
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              disabled={page === currentPage}
              className={`px-4 py-2 min-w-[46px] border-r border-[#a5a3a3] ${
                page === currentPage
                  ? "bg-[#00aaff] text-white font-bold"
                  : "bg-white text-[#00aaff] hover:bg-[#f0faff]"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 min-w-[60px] ${
            currentPage === totalPages
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-[#00aaff] hover:bg-[#f0faff]"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
