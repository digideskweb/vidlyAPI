const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
                                               name: {
                                                   type: String,
                                                   required: true,
                                                   minlength: 3,
                                                   maxlength: 50,
                                                   get: (genre) => {
                                                       return (genre.charAt(0).toUpperCase() + genre.slice(1));
                                                   },
                                                   set: (genre) => {
                                                       return (genre.charAt(0).toUpperCase() + genre.slice(1));
                                                   }
                                               },
                                               id: {
                                                   type: Number,
                                                   required: true,
                                                   unique: true,
                                                   min: 1,
                                               },
                                               isGold: {
                                                   type: Boolean,
                                                   default: false,
        
                                               },
                                               phone: {
                                                   type: String,
                                                   required: true,
                                                   minlength: 5,
                                                   maxlength: 50
                                               }
                                           }, {toObject: {getters: true}});
const Customer = mongoose.model('customer', customerSchema);

async function getCustomers() {
    try {
        console.log("Finding all Customers...");
        const customers = await Customer.find().select({_id: 0});
        return Promise.resolve({result: customers, message: null}); //need to
                                                                    // return
                                                                    // Promise
                                                                    // so that
                                                                    // it can
                                                                    // be
                                                                    // awaited
    } catch (e) {                                                // in genresWithDB file
        return Promise.resolve({result: null, message: e.message});
    }
    
}

async function createCustomer(newCustomer) {
    
    const customer = new Customer({
                                      name: newCustomer.name,
                                      id: newCustomer.id,
                                      isGold: newCustomer.isGold,
                                      phone: newCustomer.phone,
        
                                  });
    
    try {
        const result = await customer.save(); //raises exception if customer
                                              // doesnt match schema
        console.log(result);
        return Promise.resolve({result: result, message: null});
    } catch (e) {
        console.log("Could not save document");
        console.log(e.message);
        return Promise.resolve({result: null, message: e.message});
    }
    
}

async function getCustomerById(id) {
    try {
        const customer = await Customer.find({id: id});
        console.log(customer);
        return Promise.resolve({result: customer, message: null});
    } catch (e) {
        console.log('Could not find the customer');
        console.log(e.message);
        return Promise.resolve({result: null, message: e.message});
        
    }
    
}

async function upDateCustomerByID(updateElements) {
    try {
        const upDatedCustomer = await Customer.findOneAndUpdate({id: updateElements.id},
                                                                {
                                                                    $set: updateElements
                                                                },
                                                                {new: true}
        );
        
        if (!upDatedCustomer) {
            return Promise.resolve({
                                       result: null,
                                       message: `Customer with ID : ${updateElements.id} does not exist`
                                   });
        } else {
            return Promise.resolve({result: upDatedCustomer, message: null});
        }
        
    } catch (e) {
        console.log("Could not update Customer");
        return Promise.resolve({result: null, message: e.message});
    }
    
}

async function removeCustomerByID(id) {
    try {
        const customer = await Customer.findOneAndRemove({id: id});
        if (!customer) {
            return Promise.resolve({
                                       result: null,
                                       message: `Customer with ID : ${id} does not exist`
                                   });
        } else {
            return Promise.resolve({result: customer, message: null});
        }
    } catch (e) {
        console.log("Customer Removal Unsuccessfull");
        return Promise.resolve({result: null, message: e.message});
    }
    
}

module.exports = {
    getCustomers,
    createCustomer,
    getCustomerById,
    upDateCustomerByID,
    removeCustomerByID,
};

