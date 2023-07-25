import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';
import { deleteTaskGroupById } from '../../businessLogic/taskGroup'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const taskGroupId = event.pathParameters.taskGroupId
        await deleteTaskGroupById(taskGroupId, getUserId(event));
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify("Deleted successfully!")
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
