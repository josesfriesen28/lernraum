import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const workspaces = sqliteTable('workspaces', { owner: text('owner').primaryKey(), revision: integer('revision').notNull().default(0) });
export const entities = sqliteTable('entities', { owner: text('owner').notNull(), kind: text('kind').notNull(), id: text('id').notNull(), data: text('data').notNull() }, t => [primaryKey({columns:[t.owner,t.kind,t.id]})]);
export const commands = sqliteTable('commands', { owner: text('owner').notNull(), id: text('id').notNull(), expected: integer('expected').notNull(), created: text('created').notNull() }, t => [primaryKey({columns:[t.owner,t.id]})]);
