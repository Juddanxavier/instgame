/* eslint-disable no-underscore-dangle */
/**
 * Utility methods to be used for invoking API methods
 */

import Axios, { AxiosAdapter, AxiosRequestHeaders } from 'axios';
import queryString from 'querystring';
import { Cookies } from 'react-cookie';

import { UriEndPoint } from '@/interface/uriEndPoint';

// Interfaces

export const cookies = new Cookies();

// export const APIHost = 'http://127.0.0.1:5001';
// export const APIHost = 'http://192.168.165.208:5001';
export const APIHost = 'https://api.instagamesm.com';

/**
 * Use this to get backend application domain
 * @returns
 */

interface PathParams {
  [key: string]: string;
}
interface BodyParams {
  [key: string]: any;
}
interface QueryParams {
  [key: string]: string;
}

export const makeUrl = (
  {
    uri,
    pathParams,
    query,
    version,
  }: {
    pathParams?: PathParams;
    query?: QueryParams;
    uri: string;
    method: string;
    version: string;
    headerProps?: AxiosRequestHeaders;
  },
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  host?: string | undefined
): string => {
  return `${host ?? ''}${version}${uri
    .split('/')
    .map((param: string) =>
      param.charAt(0) === ':'
        ? encodeURI(pathParams?.[param.slice(1)] || '')
        : param
    )
    .join('/')}${query ? `?${queryString.stringify(query)}` : ''}`;
};

export const getDefaultHeaders = () => ({
  accessToken: cookies.get('accessToken') || null,
  refreshToken: cookies.get('refreshToken') || null,
  'Content-Type': 'application/json',
});

/**
 * Generic utility method that should be called when invoking any REST API
 *
 * This function streamlines the functionality to make api calls,
 * and carries easy management for controlling versions of the apis
 *
 * @since 1.0.0
 *
 * @todo all the incoming values for the APIParamaters.pathParams and APIParamaters.query
 * should be uri encoded.
 * @alias callAxios
 * @memberof apiUtils
 * @param {Object} APIParamaters - Set of objects required to make the api call.
 * @param {Object} APIParamaters.uriEndPoint - Endpoint object as described in apiEndPoints.js.
 * @param {String} APIParamaters.uriEndPoint.api - Path to your endpoint
 * @param {String} APIParamaters.uriEndPoint.method - POST/GET/PUT/DELETE etc.
 * @param {String} APIParamaters.uriEndPoint.version - Versioning of your api
 * @param {Object} APIParamaters.uriEndPoint.headerProps - Object of headers you want to pass.
 * @param {Object} APIParamaters.pathParams - Path parameters. Example :id in the path,
 * then pathParams object will be {id:value}.
 * @param {Object} APIParamaters.query - GET/POST/PUT/DELETE Endpoint.
 * @param {Object} APIParamaters.body - Body of the request.
 * @returns {Promise<object>} Body Data from the server.
 */

interface CallAxiosInput {
  uriEndPoint: UriEndPoint;
  pathParams?: PathParams;
  query?: QueryParams;
  body?: BodyParams;
  adapter?: AxiosAdapter;
  apiHostUrl?: string;
}
const callAxios = ({
  uriEndPoint,
  pathParams,
  query,
  body,
  adapter,
  apiHostUrl,
}: CallAxiosInput) =>
  Axios({
    method: uriEndPoint.method,
    url: makeUrl({ ...uriEndPoint, pathParams, query }, APIHost),
    headers: {
      ...getDefaultHeaders(),
      ...uriEndPoint.headerProps,
    },
    adapter,
    data: body || {},
  });

/**
 * Generic utility method that should be called when invoking any REST API
 *
 * This function streamlines the functionality to make api calls,
 * and carries easy management for controlling versions of the apis
 *
 * @since 1.0.0
 *
 * @todo all the incoming values for the APIParamaters.pathParams and APIParamaters.query
 * should be uri encoded.
 * @alias callMockios
 * @memberof apiUtils
 * @param {Object} APIParamaters - Set of objects required to make the api call.
 * @param {Object} APIParamaters.uriEndPoint - Endpoint object as described in apiEndPoints.js.
 * @param {String} APIParamaters.uriEndPoint.api - Path to your endpoint
 * @param {String} APIParamaters.uriEndPoint.method - POST/GET/PUT/DELETE etc.
 * @param {String} APIParamaters.uriEndPoint.version - Versioning of your api
 * @param {Object} APIParamaters.uriEndPoint.headerProps - Object of headers you want to pass.
 * @param {Object} APIParamaters.pathParams - Path parameters. Example :id in the path,
 * then pathParams object will be {id:value}.
 * @param {Object} APIParamaters.query - GET/POST/PUT/DELETE Endpoint.
 * @param {Object} APIParamaters.body - Body of the request.
 * @returns {Promise<object>} Body Data from the server.
 */
const callMockios = ({
  uriEndPoint,
  pathParams,
  query,
  body,
}: CallAxiosInput) =>
  Axios({
    method: uriEndPoint.method,
    url: makeUrl(
      { ...uriEndPoint, pathParams, query },
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
    ),
    headers: {
      ...getDefaultHeaders(),
      ...uriEndPoint.headerProps,
    },
    data: body || {},
  });

interface CallApiProps {
  uriEndPoint: UriEndPoint;
  pathParams?: PathParams;
  query?: QueryParams;
  body?: BodyParams;
  adapter?: AxiosAdapter;
  apiHostUrl?: string;
  mock?: boolean;
}

/**
 * Extract the error messages from a failed API response.
 * @param {} apiResponse
 */
// const extractErrors = () => {};
/**
 * Generic utility method that should be called when invoking any REST API
 *
 * This function streamlines the functionality to make api calls,
 * and carries easy management for controlling versions of the apis
 *
 * @since 2.0.0
 * @author ANknown
 *
 * @todo all the incoming values for the APIParamaters.pathParams and APIParamaters.query
 * should be uri encoded.
 * @alias callApi
 * @memberof apiUtils
 * @param {Object} APIParamaters - Set of objects required to make the api call.
 * @param {String} APIParamaters.apiHostUrl - Use this to override the host url for calling external apis, example weather api https://api.openweathermap.org.
 * @param {Object} APIParamaters.uriEndPoint - Endpoint object as described in apiEndPoints.js.
 * @param {String} APIParamaters.uriEndPoint.api - Path to your endpoint
 * @param {String} APIParamaters.uriEndPoint.method - POST/GET/PUT/DELETE etc.
 * @param {String} APIParamaters.uriEndPoint.version - Versioning of your api
 * @param {Object} APIParamaters.uriEndPoint.headerProps - Object of headers you want to pass.
 * @param {Object} APIParamaters.pathParams - Path parameters. Example :id in the path,
 * then pathParams object will be {id:value}.
 * @param {Object} APIParamaters.query - GET/POST/PUT/DELETE Endpoint.
 * @param {Object} APIParamaters.body - Body of the request.
 * @returns {Promise<object>} Body Data from the server.
 */

export function callApi<ResponseType>({
  uriEndPoint,
  pathParams,
  query,
  body,
  adapter,
  apiHostUrl,
  mock,
}: CallApiProps): Promise<ResponseType> {
  return new Promise((resolve, reject) => {
    let callGenericApi = callAxios;
    if (mock) callGenericApi = callMockios;
    callGenericApi({
      uriEndPoint,
      pathParams,
      query,
      body,
      adapter,
      apiHostUrl,
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        // if (!err.response) {
        //   reject({ isServerUnreachable: true });

        //   return;
        // }
        reject(err);
      });
  });
}
