import React, { useEffect, useState } from "react";
import { View, Text, Button, Image, FlatList, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useDispatch, useSelector } from "react-redux";
import { toggleSelectionMode, selectImage, deselectImage } from "../redux/imageSlice";

export default function ImageGallery() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [media, setMedia] = useState<MediaLibrary.Asset[]>([]);
  const dispatch = useDispatch();
  const selectedImages = useSelector((state:any) => state.images.selectedImages);
  const selectionMode = useSelector((state:any) => state.images.selectionMode);
 
  const theme = useColorScheme();
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setHasPermission(status === "granted");
    if (status === "granted") getPhotos();
  };

  const getPhotos = async () => {
    const album = await MediaLibrary.getAssetsAsync({
      first: 50,
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: [MediaLibrary.SortBy.creationTime],
    });
    setMedia(album.assets);
  };

  const toggleSelection = (image:any) => {
    if (selectedImages.some((img:any) => img.uri === image.uri)) {
      dispatch(deselectImage(image.uri));
    } else {
      dispatch(selectImage(image));
    }
  };

  if (hasPermission === null) return <Text>Requesting permissions...</Text>;
  if (hasPermission === false) return <Text>No access to photos</Text>;

  return (
    <View style={styles.container}>
       <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10,marginTop:50 }}>
          <Text style={[styles.text, theme === "dark" ? styles.darkText : styles.lightText]}>
              Selected Images: {selectedImages.length}
            </Text>
          <Button title={`Toggle Mode: ${selectionMode.toUpperCase()}`} onPress={() => dispatch(toggleSelectionMode())} />
      </View>
      <FlatList
        data={media}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleSelection(item)}>
            <Image source={{ uri: item.uri }} style={[styles.image, selectedImages.some((img:any) => img.uri === item.uri) && styles.selected]} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 6, padding: 10},
  image: { width: 100, height: 100, margin: 5 },
  selected: { borderColor: "#9063CD", borderWidth: 3 },
  lightText: {
    color: "black",
  },
  darkText: {
    color: "white",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});
