import {
  Button,
  Heading,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [contactList, setContactList] = useState([]);
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
        console.log(json);
        setContactList(json.records);
      });
  };

  const createContactsList = (accessToken) => {
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
      body: JSON.stringify({ Name: "Marcus Test" }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  };

  useEffect(() => {
    if (window.location.href === "http://localhost:3000/") {
      authenticateUser();
    }

    const { access_token: accessToken } = getQueryParams(
      window.location.href.replace("http://localhost:3000/#", "")
    );
    console.log(accessToken);

    retrieveContactsList(accessToken);
  }, []);

  return (
    <div className="App">
      <Stack
        spacing={12}
        direction="row"
        align="center"
        justifyContent="space-between"
      >
        <Heading as="h3" size="lg">
          Marcus Mingoransi Challenge
        </Heading>
        <Button colorScheme="teal" size="sm">
          Add Contact
        </Button>
      </Stack>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
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
    </div>
  );
}

export default App;
