import { OkPacket } from 'mysql2'
import * as db from './db'

interface UserInterviewParams {
  availability: string
  phoneNumber: string
  birthdate: string
}

export const createUserInterview = async ({
  availability,
  phoneNumber,
  birthdate,
}: UserInterviewParams): Promise<number> => {
  const [dbResult] = await db.pool.query<OkPacket>(
    `INSERT INTO user_interviews (availability, phone_number, birthdate) VALUES (?, ?, ?)`,
    [availability, phoneNumber, birthdate]
  )
  return dbResult.insertId
}
