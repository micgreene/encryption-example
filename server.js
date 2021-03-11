'use strict';

//bring in 3rd party npm dependencies
const express = require('express');
const bcrypt = require('bcrypt');//crypto for password managemenet
const base64 = require('base-64');//encoding/decoding of username:pw

//opens public access to our API
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors());
//sign up and sign in come from forms on a frontend - this can process form data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//mongoose schema (blueprint for db dta)
const usersSchema = mongoose.Schema({ //.Schema is a constructor
  username: {type: String, required: true},
  password: {typ: String, required: true }
})

//assigning the user model to add users to the db
//creates a 'users' collection in the db
const Users = mongoose.model('Users', usersSchema);

app.post('/signup', async (req, res)=>{
  try{
    req.body.password = await bcrypt.hash(req.body.password, 10);
    //instantiate new user with username and pw
    const user = new Users(req.body);
    console.log('new user: ', user);
    
    //save new user to the db
    const record = await user.save(req.body);
    
    //(for now) return user info, will return auth tokens or pages 
    res.status(200).json(record);//only for learning purposes, don't send back password data in real life
  } catch {
    //if our hashing doesnt work for some reason on the bcrypt side, return an error to the user
    res.status(500).send('error while trying to create user');
  }
});

//sign-in will pull the username:password off of an "authorization" header
//the username:password will already be in base64 upon receipt
//we decode it, find the user in the db, check the db assword (hashed) against the plaintext password
app.post('sign-in', async(req,res)=>{
  let basicAuthParts = req.headers.authorization.split(' ');//'authorization' is a custom header, it can be changed to anythingbasic 

  let encidedUser = basicAuthParts.pop(); //username:password as base64 -> 
  
  let decoded = base64.decode(encodedUser);//username:password
  
  let [username, password] = decoded.split(':');//destructuring

  try{
    const user = await Users.findOne({username: username});
    const valid = await bcrypt.compare(password, user.password);
  } catch {
    //compare the plain text password we pulled off the req.authorization header and compare it with the plain text password of the user
    //if valid, "valid" will be true
    const valid = await bcrypt.compare(password, user.password)

    if(valid){
      res.status(200).json({loggedIn: true})
    } else {
      console.error('user could not be retrieved')
    }
  } 
})

let options = {useNewUrlParser: true, useUnifiedTopology: true};
mongoose.connect('mongodb://localhost:27017/api-server', options)
  .then(
    app.listen(PORT, ()=>{
      console.log('server up: ', PORT)
    })).catch(err =>{
      console.error('Database Error: ', err.message);
    });
