const express = require('express');
const router = express.Router();
const Joi = require('joi');
const customerDB = require('../database/customerDB');

const schema = {
    name: Joi.string().min(3).required(),
    id: Joi.number().min(1).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(50),
};

//GET REQUEST TO SERVER TO SEE ALL Customers
router.get('/', (req, res) => {
    
    customerDB.getCustomers()
              .then((result) => {
                  if (!result.message) {
                      res.send(result.result);
                      return;
                  } else {
                      res.status(404).send(result.message);
                      return;
                  }
        
              });
    ; //no need for catch block. always returns resolved promise
    
});

//GET Request to Server to see a particular Customer
router.get('/:id', (req, res) => {
    //See if id of course exists
    const param_id = parseInt(req.params.id);
    
    customerDB.getCustomerById(param_id)
              .then((result) => {
                  if (!result.message) {
                      if (result.result.length === 0) {
                          res.status(404).send(`Customer with ID: ${param_id} doesnt exist`);
                          return;
                      } else {
                          res.send(result.result);
                          return;
                      }
            
                  } else {
                      res.status(404).send(result.message);
                      return;
                  }
        
              });
    
});

// POST Request to create a new customer
router.post('/:id', (req, res) => {
    const param_id = parseInt(req.params.id);
    const body = req.body;
    body.id = param_id;
    const result = validateCustomer(body);
    
    if (result.error) {
        res.status(404).send(`BAD Request. ${result.error.details[0].message}`);
        return;
    }
    
    // const new_customer = {
    //     name: body.name,
    //     id: param_id,
    // };
    
    customerDB.createCustomer(body)
              .then((result) => {
                  if (!result.message) {
                      res.send(result.result);
                  } else {
                      res.status(404).send(result.message);
                      return;
                  }
        
              });
    
});

//PUT Request to Update a particular Customer
router.put('/:id', (req, res) => {
    
    const param_id = parseInt(req.params.id);
    const body = req.body;
    body.id = param_id;
    
    const result = validateCustomer(body);
    
    if (result.error) {
        res.status(404).send(`${result.error.details[0].message}`);
        return;
    } else {
        customerDB.upDateCustomerByID(body)
                  .then((result) => {
                      if (!result.result) {
                          res.status(404).send(result.message);
                      } else {
                          res.send(result.result);
                      }
                  });
        
    }
    
});

//DELETE Request to Delete a Particular Customer
router.delete('/:id', (req, res) => {
    const param_id = parseInt(req.params.id);
    
    customerDB.removeCustomerByID(param_id)
              .then((result) => {
                  if (!result.result) {
                      res.status(404).send(result.message);
                      return;
                  } else {
                      res.send(result.result);
                      return;
                  }
              });
    
});

function validateCustomer(requestBody) {
    return Joi.validate(requestBody, schema);
    
}

module.exports = router;