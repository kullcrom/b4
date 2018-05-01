'use strict';

/**
 * Provides API enpoints for searching the books index.
 */

 const request = require('request');
 
 module.exports = (app, es) => {
    const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;

     /**
    * Search for books matching a particular field value.
    * Example: /api/search/books/authors/Twain
    */
    app.get('/api/search/books/:field/:query', (req, res) => {
        const esReqBody = {
            size: 10,
            query: {
                match: {
                    [req.params.field]: req.params.query
                }
            }
        };

        const options = {
            url,
            json: true,
            body: esReqBody
        };

        request.get(options, (err, esRes, esResBody) => {
            if (err) {
                res.status(502).json({
                    error: 'bad_gateway',
                    reason: err.code
                });
                return;
            }

            if (esRes.statusCode !== 200) {
                res.status(esRes.statusCode).json(esResBody);
                return;
            }

            res.status(200).json(esResBody.hits.hits.map(({_source}) => _source));
        });
    });

    /**
     * Collect suggested terms for a given field based on a given query.
     * Example: /api/suggests/authors/lipman
     */
    app.get('/api/suggest/:field/:query', (req, res) => {

    });
 };