import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TaskGroupItem } from '../models/TaskGroupItem'
import { TaskGroupUpdate } from '../models/TaskGroupUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

export class TaskGroupAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly taskIndex = process.env.TASK_GROUP_TABLE_GSI,
    private readonly taskGroupTable = process.env.TASK_GROUP_TABLE) {
  }

  async deleteTaskGroupById(taskGroupId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.taskGroupTable,
      Key: {
        'taskGroupId': taskGroupId,
        'userId': userId
      }
    }).promise()
  }

  async updateTaskGroup(taskGroupId: string, userId: string, updatedTaskGroup: TaskGroupUpdate){

    await this.docClient.update({
        TableName: this.taskGroupTable,
        Key: {
            "taskGroupId": taskGroupId,
            "userId": userId
        },
        UpdateExpression: "set #name = :name, description = :description",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": updatedTaskGroup.name,
            ":description": updatedTaskGroup.description
        }
    }).promise()
}

  async getTaskGroupByUserId(userId: string): Promise<TaskGroupItem[]> {
    console.log("Called function get task")
    const result = await this.docClient.query({
      TableName: this.taskGroupTable,
      IndexName: this.taskIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    const items = result.Items
    return items as TaskGroupItem[]
  }

  async createTaskGroup(taskGroup: TaskGroupItem): Promise<TaskGroupItem> {
    await this.docClient.put({
      TableName: this.taskGroupTable,
      Item: taskGroup
    }).promise()

    return taskGroup
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
