import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Grommet, Box } from "grommet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import dayjs from "dayjs";
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

const Analysis = () => {
  const { data: tasks, loading, refetch } = useQuery(QUERY_ALL_TASKS);

  let last7dates = [...Array(7)]
    .map((_, i) => {
      const d = new Date();

      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    })
    ?.reduce((acc, obj) => ({ ...acc, [obj]: 1 }), {});
  let completed = 0;
  let uncompleted = 0;
  if (tasks?.getTasks) {
    tasks?.getTasks.forEach((item) => {
      if (item.completed) {
        completed++;
      } else {
        uncompleted++;
      }
      let date = dayjs(new Date(Number(item.createdAt))).toDate();
      date = new Date(date);
      date.setDate(date.getDate());
      const localDate = date.toLocaleDateString();
      if (last7dates[localDate] > 0) {
        last7dates[localDate] = last7dates[localDate] + 1 || 1;
      }
    });
  }

  const data = [
    { name: "Completed", value: completed },
    { name: "UnCompleted", value: uncompleted },
  ];

  let myKeys = Object.entries(last7dates);
  let myKeysArr = [];
  myKeys.forEach(([key, val]) => {
    let obj = { label: key, value: val - 1 };

    myKeysArr.push(obj);
  });

  const colors = ["#0088FE", "#00C49F", "#FFBB28"];

  if (loading) return <Loading />;

  return (
    <div style={{ margin: "20px 30px" }}>
      <h1>Number of Tasks Last seven days </h1>
      <Grommet>
        <Box align="center" pad="medium">
          <ResponsiveContainer width="80%" height={300}>
            <BarChart data={myKeysArr}>
              <CartesianGrid />
              <XAxis dataKey="label" />
              <YAxis />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Grommet>
      <h1>Pie Chart Analysis</h1>

      <Grommet>
        <Box align="center" pad="medium">
          <ResponsiveContainer width="80%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Grommet>
    </div>
  );
};

export default Analysis;

export const getServerSideProps = withPageAuthRequired();
