import React, { useEffect, useState } from "react"
import {
  Link as ChakraLink,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react"
import { useCanister } from "@connect2ic/react"
import { Link as ReactRouterLink } from "react-router-dom"

const AdminPanel: React.FC = () => {
  const [backend] = useCanister("backend")
  const [startupInfo, setStartupInfo] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.getIncomingStartUps()
        const data = response[0]
        setStartupInfo(`<h1>${data.startUpName}</h1><h2>${data.shortDes}</h2>`)
      } catch (error) {
        console.error("Error al obtener datos de startups:", error)
        // Puedes manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
      }
    }

    //fetchData();
  }, [])

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: startupInfo || "" }} />

      <Heading fontSize="4xl">Administration Panel</Heading>
      <List spacing={3}>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to="Whitelist">
            <Text fontSize="xl">See Whitelist</Text>
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to="StartupsReqs">
            <Text fontSize="xl">Startup registration requests</Text>
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to="StartupsList">
            <Text fontSize="xl">Startups list</Text>
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to="ProjectsReqs">
            <Text fontSize="xl">Project registration requests</Text>
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to="Projects">
            <Text fontSize="xl">Projects list</Text>
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to="UsersPendingVerification">
            <Text fontSize="xl">Users with pending verification</Text>
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ChakraLink as={ReactRouterLink} to="Admin/FundReqs">
            <Text fontSize="xl">Financing requests</Text>
          </ChakraLink>
        </ListItem>
      </List>
    </>
  )
}

export default AdminPanel
