import { defineConfig } from 'orval';

export default defineConfig({
  naherbApi: {
    input: '../docs/openapi.yml',
    output: {
      mode: 'tags-split',
      target: 'src/services/generated/api.ts',
      schemas: 'src/services/generated/model',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: 'src/services/api-client.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
