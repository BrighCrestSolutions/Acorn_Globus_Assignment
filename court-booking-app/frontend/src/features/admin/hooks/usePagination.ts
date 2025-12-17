import { useState } from 'react';

export const usePagination = (itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = <T,>(items: T[]): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    paginate,
    resetPage
  };
};
