import React from "react";
import { Box, Spinner } from "grommet";

const Loading = () => {
  return (
    <Box align="center" justify="center" pad="large">
      <Spinner size="large" />
    </Box>
  );
};

export default Loading;
