import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";

const HomeScreen = () => {
  Geocoder.init("AIzaSyAw99RzBxkw-upCWfK5gVURlEMRzTn3pOI", { language: "id" }); // use a valid API key
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  var addressComponent;
  let long = "Waiting..";
  let lat = "Waiting..";
  if (errorMsg) {
    long = errorMsg;
  } else if (location) {
    Geocoder.from(location?.coords.latitude, location?.coords.longitude)
      .then((json) => {
        addressComponent = json.results[0];
        console.log(addressComponent, "XXXX");
      })
      .catch((error) => console.warn(error));
    // console.log(location);
    // long = JSON.stringify(location?.coords.latitude);
    // lat = JSON.stringify(location?.coords.longitude);
  }
  // console.log(long, "<<<<<<<<");
  const dispatch = useDispatch();
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.paragraph}>{long}</Text>
        <Text style={styles.paragraph}>{addressComponent}</Text>
      </View>
      <View>
        <Text>i'am a HomeScreen</Text>
      </View>
      <GooglePlacesAutocomplete
        placeholder="Where From?"
        styles={{ container: { flex: 0 }, textInput: { fontSize: 18 } }}
        onPress={(data, details = null) => {
          console.log(data, details);
          dispatch(
            setOrigin({
              location: details.geometry.location,
              description: data.description,
            })
          );
          dispatch(setDestination(null));
        }}
        fetchDetails={true}
        returnKeyType={"search"}
        enablePoweredByContainer={false}
        minLength={2}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: "en",
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
      />

      <NavOptions />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   paddingTop: Constants.statusBarHeight,
  //   backgroundColor: "#ecf0f1",
  // },
  // paragraph: {
  //   margin: 24,
  //   fontSize: 18,
  //   textAlign: "center",
  // },
});
