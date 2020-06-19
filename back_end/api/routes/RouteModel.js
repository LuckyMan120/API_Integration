const router = require('express').Router();
// var request = require("request");
// var options = {method: 'GET', url: 'https://kitces.api-us1.com/api/3/groups'};
// const activeCampaignApi = require('activecampaign-api');

// // Instantiate a new client.
// const activeCampaignApiClient = new activeCampaignApi.ApiClient({
//   // Pass your account name and secret key
//   accountName: 'kitces',
//   key: '44a80ac37cb045fa3f7741df00969d28ba52e8860bff259ebd2994d8d11415dfb6fb2e8e'
// });
// var ActiveCampaign = require("activecampaign");

// var ac = new ActiveCampaign("https://kitces.api-us1.com", "44a80ac37cb045fa3f7741df00969d28ba52e8860bff259ebd2994d8d11415dfb6fb2e8e");

router.route('/all').get((req, res) =>{
	var chargebee = require("chargebee");
    chargebee.configure({site : "kitces",
      api_key : "live_rFgkk8fXHznL4tvIWdavqz0HQROD6cdFF"});
    chargebee.subscription.list({
      	"limit": 100,
        "sort_by[desc]" : "created_at",
        // "offset": 101
    }).request(function(error,result) {
      if(error){
        //handle error
        console.log("--------error", error);
      }else{
        res.json(result.list);
        }
      });
//     request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//   console.log('response', response);
//   console.log("body", body);
// });
    // console.log('ac', ac);
  //   var account_view = ac.api("account/view", {});
  // account_view.then(function(result) {
  //   // successful request
  //   console.log("result", result);
  // }, function(result) {
  //   // request error
  // });
// var options = {method: 'GET', url: 'https://kitces.api-us1.com/api/3/groups/users'};

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//   console.log('------response', response);
//   console.log("body", body);
// });
// Listing all active contacts from the list.
// console.log('activeCampaignApiClient', activeCampaignApiClient);
// activeCampaignApiClient
//   .call('contact_list', {
//     filters: {
//       // listid: 4,
//       status: 1  // 1 = active
//     }
//   }, 'GET')
//   .then(response => {
//     // Handle the response...
//     console.log("response", response);
//     res.json(response);
//   })
// ;
});

module.exports = router;
