import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import "source-map-support/register";
import * as elasticsearch from "elasticsearch";
import * as httpAwsEs from "http-aws-es";

const esHost = process.env.ES_ENDPOINT;

const es = new elasticsearch.Client({
  hosts: [esHost],
  connectionClass: httpAwsEs,
});

export const handler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent
) => {
  console.log("Processing events batch from DynamoDB", JSON.stringify(event));

  for (const record of event.Records) {
    console.log("Processing record", JSON.stringify(record));
    try {
      if (record.eventName == "INSERT") {
        await newIndexItem(record);
      }
      if (record.eventName == "MODIFY") {
        await updateIndexItem(record);
      }
      if (record.eventName == "REMOVE") {
        await removeIndexedItem(record);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const newIndexItem = async (record: any) => {
  const newItem = record.dynamodb.NewImage;

  const itemId = newItem.partitionKey.S;

  const body = {
    partitionKey: newItem.partitionKey.S,
    sortKey: newItem.sortKey.S,
    recipeName: newItem.recipeName.S,
    description: newItem.description.S,
    // preparationInfo: newItem.preparationInfo.M,
    ingridients: newItem.ingridients.L,
    // cookingSteps: newItem.cookingSteps.L,
    // createdAt: newItem.createdAt.S,
  };
  console.log("Indexing...", body);
  try {
    await es
      .index({
        index: "recipes-index",
        type: "recipes",
        id: itemId,
        body,
      })
      .then((data) => console.log("index op ", data));
  } catch (error) {
    console.log(error);
  }
};

const updateIndexItem = async (record: any) => {
  const newItem = record.dynamodb.NewImage;

  const itemId = newItem.partitionKey.S;

  const body = {
    partitionKey: newItem.partitionKey.S,
    sortKey: newItem.sortKey.S,
    recipeName: newItem.recipeName.S,
    description: newItem.description.S,
    // preparationInfo: newItem.preparationInfo.M,
    ingridients: newItem.ingridients.L,
    // cookingSteps: newItem.cookingSteps.L,
    // createdAt: newItem.createdAt.S,
  };

  await es.update({
    index: "recipes-index",
    type: "recipes",
    id: itemId,
    body,
  });
};

const removeIndexedItem = async (record: any) => {
  const deletedItemKeys = record.dynamodb.Keys;

  const itemKey = deletedItemKeys.partitionKey.S;

  await es.delete({
    index: "recipes-index",
    type: "recipes",
    id: itemKey,
  });
};
