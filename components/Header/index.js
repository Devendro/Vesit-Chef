import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const Header = ({ title, showProfile = true }) => {
  const userDetail = useSelector((state) => state?.user)
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 10
      }}
    >
      <TouchableOpacity
        onPress={() => { navigation.goBack() }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 75,
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </TouchableOpacity>
      <Text
        style={{
          flex: 1, // Allow text to take remaining space
          fontSize: 18,
          marginTop: 8,
          fontFamily: "Poppins-Medium",
          textAlign: "center", // Center text
        }}
      >
        {title}
      </Text>
      {<Pressable
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          navigation.navigate("SettingMenu");
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            backgroundColor: "rgba(255, 195, 0, 0.2)",
            textAlign: "center",
            alignItems: "center",
            justifyContent: 'center'
          }}>
          <Text style={{
            color: "#FFC300",
            fontFamily: "Poppins-SemiBold",
            fontSize: 20,
            marginTop: 4
          }}>{userDetail?.name?.charAt(0)}</Text>
        </View>
      </Pressable>}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
