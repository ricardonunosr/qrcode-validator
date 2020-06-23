import { Application } from "../declarations";

export default function (app: Application) {
  const modelName = "qrcode";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      uuid: { type: String, required: true },
      qrcode: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  );
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
}
