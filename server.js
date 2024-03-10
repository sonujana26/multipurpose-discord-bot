const app = require('express')();

app.get('/', (req, res) => res.send('Olympus is online!'));

module.exports = () => {
  app.listen(3000);
}