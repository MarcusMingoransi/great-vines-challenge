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

const App = () => {
  const { isOpen: isModalOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [contactList, setContactList] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [isLoadingContacts, setLoadingContacts] = useState(true);
  const [isLoadingAdd, setLoadingAdd] = useState(false);
  const [contactName, setContactName] = useState("");

  const getQueryParams = (query = null) =>
    [
      ...new URLSearchParams(query || window.location.search || "").entries(),
    ].reduce((a, [k, v]) => ((a[k] = v), a), {});

  const authenticateUser = async () => {
    window.location.href =
      "http://login.salesforce.com/services/oauth2/authorize?client_id=3MVG9yZ.WNe6byQDn_tc_.9aCjm_xoITkY9Wk9TX1us_oY_8ImbWF6cUgmkrRWmL4xlitLBRQgGA9pupDi.76&redirect_uri=http%3A//localhost%3A3000&response_type=token&scopes=api%20id";
  };

  const retrieveContactsList = (accessToken) => {
    const urlContacts =
      "https://test448-dev-ed.develop.my.salesforce.com/services/data/v56.0/query/?q=SELECT+name+from+Account";
    fetch(urlContacts, {
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
    const urlCreateContact =
      "https://test448-dev-ed.develop.my.salesforce.com/services/data/v56.0/sobjects/Account/";
    fetch(urlCreateContact, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ Name: contactName }),
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
    if (window.location.href === "http://localhost:3000/") {
      authenticateUser();
    }

    const { access_token: accessToken } = getQueryParams(
      window.location.href.replace("http://localhost:3000/#", "")
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
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
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
            <Stack spacing={3}>
              <Input
                color="teal"
                placeholder="Contact Name"
                size="md"
                onChange={(e) => setContactName(e.target.value)}
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
