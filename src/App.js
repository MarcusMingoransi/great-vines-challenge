import {
  Box,
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonText,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { URL, URL_CONTACTS, URL_CREATE_COONTACT } from "./utils/constants";
import { authenticateUser, getQueryParams } from "./utils/utils";

const App = () => {
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [contactList, setContactList] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [isLoadingContacts, setLoadingContacts] = useState(true);
  const [isLoadingAdd, setLoadingAdd] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const retrieveContactsList = (accessToken) => {
    fetch(URL_CONTACTS, {
      method: "GET",
      headers: {
        "Content-Type": "text/json",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setContactList(json.records);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoadingContacts(false);
      });
  };

  const addContact = () => {
    setLoadingAdd(true);
    fetch(URL_CREATE_COONTACT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ Name: `${firstName} ${lastName}` }),
    })
      .then((response) => response.json())
      .then((json) => {
        toast({
          title: "Contact added.",
          description: "We've added your a new contact for you.",
          position: "top-right",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Failed to add contact",
          description: "Something went wrong to add a new contact",
          position: "top-right",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoadingAdd(false);
        retrieveContactsList(accessToken);
      });
  };

  useEffect(() => {
    if (window.location.href === URL) {
      authenticateUser();
    }

    const { access_token: accessToken } = getQueryParams(
      window.location.href.replace(`${URL}#`, "")
    );
    setAccessToken(accessToken);

    retrieveContactsList(accessToken);
  }, []);

  return (
    <Box paddingX={10}>
      <Stack
        spacing={12}
        direction="row"
        align="center"
        justifyContent="space-between"
        paddingTop={5}
        paddingBottom={30}
      >
        <Heading as="h3" size="lg">
          Marcus Mingoransi Challenge
        </Heading>
        <Button colorScheme="teal" size="sm" onClick={onOpen}>
          Add Contact
        </Button>
      </Stack>

      {contactList && contactList.length > 0 && !isLoadingContacts && (
        <TableContainer>
          <Table variant="striped" colorScheme="teal" size="sm">
            <Thead>
              <Tr>
                <Th>Contact</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contactList.map((contact, index) => (
                <Tr key={String(index)}>
                  <Td>{contact.Name}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Contact</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      )}

      {isLoadingContacts && contactList && contactList.length === 0 && (
        <Box padding="6" boxShadow="lg" bg="white">
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="4" />
        </Box>
      )}

      {!isLoadingContacts && contactList && contactList.length === 0 && (
        <Box padding="6" boxShadow="lg" bg="white">
          <Text fontSize="md">There is no contacts to show</Text>
        </Box>
      )}

      <Modal isOpen={isModalOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Contact Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3} marginBottom={3}>
              <Input
                color="teal"
                placeholder="First Name"
                size="md"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Stack>
            <Stack spacing={3}>
              <Input
                color="teal"
                placeholder="Last Name"
                size="md"
                onChange={(e) => setLastName(e.target.value)}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              isLoading={isLoadingAdd}
              loadingText="Adding"
              colorScheme="teal"
              variant="outline"
              onClick={addContact}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default App;
