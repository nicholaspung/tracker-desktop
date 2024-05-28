import { useEffect, useState } from 'react';

export default function useData(apiFunc) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState({});
  const [willRefetch, setWillRefetch] = useState(false);

  const useFunc = async () => {
    setHasError(false);
    setError({});
    try {
      setIsLoading(true);
      await apiFunc();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setHasError(true);
      setError(err);
    }
  };

  useEffect(() => {
    useFunc();
  }, []);

  const refetch = async () => {
    setWillRefetch(true);
  };

  const refetching = async () => {
    await useFunc();
    setWillRefetch(false);
  };

  useEffect(() => {
    if (willRefetch) {
      refetching();
    }
  }, [willRefetch]);

  return {
    isLoading,
    hasError,
    error,
    refetch,
  };
}
