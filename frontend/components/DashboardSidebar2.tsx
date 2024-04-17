import React, { ReactNode, useEffect, useState } from "react"
import { Outlet, Link as RouterLink } from "react-router-dom"
import {
  Box,
  CloseButton,
  HStack,
  Image,
  Flex,
  Text,
  IconButton,
  Link as ChakraLink,
  Drawer,
  DrawerContent,
  Icon,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { FiHome, FiMenu, FiBell } from "react-icons/fi"
import { BsCollection } from "react-icons/bs"
import { BsFillRocketTakeoffFill } from "react-icons/bs"
import { MdOutlineHowToVote } from "react-icons/md"
import { GiMicroscope } from "react-icons/gi"
import { RiAdminFill } from "react-icons/ri"
import { IconType } from "react-icons"
import { ReactText } from "react"
import LogoNegro from "../assets/LogoNegro.png"
import MenuUser from "./MenuUser"
import { useCanister, useConnect } from "@connect2ic/react"
import { UserType } from "./CommonTypes"

interface LinkItemProps {
  name: string
  icon: IconType
  to?: string
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: FiHome, to: "" },
  { name: "Portfolio", icon: BsCollection, to: "Portfolio" },
  { name: "Launchpad", icon: BsFillRocketTakeoffFill, to: "Launchpad" },
  { name: "FungiDAO", icon: MdOutlineHowToVote, to: "/FungiDAO" },
  { name: "For Researcher", icon: GiMicroscope, to: "ForResearcher" },
  { name: "Admin", icon: RiAdminFill, to: "/Dashboard/Admin" },
]

export default function DashboardSidebar2({
  children,
}: {
  children: ReactNode
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  // const [backend] = useCanister("backend")
  // const { isConnected } = useConnect()
  // const [user, setUser] = useState<UserType>(initialStateUser)

  // useEffect(() => {
  //   console.log("user")
  //   console.log(user)
  //   const getMyUser = async () => {
  //     const myUser = await backend.getMyUser()
  //     console.log("myUser")
  //     console.log(myUser)
  //     return myUser as [UserType]
  //   }

  //   isConnected
  //     ? getMyUser().then((responseUser) => {
  //         if (responseUser.length > 0) {
  //           setUser(responseUser[0] as UserType)
  //         }
  //       })
  //     : setUser(initialStateUser)
  // }, [isConnected])

  const handleItemClick = (to?: string) => {
    if (to) {
      setSelectedPage(to)
      onClose()
    }
  }

  return (
    <Box minH="100vh" bg="#000000">
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
        handleItemClick={handleItemClick}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} handleItemClick={handleItemClick} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} handleItemClick={handleItemClick} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
        {/* Mostrar el contenido de AdminPage dentro del sidebar si está seleccionado */}
        {/* {selectedPage === '/Dashboard/Admin' && <AdminPage />} */}
        <Outlet />
      </Box>
    </Box>
  )
}

interface SidebarProps {
  onClose: () => void
  display?: { base: string; md: string }
  handleItemClick: (to?: string) => void
}

const initialStateUser: UserType = {
  principalID: { _arr: new Uint8Array(), _isPrincipal: false },
  userId: "",
  admissionDate: 0,
  name: "",
  avatar: null,
  email: "",
  verified: { Code: "", Success: false },
  roles: [{}],
}

const SidebarContent = ({
  onClose,
  handleItemClick,
  ...rest
}: SidebarProps) => {
  const [backend] = useCanister("backend")
  const { isConnected } = useConnect()
  const [user, setUser] = useState<UserType>(initialStateUser)

  useEffect(() => {
    const getMyUser = async () => {
      const myUser = await backend.getMyUser()
      return myUser as [UserType]
    }

    isConnected
      ? getMyUser().then((responseUser) => {
          if (responseUser.length > 0) {
            setUser(responseUser[0] as UserType)
          }
        })
      : setUser(initialStateUser)
  }, [isConnected])

  const isUserRoleAdmin = (roles) => {
    let isUserRoleAdminFlag = false
    roles.map((elm) => {
      if (elm.Admin && elm.Admin.length > 0) {
        isUserRoleAdminFlag = true
      }
    })
    return isUserRoleAdminFlag
  }

  return (
    <Box
      transition="3s ease"
      bg="#000000"
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="10" justifyContent="space-between">
        <Image src={LogoNegro} alt="Profile" />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => {
        if (link.name !== "Admin") {
          return (
            <NavItem
              key={link.name}
              icon={link.icon}
              to={link.to}
              onClick={() => handleItemClick(link.to)}
            >
              {link.name}
            </NavItem>
          )
        } else {
          isUserRoleAdmin(user.roles) ? 
            <NavItem
              key={link.name}
              icon={link.icon}
              to={link.to}
              onClick={() => handleItemClick(link.to)}
            >
              {link.name}
            </NavItem>
          : null
        }
      })}
    </Box>
  )
}

interface NavItemProps {
  icon: IconType
  children: ReactText
  to?: string
  onClick?: () => void
}

const NavItem = ({ icon, children, to, onClick, ...rest }: NavItemProps) => {
  return (
    <ChakraLink
      as={RouterLink}
      to={to}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        marginTop="4"
        p="4"
        mx="8"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        onClick={onClick}
        _hover={{
          bg: "#1FAFC8",
          color: "#000000",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="20"
            _groupHover={{
              color: "#000000",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </ChakraLink>
  )
}

interface MobileProps {
  onOpen: () => void
  handleItemClick: (to?: string) => void
}

const MobileNav = ({ onOpen, handleItemClick, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="24"
      alignItems="center"
      bg="#000000"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <MenuUser />
        </Flex>
      </HStack>
    </Flex>
  )
}
