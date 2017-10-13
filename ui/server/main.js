import { Meteor } from 'meteor/meteor';

import '../imports/startup/accounts-config.js';
import { Measurements } from '../imports/api/measurements.js';

import basicAuth from 'basic-auth';
import bodyParser from 'body-parser';
import { STATUS_CODES } from "http";

const allowedScales = [ 'linkoping', 'stockholm', ]

function basicAuthentication(req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (allowedScales.includes(user.name) && user.pass === 'attentecarbra') {
    return next();
  } else {
    return unauthorized(res);
  };
};

Meteor.startup(() => {
  const measurementPath = "/api/measurement"

  WebApp.connectHandlers.use(measurementPath, basicAuthentication);
  WebApp.connectHandlers.use(measurementPath, bodyParser.json());
  WebApp.connectHandlers.use(measurementPath, function (req, res, next) {
    if (req.method === "POST") {
      console.log(`Grams:' ${req.body.valueInGrams} body: ${req.body}`);
      var user = basicAuth(req);
      Measurements.insert({
        scaleId: user.name,
        timestamp: new Date(),
        valueInGrams: req.body.valueInGrams
      });
      const status = 200
      res.writeHead(status, { "Content-Type": "text/plain" });
      res.end(STATUS_CODES[status]);
    } else {
      next();
    }
  });
});
