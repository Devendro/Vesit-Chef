import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  RefreshControl,
  Alert
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
// import FloatingButton from "../../components/FloatingButton";
import Header from "../../components/Header";
import OrderCard from "./OrderCard";
import { useDispatch } from "react-redux";
import { getALlOrders, updateOrderStatus } from "../../context/actions/order";
import UnloadedOrderedCard from "../../components/UnloadedOrderedCard";
import { SocketContext } from "../../context/actions/socket";

const Orders = () => {
  const { backendSocket } = useContext(SocketContext);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    setOrderLoading(true);
    dispatch(
      getALlOrders({}, (res) => {
        setOrders(res);
        setOrderLoading(false);
      })
    );

    backendSocket.off("orderStatusUpdate").on("orderStatusUpdate", (res, err)=>{
      let mainOrderIndex = orders?.docs?.findIndex(item => item._id == res?.mainOrderId);
      let orderIndex = orders?.docs[mainOrderIndex]?.order?.findIndex(item => item._id == res?.orderId);
      setOrders((prevState)=>{
        let arr = [...prevState?.docs]
        arr[mainOrderIndex].order[orderIndex].orderStatus = res?.orderStatus
        return{
          ...prevState,
          docs: arr
        }
      })
    })
  }, []);

  const refreshOrder = () => {
    setRefreshing(true)
    dispatch(
      getALlOrders({}, (res) => {
        setOrders(res);
        setRefreshing(false);
      })
    );
  }

  const handleUpdateOrderStatus = (id, status, completed) => {
    Alert.alert('Do you want to update status?', "It will be marked as " + status, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => dispatch(updateOrderStatus({orderId: id, newStatus: status, completed: completed}, (res)=> {}))
},
    ]);
  } 
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={"Order History"} />
      {orderLoading && (
        <View style={styles.orderContainer}>
          <UnloadedOrderedCard />
          <UnloadedOrderedCard />
          <UnloadedOrderedCard />
          <UnloadedOrderedCard />
        </View>
      )}

      {orders && (
        <FlatList
          style={styles.orderContainer}
          data={orders?.docs}
          renderItem={({ item, index }) => <OrderCard foodData={item} handleUpdateOrderStatus={handleUpdateOrderStatus} />}
          keyExtractor={(item) => item?._id}
          refreshControl={<RefreshControl refreshing={refreshing}
            onRefresh={refreshOrder} colors={["#FFC300"]} tintColor={"#FFC300"}/>}
        />
      )}
      {/* <FloatingButton /> */}
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  orderContainer: {
    padding: 10,
  },
});
