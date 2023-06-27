const typeDefs = `#graphql
  type Query {
    getTasks: [Task!]
    getTask(id: Int!): Task!
    getPomodoro: Pomodoro
  
  }

  type Mutation {
    completedTask(id: Int!): Task!
    deleteTask(id:Int!):Task!
    updateTask(
      id: Int!
      title: String!
      description: String!
      dueDate: String!
      priority: Int!
      tomatoes: Int!
      completed: Boolean!
    ): Task!
    createTask(
      title: String!
      description: String!
      dueDate: String!
      priority: Int!
      tomatoes: Int!
    ): Task!

    createPomodoro(taskId: Int!, time: String!): Pomodoro!
  }

  type User {
    id: Int!
    name: String!
    email: String!
    tasks: [Task!]
  }

  type Task {
    id: Int!
    title: String!
    description: String!
    dueDate: String!
    createdAt: String
    completed: Boolean!
    tomatoes: Int!
    priority: Int!
    user: User!
    userId: String!
  }

  type Pomodoro {
    id: Int!
    userId: String!
    taskId: String!
    user: User!
    task: Task!
    time: String!
  }
`;

export default typeDefs;
