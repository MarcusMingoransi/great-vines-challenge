import { URL_AUTHENTICATION } from "./constants";

export const getQueryParams = (query = null) =>
  [
    ...new URLSearchParams(query || window.location.search || "").entries(),
  ].reduce((a, [k, v]) => ((a[k] = v), a), {});

export const authenticateUser = () => {
  window.location.href = URL_AUTHENTICATION;
};
