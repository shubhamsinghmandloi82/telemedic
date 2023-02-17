import { Schema, model} from "mongoose";

const activityLogSchema: Schema = new Schema(
  {
    roleId : { type: String, required: true },
    userType : { type: String, required: true },
    type: { type: String, required: true },
    time: { type: String, required: true },
    macAddress: { type: String, required: true },
    endPoint : { type: String, required: true },
    data : {type: Object, required: true }
  },
  {
    timestamps: true
  }
);

const activityLog = model(
  "activityLog",
  activityLogSchema
);

export default activityLog;
