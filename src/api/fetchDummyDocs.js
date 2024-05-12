// Filename - components/fetchDocs.js
// accesses ToDoList container

const { CosmosClient } = require("@azure/cosmos");
const primaryConnectionString = "AccountEndpoint=https://histology-slides.documents.azure.com:443/;AccountKey=GmdsdPHLCCPh8aaxrwRBKE5zU6IZTFXS7mybAU2RnAvkkDSxNFvhXa5SViiAOq9UQkGvemH7W6ZHACDbrZP3DQ==;";
const client = new CosmosClient(primaryConnectionString);

// database and container details
const databaseId = "ToDoList";
const containerId = "Items";

async function fetchDocuments() {
    try {
        const database = client.database(databaseId);
        const container = database.container(containerId);

        const querySpec = {
            query: "SELECT * FROM c"
        };

        const { resources: items } = await container.items.query(querySpec).fetchAll();
        return items[1];
    } catch (error) {
        console.error("Error fetching documents:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

// fetchDocuments();
module.exports = fetchDocuments;