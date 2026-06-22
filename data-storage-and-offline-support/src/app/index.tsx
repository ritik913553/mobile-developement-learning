import { Directory, File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import { useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const [output, setOutput] = useState<string>("");
  const [downloadedImageUri, setDownloadedImageUri] = useState<string | null>(
    null,
  );

  // Write file

  const demoFile = new File(Paths.document, "demo.txt");

  const copiedFile = new File(Paths.document, "copy-demo.txt");

  const movedFile = new File(Paths.document, "moved-demo.txt");

  const notesDirectory = new Directory(Paths.document, "notes");

  console.log(notesDirectory);

  const writeFile = () => {
    demoFile.write("Hello expo filesystem");
    setOutput("File written successfully");
  };

  const readFile = async () => {
    const data = await demoFile.text();

    setOutput(data);

    return data;
  };

  const appendFile = async () => {
    const oldData = await demoFile.text();

    demoFile.write(oldData + "\n New Data Added");

    setOutput("Data appended");
  };

  const copyFile = () => {
    demoFile.copy(copiedFile);

    setOutput("File copied successfully");
  };

  const moveFile = () => {
    copiedFile.move(movedFile);
    setOutput("File moved successfully");
  };

  const deleteAllFile = () => {
    demoFile.delete();
    copiedFile.delete();
    movedFile.delete();
    setOutput("File Deleted successfully");
  };

  const getFileInfo = () => {
    const info = {
      exists: demoFile.exists,
      size: demoFile.size,
      uri: demoFile.uri,
      name: demoFile.name,
    };

    setOutput(JSON.stringify(info, null, 2));
  };

  const createFolder = () => {
    notesDirectory.create();
    setOutput("Folder created successfully");
  };

  const readDir = () => {
    const files = notesDirectory.list();
    setOutput(
      JSON.stringify(
        files.map((f) => f.uri),
        null,
        2,
      ),
    );
  };

  const downloadFile = async () => {
    const folder = new Directory(Paths.cache, "images");
    folder.create();

    const downloadedFile = await File.downloadFileAsync(
      "https://picsum.photos/300",
      folder,
    );

    setDownloadedImageUri(downloadedFile.uri);

    setOutput(
      JSON.stringify(
        {
          uri: downloadedFile.uri,
          exists: downloadedFile.exists,
          size: downloadedFile.size,
        },
        null,
        2,
      ),
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          gap: 12,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Expo FileSystem Modern API
        </Text>

        <Button title="1. Write File" onPress={writeFile} />
        <Button title="2. Read File" onPress={readFile} />
        <Button title="3. Append File" onPress={appendFile} />
        <Button title="4. Get File Info" onPress={getFileInfo} />
        <Button title="5. Copy File" onPress={copyFile} />
        <Button title="6. Move File" onPress={moveFile} />
        <Button title="7. Create Folder" onPress={createFolder} />
        <Button title="8. Read Directory" onPress={readDir} />
        <Button title="9. Download File" onPress={downloadFile} />
        <Button title="10. Delete All Files" onPress={deleteAllFile} />

        <View
          style={{
            marginTop: 20,
            padding: 16,
            borderWidth: 1,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Output
          </Text>

          <Text selectable>{output}</Text>
        </View>

        {downloadedImageUri ? (
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Downloaded Image
            </Text>

            <Image
              source={{ uri: downloadedImageUri }}
              style={{
                width: 300,
                height: 300,
                borderRadius: 10,
              }}
              contentFit="cover"
            />
          </View>
        ) : null}

        <View
          style={{
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Paths.document
          </Text>

          <Text selectable>{Paths.document.uri}</Text>

          <Text
            style={{
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Paths.cache
          </Text>

          <Text selectable>{Paths.cache.uri}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
