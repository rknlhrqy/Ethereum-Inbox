// Include assert module.
const assert = require('assert');
// Include ganache-cli module.
const ganache = require('ganache-cli');

// Include the constructor of web3 module.
const Web3 = require('web3');
// Create an instance of Web3, requires ganache's Provider.
const web3 = new Web3(ganache.provider());
// Get the bytecode and interface (ABI) from compile.js
const {interface, bytecode} = require('../compile');

//For explainning Mocha mechanism only.
//will be commented out when not needed.
//Define a class Car.
/*
class Car {
  park() {
    return 'stopped';
  }
  drive() {
    return 'vroom';
  }
}

//Make it a 'global'-like variable
let car;

beforeEach(()=> {
  car = new Car();
});

describe('Test Car', () => {
  it('can park', () => {
    assert.equal(car.park(), 'stopped');
  });
  it('car drive', () => {
    assert.equal(car.drive(), 'vroom');
  });
});
*/
/*
 * Use Promise.
beforeEach(() => {
  //Get a list of unlocked accounts from ganache.
  web3.eth.getAccounts()
    .then(fetchedAccounts => {
      console.log(fetchedAccounts);
    });
  //Use one of these accounts to deploy the contract.
});
*/

// Use Async/Await
let accounts;
let inbox;

const INITIAL_MESSAGE = 'Hi there!';
const NEW_MESSAGE = 'Bye there!';

beforeEach(async () => {
  //Get a list of unlocked accounts from ganache.
  //ganache provides these temporary accounts for you to do the test.
  accounts = await web3.eth.getAccounts();
  //Use one of these accounts to deploy the contract.
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: [INITIAL_MESSAGE]})
    .send({from: accounts[0], gas: '1000000'});
});


describe('Test Inbox', () => {
  it('Deploy a contract', () =>{
    //console.log(inbox);
    //Check whether the contract instance has a valid address.
    //You need to print out inbox and then you can find where address is.
    //In the inbox, it is inside options.
    assert.ok(inbox.options.address);
  });

  it('Has a default message', async () => {
    // You need to print out inbox. And you can find the message() is
    // inside methods.
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage(NEW_MESSAGE).send({from: accounts[0]});
    const message = await inbox.methods.message().call();
    assert.equal(message, NEW_MESSAGE);
  });
});
