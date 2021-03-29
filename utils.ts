import fetch from 'node-fetch';

export const getData = async (path: string) => {
  const res = fetch('https://disease.sh/v3/covid-19/' + path);
  const data = (await res).json();
  return data;
};
