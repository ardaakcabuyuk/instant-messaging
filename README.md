# CS411 Project 2 - Instant Messaging App

## Project Structure:
This project is implemented with Express.js and PostgreSQL. There is no need for a front-end framework since the program changes the DOM elements dynamically.

## Preparation
Make sure you have npm and postgres is installed in your machine. The project uses a single table named "messages". Therefore, you need to create a database and a table "messages" inside it.

CREATE TABLE messages (
  ID SERIAL PRIMARY KEY,
  group_name VARCHAR(30),
  channel VARCHAR(30),
  username VARCHAR(30),
  time VARCHAR(8),
  text VARCHAR(160)
);

## Running the code
- Go to the project directory after cloning. 
- Then, open a terminal and run the command "nodemon run dev". 
- Then, open a browser and go to "localhost:3000". 
- If you want to test the instant messaging feature, you can open another browser (not a tab) and go to "localhost:3000".
- Check the data.js file for user credentials that you can use to login. Ex: (username: arda, password: ardapw && username: elif, password: elifpw)
- You can select group and channel and start to chat. After leaving and rejoining the same group or channel, message history will be available.

