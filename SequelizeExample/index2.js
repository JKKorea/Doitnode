var Sequelize = require('sequelize');

var connection = new Sequelize('demo_schema','root','root');

var Article = connection.define('article', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT,
	approved: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}	
})

connection
	.sync({
		force: true,
		// logging: console.log
	})
	.then(function(){
		Article.bulkCreate([
		{
			title: 'Article 1',
			body: 'Article 1'
		},
		{
			title: 'Article 2',
			body: 'Article 2'	
		}
	], {
		validate: true,
		ignoreDuplicates: true
	})	
	})
	.catch(function(err){
		console.log('err', err);
	});