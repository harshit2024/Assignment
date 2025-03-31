import React, { useState } from "react";
import { View, Button, Text, useColorScheme, StyleSheet } from "react-native";
import Gallery from "./ImageGallery";
import { lightTheme, darkTheme } from "../constants/theme";
import { useDispatch } from "react-redux";
import { setSelectedImages } from "../redux/imageSlice";

export default function ImageSelector() {
  const [selectedImages, setSelectedImagesState] = useState<any[]>([]);
  const [multiSelect, setMultiSelect] = useState(false);
  const theme = useColorScheme() === "dark" ? darkTheme : lightTheme;
  const dispatch = useDispatch();

  const handleSelectImage = (image: any) => {
    setSelectedImagesState((prev) =>
      multiSelect ? [...prev, image] : [image]
    );
  };

  const saveSelection = () => {
    dispatch(setSelectedImages(selectedImages));
    alert(`${selectedImages.length} images selected!`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Button title={`Mode: ${multiSelect ? "Multi" : "Single"}`} onPress={() => setMultiSelect(!multiSelect)} color={theme.button} />
      <Gallery onSelectImage={handleSelectImage} />
      <Button title="Save Selection" onPress={saveSelection} color={theme.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, alignItems: "center" },
});
