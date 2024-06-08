import { OkPacket, RowDataPacket } from 'mysql2'
import * as db from './db'

interface UserInterviewParams {
  availability: string
  phoneNumber: string
  birthdate: string
}

interface UserInterview {
  id: number
  availability: string
  phoneNumber: string
  birthdate: string
  createdAt: string
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

const formatUserInterviews = (
  rows: RowDataPacket[]
): { ids: number[]; data: Record<number, UserInterview> } => {
  if (rows.length === 0) return { data: {}, ids: [] }

  const data = rows.reduce((acc, row) => {
    acc[row.id] = {
      id: row.id,
      availability: row.availability,
      phoneNumber: row.phone_number,
      birthdate: row.birthdate,
      createdAt: row.created_at,
    }
    return acc
  }, {} as Record<number, UserInterview>)

  return {
    ids: rows.map((row) => row.id),
    data,
  }
}

export const getLatestUserInterviews = async (
  limit: number
): Promise<Record<number, UserInterview>> => {
  const [rows] = await db.pool.query<RowDataPacket[]>(
    `SELECT id, availability, phone_number, birthdate, created_at 
     FROM user_interviews 
     ORDER BY created_at DESC 
     LIMIT ?`,
    [limit]
  )

  return formatUserInterviews(rows)
}

export const countUserInterviews = async (): Promise<number> => {
  const [rows] = await db.pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as count FROM user_interviews`
  )
  return rows[0].count
}
