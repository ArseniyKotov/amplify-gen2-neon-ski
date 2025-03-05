import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Resort: a.model({
    id: a.id(),
    name: a.string().required(),
    location: a.string().required(),
    description: a.string(),
    elevation: a.integer(),
    numberOfTrails: a.integer(),
    difficulty: a.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
    imageUrl: a.string(),
    adventures: a.hasMany("Adventure", "resortId"),
  }).authorization((allow) => [
    allow.guest().to(["read"]),
    allow.owner().to(["read", "create", "update", "delete"]),
  ]),

  Adventure: a.model({
    id: a.id(),
    title: a.string().required(),
    startDate: a.datetime().required(),
    endDate: a.datetime().required(),
    userId: a.id().required(),
    user: a.belongsTo("User", "userId"),
    resortId: a.id().required(),
    resort: a.belongsTo("Resort", "resortId"),
    activities: a.hasMany("Activity", "adventureId"),
    participants: a.hasMany("Participant", "adventureId"),
    gear: a.hasMany("Gear", "adventureId"),
  }).authorization((allow) => [
    allow.owner().to(["read", "create", "update", "delete"]),
  ]),

  User: a.model({
    id: a.id(),
    username: a.string().required(),
    email: a.string().required(),
    profilePicture: a.string(),
    skillLevel: a.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
    adventures: a.hasMany("Adventure", "userId"),
    participatingIn: a.hasMany("Participant", "userId"),
  }).authorization((allow) => [
    allow.owner().to(["read", "create", "update", "delete"]),
  ]),

  Activity: a.model({
    id: a.id(),
    name: a.string().required(),
    type: a.enum(["SKI", "SNOWBOARD", "LESSON", "APRES_SKI", "OTHER"]),
    date: a.datetime().required(),
    duration: a.integer(), // in minutes
    adventureId: a.id().required(),
    adventure: a.belongsTo("Adventure", "adventureId"),
  }).authorization((allow) => [
    allow.owner().to(["read", "create", "update", "delete"]),
  ]),

  Participant: a.model({
    id: a.id(),
    userId: a.id().required(),
    user: a.belongsTo("User", "userId"),
    adventureId: a.id().required(),
    adventure: a.belongsTo("Adventure", "adventureId"),
    status: a.enum(["INVITED", "CONFIRMED", "DECLINED"]),
  }).authorization((allow) => [
    allow.owner().to(["read", "create", "update", "delete"]),
  ]),

  Gear: a.model({
    id: a.id(),
    name: a.string().required(),
    type: a.enum(["SKI", "SNOWBOARD", "HELMET", "GOGGLES", "CLOTHING", "OTHER"]),
    status: a.enum(["OWNED", "NEED_TO_BUY", "NEED_TO_RENT"]),
    adventureId: a.id().required(),
    adventure: a.belongsTo("Adventure", "adventureId"),
  }).authorization((allow) => [
    allow.owner().to(["read", "create", "update", "delete"]),
  ]),
}).authorization((allow) => [
  allow.guest().to(["read"]),
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
