const express = require('express');
const { createEventAdapter } = require('@slack/events-api');
const routr = express.Router();

module.exports = params => {
  const { config } = params;

  const slackEvents = createEventAdapter(config.slack.signingSecret);

  return router;
};
