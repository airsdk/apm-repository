import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function findMany(searchQuery: String) {
  const { data, error } = useSWR(`/api/search/?q=${searchQuery}`, fetcher);

  return {
    packages: data,
    isLoading: !error && !data,
    isError: error,
  };
}


export function findOne(identifier:string) {
  const { data, error } = useSWR(`/api/packages/${identifier}`, fetcher);

  var packageData = {};
  if (data)
  {
    packageData = data;
  }

  return {
    data: packageData,
    isLoading: !error && !data,
    isError: error,
  };
}
