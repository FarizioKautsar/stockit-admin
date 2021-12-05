import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

/**
 * Calls the backend api.
 * @returns {Object}.
 * @param {function} actionCreator
 */
export default function useFromApi(
  actionCreator,
  dependencyList = [],
  conditional = undefined,
  isConcat = false,
  resetDependencies = []
) {
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  // Temporary resources
  const [tempResources, setTempResources] = useState([]);
  // Main resources that will be used
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(undefined);

  const [refreshState, setRefreshState] = useState(true);

  const dispatch = useDispatch();

  function refresh() {
    setRefreshState(!refreshState);
  }

  useEffect(() => {
    if (conditional === undefined || conditional()) {
      setLoading(true);
      setDone(false);
      dispatch(actionCreator)
        .then((res) => {
          if (isConcat) {
            setTempResources(res.data?.map((resource) => resource.id));
          } else {
            setResources(res.data?.map((resource) => resource.id));
          }
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
          setDone(true);
        });
    } // eslint-disable-next-line
  }, [dispatch, refreshState, ...dependencyList]);

  // resetDependencies list will reset the resources
  useEffect(() => {
    setResources([]);
  }, [dispatch, ...resetDependencies]);

  // Listen to changes to the temporary resources,
  // then apply it accordingly
  useEffect(() => {
    // Concatinate to previous resources
    setResources(resources.concat(tempResources));
  }, [tempResources]);

  /**
   * Loading tells whether call is still loading.
   * resources tells the order of the resource's ids in data (not in included).
   * error is an object that contains the error from makeRequestThunkApi.
   * done tells whether or not the response has been returned.
   * refresh is a function that redo the API call
   */
  return { loading, resources, error, done, refresh };
}
