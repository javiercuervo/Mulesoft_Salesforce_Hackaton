'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

 
function showBasket(agent) {
  if (agent.getContext('basket')){
    const basket = agent.getContext('basket'),
          basketItems = basket.parameters.items,
          itemKeys = Object.keys(basketItems);
    
    var basketOutput = `Hasta ahora has añadido:`;
    for (let i = 0; i < itemKeys.length; i++) {
      let item = basketItems[itemKeys[i]];
      if ((i > 0) && (i === itemKeys.lenght - 1)) {
        basketOutput += ` and `;
      }
      else if (i > 0) {
        basketOutput +=`, `;
      }
      basketOutput += `bolso de ${item.material} con asa de ${item.asa} y funda ${item.funda}`;
    }
    agent.add(basketOutput);
  }
  else {
    agent.add(`Aún no hay nada en tu cesta.`);
  }
}
  
function confirmItem(agent) {
  const item = agent.getContext ('item'),
        material = item.parameters.material,
        asa = item.parameters.asa,
        funda = item.parameters.funda;
  
  var basketContext = {'name': 'basket', 'lifespan': 50, 'parameters': {}}, 
    items = {};
  if (agent.getContext ('basket')) {
    items = agent.getContext('basket').parameters.items;
  }
  items[request.body.responseId] = {
    "material": material,
    "asa": asa,
    "funda": funda
  };
  basketContext.parameters.items = items;
  console.log(JSON.stringify(basketContext));
  agent.setContext(basketContext);
  agent.add(`Confirmando el pedido de bolso de ${item.material} con asa de ${item.asa} y funda ${item.funda}. ¿Algo más?`);
}
  
  let intentMap = new Map();
  intentMap.set('order.showbasket', showBasket);
  intentMap.set('item.confirm.yes', confirmItem);
  agent.handleRequest(intentMap);
});
  
