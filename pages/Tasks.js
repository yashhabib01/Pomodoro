import React, { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useQuery, gql, useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { Clock, CaretDownFill } from "grommet-icons";
import {
  Box,
  TextInput,
  TextArea,
  DateInput,
  Select,
  Button,
  Text,
  CheckBox,
} from "grommet";
import TaskComponent from "@/components/TaskComponent";
import Loading from "@/components/Loading";

const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String!
    $dueDate: String!
    $priority: Int!
    $tomatoes: Int!
  ) {
    createTask(
      title: $title
      description: $description
      dueDate: $dueDate
      priority: $priority
      tomatoes: $tomatoes
    ) {
      completed
      createdAt
      description
      dueDate
      id
      priority
      title
      tomatoes
      user {
        email
        id
        name
      }
      userId
    }
  }
`;

const DELETE_TASK = gql`
  mutation Mutation($deleteTaskId: Int!) {
    deleteTask(id: $deleteTaskId) {
      completed
      description
      createdAt
      dueDate
      id
      priority
      title
      tomatoes
      user {
        email
        id
        name
      }
      userId
    }
  }
`;

const QUERY_ALL_TASKS = gql`
  query ExampleQuery {
    getTasks {
      id
      title
      completed
      createdAt
      description
      dueDate
      priority
      tomatoes
      user {
        email
        id
        name
      }
    }
  }
`;
const UPDATE_TASk = gql`
  mutation Mutation(
    $updateTaskId: Int!
    $title: String!
    $description: String!
    $dueDate: String!
    $priority: Int!
    $tomatoes: Int!
    $completed: Boolean!
  ) {
    updateTask(
      id: $updateTaskId
      title: $title
      description: $description
      dueDate: $dueDate
      priority: $priority
      tomatoes: $tomatoes
      completed: $completed
    ) {
      id
      title
      description
      priority
      createdAt
      completed
      tomatoes
      user {
        email
        id
        name
      }
      userId
    }
  }
`;

const TaskInput = () => {
  const { data, loading, refetch } = useQuery(QUERY_ALL_TASKS);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("");
  const [updateTaskState, setUpdateTaskState] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);

  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASk);
  const [deleteTask] = useMutation(DELETE_TASK);
  const handleSubmit = () => {
    if (
      title.length < 3 ||
      description.length < 3 ||
      dueDate < 1 ||
      priority < 1
    ) {
      return;
    }

    const task = {
      title,
      description,
      dueDate,
      priority,
    };
    onSubmit(task);
  };

  const onSubmit = async (task) => {
     setCustomLoading(true);
    if (updateTaskState) {
      await updateTask({
        variables: {
          updateTaskId: updateTaskState.id,
          title: title,
          description: description,
          dueDate: dueDate,
          priority: priority === "High" ? 1 : 0,
          tomatoes: updateTaskState.tomatoes || 0,
          completed: completed,
        },
      });
    } else {
      await createTask({
        variables: {
          title: title,
          description: description,
          dueDate: dueDate,
          priority: priority === "High" ? 1 : 0,
          tomatoes: 0,
        },
      });
    }

    refetch();
    setCustomLoading(false);

    setTitle("");
    setDescription("");
    setDueDate(new Date());
    setPriority("");
    setUpdateTaskState(null);
  };

  if (loading || customLoading) {
    return <Loading />;
  }

  return (
    <div style={{ margin: "20px 30px" }}>
      <Box
        background="white"
        pad="medium"
        round="small"
        elevation="small"
        width={{ max: "600px" }}
      >
        <Box margin={{ bottom: "small" }}>
          <Text>Task Title</Text>
          <TextInput
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Box>
        <Box margin={{ bottom: "small" }}>
          <Text>Description</Text>
          <TextArea
            placeholder="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Box>
        {updateTaskState && (
          <Box margin={{ bottom: "small" }}>
            <CheckBox
              checked={completed}
              label="Completed"
              onChange={() => setCompleted(!completed)}
            />
          </Box>
        )}
        <Box margin={{ bottom: "small" }}>
          <Text>Due Date</Text>
          <Box direction="row" align="center">
            <Clock size="medium" />
            <DateInput
              placeholder="Due Date"
              value={dueDate}
              onChange={(event) => setDueDate(event.value)}
            />
            <Text>{dueDate && dayjs(dueDate).format("DD/MM/YY")}</Text>
          </Box>
        </Box>
        <Box margin={{ bottom: "small" }}>
          <Text>Priority</Text>
          <Box direction="row" align="center">
            <CaretDownFill size="medium" />
            <Select
              placeholder="Priority"
              options={["Low", "High"]}
              value={priority}
              onChange={({ option }) => setPriority(option)}
            />
          </Box>
        </Box>
        <Button
          label={updateTaskState ? "Update" : "Add Task"}
          onClick={handleSubmit}
          primary
          alignSelf="end"
          width="full"
        />
      </Box>

      <h1 style={{ margin: "20xp" }}>Tasks </h1>
      {data?.getTasks.map((item) => {
        return (
          <TaskComponent
            key={item.id}
            title={item.title}
            description={item.description}
            dueDate={new Date(Number(item.dueDate))}
            completed={item.completed}
            priority={item.priority}
            handleOnClick={() => {
              setUpdateTaskState(item);
              setTitle(item.title);
              setDueDate(new Date(Number(item.dueDate)));
              setPriority(item.priority === 0 ? "Low" : "High");
              setCompleted(item.completed);
              setDescription(item.description);
            }}
            isUpdate={true}
            handleOnDelete={async () => {
              if (item.id > 0) {
                setCustomLoading(true);
                await deleteTask({
                  variables: {
                    deleteTaskId: item.id,
                  },
                });
              }
              refetch();
              setCustomLoading(false);
            }}
          />
        );
      })}
    </div>
  );
};

export default TaskInput;

export const getServerSideProps = withPageAuthRequired();
