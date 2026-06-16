const app = require('../dist/api/index').default;

module.exports = async (req, res) => {
  return app.fetch({
    method: req.method,
    url: `http://${req.headers.host}${req.url}`,
    headers: req.headers,
    body: req.body,
  }).then(response => {
    res.status(response.status);
    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }
    return response.text().then(body => res.send(body));
  });
};
