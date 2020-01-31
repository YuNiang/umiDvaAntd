import jsonpAdapter from 'axios-jsonp';

/* eslint-disable */
export default function addAjaxMethod(axios) {
  axios.jsonp = (pathname, params = {}, config = {}) => {
    config.adapter = config.adapter || jsonpAdapter;
    config.params = params;

    return axios({
      url: pathname,
      withCredentials: true,
      ...config,
    });
  };
}
