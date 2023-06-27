import React, { useState } from "react";
import { Box, Select, Text } from "grommet";
import { StatusGood, StatusCritical } from "grommet-icons";

const TaskRow = ({ onPriorityChange, onStatusChange }) => {
  const [priority, setPriority] = useState("both");
  const [status, setStatus] = useState("both");
  const [sort, setSort] = useState("none");

  return (
    <Box
      direction="row"
      align="center"
      gap="small"
      pad="medium"
      background="dark-1"
    >
      <Text color="white" margin={{ right: "small" }}>
        Select Priority:
      </Text>
      <Select
        options={["high", "low", "both"]}
        value={priority}
        onChange={({ option }) => {
          setPriority(option);
          onPriorityChange(option, status, sort);
        }}
        style={{ background: "black" }}
      />
      <Text color="white" margin={{ right: "small", left: "medium" }}>
        Select Completed:
      </Text>
      <Select
        options={["Completed", "Not Completed", "both"]}
        value={status}
        onChange={({ option }) => {
          setStatus(option);
          onPriorityChange(priority, option, sort);
        }}
        style={{ background: "black" }}
      />
      <Text color="white" margin={{ right: "small", left: "medium" }}>
        Sort DueDate by:
      </Text>
      <Select
        options={["Asc", "Desc", "none"]}
        value={sort}
        onChange={({ option }) => {
          setSort(option);
          onPriorityChange(priority, status, option);
        }}
        style={{ background: "black" }}
      />
    </Box>
  );
};

export default TaskRow;
