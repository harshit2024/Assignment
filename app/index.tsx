import React from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import store from "../redux/store";
import ImageGallery from "../components/ImageGallery";
import SaveImagesLocally from "../components/saveImageLocally";

export default function App() {
  return (
    <Provider store={store}>
      <View style={{ flex: 1}}>
        <ImageGallery />
        <SaveImagesLocally />
      </View>
    </Provider>
  );
}
