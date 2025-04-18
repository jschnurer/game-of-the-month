import { Collection, Db, Document, Filter, MongoClient, ObjectId, Sort, WithId } from 'mongodb';
import settings from '../settings/settings';
import { jsonRegexReviver } from '../utilities/jsonUtilities';
import ApiError from '../validation/ApiError';
import ErrorTypes from '../validation/ErrorTypes';

/////////////////////////////////////////////////////////////////////////////////
// Open a mongo client as soon as the app starts up and save it forever.
let mongoClient: MongoClient | undefined;
async function openDbConnection() {
  mongoClient = await MongoClient.connect(settings.mongoDb.connectionString);
}
openDbConnection();
/////////////////////////////////////////////////////////////////////////////////

export async function getMongo(collectionName?: string): Promise<IMongoHelper> {
  let client: MongoClient;

  if (mongoClient) {
    client = mongoClient;
  } else {
    mongoClient = await MongoClient.connect(settings.mongoDb.connectionString);
    client = mongoClient;
  }

  const db = client.db(settings.mongoDb.db);

  if (!db.collection(collectionName)) {
    await db.createCollection(collectionName);
  }

  return {
    client,
    collection: collectionName ? db.collection(collectionName) : undefined,
    db,
  };
}

export async function find(collection: Collection<Document>, findFilters: any): Promise<WithId<Document>> {
  return (await (collection.find as any)(findFilters).toArray()) as any;
}

export interface IMongoHelper {
  client: MongoClient,
  collection: Collection<Document> | undefined,
  db: Db,
}

export function stringToMongoFilter(str: string | undefined): Filter<WithId<Document>> {
  if (!str) {
    return {};
  }

  try {
    return JSON.parse(str, jsonRegexReviver);
  } catch (err) {
    throw new ApiError(err.message, ErrorTypes.BadRequest);
  }
}

export function stringToMongoSort(str: string | undefined): Sort | undefined {
  if (!str) {
    return undefined;
  }

  try {
    return JSON.parse(str);
  } catch (err) {
    throw new ApiError(err.message, ErrorTypes.BadRequest);
  }
}

export function stringToObjectId(str: any): ObjectId {
  if (!str
    || !str?.toString()
    || !str.toString().trim()) {
    throw new ApiError("Invalid id specified.", ErrorTypes.BadRequest);
  }

  try {
    return new ObjectId(str);
  } catch {
    return str.toString();
  }
}