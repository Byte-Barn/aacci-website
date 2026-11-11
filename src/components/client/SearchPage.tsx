'use client';

import { useSearchParams } from 'next/navigation';
import { SearchBox } from './Search';

export default function SearchPage() {
  const q = useSearchParams().get('q') ?? '';
  return <SearchBox key={q} initial={q} autoFocus />;
}
