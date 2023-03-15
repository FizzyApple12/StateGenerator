import {
    Button,
    Divider,
    Grid,
    Group,
    Navbar,
    Text,
    Title,
    useMantineColorScheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { FC, useState } from "react";
import { Graph, GraphEditor } from "./components/GraphEditor";
import { useGraph } from "./components/GraphProvider";
import { useStateGridDB } from "./stores/states/stateGridDB";

const App: FC = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const { masterGrid, stateGrids } = useStateGridDB();

    const [activeState, setActiveState] = useState(-1);

    const { graph } = useGraph();

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

                        <Button onClick={() => setActiveState(-1)} fullWidth>
                            Main Workspace
                        </Button>

                        {stateGrids.map((stateGrid, index) => (
                            <Button
                                onClick={() => setActiveState(index)}
                                fullWidth
                            >
                                State Grid #{index}
                            </Button>
                        ))}
                    </Navbar.Section>
                    <Navbar.Section>
                        <Divider my="sm" />

                        <Button onClick={(event) => {}} fullWidth>
                            <IconPlus stroke={1.5} />
                            <Text>Add New State Graph</Text>
                        </Button>
                    </Navbar.Section>
                </Navbar>
            </Grid.Col>
            <Grid.Col span={"auto"} p={0}>
                <GraphEditor
                    graph={graph}
                    onChange={(graph: Graph): void => {
                        throw new Error("Function not implemented.");
                    }}
                />
            </Grid.Col>
        </Grid>
    );
};

export default App;
