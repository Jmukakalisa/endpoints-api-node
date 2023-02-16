import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
      openapi: '3.0.0',
      info:{
        title: 'Blog API',
        version: '1.0.0',
        description: 'An API for managing blog posts, comments, and likes.',
      },
    //   servers:[
    //     {
    //       url: 'http://localhost:3000/api/v1'
    //     },
    //   ],
      components: {
        securitySchemes: {
          jwt: {
            type: 'http',
            scheme: 'bearer',
            in: 'header',
            bearerFormat: 'JWT',
          },
        },
      },
      swagger: '3.0',
    },
    apis: ['./routes/*.js']
    };

    const swaggerSpec = swaggerJsdoc(options);

    const swaggerDocument = (app, port) => {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    console.info(`Documentation available at http://localhost:${port}/docs`);
};

export default swaggerDocument
