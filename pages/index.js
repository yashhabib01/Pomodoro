import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Timer from "@/components/Timer";
import TaskComponent from "@/components/TaskComponent";
import CustomizeTask from "@/components/CustomTask";
import Loading from "@/components/Loading";

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

const Home = () => {
  const { data, loading, refetch } = useQuery(QUERY_ALL_TASKS, {
    onCompleted: (data) => setTasks(data.getTasks),
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(0);
  const [breakTime, setBreakTime] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [updateTask] = useMutation(UPDATE_TASk);

  const handleComplete = () => {
    // Update the task

    if (selectedTask) {
      updateTask({
        variables: {
          updateTaskId: selectedTask.id,
          title: selectedTask.title,
          description: selectedTask.description,
          priority: selectedTask.priority,
          dueDate: new Date(Number(selectedTask.dueDate)),
          tomatoes: selectedTask.tomatoes + 1,
          completed: selectedTask.completed,
        },
      });
    }

    if ((taskCompleted + 1) % 4 === 0) {
      setBreakTime(1800);
    } else {
      setBreakTime(300);
    }
    setTaskCompleted(taskCompleted + 1);
    setSelectedTask(null);

    refetch();
  };

  const handleBreakeTimeComp = () => {
    setBreakTime(null);
  };

  const handleCustomizeOptionTasks = (priority, status, sort) => {
    refetch();

    if (data?.getTasks) {
      let new_tasks = data?.getTasks;
      if (priority === "low") {
        new_tasks = new_tasks.filter((item) => item.priority === 0);
      }
      if (priority === "high") {
        new_tasks = new_tasks.filter((item) => item.priority === 1);
      }
      if (status === "Completed") {
        new_tasks = new_tasks.filter((item) => item.completed);
      } else if (status === "Not Completed") {
        new_tasks = new_tasks.filter((item) => !item.completed);
      }
      if (sort === "Asc") {
        new_tasks = [...new_tasks].sort(
          (a, b) => Number(a.dueDate) - Number(b.dueDate)
        );
      }
      if (sort === "Desc") {
        new_tasks = [...new_tasks].sort(
          (a, b) => Number(b.dueDate) - Number(a.dueDate)
        );
      }

      setTasks([...new_tasks]);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {selectedTask && (
        <div>
          <h1>Selected Task: {selectedTask.title}</h1>
          <Timer sec={1500} handleComplete={handleComplete} />
        </div>
      )}

      {breakTime && (
        <div>
          <h1>Break Task</h1>
          <Timer
            sec={breakTime}
            handleComplete={handleBreakeTimeComp}
            hideController
          />
        </div>
      )}
      <CustomizeTask
        onPriorityChange={handleCustomizeOptionTasks}
        onStatusChange={handleCustomizeOptionTasks}
      />
      <h1 style={{ margin: "0px 30px" }}>Tasks</h1>
      {tasks.map((item) => {
        console.log(item.title, item.dueDate, new Date(Number(item.dueDate)));
        return (
          <TaskComponent
            key={item.id}
            title={item.title}
            description={item.description}
            dueDate={new Date(Number(item.dueDate))}
            priority={item.priority}
            completed={item.completed}
            handleOnClick={() => {
              if (breakTime || selectedTask) return;
              setSelectedTask(item);
            }}
          />

          // <div
          //   key={item.id}
          //   onClick={() => {
          //     if (breakTime || selectedTask) return;
          //     setSelectedTask(item);
          //   }}
          // >
          //   {item.title}
          // </div>
        );
      })}
    </div>
  );
};

export default Home;

export const getServerSideProps = withPageAuthRequired();
