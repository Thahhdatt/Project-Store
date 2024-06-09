import React from "react"
import { View, Image, TouchableOpacity, StyleSheet } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { Button, Text } from "react-native-paper"

const ServiceDetailCustomer = ({ route, item}) => {
    const { service } = route.params;

    return (

            <View style={{ padding: 10 }}>
                <ScrollView>
                        {service.image ? (
                            <View style={{ marginBottom: 5 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}></Text>
                                <Image
                                    source={{ uri: service.image }}
                                    style={{ height: 300, width: '100%' }}
                                    resizeMode="contain"
                                />
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hình ảnh: </Text>
                                <Text style={{ fontSize: 20 }}>Trống</Text>
                            </View>
                        )}
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên sản phẩm: </Text>
                            <Text style={{ fontSize: 20 }}>{service.title}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá sản phẩm: </Text>
                            <Text style={{ fontSize: 20, color: "red" }}>{service.price ? parseFloat(service.price).toLocaleString() : "Trống"} ₫</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Loại sản phẩm: </Text>
                            <Text style={{ fontSize: 20 }}>{service.category || "Trống"}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tình trạng: </Text>
                            <Text style={{ fontSize: 20 }}>{service.state || "Trống"}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', marginBottom: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin sản phẩm: </Text>
                            <Text style={{ fontSize: 20 }}>{service.info || "Trống"}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', marginBottom: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thương hiệu: </Text>
                            <Text style={{ fontSize: 20 }}>{service.brand || "Trống"}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ghi chú: </Text>
                            <Text style={{ fontSize: 20 }}>{service.note || "Trống"}</Text>
                        </View>
                        <View styles={styles.categoriesContainer}>
                            <TouchableOpacity
                                style={styles.categoryButton}>
                                <Text style={styles.categoryButtonText}>Mua sản phẩm</Text>
                            </TouchableOpacity>
                        </View>
                </ScrollView>     
            </View>
    )
}
const handleAppointment = (service, navigation) => {
    navigation.navigate("Appointment", { service });
}

const styles = StyleSheet.create({
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 0,
    },
    categoryButton: {
        backgroundColor: '#80FF00',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        justifyContent: 'center',
        width:'100%',
        height:50,
        flexDirection: 'row',
        marginBottom:10,
        paddingTop:10
    },
    categoryButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center', 
    },
});
export default ServiceDetailCustomer;
