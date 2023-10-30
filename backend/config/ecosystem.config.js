module.exports = {
  apps : [
    {
      name: "auth",
      script: "npx ts-node ../auth/src/main_api.ts",
      env: {
        "NODE_ENV": "development",
        "API_PORT":"3004",
      }
    },
    {
      name: "catalog",
      script: "npx ts-node ../catalog/src/main_api.ts",
      env: {
        "NODE_ENV": "development",
        "API_PORT":"3002",
      }
    },
    {
      name: "freight",
      script: "npx ts-node ../freight/src/main_api.ts",
      env: {
        "NODE_ENV": "development",
        "API_PORT":"3003",
      }
    },
    {
      name: "checkout",
      script: "npx ts-node ../checkout/src/main_api.ts",
      env: {
        "NODE_ENV": "development",
        "API_PORT":"3001",
      }
    }
  ],
};
