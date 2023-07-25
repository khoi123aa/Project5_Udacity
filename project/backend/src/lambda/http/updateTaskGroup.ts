import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';

import { updateTaskGroup } from '../../businessLogic/taskGroup'
import { UpdateTaskGroupRequest } from '../../requests/UpdateTaskGroupRequest'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const taskGroupId = event.pathParameters.taskGroupId
        const updatedTaskGroup: UpdateTaskGroupRequest = JSON.parse(event.body)
        await updateTaskGroup(taskGroupId,getUserId(event), updatedTaskGroup)
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(updatedTaskGroup)
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
