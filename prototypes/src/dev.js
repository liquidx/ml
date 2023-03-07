let server = 'https://liquidx-ml.uc.r.appspot.com';
let localServer = 'http://localhost:11000';

export const serverUrl = () => {
  if (window.location.hostname === 'localhost') {
    return localServer;
  }
  return server;
}