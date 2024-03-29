import React, { useEffect, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { backend } from "../../../src/declarations/backend";

const AdminPanel: React.FC = () => {
  const [startupInfo, setStartupInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.getIncomingStartUps();
        const data = response[0][1];
        setStartupInfo(`<h1>${data.startUpName}</h1><h2>${data.email}</h2>`);
        console.log(data);
      } catch (error) {
        console.error('Error al obtener datos de startups:', error);
        // Puedes manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
      }
    };

    fetchData();
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: startupInfo || '' }} />
  );
};

export default AdminPanel;
