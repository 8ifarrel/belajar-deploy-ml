const {postPredictHandler, predictHistories} = require('../server/handler');
     
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1000 * 1000,
        allow: 'multipart/form-data',
        multipart: true,
        parse: true, 
        output: 'stream',
      }
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: predictHistories
    
  }
]
 
module.exports = routes;