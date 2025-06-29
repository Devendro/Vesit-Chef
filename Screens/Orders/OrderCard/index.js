import React, { memo, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { APIURL } from "../../../context/constants/api";
import { useNavigation } from "@react-navigation/native";

// Memoized date formatter to avoid recreating on each render
const formatDate = (dateString) => {
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
};

// Memoized status colors to avoid inline object creation
const STATUS_COLORS = {
  Cancel: "#D22B2B",
  default: "#2E8B57",
};

// Memoized order item component for better performance
const OrderItem = memo(({ order, handleUpdateOrderStatus, createdAt }) => {
  const statusColor = order?.orderStatus === "Cancel" ? STATUS_COLORS.Cancel : STATUS_COLORS.default;
  
  const imageUri = useMemo(() => 
    `${APIURL}${order?.foodDetails?.image}`, 
    [order?.foodDetails?.image]
  );

  const totalPrice = useMemo(() => 
    parseInt(order?.foodDetails?.price || 0) * parseInt(order?.count || 0),
    [order?.foodDetails?.price, order?.count]
  );

  const formattedDate = useMemo(() => formatDate(createdAt), [createdAt]);

  const handleCancelPress = useCallback(() => {
    handleUpdateOrderStatus(order?._id, "Cancel");
  }, [handleUpdateOrderStatus, order?._id]);

  const handleStatusPress = useCallback(() => {
    const { orderStatus } = order;
    let newStatus;
    let shouldNotify = false;

    if (orderStatus === "Received") {
      newStatus = "Preparing";
    } else if (orderStatus === "Preparing") {
      newStatus = "Complete";
      shouldNotify = true;
    } else {
      newStatus = "Collected";
      shouldNotify = true;
    }

    handleUpdateOrderStatus(order?._id, newStatus, shouldNotify);
  }, [handleUpdateOrderStatus, order?._id, order?.orderStatus]);

  const handleNotCollectedPress = useCallback(() => {
    handleUpdateOrderStatus(order?._id, "Complete");
  }, [handleUpdateOrderStatus, order?._id]);

  const getNextStatusText = () => {
    const { orderStatus } = order;
    if (orderStatus === "Received") return "Preparing";
    if (orderStatus === "Preparing") return "Complete";
    return "Collected";
  };

  return (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order - {order?.orderId}</Text>
        <View style={styles.statusContainer}>
          <FontAwesomeIcon
            icon={faCircle}
            color={statusColor}
            size={6}
            style={styles.statusIcon}
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {order?.orderStatus}
          </Text>
        </View>
      </View>

      <View style={styles.orderContent}>
        <Image source={{ uri: imageUri }} style={styles.foodImage} />
        <View style={styles.orderDetails}>
          <Text style={styles.foodName}>
            {order?.foodDetails?.name} - {order?.count}
          </Text>
          <Text style={styles.foodCategory}>
            {order?.foodDetails?.categoryDetails?.name}
          </Text>
          <Text style={styles.foodPrice}>₹ {totalPrice}</Text>
          <Text style={styles.orderDate}>{formattedDate}</Text>
        </View>
      </View>

      {order?.orderStatus !== "Collected" && (
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleCancelPress}
            style={[styles.button, styles.cancelButton]}
            android_ripple={{ color: "#D22B2B20" }}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={handleStatusPress}
            style={[styles.button, styles.actionButton]}
            android_ripple={{ color: "#2E8B5720" }}
          >
            <Text style={[styles.buttonText, styles.actionButtonText]}>
              {getNextStatusText()}
            </Text>
          </Pressable>
        </View>
      )}

      {order?.orderStatus === "Collected" && (
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleNotCollectedPress}
            style={[styles.button, styles.cancelButton]}
            android_ripple={{ color: "#D22B2B20" }}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Not Collected
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});

const OrderCard = memo(({ foodData, handleUpdateOrderStatus }) => {
  const navigation = useNavigation();

  const renderOrderItem = useCallback(
    ({ item, index }) => (
      <OrderItem
        order={item}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
        createdAt={foodData?.createdAt}
        key={item?._id}
      />
    ),
    [handleUpdateOrderStatus, foodData?.createdAt]
  );

  const keyExtractor = useCallback((item) => item?._id, []);

  const ItemSeparatorComponent = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  if (!foodData?.order?.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order - {foodData?.orderId}</Text>
      </View>
      
      <FlatList
        data={foodData.order}
        renderItem={renderOrderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={3}
      />
    </View>
  );
});

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  separator: {
    height: 12,
  },
  orderItem: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#E5E5E5",
    backgroundColor: "#FAFAFA",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    fontWeight: "500",
  },
  orderContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  foodImage: {
    height: 100,
    width: 100,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  orderDetails: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: "space-between",
  },
  foodName: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
  },
  foodCategory: {
    fontFamily: "Poppins-Regular",
    color: "#666",
    fontSize: 12,
    marginBottom: 4,
  },
  foodPrice: {
    fontFamily: "Poppins-Medium",
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  orderDate: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#999",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  cancelButton: {
    borderColor: "#D22B2B",
    borderWidth: 1,
    backgroundColor: "#FFF5F5",
  },
  actionButton: {
    borderColor: "#2E8B57",
    borderWidth: 1,
    backgroundColor: "#F0FFF4",
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    fontWeight: "500",
  },
  cancelButtonText: {
    color: "#D22B2B",
  },
  actionButtonText: {
    color: "#2E8B57",
  },
});