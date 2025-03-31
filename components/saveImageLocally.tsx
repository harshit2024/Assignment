import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  useColorScheme,
  StyleSheet,
  Alert,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useDispatch, useSelector } from "react-redux";
import { clearSelection } from "@/redux/imageSlice"; // Import clearSelection action

export default function SaveImagesLocally() {
  const selectedImages = useSelector((state: any) => state.images.selectedImages);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedFolderPath, setSavedFolderPath] = useState("");
  const dispatch = useDispatch();
  const theme = useColorScheme(); // Get current theme (light/dark)

  const saveImages = async () => {
    if (selectedImages.length === 0) {
      Alert.alert("No images selected!");
      return;
    }

    // Request permission to save files
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "You need to allow access to save images.");
      return;
    }

    setSaving(true);
    let savedFolder = null;

    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];

      // Copy image to a temporary file (needed for MediaLibrary)
      const fileUri = FileSystem.cacheDirectory + image.filename;
      await FileSystem.copyAsync({ from: image.uri, to: fileUri });

      // Save the copied file to the Media Library
      const asset = await MediaLibrary.createAssetAsync(fileUri);

      // Create an album (if not already created) and add the asset
      if (!savedFolder) {
        savedFolder = await MediaLibrary.createAlbumAsync("SavedImages", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], savedFolder, false);
      }

      setProgress(Math.round(((i + 1) / selectedImages.length) * 100)); // Update progress
    }

    setSaving(false);
    setSavedFolderPath("Saved in Photos > SavedImages");
    dispatch(clearSelection()); // Clear selection after saving
    Alert.alert("Success", "Images saved to gallery under 'SavedImages'!");
  };

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkBg : styles.lightBg]}>
      <Button title="Save Images" onPress={saveImages} disabled={selectedImages.length === 0 || saving} />
      {saving && <ActivityIndicator size="large" color={theme === "dark" ? "white" : "blue"} />}
      {saving && (
        <Text style={[styles.text, theme === "dark" ? styles.darkText : styles.lightText]}>
          Saving... {progress}%
        </Text>
      )}
      {savedFolderPath ? (
        <Text style={[styles.text, theme === "dark" ? styles.darkText : styles.lightText]}>
          {savedFolderPath}
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
