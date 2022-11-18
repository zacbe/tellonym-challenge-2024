import request from 'supertest'
import app from '../src/app'
import * as db from '../src/logic/db'

export const getGetHttpResponse = async ({
  path,
  jwtToken,
}: {
  path: string
  jwtToken: string
}): Promise<request.Response> => {
  const response = await request(app)
    .get(path)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${jwtToken}`)

  return response
}

export const sendPostRequest = async ({
  path,
  postBody,
  jwtToken,
}: {
  path: string
  postBody: Record<string, unknown>
  jwtToken: string
}): Promise<request.Response> => {
  const req = request(app)
    .post(path)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${jwtToken}`)

  return req.send(postBody)
}

export const emptyDb = async (): Promise<void> => {
  await db.pool.query('DELETE FROM chats')
  await db.pool.query('DELETE FROM chat_messages')
}
