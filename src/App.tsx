import {
    Accordion,
    ActionIcon,
    Button,
    Divider,
    Grid,
    Group,
    Kbd,
    Navbar,
    Text,
    TextInput,
    Title,
    useMantineColorScheme,
} from "@mantine/core";
import { IconCodePlus, IconLayoutGridAdd, IconPlus, IconTrash, IconVariablePlus } from "@tabler/icons-react";
import { FC, useContext, useState } from "react";
import { Graph, GraphEditor } from "./components/GraphEditor";
import { GraphContext } from "./contexts/GraphContext";
import { SubstatesContext } from "./contexts/SubStatesContext";
import { generate } from "./generation/java";

const App: FC = () => {
    const {
        graph,
        availableGraphs,
        selectActiveGraph,
        updateActiveGraph,
        addGraph,
        removeGraph
    } = useContext(GraphContext);

    const {
        substates,
        addSubstate,
        addSubstateValue,
        removeSubstate
    } = useContext(SubstatesContext);

    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [newSubstateName, setNewSubstateName] = useState("");
    const [newSubstateValueName, setNewSubstateValueName] = useState("");

    const addNewWorkspace = () => {
        if (!newWorkspaceName) return;

        addGraph(newWorkspaceName);

        setNewWorkspaceName("");
    }

    const addNewSubstate = () => {
        if (!newSubstateName) return;

        addSubstate(newSubstateName);

        setNewSubstateName("");
    }

    const addToSubstate = (substate: string) => {
        if (!newSubstateValueName) return;

        addSubstateValue(substate, newSubstateValueName);

        setNewSubstateValueName("");
    }

    const downloadBlob = (fileBlob: Blob) => {
        const element = document.createElement("a");

        const time = new Date();
        const dateString = `${time.getMonth()}-${time.getDay()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}`;

        element.href = URL.createObjectURL(fileBlob);
        element.download = `data-${dateString}.${fileBlob.type.split("/")[1]}`;

        document.body.appendChild(element); // Required for this to work in FireFox

        element.click();

        element.remove();
    };

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

                        <Button
                            variant={(graph.name == "main") ? "filled" : "outline"}
                            onClick={() => selectActiveGraph(-1)}
                            fullWidth
                            mb={16}
                        >
                            Main Workspace
                        </Button>

                        {
                            availableGraphs.map((availableGraph) => (
                                <Grid key={availableGraph.index}>
                                    <Grid.Col span="auto">
                                        <Button
                                            variant={(availableGraph.name == graph.name) ? "filled" : "outline"}
                                            onClick={() => selectActiveGraph(availableGraph.index)}
                                            fullWidth
                                            mb={16}
                                        >
                                            {availableGraph.name}
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col span="content">
                                        <ActionIcon onClick={() => removeGraph(availableGraph.index)} color="red" variant="light" size={36}>
                                            <IconTrash />
                                        </ActionIcon>
                                    </Grid.Col>
                                </Grid>
                            ))
                        }
                    </Navbar.Section>
                    <Navbar.Section>
                        <TextInput value={newWorkspaceName} onChange={(value) => setNewWorkspaceName(value.target.value)} label="Add New Workspace" placeholder="Workspace name" rightSection={
                            <ActionIcon onClick={addNewWorkspace} variant="default" size={32}>
                                <IconLayoutGridAdd />
                            </ActionIcon>
                        } />
                    </Navbar.Section>
                    <Navbar.Section>
                        <Divider my="sm" />

                        <Accordion variant="separated" chevronPosition="left" defaultValue="customization">
                            {
                                substates.map((substate) => (
                                    <Accordion.Item value={substate.name} key={substate.name}>
                                        <Accordion.Control py={8}>{substate.name}</Accordion.Control>
                                        <Accordion.Panel>
                                            {
                                                substate.values.map((value) =>
                                                    <Text key={value} my={4}><Kbd>{value}</Kbd></Text>
                                                )
                                            }
                                            <Grid mt={8}>
                                                <Grid.Col span="auto">
                                                    <TextInput value={newSubstateValueName} onChange={(value) => setNewSubstateValueName(value.target.value)} placeholder="Substate Name" rightSection={
                                                        <ActionIcon onClick={() => addToSubstate(substate.name)} variant="default" size={32}>
                                                            <IconPlus />
                                                        </ActionIcon>
                                                    } />
                                                </Grid.Col>
                                                <Grid.Col span="content">
                                                    <ActionIcon color="red" variant="light" onClick={() => removeSubstate(substate.name)} size={36}>
                                                        <IconTrash />
                                                    </ActionIcon>
                                                </Grid.Col>
                                            </Grid>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                ))
                            }
                        </Accordion>

                        <TextInput value={newSubstateName} onChange={(value) => setNewSubstateName(value.target.value)} label="Add New Substate" placeholder="Substate Name" rightSection={
                            <ActionIcon onClick={addNewSubstate} variant="default" size={32}>
                                <IconCodePlus />
                            </ActionIcon>
                        } />
                    </Navbar.Section>
                    <Navbar.Section>
                        <Divider my="sm" />

                        <Button fullWidth onClick={() => downloadBlob(new Blob([ generate(graph) ], { type: 'text/java'}))}>Export Connections</Button>
                    </Navbar.Section>
                </Navbar>
            </Grid.Col>
            <Grid.Col span={"auto"} p={0}>
                <GraphEditor
                    graph={graph}
                    onChange={(graph) => updateActiveGraph(graph)}
                />
            </Grid.Col>
        </Grid>
    );
};

export default App;
