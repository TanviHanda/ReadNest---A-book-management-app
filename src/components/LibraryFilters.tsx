"use client";

import { useState } from "react";
import Image from "next/image";
import { useQueryStates } from "nuqs";
import { librarySearchParams } from "@/app/(root)/library/searchParams";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface LibraryFiltersProps {
  genres: string[];
}

const LibraryFilters = ({ genres }: LibraryFiltersProps) => {
  const [{ search, genre, sortBy }, setSearchParams] = useQueryStates(
    librarySearchParams,
    {
      shallow: false, // Trigger server re-render
    },
  );

  const [searchInput, setSearchInput] = useState(search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, page: 1 });
  };

  const handleGenreChange = (newGenre: string) => {
    setSearchParams({
      genre: newGenre === genre ? "" : newGenre,
      page: 1,
    });
  };

  const handleSortChange = (newSort: string) => {
    setSearchParams({
      sortBy: newSort as "newest" | "oldest" | "highestRated" | "available",
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({
      search: "",
      genre: "",
      sortBy: "newest",
      page: 1,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Input
          type="text"
          placeholder="Search by title or author..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-dark-300 border-dark-500 text-light-100 placeholder:text-light-400 rounded-lg"
        />
        <Image
          src="/icons/search-fill.svg"
          alt="search"
          width={20}
          height={20}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        />
        <Button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4"
        >
          Search
        </Button>
      </form>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Genre Filter */}
        <div className="flex-1 min-w-[200px]">
          <p className="text-light-100 text-sm font-medium mb-2">Genre</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleGenreChange("")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                genre === ""
                  ? "bg-primary text-white"
                  : "bg-dark-300 text-light-100 hover:bg-dark-400"
              }`}
            >
              All
            </button>
            {genres.slice(0, 5).map((genreItem) => (
              <button
                key={genreItem}
                type="button"
                onClick={() => handleGenreChange(genreItem)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  genre === genreItem
                    ? "bg-primary text-white"
                    : "bg-dark-300 text-light-100 hover:bg-dark-400"
                }`}
              >
                {genreItem}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="w-full sm:w-auto">
          <label
            htmlFor="sort-by"
            className="text-light-100 text-sm font-medium mb-2 block"
          >
            Sort By
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full sm:w-48 h-10 px-4 bg-dark-300 border border-dark-500 text-light-100 rounded-lg"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highestRated">Highest Rated</option>
            <option value="available">Most Available</option>
          </select>
        </div>
      </div>

      {/* Active Filters & Clear */}
      {(search || genre || sortBy !== "newest") && (
        <div className="flex items-center gap-2">
          <span className="text-light-400 text-sm">Active filters:</span>
          {search && (
            <span className="px-3 py-1 bg-dark-400 text-light-100 text-sm rounded-full">
              Search: {search}
            </span>
          )}
          {genre && (
            <span className="px-3 py-1 bg-dark-400 text-light-100 text-sm rounded-full">
              Genre: {genre}
            </span>
          )}
          {sortBy !== "newest" && (
            <span className="px-3 py-1 bg-dark-400 text-light-100 text-sm rounded-full">
              Sort: {sortBy}
            </span>
          )}
          <button
            type="button"
            onClick={clearFilters}
            className="text-primary text-sm hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default LibraryFilters;
