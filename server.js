const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

let app = express();

const port = process.env.PORT || 3000;
const maintenanceMode = false;


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


// logger
app.use((req,res,next) => {
	let now = new Date().toString();
	let log = `${now}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if(err){
			console.log('Unable to update server.log');
		}
	});
	next();
});

app.use((req, res, next) => {

	if(maintenanceMode){
		res.render('maintenance.hbs', {
			pageTitle: 'Maintenance'
		});
	}
	else{
		next();
	}

});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());


app.get('/', (req, res) => {
	// res.send('<h1>hello express</h1>');
	res.render('home.hbs',{
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to our web site'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Your request failed'
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});