import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

const Countries = () => {
  const [data, setData] = useState([
    { country: "Nigeria", thisYear: 50, prevYear: 40 },
    { country: "Kenya", thisYear: 30, prevYear: 25 },
    { country: "Ethiopia", thisYear: 20, prevYear: 15 },
    { country: "South A.", thisYear: 10, prevYear: 5 },
  ]);

  const handleUpdateData = () => {
    // Update the data as needed
    setData([
      { country: "Nigeria", thisYear: 60, prevYear: 45 },
      { country: "Kenya", thisYear: 35, prevYear: 30 },
      { country: "Ethiopia", thisYear: 25, prevYear: 18 },
      { country: "South A.", thisYear: 12, prevYear: 7 },
    ]);
  };

  return (
    <Flex w="100%" flexDir={{ base: "column", md: "row" }} justify="space-between" align="center" mt={8}>
      {data.map((item, index) => (
        <Box key={index} w={{ base: "100%", md: "24%" }} mb={{ base: 4, md: 0 }}>
          <Text fontWeight="bold" fontSize="xl" mb={2}>
            {item.country}
          </Text>
        </Box>
      ))}
    </Flex>
  );
};

export default Countries;