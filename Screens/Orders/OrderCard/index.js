import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { APIURL } from "../../../context/constants/api";
import { useNavigation } from "@react-navigation/native";

const OrderCard = ({ foodData, handleUpdateOrderStatus }) => {
  const navigation = useNavigation();
  function formatDate(dateString) {
    const date = new Date(dateString);
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString(undefined, optionsDate);
    const formattedTime = date.toLocaleTimeString(undefined, optionsTime);

    return `${formattedDate} ${formattedTime}`;
  }
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.title}>Order - {foodData?.orderId}</Text>
      </View>
      {foodData?.order &&
        foodData?.order?.length > 0 &&
        foodData?.order?.map((order, index) => {
          return (
            <View
              style={[
                styles.food,
                {
                  marginBottom: foodData?.orders?.length - 1 != index ? 10 : 0,
                },
              ]}
              key={order?._id}
            >
              <View style={styles.head}>
                <View>
                  <Text style={styles.foodOrder}>Order - {order?.orderId}</Text>
                </View>
                <View style={styles.foodStatusContainer}>
                  <FontAwesomeIcon
                    icon={faCircle}
                    color={order?.orderStatus == "Cancel" ? "#D22B2B" : "#2E8B57"}
                    size={6}
                    style={{ marginHorizontal: 6, marginBottom: 3 }}
                  />
                  <Text style={{ ...styles.foodStatus, color: order?.orderStatus == "Cancel" ? "#D22B2B" : "#2E8B57" }}>{order?.orderStatus}</Text>
                </View>
              </View>
              <View style={styles.foodContainer}>
                <Image
                  source={{ uri: `${APIURL + order?.foodDetails?.image}` }}
                  style={styles.foodImage}
                />
                <View style={styles.foodDetails}>
                  <Text style={styles.foodName}>
                    {order?.foodDetails?.name} - {order?.count}
                  </Text>
                  <Text style={styles.foodCategory}>
                    {order?.foodDetails?.categoryDetails?.name}
                  </Text>
                  <Text style={styles.foodPrice}>
                    ₹{" "}
                    {parseInt(order?.foodDetails?.price) *
                      parseInt(order?.count)}
                  </Text>
                  <Text style={styles.orderDate}>
                    {formatDate(foodData?.createdAt)}
                  </Text>
                </View>
              </View>
              {order?.orderStatus != "Collected" && <View style={styles.buttons}>
                <Pressable onPress={() => { handleUpdateOrderStatus(order?._id, "Cancel") }}style={[{ ...styles.button, borderColor: "#D22B2B", borderWidth: 1 }]}>
                  <Text style={{...styles.buttonText, color: "#D22B2B"}}>Cancel</Text>
                </Pressable>
                <Pressable style={[{ ...styles.button, borderColor: "#2E8B57", borderWidth: 1}]} onPress={() => { handleUpdateOrderStatus(order?._id, order?.orderStatus == "Received" ? "Preparing" : order?.orderStatus == "Preparing" ? "Complete" : "Collected", order?.orderStatus == "Preparing" || order?.orderStatus == "Complete" ? true : false) }}>
                  <Text style={{...styles.buttonText, color: "#2E8B57"}}>{order?.orderStatus == "Received" ? "Preparing" : order?.orderStatus == "Preparing" ? "Complete" : "Collected"}</Text>
                </Pressable>
              </View>}
              {order?.orderStatus == "Collected" && <View style={styles.buttons}>
                <Pressable onPress={() => { handleUpdateOrderStatus(order?._id, "Complete") }} style={[{ ...styles.button, borderColor: "#D22B2B", borderWidth: 1 }]}>
                  <Text style={{...styles.buttonText, color: "#D22B2B"}}>Not Collected</Text>
                </Pressable>
              </View>}
            </View>
          );
        })}
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttons: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between", // Ensures there is a small gap between the buttons
    gap: 5
  },
  button: {
    flex: 1, // Ensures buttons spread equally within the parent view
    alignItems: "center",
    borderRadius: 5,
    padding: 5
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
  }
});
