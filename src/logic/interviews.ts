import { OkPacket, RowDataPacket } from 'mysql2'
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

interface UserInterview {
  id: number
  availability: string
  phoneNumber: string
  birthdate: string
  createdAt: string
}

export const getLatestUserInterviews = async (
  limit: number
): Promise<UserInterview[]> => {
  const [rows] = await db.pool.query<RowDataPacket[]>(
    `SELECT id, availability, phone_number, birthdate, created_at 
     FROM user_interviews 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [limit]
  )

  return rows.map((row) => ({
    id: row.id,
    availability: row.availability,
    phoneNumber: row.phone_number,
    birthdate: row.birthdate,
    createdAt: row.created_at,
  }))
}
