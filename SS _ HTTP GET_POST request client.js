const claimRequest = require('claimRequest');
const getRequestHeader = require('getRequestHeader');
const getRequestBody = require('getRequestBody');
const getRequestMethod = require('getRequestMethod');
const getRequestPath = require('getRequestPath');
const setResponseHeader = require('setResponseHeader');
const setResponseBody = require('setResponseBody');
const setResponseStatus = require('setResponseStatus');
const returnResponse = require('returnResponse');
const setPixelResponse = require('setPixelResponse');
const runContainer = require('runContainer');
const log = require('logToConsole');
const JSON = require('JSON');
const decodeUriComponent = require('decodeUriComponent');
const getRequestQueryString = require('getRequestQueryString');
const Object = require('Object');
const getRequestQueryParameters = require('getRequestQueryParameters');
const BigQuery = require('BigQuery');
const getTimestampMillis = require('getTimestampMillis');
const getType = require('getType');
const parseUrl = require('parseUrl');
const getAllEventData = require('getAllEventData');
const Promise = require('Promise');


const endpoint = data.custom_endpoint;
const request_method = getRequestMethod();
const allowed_request_method = data.request_method;

// BigQuery project settings

const project = {
  projectId: data.project_id,
  datasetId: data.dataset_id,
  tableId: data.table_id
};


// Claim the request
// if(getRequestPath() === '/'){ // For testing only
if(getRequestPath() === '/' + endpoint){
  const allow_request_from = data.accept_requests_from;
  const origin = getRequestHeader('Origin');

  if(request_method === allowed_request_method){
    // POST requests
    if (request_method === 'POST') {
      if(data.enable_logs){log('SERVER-SIDE GTM CLIENT TAG: TAG CONFIGURATION');}
      if(data.enable_logs){log('👉 Endpoint:', endpoint);}
      if(data.enable_logs){log('👉 Accepted request type:', data.request_method);}
      if(data.enable_logs){log('👉 Accept data from:', data.accept_requests_from + ' domains');}
      if(data.enable_logs){log('REQUEST DATA');}
      if(data.enable_logs){log('👍 POST request');}

      const event_data = JSON.parse(getRequestBody());

      if(event_data && Object.keys(event_data).length > 0){
        // Any domains
        if (allow_request_from === 'any') {
          if(data.enable_logs){log('👍 Request origin:', origin);}
          if(data.enable_logs){log('👍 Request origin allowed');}
          if(data.enable_logs){log('👍 Event data: ', event_data);}
          claim_request(event_data, origin);

        // Some domains
        } else {
          const allowed_domains_list = data.allowed_domains_list;

          for (var i=0; i < allowed_domains_list.length; i++){
            if (allowed_domains_list[i].allowed_domain === origin) {
              if(data.enable_logs){log('👉 Request origin:', origin);}
              if(data.enable_logs){log('👍 Request origin allowed');}
              if(data.enable_logs){log('👍 Event data: ', event_data);}
              claim_request(event_data, origin);
            }
          }
        }
      } else {
        if(data.enable_logs){log('🟠 204 Empty request. This has no payload.');}
        setResponseStatus(204);
        returnResponse();
      }

    // GET requests
    } else if (request_method === 'GET') {
      if(data.enable_logs){log('SERVER-SIDE GTM CLIENT TAG: TAG CONFIGURATION');}
      if(data.enable_logs){log('👉 Endpoint:', endpoint);}
      if(data.enable_logs){log('👉 Accepted request type:', data.request_method);}
      if(data.enable_logs){log('👉 Accept data from:', data.accept_requests_from + ' domains');}
      if(data.enable_logs){log('REQUEST DATA');}
      if(data.enable_logs){log('👍 GET request');}

      const event_data = getRequestQueryParameters();
      // const event_data = {
      //   event: 'dl_send_post_request',
      //   user_id: 'abcd',
      //   session_id: 'abcd_1234',
      //   client_id: "1234",
      //   ip: '0.0.0.0',
      //   consent: 100,
      //   eec: JSON.stringify({
      //     transaction_id: "T12345",
      //     affiliation: "Online Store",
      //     value: 59.89,
      //     tax: 4.90,
      //     shipping: 5.99,
      //     currency: "EUR",
      //     coupon: "SUMMER_SALE",
      //     items: [{
      //       item_name: "Triblend Android T-Shirt",
      //       item_id: "12345",
      //       price: "15.25",
      //       item_brand: "Google",
      //       item_category: "Apparel",
      //       item_variant: "Gray",
      //       quantity: 1
      //     }, {
      //       item_name: "Donut Friday Scented T-Shirt",
      //       item_id: "67890",
      //       price: 33.75,
      //       item_brand: "Google",
      //       item_category: "Apparel",
      //       item_variant: "Black",
      //       quantity: 1
      //     }]
      //   })
      // };

      if(event_data && Object.keys(event_data).length > 0){
        Object.keys(event_data).forEach((key) => {
          log("👉🏻 Original type of: " + typeof(event_data[key]) + "👉🏻 Value: ", event_data[key]);
            if (JSON.parse(event_data[key]) != undefined){
            event_data[key] = JSON.parse(event_data[key]);
          } else {
            event_data[key] = event_data[key];
          }

          // JSON.parse(event_data[key], (key, value) => typeof value === 'object' ? event_data[key] = JSON.parse(event_data[key]) : event_data[key] = event_data[key]);

          // Promise.all([event_data[key]])
          //   .then(() => {
          //   log('Data to parse: ', typeof(event_data[key]), " => ",  event_data[key]);
          //   }).then(() => {
          //     event_data[key] = JSON.parse(event_data[key]);
          //     log('Parsed: ', typeof(event_data[key]), " => ", event_data[key]);
          //   }).catch((e) => {
          //     log('Not parsed: ', typeof(event_data[key]), " => ", event_data[key]);
          // });
        });

        // Any domains
        if (allow_request_from === 'any') {
          if(data.enable_logs){log('👉 Request origin:', origin);}
          if(data.enable_logs){log('👍 Request origin allowed');}
          if(data.enable_logs){log('👍 Event data: ', event_data);}
          claim_request(event_data, origin);

        // Some domains
        } else {
          const allowed_domains_list = data.allowed_domains_list;

          for (let i=0; i < allowed_domains_list.length; i++){
            if (allowed_domains_list[i].allowed_domain === origin) {
              if(data.enable_logs){log('👉 Request origin:', origin);}
              if(data.enable_logs){log('👍 Request origin allowed');}
              if(data.enable_logs){log('👍 Event data: ', event_data);}
              claim_request(event_data, origin);
            }
          }
        }
      } else {
        if(data.enable_logs){log('🟠 204 Empty request. This has no payload.');}
        setResponseStatus(204);
        returnResponse();
      }
    }
  } else {
    if(data.enable_logs){log('🔴 401 Unauthorized request. 🖕');}
    setResponseStatus(401);
    returnResponse();
  }
}


