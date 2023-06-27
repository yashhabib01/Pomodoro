import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dayjs from "dayjs";

const resolvers = {
  Query: {
    getTasks: async (_, args, context) => {
      const user = context.user;
      const tasks = await prisma.task.findMany({
        where: {
          userId: user.id,
        },
      });

      return tasks;
    },

    getTask: async (_, args, context) => {
      const user = context.user;
      const task = await prisma.task.findFirst({
        where: {
          userId: user.id,
          id: args.id,
        },
      });

      return task;
    },

    getPomodoro: async (_, args, context) => {
      const user = context.user;
      const pomodoro = await prisma.pomodoro.findFirst({
        where: {
          userId: user.id,
        },
      });

      return pomodoro;
    },
  },
  Mutation: {
    createTask: async (_, args, context) => {
      const user = context.user;
      const { title, description, dueDate, priority, tomatoes } = args;
      const task = await prisma.task.create({
        data: {
          title: title,
          description: description,
          dueDate: dayjs(dueDate).toDate(),
          priority: priority,
          tomatoes: tomatoes,
          userId: user.id,
        },
      });

      return task;
    },
    updateTask: async (_, args, context) => {
      const user = context.user;
      const { id, title, description, dueDate, priority, tomatoes, completed } =
        args;
      await prisma.task.updateMany({
        where: {
          id: id,
          userId: user.id,
        },
        data: {
          title: title,
          description: description,
          dueDate: dayjs(dueDate).toDate(),
          priority: priority,
          tomatoes: tomatoes,
          completed: completed,
        },
      });

      const task = await prisma.task.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });

      return task;
    },
    createPomodoro: async (_, args, context) => {
      const userId = context.user.id;
      const taskId = args.taskId;
      const time = args.time;
      const pomodoro = await prisma.pomodoro.upsert({
        where: {
          userId: userId,
          taskId: taskId,
        },
        update: {},
        create: {
          userId: userId,
          taskId,
          taskId,
          time: time,
        },
      });

      return pomodoro;
    },
    deleteTask: async (_, args, context) => {
      const task = await prisma.task.delete({
        where: {
          id: args.id,
        },
      });
      console.log(task);

      return task;
    },
  },
  Task: {
    user: async (_, args, context) => {
      const userId = context.user.id;
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      return user;
    },
  },
  User: {
    tasks: async (_, args, context) => {
      const userId = context.user.id;
      const tasks = await prisma.task.findMany({
        where: {
          userId: userId,
        },
      });

      return tasks;
    },
  },
};

export default resolvers;
