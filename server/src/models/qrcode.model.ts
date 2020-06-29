import { Application } from "../declarations";

export default function (app: Application) {
  const modelName = "qrcode";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      uuid: { type: String, required: true, unique: true },
      qrcode: { type: String, required: true },
      validUntil: {
        type: Date,
        validate: {
          validator: function (date: Date) {
            return date > new Date();
          },
          message: "Date needs to be greater then at the moment created",
        },
      },
      type: {
        type: String,
        enum: ["definitive", "temporary", "onetime"],
        default: "onetime",
      },
      associatedName: { type: String },
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
