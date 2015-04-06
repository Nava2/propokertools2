# propokertools2
A redesign of [ProPokerTools](http://propokertools.com/simulations)

## Remote Server
The latest version of this application is hosted on https://stark-inlet-1935.herokuapp.com/ for easier access.

## Local Deployment
### Install

1. Install [node.js](http://nodejs.org/download/)
1. Clone this repository `git clone git@github.com:Nava2/propokertools2.git` or unzip the provided file
1. Go to the directory from previous step and start the nodejs terminal.
1. Execute `npm install`

### Running the application

1. Go to directory from the Install step
1. Execute `node app.js`
1. Open http://localhost:8080/

## Running tests

1. `node test/`


## Deploying to Heroku

Note, not everyone can do this, currently ours is hosted on @Nava2's account.

1. `heroku create`
1. `git push heroku master`
1. `heroku open`

To run locally, replace `heroku` with `foreman`.
