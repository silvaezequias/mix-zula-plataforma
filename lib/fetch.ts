export const easyFetch = (url: string, headers: RequestInit) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  return fetch(url, {
    ...requestOptions,
    ...headers,
    credentials: "include",
  });
};