// Claim requests
function claim_request(event_data, allowed_origin) {
  claimRequest();
  runContainer(event_data, () => {
    setResponseStatus(200);
    setResponseHeader('Access-Control-Allow-Headers', 'content-type');
    setResponseHeader('Access-Control-Allow-Credentials', 'true');
    setResponseHeader('Access-Control-Allow-Origin', allowed_origin);
    setResponseHeader('Access-Control-Allow-Methods', allowed_request_method);
    setResponseHeader('cache-control', 'no-cache');
    setResponseBody(JSON.stringify(event_data));
    returnResponse();
  });

  // Log incoming request to BQ
  if(data.log_requests_to_bq){
    const log_data = {
      timestamp: getTimestampMillis() / 1000,
      method: request_method,
      host: getRequestHeader('Host'),
      origin: getRequestHeader('Origin'),
      referer: getRequestHeader('Referer'),
      content_length: getRequestHeader('Content-Length'),
      content_type: getRequestHeader('Content-Type'),
      user_agent: getRequestHeader('User-Agent'),
      browser_info: getRequestHeader('Sec-Ch-Ua'),
      device: getRequestHeader('Sec-Ch-Ua-Mobile'),
      platform: getRequestHeader('Sec-Ch-Ua-Platform'),
      city: getRequestHeader('X-Appengine-City'),
      user_ip: getRequestHeader('X-Appengine-User-Ip'),
      payload: JSON.stringify(event_data)
    };
    sendToBigQuery(project, [log_data]);
  }
  if(data.enable_logs){log('🟢 200 Ok: Request claimed succesfully');}
}


// Send data to BigQuery
function sendToBigQuery(project, rows){
  BigQuery.insert(
    project,
    rows,
    {
      'ignoreUnknownValues': true,
      'skipInvalidRows': false
    },
    () => {
      if(data.enable_logs){log('🟢 Request logged successfully to ' +  project.tableId);}
    },
    () => {
      if(data.enable_logs){log('🔴 Request not logged to ' + project.tableI);}
    }
  );
}
