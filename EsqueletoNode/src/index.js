const app = require('./app');

//listening the server
app.listen(app.get('port'), () => {
    console.log('server on port'.rainbow, app.get('port'));
});