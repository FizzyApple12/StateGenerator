import {
    Accordion,
    ActionIcon,
    Button,
    Divider,
    FileInput,
    Flex,
    Grid,
    Group,
    Kbd,
    Navbar,
    Text,
    TextInput,
    Title,
    useMantineColorScheme,
} from "@mantine/core";
import {
    IconCheck,
    IconCodePlus,
    IconDeviceFloppy,
    IconDownload,
    IconFileExport,
    IconLayoutGridAdd,
    IconPlus,
    IconTrash,
    IconVariablePlus,
    IconX,
} from "@tabler/icons-react";
import { FC, useContext, useState } from "react";
import { Graph, GraphEditor } from "./components/GraphEditor";
import { GraphContext } from "./contexts/GraphContext";
import { SubstatesContext } from "./contexts/SubStatesContext";
import { generateConnections } from "./generation/java/java";
import { showNotification, updateNotification } from "@mantine/notifications";
import { parseEnum } from "./generation/java/java";

const App: FC = () => {
    const { graph, updateGraph } = useContext(GraphContext);

    const { substates, addSubstate, removeSubstate } =
        useContext(SubstatesContext);

    const [newSubstateName, setNewSubstateName] = useState("");
    const [newSubstateValueName, setNewSubstateValueName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const downloadBlob = (fileBlob: Blob, name: string) => {
        const element = document.createElement("a");

        const time = new Date();
        const dateString = `${time.getMonth()}-${time.getDay()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}`;

        element.href = URL.createObjectURL(fileBlob);
        element.download = name;

        document.body.appendChild(element); // Required for this to work in FireFox

        element.click();

        element.remove();
    };

    const downloadState = () =>
        downloadBlob(
            new Blob([generateConnections(graph)], { type: "text/java" }),
            "StateMachine.java"
        );

    const downloadConnections = () =>
        downloadBlob(
            new Blob([generateConnections(graph)], { type: "text/java" }),
            `${graph.stateMachineName}Connections.java`
        );

    const downloadSubstate = (name: string) => {
        downloadBlob(
            new Blob([generateConnections(graph)], { type: "text/java" }),
            `${name}.java`
        );
    };

    const uploadBlob = (
        callback: (data: string, notificationId: string) => void
    ) => {
        const notificationId = "0";

        showNotification({
            id: notificationId,
            title: "Uploading...",
            message: `Reading file...`,
            color: "blue",
            autoClose: false,
            loading: true,
        });

        if (!selectedFile) {
            updateNotification({
                id: notificationId,
                title: "Upload Error!",
                message: `Please select a file to upload`,
                color: "red",
                autoClose: true,
                icon: <IconX />,
                loading: false,
            });

            return;
        }

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target && e.target.result) {
                callback(e.target.result as string, notificationId);
            } else {
                updateNotification({
                    id: notificationId,
                    title: "Upload Error!",
                    message: `Failed to upload "${selectedFile.name}"`,
                    color: "red",
                    autoClose: true,
                    icon: <IconX />,
                    loading: false,
                });
            }
        };

        reader.onerror = (e: ProgressEvent<FileReader>) => {
            updateNotification({
                id: notificationId,
                title: "Upload Error!",
                message: `Failed to upload "${selectedFile.name}"`,
                color: "red",
                autoClose: true,
                icon: <IconX />,
                loading: false,
            });
        };

        reader.readAsText(selectedFile);
    };

    const uploadEnum = () => {
        uploadBlob((data, notificationId) => {
            updateNotification({
                id: notificationId,
                title: "Uploading...",
                message: `Parsing Java Enum...`,
                color: "blue",
                autoClose: false,
                loading: true,
            });

            const enumData = parseEnum(data);

            if (!enumData) {
                updateNotification({
                    id: notificationId,
                    title: "Upload Error!",
                    message: `Failed to find a valid Enum`,
                    color: "red",
                    autoClose: true,
                    icon: <IconX />,
                    loading: false,
                });

                return;
            }

            addSubstate(enumData[0], enumData[1]);

            updateNotification({
                id: notificationId,
                title: "Upload Succeeded!",
                message: `Enum imported successfully`,
                color: "green",
                autoClose: true,
                icon: <IconCheck />,
                loading: false,
            });
        });
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

                        <TextInput
                            label="State Machine Name"
                            placeholder="eg. Arm, Autonomous, etc."
                            value={graph.stateMachineName}
                            onChange={(element) => updateGraph({
                                ...graph,

                                stateMachineName: element.target.value
                            })}
                        />

                        <Divider my="sm" />

                        <Accordion
                            variant="separated"
                            chevronPosition="left"
                            defaultValue="customization"
                        >
                            {substates.map((substate) => (
                                <Accordion.Item
                                    value={substate.name}
                                    key={substate.name}
                                >
                                    <Accordion.Control py={8}>
                                        {substate.name}
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        {substate.values.map((value) => (
                                            <Text key={value} my={4}>
                                                <Kbd>{value}</Kbd>
                                            </Text>
                                        ))}
                                        <Flex mt={16} gap="sm">
                                            <ActionIcon
                                                variant="outline"
                                                onClick={() =>
                                                    downloadSubstate(
                                                        substate.name
                                                    )
                                                }
                                                size={36}
                                            >
                                                <IconDownload />
                                            </ActionIcon>
                                            <ActionIcon
                                                color="red"
                                                variant="outline"
                                                onClick={() =>
                                                    removeSubstate(
                                                        substate.name
                                                    )
                                                }
                                                size={36}
                                            >
                                                <IconTrash />
                                            </ActionIcon>
                                        </Flex>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Navbar.Section>
                    <Navbar.Section>
                        <FileInput
                            placeholder="Select a Java Enum File"
                            onChange={(payload) => setSelectedFile(payload)}
                            accept={"text/java"}
                            mb={16}
                        />

                        <Button
                            fullWidth
                            variant="outline"
                            onClick={uploadEnum}
                        >
                            Upload Substate
                        </Button>
                    </Navbar.Section>
                    <Navbar.Section>
                        <Divider my="sm" />

                        <Button
                            fullWidth
                            variant="outline"
                            onClick={downloadState}
                        >
                            Download State
                        </Button>

                        <Button
                            mt={8}
                            fullWidth
                            variant="outline"
                            onClick={downloadConnections}
                        >
                            Download Connections
                        </Button>
                    </Navbar.Section>
                </Navbar>
            </Grid.Col>
            <Grid.Col span={"auto"} p={0}>
                <GraphEditor
                    graph={graph}
                    onChange={(graph) => updateGraph(graph)}
                />
            </Grid.Col>
        </Grid>
    );
};

export default App;
