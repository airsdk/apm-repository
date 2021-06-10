import useSWR from "swr";
import type { Package } from 'types/package'

const fetcher = (input: RequestInfo, init: RequestInit) => fetch(input, init).then((res) => res.json());

export function findMany(searchQuery: String) : { packages: Array<Package> | undefined, isLoading: boolean, isError:boolean } {
  const { data, error } = useSWR<Array<Package>>(`/api/search/?q=${searchQuery}`, fetcher);

  return {
    packages: data,
    isLoading: !error && !data,
    isError: error,
  };
}


export function findOne(identifier:string) : { data: Package | undefined, isLoading: boolean, isError:boolean } {
  const { data, error } = useSWR<Package>(`/api/packages/${identifier}`, fetcher);

  var packageData = {};
  if (data)
  {
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

