import {
    ActionIcon,
    Badge,
    Box,
    Code,
    Divider,
    Flex,
    Grid,
    Group,
    Navbar,
    Paper,
    Title,
    Text,
    useMantineColorScheme,
    Button,
} from "@mantine/core";
import { FC, useState } from "react";
import { useStateGridDB } from "./stores/states/stateGridDB";
import { IconPlus } from "@tabler/icons-react";

const App: FC = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const { masterGrid, stateGrids } = useStateGridDB();

    const [ activeState, setActiveState ] = useState(-1);

    return (
        <Grid
            sx={(theme) => ({
                width: "100vw",
                height: "100vh",
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[2],
            })}
            m={0}
        >
            <Grid.Col span={"content"} p={0}>
                <Navbar height="100vh" width={{ sm: 300 }} p="md">
                    <Navbar.Section grow>
                        <Group position="center">
                            <Title>State Generator</Title>
                        </Group>

                        <Divider my="sm" />

                        <Button onClick={() => setActiveState(-1)} fullWidth>Main Workspace</Button>

                        {
                            stateGrids.map((stateGrid, index) => (
                                <Button onClick={() => setActiveState(index)} fullWidth>State Grid #{index}</Button>
                            ))
                        }
                    </Navbar.Section>
                    <Navbar.Section>
                        <Divider my="sm" />
                        
                        <Button onClick={(event) => {
                            
                        }} fullWidth>
                            <IconPlus stroke={1.5} />
                            <Text>Add New State Graph</Text>
                        </Button>
                    </Navbar.Section>
                </Navbar>
            </Grid.Col>
            <Grid.Col span={"auto"} p={0}>
                <Box
                    sx={(theme) => ({
                        display: "grid",
                        gridTemplateColumns: "auto auto auto",
                    })}
                ></Box>
            </Grid.Col>
        </Grid>
    );
};

export default App;
