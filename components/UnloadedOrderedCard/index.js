import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const UnloadedOrderedCard = () => {
  return (
    <View
      style={[
        styles.food,
        {
          marginBottom: 10,
        },
        styles.container,
      ]}
    >
      <View style={styles.head}>
        <ShimmerPlaceHolder
          visible={false}
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 3,
          }}
        ></ShimmerPlaceHolder>

        <View style={styles.foodStatusContainer}>
          {/* <FontAwesomeIcon
            icon={faCircle}
            color="green"
            size={6}
            style={{ marginHorizontal: 6, marginBottom: 3 }}
          /> */}
          {/* <Text style={styles.foodStatus}>ABC</Text> */}
        </View>
      </View>
      <View style={styles.foodContainer}>
        <ShimmerPlaceHolder
          visible={false}
          style={styles.foodImage}
        ></ShimmerPlaceHolder>
        <View style={styles.foodDetails}>
          <ShimmerPlaceHolder
            visible={false}
            style={styles.foodName}
          ></ShimmerPlaceHolder>
          <ShimmerPlaceHolder
            visible={false}
            style={styles.foodName}
          ></ShimmerPlaceHolder>
          <ShimmerPlaceHolder
            visible={false}
            style={styles.foodName}
          ></ShimmerPlaceHolder>
          <ShimmerPlaceHolder
            visible={false}
            style={styles.foodName}
          ></ShimmerPlaceHolder>
        </View>
      </View>
    </View>
  );
};

export default UnloadedOrderedCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    marginBottom: 5,
  },
  orderDate: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#999999",
  },
  food: {
    padding: 10,
    borderWidth: 0.7,
    borderRadius: 10,
    borderColor: "#DADADA",
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  foodOrder: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  foodStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodStatus: {
    fontFamily: "Poppins-Medium",
    color: "green",
  },
  foodContainer: {
    flexDirection: "row",
  },
  foodImage: { height: 100, width: 105, resizeMode: "cover", borderRadius: 5 },
  foodDetails: {
    padding: 10,
  },
  foodName: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    borderRadius: 5,
    marginBottom: 5,
  },
  foodCategory: {
    fontFamily: "Poppins-Medium",
    color: "#999999",
    fontSize: 12,
  },
  foodPrice: {
    fontFamily: "Poppins-Medium",
    color: "#999999",
    fontSize: 12,
  },
});
