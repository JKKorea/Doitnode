var Sequelize = require('sequelize');

var connection = new Sequelize('demo_schema','root','root');

var Article = connection.define('article', {
	slug: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	title: Sequelize.STRING,
	body: Sequelize.TEXT }, 
	{hooks: {
			beforeValidate: function(){
				console.log('beforeValidate');
			},
			afterValidate: function(){
				console.log('afterValidate');
			},
			beforeCreate: function(){
				console.log('beforeCreate');
			},
			afterCreate: function(res){
				console.log('afterCreate: Created article with slug', res.dataValues.slug);
			}
}});
	// body: {
	// 	type: Sequelize.TEXT,
		// defaultValue: 'Coming soon...'
		// validate: {
		// 	startsWithUpper: function (bodyVal){
		// 		var first = bodyVal.charAt(0);
		// 		var startsWithUpper = first === first.toUpperCase();
		// 		if (!startsWithUpper){
		// 			throw new Error('First letter must be a uppercase letter.')
		// 		} else {
		// 			// ...
		// 		}
		// 	}
		// }

connection
	.sync({
		force: true,
		// logging: console.log
	})
	.then(function(){
		Article.create({
			slug: 'some-slug',
			title: 'some Title',
			body: 'some body'
		})
	})
	.catch(function(err){
		console.log(err);
	});