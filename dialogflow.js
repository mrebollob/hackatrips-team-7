const DialogflowApp = require('actions-on-google').DialogflowApp; // Google Assistant helper library

module.exports.webhook = function (request, response) {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  if (request.body.result) {
    processV1Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
}

function processV1Request(request, response) {
  let action = request.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
  console.log('ACTION:', action);

  let parameters = request.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
  let inputContexts = request.body.result.contexts; // https://dialogflow.com/docs/contexts
  let requestSource = (request.body.originalRequest) ? request.body.originalRequest.source : undefined;
  const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests
  const app = new DialogflowApp({ request: request, response: response });


  // Create handlers for Dialogflow actions as well as a 'default' handler
  const actionHandlers = {
    // The default welcome intent has been matched, welcome the user (https://dialogflow.com/docs/events#default_welcome_intent)
    'input.welcome': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      if (requestSource === googleAssistantRequest) {
        sendGoogleResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
      } else {
        sendResponse('Hello, Welcome to my Dialogflow agent!'); // Send simple response to user
      }
    },
    // The default fallback intent has been matched, try to recover (https://dialogflow.com/docs/intents#fallback_intents)
    'input.unknown': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      if (requestSource === googleAssistantRequest) {
        sendGoogleResponse('I\'m having trouble, can you try that again?'); // Send simple response to user
      } else {
        sendResponse('I\'m having trouble, can you try that again?'); // Send simple response to user
      }
    },
    // Default handler for unknown or undefined actions
    'default': () => {
      // Use the Actions on Google lib to respond to Google requests; for other requests use JSON
      if (requestSource === googleAssistantRequest) {
        let responseToUser = {
          googleRichResponse: carouselResponse, // Optional, uncomment to enable
          //googleOutputContexts: ['weather', 2, { ['city']: 'rome' }], // Optional, uncomment to enable
          //   speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
          //   text: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
        };
        sendCarouselResponse()
        // sendGoogleResponse(responseToUser);
      } else {
        let responseToUser = {
          //data: richResponsesV1, // Optional, uncomment to enable
          //outputContexts: [{'name': 'weather', 'lifespan': 2, 'parameters': {'city': 'Rome'}}], // Optional, uncomment to enable
          speech: 'This message is from Dialogflow\'s Cloud Functions for Firebase editor!', // spoken response
          text: 'This is from Dialogflow\'s Cloud Functions for Firebase editor! :-)' // displayed response
        };
        sendResponse(responseToUser);
      }
    }
  };
  // If undefined or unknown action use the default handler
  if (!actionHandlers[action]) {
    action = 'default';
  }

  // Run the proper handler function to handle the request from Dialogflow
  actionHandlers[action]();
  // Function to send correctly formatted Google Assistant responses to Dialogflow which are then sent to the user
  function sendGoogleResponse(responseToUser) {
    if (typeof responseToUser === 'string') {
      app.ask(responseToUser); // Google Assistant response
    } else {
      // If speech or displayText is defined use it to respond
      let googleResponse = app.buildRichResponse().addSimpleResponse({
        speech: responseToUser.speech || responseToUser.displayText,
        displayText: responseToUser.displayText || responseToUser.speech
      });
      // Optional: Overwrite previous response with rich response
      if (responseToUser.googleRichResponse) {
        googleResponse = responseToUser.googleRichResponse;
      }
      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      if (responseToUser.googleOutputContexts) {
        app.setContext(...responseToUser.googleOutputContexts);
      }
      console.log('Response to Dialogflow (AoG): ' + JSON.stringify(googleResponse));
      app.ask(googleResponse); // Send response to Dialogflow and Google Assistant
    }
  }

  function sendCarouselResponse() {
    app.askWithCarousel('Marchando unas sugerencias de la casa',
      // Build a carousel
      app.buildCarousel()
        // Add the first item to the carousel
        .addItems(app.buildOptionItem('MATH_AND_PRIME',
          ['math', 'math and prime', 'prime numbers', 'prime'])
          .setTitle('París')
          .setDescription('42 is an abundant number because the sum of its ' +
          'proper divisors 54 is greater…')
          .setImage('http://burgostravel.com/wp-content/uploads/2017/08/paris-attractions-xlarge.jpg', 'Math & prime numbers'))
        // Add the second item to the carousel
        .addItems(app.buildOptionItem('EGYPT',
          ['religion', 'egpyt', 'ancient egyptian'])
          .setTitle('México')
          .setDescription('42 gods who ruled on the fate of the dead in the ' +
          'afterworld. Throughout the under…')
          .setImage('http://ciprodeh.org.hn/wp-content/uploads/2017/07/mexico_large.gif', 'Egypt')
        )
        // Add third item to the carousel
        .addItems(app.buildOptionItem('RECIPES',
          ['recipes', 'recipe', '42 recipes'])
          .setTitle('42 recipes with 42 ingredients')
          .setDescription('Here\'s a beautifully simple recipe that\'s full ' +
          'of flavor! All you need is some ginger and…')
          .setImage('http://example.com/recipe', 'Recipe')
        )
    );
  }
}