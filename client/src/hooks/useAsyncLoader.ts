import { useEffect } from "react";
import ILoading from "~/types/load/ILoading";
import { throwIfResponseError } from "~/utilities/apiUtilities";
import { authGetJson, IFetchValues } from "~/utilities/authFetches";
import { getResponseErrorMessage } from "~/utilities/validationErrorHelpers";

export default function useAsyncLoader<TResponse>(fetchValues: IFetchValues,
  setLoading: React.Dispatch<React.SetStateAction<ILoading>>,
  setResponse: React.Dispatch<React.SetStateAction<TResponse>>) {
  useEffect(() => {
    let controller = new AbortController();

    // Load my clubs.
    const loadData = async () => {
      setLoading({
        isLoading: true,
      });

      try {
        const result = await authGetJson(fetchValues);
        await throwIfResponseError(result);
        if (!controller.signal.aborted) {
          setResponse(await result.json() as TResponse);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setLoading({
            isLoading: false,
            errorMessage: getResponseErrorMessage(err),
          });
        }
        return;
      }

      if (!controller.signal.aborted) {
        setLoading({
          isLoading: false,
        });
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [setLoading, setResponse]);
}