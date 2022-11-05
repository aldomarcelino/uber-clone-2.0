import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectOrigin } from "../slices/navSlice";
import tw from "twrnc";

const NavOptions = () => {
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("MapScreen");
        }}
        disabled={!origin}
      >
        <View style={tw`${!origin && "opacity-20"}`}>
          <Text>map</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default NavOptions;
