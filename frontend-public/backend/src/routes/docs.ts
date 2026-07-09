/**
 * B-107f: API Documentation (Swagger/OpenAPI)
 *
 * Generates an OpenAPI 3.0 JSON spec served at GET /docs.
 * Lightweight — no extra dependencies, just a JSON file and a route.
 */

import { Router, Request, Response } from 'express';

const router = Router();

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Monastery360 Backend API',
    description: 'REST API for exploring Sikkim\'s sacred monasteries, festivals, virtual tours, and media.',
    version: '1.0.0',
    contact: { name: 'Monastery360 Team' },
    license: { name: 'MIT' },
  },
  servers: [
    { url: 'http://localhost:4000', description: 'Development' },
  ],
  components: {
    schemas: {
      Monastery: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'rumtek' },
          name: { type: 'string', example: 'Rumtek Monastery' },
          description: { type: 'string' },
          history: { type: 'string' },
          architecture: { type: 'string' },
          rituals: { type: 'string' },
          foundedYear: { type: 'integer', example: 1740 },
          location: {
            type: 'object',
            properties: {
              latitude: { type: 'number', example: 27.2877 },
              longitude: { type: 'number', example: 88.5682 },
              address: { type: 'string' },
            },
          },
          images: { type: 'array', items: { type: 'string' } },
          virtualTourId: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Festival: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          date: { type: 'string', format: 'date' },
          duration: { type: 'integer' },
          significance: { type: 'string' },
          monasteryId: { type: 'string' },
          monastery: { $ref: '#/components/schemas/Monastery' },
          images: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Tour: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          panoramaUrl: { type: 'string', nullable: true },
          monasteryId: { type: 'string' },
          monastery: { $ref: '#/components/schemas/Monastery' },
          images: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Media: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          fileName: { type: 'string' },
          filePath: { type: 'string' },
          thumbnailPath: { type: 'string', nullable: true },
          fileType: { type: 'string', enum: ['image', 'panoramic', 'video', 'audio'] },
          description: { type: 'string', nullable: true },
          monasteryId: { type: 'string', nullable: true },
          festivalId: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          data: {},
          message: { type: 'string' },
          statusCode: { type: 'integer' },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          data: { type: 'array' },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
          message: { type: 'string' },
          statusCode: { type: 'integer' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check with DB connectivity',
        tags: ['System'],
        responses: {
          '200': { description: 'Service is healthy' },
          '503': { description: 'Service is unhealthy' },
        },
      },
    },
    '/monasteries': {
      get: {
        summary: 'List all monasteries (paginated)',
        tags: ['Monasteries'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
        ],
        responses: {
          '200': { description: 'Paginated list of monasteries' },
        },
      },
      post: {
        summary: 'Create a new monastery',
        tags: ['Monasteries'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'history', 'architecture', 'rituals', 'foundedYear', 'latitude', 'longitude', 'address'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  history: { type: 'string' },
                  architecture: { type: 'string' },
                  rituals: { type: 'string' },
                  foundedYear: { type: 'integer' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  address: { type: 'string' },
                  images: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Monastery created' },
          '400': { description: 'Validation error' },
        },
      },
    },
    '/monasteries/search': {
      get: {
        summary: 'Search monasteries by name/description/address',
        tags: ['Monasteries'],
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          '200': { description: 'Search results' },
          '400': { description: 'Missing query parameter' },
        },
      },
    },
    '/monasteries/{id}': {
      get: {
        summary: 'Get monastery by ID',
        tags: ['Monasteries'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Monastery details' },
          '404': { description: 'Not found' },
        },
      },
      put: {
        summary: 'Update a monastery',
        tags: ['Monasteries'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Monastery updated' },
          '404': { description: 'Not found' },
        },
      },
      delete: {
        summary: 'Delete a monastery',
        tags: ['Monasteries'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Monastery deleted' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/festivals': {
      get: {
        summary: 'List all festivals (paginated)',
        tags: ['Festivals'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'include', in: 'query', schema: { type: 'string', enum: ['monastery'] } },
        ],
        responses: {
          '200': { description: 'Paginated list of festivals' },
        },
      },
    },
    '/festivals/upcoming': {
      get: {
        summary: 'List upcoming festivals',
        tags: ['Festivals'],
        responses: { '200': { description: 'Upcoming festivals' } },
      },
    },
    '/festivals/past': {
      get: {
        summary: 'List past festivals',
        tags: ['Festivals'],
        responses: { '200': { description: 'Past festivals' } },
      },
    },
    '/festivals/{id}': {
      get: {
        summary: 'Get festival by ID',
        tags: ['Festivals'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Festival details' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/tours': {
      get: {
        summary: 'List all tours (paginated)',
        tags: ['Tours'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'include', in: 'query', schema: { type: 'string', enum: ['monastery'] } },
        ],
        responses: { '200': { description: 'Paginated list of tours' } },
      },
    },
    '/tours/monastery/{monasteryId}': {
      get: {
        summary: 'List tours by monastery',
        tags: ['Tours'],
        parameters: [{ name: 'monasteryId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Tours for the given monastery' } },
      },
    },
    '/tours/{id}': {
      get: {
        summary: 'Get tour by ID',
        tags: ['Tours'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Tour details' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/media': {
      get: {
        summary: 'List all media (paginated)',
        tags: ['Media'],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['image', 'panoramic', 'video', 'audio'] } },
        ],
        responses: { '200': { description: 'Paginated list of media' } },
      },
    },
    '/media/monastery/{monasteryId}': {
      get: {
        summary: 'List media by monastery',
        tags: ['Media'],
        parameters: [{ name: 'monasteryId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Media for the given monastery' } },
      },
    },
    '/media/festival/{festivalId}': {
      get: {
        summary: 'List media by festival',
        tags: ['Media'],
        parameters: [{ name: 'festivalId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Media for the given festival' } },
      },
    },
    '/media/{id}': {
      get: {
        summary: 'Get media by ID',
        tags: ['Media'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Media details' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/media/{id}/thumbnail': {
      get: {
        summary: 'Get thumbnail for media',
        tags: ['Media'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Redirect to thumbnail image' },
          '404': { description: 'No thumbnail available' },
        },
      },
    },
    '/media/upload': {
      post: {
        summary: 'Upload a media file',
        tags: ['Media'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: { type: 'string', format: 'binary' },
                  description: { type: 'string' },
                  monasteryId: { type: 'string' },
                  festivalId: { type: 'string' },
                  fileType: { type: 'string', enum: ['image', 'panoramic', 'video', 'audio'] },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'File uploaded successfully' },
          '400': { description: 'Invalid file type or size' },
        },
      },
    },
  },
};

// Serve OpenAPI spec as JSON
router.get('/', (_req: Request, res: Response) => {
  res.json(openApiSpec);
});

// Serve a minimal HTML page that loads Swagger UI from CDN
router.get('/ui', (_req: Request, res: Response) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Monastery360 API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({ url: '/docs', dom_id: '#swagger-ui', presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset], layout: 'BaseLayout' });
  </script>
</body>
</html>`);
});

export default router;
