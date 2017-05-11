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
		var req = {
			body: {
				approved: true,
				title: 'some title',
				body: 'some body'
			}
		}
		Article.create(req.body).then(function(insertedArticle){
			console.log(insertedArticle.dataValues);
		})
	 //  var articleInstance = Article.build({
		// 	title: 'some title',
		// 	body: 'some body'
		// })
	 //  articleInstance.save()
	})
	.catch(function(err){
		console.log('err', err);
	});