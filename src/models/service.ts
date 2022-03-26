import mongoose from "mongoose";

export default class Service {
    protected collection: typeof mongoose.Model;

    public constructor(collectionName: string, schema: mongoose.SchemaDefinition) {
        this.collection = mongoose.model(collectionName, new mongoose.Schema(schema));
    }
}
