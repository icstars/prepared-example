import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// the port your server runs on - hope 3000 isn't in use!
// if you close your terminal window without properly stopping the server
// it'll be there for a while
const port = 3000;
app.use(cors({ origin: 'http://localhost:5173' }));

const db = mysql.createConnection({
    host: 'thresholds-test.mysql.database.azure.com',
    user: 'test', // Replace with your MySQL username
    port: 3306, // Replace with the port you need - may be different from mine
    password: 'test', // Replace with your MySQL password
    database: 'world', // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// app.get, .post, .push - these are all set to handle different
// HTTP verbs/methods - we should talk about these
// I like to call these "routes"
app.get('/', (req, res) => {
    res.send('Hello World!');
})

// app.get('/cities', (req, res) => {
//     // set up the query needed for this request
//     const query = 'SELECT * FROM city;';

//     // make the query run

//     db.query(query, (err, results) => {
//             // handle the query
//     if (err) {
//         console.log(`whoops! could not get cities, error message is '${err}'`);
//         res.status(500).json({ error: 'Error retrieving cities.'})
//     }
//     else {
//         res.json(results);
//     }

//     })
// })

app.post('/cities_in_population_range', (req, res) => {
    // set up the query needed for this request
    // one thing we need is the form data from the request
    const params = [req.body['min'], req.body['max']]
    // the other thing we need is to actually make a proper prepared statement
    const query = 'SELECT city.ID, city.Name, city.CountryCode, city.Population, country.Name AS Country FROM world.city JOIN world.country ON city.CountryCode = country.Code WHERE city.Population > ? AND city.Population < ?;';
    // make the query run

    db.query(query, params, (err, results) => {
    // handle the query, passing in the parameters from the body
    if (err) {
        console.log(`whoops! could not get cities, error message is '${err}'`);
        res.status(500).json({ error: 'Error retrieving cities.'})
    }
    else {
        console.log(results[0]);
        res.json(results);
    }

    })
})

// starts the app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})