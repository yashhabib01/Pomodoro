import React from "react";
import {
  Box,
  CheckBox,
  Text,
  Heading,
  Paragraph,
  Stack,
  Meter,
  Button,
} from "grommet";
import dayjs from "dayjs";

const TaskComponent = ({
  title,
  description,
  priority,
  dueDate,
  completed,
  handleOnClick,
  isUpdate,
  handleOnDelete,
}) => {
  const getPriorityColor = () => {
    if (priority === 1) return "status-critical";
    if (priority === 0) return "status-ok";
    return "status-unknown";
  };

  return (
    <Box
      background="light-2"
      pad="small"
      round="small"
      width="600px"
      margin={isUpdate ? "20px 0px" : "20px 30px"}
    >
      <Stack anchor="center" gap="small">
        <Meter
          size="xsmall"
          values={[{ value: completed ? 100 : 0 }]}
          thickness="small"
          color={completed ? "status-ok" : "status-unknown"}
        />
      </Stack>
      <Box margin={{ top: "small" }}>
        <Heading level={4} size="small">
          {title}
        </Heading>
        <Paragraph margin={{ top: "xsmall" }} size="small">
          {description}
        </Paragraph>
        <Text size="xsmall" color={getPriorityColor()}>
          {priority === 1 ? "High" : "Low"}
        </Text>
        <Text size="xsmall" color="dark-6">
          {dayjs(dueDate).format("DD/MM/YY")}
        </Text>
        <CheckBox
          label="Completed"
          checked={completed}
          disabled={true}
          size="small"
        />
      </Box>
      <Box margin={{ top: "medium" }} align="end" direction="row">
        <Button
          label={isUpdate ? "Update" : "Select"}
          size="small"
          onClick={handleOnClick}
        />
        {isUpdate && (
          <Button
            label="Delete"
            size="small"
            margin="0px 20px"
            onClick={handleOnDelete}
          />
        )}
      </Box>
    </Box>
  );
};

export default TaskComponent;
