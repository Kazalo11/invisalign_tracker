import { Box, Heading, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { usePocket } from "../lib/PocketContext";
import { Button } from "./ui/button";

export default function Header() {
  const { logout } = usePocket();
  return (
    <header>
      <HStack bg="gray.100" px="6" py="4" boxShadow="sm">
        <Heading>Invisalign Tracker</Heading>
        <Box ml="auto">
          <Button mr="4">
            <Link to="/">Home Page</Link>
          </Button>
          <Button>
            <Link to="/login" onClick={logout}>
              Logout
            </Link>
          </Button>
        </Box>
      </HStack>
    </header>
  );
}
