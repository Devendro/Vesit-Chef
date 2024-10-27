import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Modal, StatusBar } from 'react-native';
import LottieView from "lottie-react-native";
const LoadingOverlay = () => {
    return (
        <Modal transparent={true} animationType="none" visible={true}>
            {/* <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" /> */}
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <LottieView
                        style={{ width: 200, height: 200 }}
                        source={require("../../assets/images/loading.json")}
                        loop={true}
                        autoPlay
                        speed={1.5}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 18,
        marginTop: 10,
    },
});
