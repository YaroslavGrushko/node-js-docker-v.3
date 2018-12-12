var log = require('./libs/log')(module);
// module for processing requests/response to(from) static content {located on the server}  with correct meta-data.
// means that this module takes request, response from app.js and returns response with static content

function StaticContent(current_request, current_response) {

    this.request = current_request;
    this.response = current_response;
    //get headers of request:
    var host = this.request.headers['host'];
    // request headers validation
    // host must be defined and defined as 'localhost:5000'
    if (host && host == 'localhost:5000') log.info('++ host from request headers is validated successfully, host: ' + host);
    // let's imagine that we need Chroom browser,
    //so user agent must be defined and be Chroom browser
    var userAgent = this.request.headers['user-agent'];
    if (userAgent && userAgent.includes('Chrome')) log.info('++ user agent from request headers is validated successfully, user agent: ' + userAgent);


    var staticContent = " ";
    this.getStaticContent = async function(type) {
        //return html content
        // staticContent = customers;
        // send response
        if (type == 'places') {
            //get PLACES from Db/getPlaces module
            log.info('get Data from Db/getPlaces module in async mode');
            var getPlaces = require("./Db/getPlaces");
            // getPLACES().then((data) => {
            //     console.log("sending data to front");
            //     current_response.json(data);
            // });
            var data = await getPlaces();
            current_response.json(data);
        } else {
            // let's return customers
            if (type == 'customers') {
                var a = 1;
                current_response.json(customers);
            }
        }
    }
}

module.exports = StaticContent;