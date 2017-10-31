const {getUser} = require('../model/user_queries');
const redis = require('redis');
const sendemail = require('sendemail');
require('env2')('config.env');

const email = sendemail.email;
sendemail.set_template_directory('src/email_templates');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

exports.get = (req, res) => {
  res.render('forgot', {
    activePage: {
      forgot: true
    },
    pageTitle: 'Forgotten password'
  });
};

exports.post = (req, res) => {

  getUser(req.body.email).then((userObj) => {
    if (userObj) {
      const token = guid();
      const client = redis.createClient();

      client.on('error', (error) => {
        console.log('error', error);
      });
      client.set(req.body.email, token);

      const person = {
        name: userObj.name,
        email: userObj.email,
        subject: 'All about me - reset your password',
        url: `https://test${token}`
      }
      email('reset', person, (error, result) => {
        if (error) {
          console.log('error', error);
          res.render('forgot', {
            messages: [
              {
                content: 'There was an error with sending the password recovery email, please try again.',
                error: true
              }
            ],
            activePage: {
              forgot: true
            },
            pageTitle: 'Forgotten password'
          });
        } else {
          res.render('forgot', {
            messages: [
              {
                content: 'Success! Please check your email and follow the instructions in order to reset your password.',
                error: true
              }
            ],
            activePage: {
              forgot: true
            },
            pageTitle: 'Forgotten password'
          });
        }
      });
    } else {
      res.render('forgot', {
        messages: [
          {
            content: 'There is no registered user with the email address provided.',
            error: true
          }
        ],
        activePage: {
          forgot: true
        },
        pageTitle: 'Forgotten password'
      });
    }
  });
};