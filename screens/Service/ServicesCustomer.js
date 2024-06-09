import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { ScrollView } from "react-native-gesture-handler";

const ServicesCustomer = ({ navigation }) => {
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [initialMenus, setInitialMenus] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Services')
            .onSnapshot(querySnapshot => {
                const services = [];
                querySnapshot.forEach(documentSnapshot => {
                    services.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                services.sort((a, b) => (a.state === "Còn hàng" ? -1 : 1));
                setServices(services);
                setInitialServices(services);
                setInitialMenus(services);
            });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemContainer} 
            onPress={() => handleAppointment(item)}
        >
            <Menu>
                <MenuTrigger>
                <View style={styles.itemContent}>
                    {item.image ? (
                        <Image
                            source={{ uri: item.image }}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={require('../assets/placeholder.png')}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                    )}
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemPrice}>{parseFloat(item.price).toLocaleString()} ₫</Text>
                    <Text style={[styles.itemState, { color: item.state === "Còn hàng" ? "red" : "black" ? "Hết hàng" : "Yellow"}]}>{item.state}</Text>
                </View>   
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => handleAppointment(item)}>
                        <Text>Đặt hàng</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => handleDetailCustomer(item)}>
                        <Text>Thông tin sản phẩm</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );

    const filterMenusByCategory = (category) => {
        if (selectedCategory === category) {
            setServices(initialMenus);
            setSelectedCategory(null);
        } else {
            const filteredMenus = initialMenus.filter(service => service.category === category);
            setServices(filteredMenus);
            setSelectedCategory(category);
        }
    };

    const handleAppointment = (service) => {
        navigation.navigate("Appointment", { service });
    }
    const handleDetailCustomer = (service) => {
        navigation.navigate("ServiceDetailCustomer", { service });
    }

    return (
        <View style={{ flex: 1}}>
            <Image source={require("../assets/logo.png")}
                style={styles.logo}
            />
            <TextInput
                label={"Tìm sản phẩm"}
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    const result = initialServices.filter(service => service.title.toLowerCase().includes(text.toLowerCase()));
                    setServices(result);
                }}
                style={styles.searchInput}
            />

            <ScrollView horizontal={true} style={{height:67}}>
                <View style={styles.categoriesContainer}>
                    <TouchableOpacity 
                        onPress={() => filterMenusByCategory("Trang điểm")} 
                        style={[
                            styles.categoryButton, 
                            selectedCategory === "Trang điểm" && styles.selectedCategoryButton,
                            { width: '33%', flexDirection: "row" }
                        ]}
                    >
                        <Image source={require("../assets/trangdiem.png")} style={{height: 20, width: 20}}/>
                        <Text style={styles.categoryButtonText}>Trang điểm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => filterMenusByCategory("Chăm sóc da mặt")} 
                        style={[
                            styles.categoryButton, 
                            selectedCategory === "Chăm sóc da mặt" && styles.selectedCategoryButton,
                            { width: '30%', flexDirection: "row" }
                        ]}
                    >
                        <Image source={require("../assets/chamsocda.png")} style={{height: 20, width: 20}}/>
                        <Text style={styles.categoryButtonText}>Chăm sóc da mặt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => filterMenusByCategory("Chăm sóc cơ thể")} 
                        style={[
                            styles.categoryButton, 
                            selectedCategory === "Chăm sóc cơ thể" && styles.selectedCategoryButton,
                            { width: '30%', flexDirection: "row" }
                        ]}
                    >
                        <Image source={require("../assets/chamsoccothe.png")} style={{height: 20, width: 20}}/>
                        <Text style={styles.categoryButtonText}>Chăm sóc cơ thể</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Danh sách sản phẩm
                </Text>
            </View>
            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={3}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        alignSelf: "center",
        marginVertical: 20,
        width:300,
        height:100
    },
    searchInput: {
        marginHorizontal: 15,
        marginBottom:10,
        height: 50,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 25,
        fontWeight: "bold",
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContent: {
        padding: 15,
        alignItems: 'center',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    itemTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "bold",
    },
    itemPrice: {
        fontSize: 16,
        color: 'green',
    },
    itemState: {
        fontSize: 16,
        color: 'gray',
    },
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 0,
    },
    categoryButton: {
        backgroundColor: '#ccc',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        justifyContent: 'center',
    },
    selectedCategoryButton: {
        backgroundColor: '#888',
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ServicesCustomer;
