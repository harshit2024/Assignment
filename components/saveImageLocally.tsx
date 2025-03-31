import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useSelector } from "react-redux";
import { clearSelection, deselectImage } from "@/redux/imageSlice";

export default function SaveImagesLocally() {
  const selectedImages = useSelector((state:any) => state.images.selectedImages);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedFolderPath, setSavedFolderPath] = useState("");

  const theme = useColorScheme(); // Get current theme (light/dark)

  const saveImages = async () => {
    if (selectedImages.length === 0) {
      alert("No images selected!");
      return;
    }

    setSaving(true);
    const folderUri = FileSystem.documentDirectory + "SavedImages/";

    // Ensure the directory exists
    const dirInfo = await FileSystem.getInfoAsync(folderUri);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
    }

    let i = 0;
    for (const image of selectedImages) {
      const fileUri = folderUri + image.filename;
      await FileSystem.copyAsync({ from: image.uri, to: fileUri });
      i++;
      setProgress(Math.round((i / selectedImages.length) * 100)); // Update progress
    }

    setSaving(false);
    setSavedFolderPath(folderUri);

   
  };

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkBg : styles.lightBg]}>
      <Button title="Save Images" onPress={saveImages} disabled={selectedImages.length === 0 || saving} />
      {saving && <ActivityIndicator size="large" color={theme === "dark" ? "white" : "blue"} />}
      {saving && <Text style={[styles.text, theme === "dark" ? styles.darkText : styles.lightText]}>
        Saving... {progress}%
      </Text>}
      {savedFolderPath ? (
        <Text style={[styles.text, theme === "dark" ? styles.darkText : styles.lightText]}>
          Images saved to: {savedFolderPath}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lightBg: {
    backgroundColor: "white",
  },
  darkBg: {
    backgroundColor: "#121212",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  lightText: {
    color: "black",
  },
  darkText: {
    color: "white",
  },
});
