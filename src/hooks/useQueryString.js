import qs from "qs";
import { useHistory, useLocation } from "react-router-dom";
import buildQueryStr from "src/utils/buildQueryStr";

export default function useQueryString(qsSchema) {
  const history = useHistory();
  const location = useLocation();
  const search = location.search.replace("?", "");
  let query;

  try {
    query = qsSchema.cast(qs.parse(search));
  } catch (err) {
    window.location.replace("/404");
  }
  /**
   * Sets the Query String.
   * @param {object} args dictionary of params to args.
   */
  function setQueryStr(args) {
    // console.log(args)
    // console.log(buildQueryStr(location.pathname, args))
    history.push(buildQueryStr(location.pathname, args));
  }

  function makeQueryStrWith(args) {
    const queryClauses = Object.entries(args).map(
      ([param, arg]) => `${param}=${encodeURIComponent(arg)}`
    );

    return `${location.pathname}?${queryClauses.join("&")}`;
  }

  return [query, setQueryStr, makeQueryStrWith];
}
