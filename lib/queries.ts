import { Package } from "types/model";
import useSWR from "swr";

const fetcher = (input: RequestInfo, init: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export function findMany(
  searchQuery?: string,
  tag?: string
): {
  packages: Array<Package> | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  if (searchQuery === undefined && tag === undefined)
    return { packages: undefined, isLoading: true, isError: false };
  
  const query =
    `/api/search/?` +
    (searchQuery !== undefined ? "q=" + searchQuery : "") +
    (tag !== undefined ? "t=" + tag : "");

  const { data, error } = useSWR<Array<Package>>(query, fetcher);

  return {
    packages: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function findLatest(identifier: string): {
  data: Package | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  if (identifier === undefined || identifier == null)
    return { data: undefined, isLoading: true, isError: false };

  const { data, error } = useSWR<Package>(
    `/api/packages/${identifier}`,
    fetcher
  );

  var packageData = {};
  if (data) {
    packageData = data;
  }
  console.log(packageData);

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function findVersion(
  identifier: string,
  version: string
): { data: Package | undefined; isLoading: boolean; isError: boolean } {
  if (identifier === undefined || identifier == null)
    return { data: undefined, isLoading: true, isError: false };

  const { data, error } = useSWR<Package>(
    `/api/packages/${identifier}/${version}`,
    fetcher
  );

  var packageData = {};
  if (data) {
    packageData = data;
  }

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

// function packageFromObject( data : Object ) : Package {
//   data.hasOwnProperty
//   return new Package()
//     name: data['name'],
//     description: data['description'],
//     identifier: data.identifier,
//     index: data.index,
//     publishedAt: data.publishedAt,
//     type: data.type,
//     url: data.url,
//     version: data.version
//   };
// }
