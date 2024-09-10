import dayjs from 'dayjs';
import { client, db } from '.';
import * as schemas from './schema';

async function seed() {
  await clearDatabase();
  await insertValues();
}

async function clearDatabase() {
  await db.delete(schemas.goalCompletions);
  await db.delete(schemas.goals);
}

async function insertValues() {
  const result = await db
    .insert(schemas.goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Me exercitar', desiredWeeklyFrequency: 3 },
      { title: 'Meditar', desiredWeeklyFrequency: 1 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf('week');

  await db.insert(schemas.goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ]);
}

seed().finally(() => {
  client.end();
});
