import { ReactNode, useState } from "react";
import ILoading from "~/types/load/ILoading";
import Spinner from "../spinner/Spinner";
import Notice, { NoticeTypes } from "../notice/Notice";
import useAsyncLoader from "~/hooks/useAsyncLoader";
import { IFetchValues } from "~/utilities/authFetches";

interface ILoadingDisplayProps<TResponse> {
  fetchValues: IFetchValues,
  setResponse: React.Dispatch<React.SetStateAction<TResponse>>,
  children: ReactNode,
}

export default function LoadingDisplay<TResponse>(props: ILoadingDisplayProps<TResponse>) {
  const [loading, setLoading] = useState<ILoading>({ isLoading: false });

  useAsyncLoader(props.fetchValues,
    setLoading,
    props.setResponse);

  if (loading.isLoading) {
    return <Spinner />;
  } else if (!loading.isLoading
    && loading.errorMessage) {
    return (
      <Notice
        type={NoticeTypes.Error}
      >
        {loading.errorMessage}
      </Notice>
    );
  } else {
    return <>{props.children}</>
  }
}