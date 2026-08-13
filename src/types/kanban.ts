import { Task, TaskStatus } from './task';

export interface Column {
  id: TaskStatus;
  title: string;
}

export type BoardState = {
  [K in TaskStatus]: Task[];
};

export const defaultColumns: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' },
];
