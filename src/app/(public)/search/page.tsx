import { Suspense } from 'react';
import SearchResultsClient from './search-results-client';

const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
};

export default SearchPage;
