import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";
import AddressMap from "../components/AddressMap";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectOrigin } from "../slices/navSlice";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import { useState, useEffect } from "react";

const AddressScreen = () => {
  const origin = useSelector(selectOrigin);
  const [address, setAddress] = useState({
    name: "",
    street: "",
  });
  const [location, setLocation] = useState("Waiting...");
  useEffect(() => {
    Geocoder.init("AIzaSyAw99RzBxkw-upCWfK5gVURlEMRzTn3pOI", {
      language: "id",
    });
    Geocoder.from(origin.location.lat, origin.location.lng)
      .then((json) => {
        let address = json.results[0];
        console.log(address, "XXXX");
        setLocation(address.formatted_address);
        setAddress({
          name: address.address_components[1].short_name,
          street: address.address_components[0].short_name,
        });
      })
      .catch((error) => console.warn(error));
  }, []);
  // useEffect(() => {
  //   (async () => {
  //     let response = await Location.reverseGeocodeAsync({
  //       latitude: origin.location.lat,
  //       longitude: origin.location.lng,
  //     });
  //     console.log(response, "??????????s");
  //     for (let item of response) {
  //       let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
  //       setLocation(address);
  //     }
  //   })();
  // }, []);
  const navigation = useNavigation();
  return (
    <View>
      <View style={tw`h-full`}>
        <AddressMap />
        <View style={tw`flex flex-row h-1/5 justify-between m-4`}>
          <View>
            <Text style={tw`text-xl mb-3 font-medium`}>
              {address.name}, {address.street}
            </Text>
            <Text style={tw`opacity-60 text-xs`}>{location}</Text>
            <View style={tw`my-4 bg-black p-4 rounded-3xl`}>
              <Text style={tw`text-white font-bold text-center`}>
                Confirmation
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={tw`opacity-40`}
              onPress={() => {
                navigation.navigate("HomeScreen");
              }}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddressScreen;
