const action = {
  key: "CreateEventTemplate",
  title: "Create event template",
  description: "Create a new event template based on a draft event and an event guide.",
  type: "create",
  inputParameters: [], // TODO: Add input parameters.
  operation: {
    type: "js",
    handler,
  },
  outputParameters: [], // TODO: Add output parameters.
};

async function handler({ inputParameters, configurationParameters, connector, action }) {
  
  // TODO: Implement the action logic.

  return {};
}

// Expose internal functions for unit testing in the test environment.
// Otherwise, export the action definition.
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    handler,
  };
} else {
  module.exports = action;
}
