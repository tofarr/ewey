
export const headersFromToken = (token: string) => {
  const result: { [key: string]: string } = {};
  if (token) {
    result["Authorization"] = `Bearer ${token}`;
  }
  return result;
};
