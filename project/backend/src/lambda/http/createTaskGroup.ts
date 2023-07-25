import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTaskGroupRequest } from '../../requests/CreateTaskGroupRequest'
import { getUserId } from '../utils';
import { createTaskGroup } from '../../businessLogic/taskGroup'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTaskGroup: CreateTaskGroupRequest = JSON.parse(event.body)
    console.log('Processing event: ', event)
    const newItem = await createTaskGroup(newTaskGroup, getUserId(event))

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }
)


handler.use(
  cors({
    credentials: true
  })
)
