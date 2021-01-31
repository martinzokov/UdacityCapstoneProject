import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getRecipes } from '../../businessLayer/recipesActions'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
    const userId = getUserId(event)
    console.log(userId)
    const items = await getRecipes(userId)
  
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items
      })
    }
  }catch(error){
    logger.error(`error during recipe fetch ${error}`)
  }
  
}
