// import 'source-map-support/register'
// import * as uuid from 'uuid'
// import * as AWS  from 'aws-sdk'

// import * as AWSXRay from 'aws-xray-sdk'

// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import { getUserId } from '../utils'
// import { checkTodoExists, saveImage } from '../../businessLayer/recipesActions'
// import { createLogger } from '../../utils/logger'

// const logger = createLogger('addImageToTodo')

// const XAWS = AWSXRay.captureAWS(AWS)

// const s3 = new XAWS.S3({
//   signatureVersion: 'v4'
// })

// const bucketName = process.env.IMAGES_S3_BUCKET
// const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   const todoId = event.pathParameters.todoId
//   const userId = getUserId(event)
//   const validTodoId = await checkTodoExists(todoId,userId)
  
//   if (!validTodoId) {
//     return {
//       statusCode: 404,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Credentials': true
//       },
//       body: JSON.stringify({
//         error: 'Todo does not exist'
//       })
//     }
//   }

//   try{

//   }catch(error){
//     logger.error(`error during image upload ${error}`)
//   }
//   const imageId = uuid.v4()

//   await createImage(todoId, userId, imageId)
//   const url = getUploadUrl(imageId)

//   return {
//     statusCode: 201,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Credentials': true
//     },
//     body: JSON.stringify({
//       uploadUrl: url
//     })
//   }
// }

// async function createImage(todoId: string, userId: string, imageId: string) {
//   const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

//   await saveImage(todoId, userId, imageUrl)

//   return imageUrl
// }

// function getUploadUrl(imageId: string) {
//   return s3.getSignedUrl('putObject', {
//     Bucket: bucketName,
//     Key: imageId,
//     Expires: urlExpiration
//   })
// }

