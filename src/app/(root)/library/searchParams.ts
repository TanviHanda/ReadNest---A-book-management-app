import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const librarySearchParams = {
  search: parseAsString.withDefault(""),
  genre: parseAsString.withDefault(""),
  sortBy: parseAsStringEnum(["newest", "oldest", "highestRated", "available"]).withDefault("newest"),
  page: parseAsInteger.withDefault(1),
};

export const searchParamsCache = createSearchParamsCache(librarySearchParams);
