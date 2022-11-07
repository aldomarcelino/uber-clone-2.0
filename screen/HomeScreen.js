import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import NavOptions from "../components/NavOptions";
import tw from "twrnc";

const HomeScreen = () => {
  const [location, setLocation] = useState("Waiting...");
  const [location2, setLocation2] = useState("Waiting...");
  useEffect(() => {
    const _getLocationAsync = async () => {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (loc) => {
          console.log(loc, "???????");
        }
      );
    };
    let interval = setInterval(() => {
      _getLocationAsync();
    }, 5000);
    return () => clearInterval(interval);
  });
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      for (let item of response) {
        let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
        setLocation(address);
      }
    })();
  }, []);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.paragraph}>{location}</Text>
      </View>
      <View>
        <Text style={tw`text-center py-5 text-xl`}>Set up Your Address</Text>
      </View>
      <GooglePlacesAutocomplete
        placeholder="Enter destination address?"
        styles={{
          container: { flex: 0, marginHorizontal: 10 },
          textInput: { fontSize: 18, borderRadius: 30 },
        }}
        onPress={(data, details = null) => {
          dispatch(
            setOrigin({
              location: details.geometry.location,
              description: data.description,
            })
          );
          dispatch(setDestination(null));
          navigation.navigate("AddressScreen");
        }}
        fetchDetails={true}
        returnKeyType={"search"}
        enablePoweredByContainer={false}
        minLength={2}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: "id",
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
      />
      <NavOptions />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
