import { useEffect, useState } from 'react';

const columnsFor = (width: number) => (width >= 1024 ? 4 : width >= 768 ? 3 : 2);

/** 2 columns on phones, 3 on tablets, 4 on desktops. */
export function useColumns(): number {
  const [columns, setColumns] = useState(() => columnsFor(window.innerWidth));
  useEffect(() => {
    const onResize = () => setColumns(columnsFor(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return columns;
}
