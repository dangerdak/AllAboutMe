const {
  saveDrawing,
  getDrawing,
} = require('../model/form_queries');

exports.post = (req, res) => {
  saveDrawing(req.session.id, req.body.fieldName, req.body)
    .then(() => {
      console.log('saved');
      res.end();
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.get = (req, res) => {
  getDrawing(req.session.id, req.query.question + '_svg')
    .then((svgObj) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(svgObj);
    })
    .catch(console.log);
};