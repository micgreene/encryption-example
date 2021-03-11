'use strict';

const base64 = require('base-64'); // encoded for passing over the internet
const bcrypt = require('bcrypt');

//pass me over the internet
let details = 'usrename:p@sswerd'; //format for passing username and password over the internet before being encoded

let encoded = base64.encode(details);
console.log('details:  ', encoded);

let decoded = base64.decode(encoded);
console.log('decoded:  ', decoded);

//hash me and save me to the database
let pw = 'myCoolpassword';
let salt = 10;

async function encrypt(password, complexity){
  let hashed = await bcrypt.hash(password, complexity);

  console.log('crazy hash', hashed);

  let checkPW = await bcrypt.compare(password, hashed);//(plaintTextPW, encyptedPW)

  console.log('Comparing \'password\' and \'hashed.\' Do these passwords match?', checkPW)
}
encrypt(pw, salt);