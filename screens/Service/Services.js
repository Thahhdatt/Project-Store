import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { ScrollView } from "react-native-gesture-handler";

const Services = ({ navigation }) => {
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

                services.sort((a, b) => (a.state === "Đã đặt" ? -1 : 1));

                setServices(services);
                setInitialServices(services);
                setInitialMenus(services);
            });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemContainer}
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
                <Text>{item.category}</Text>
                <Text style={[styles.itemState, { color: item.state === "Còn hàng" ? "red" : "black" ? "Hết hàng" : "Yellow"}]}>{item.state}</Text>
                </View>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => handleUpdate(item)}>
                        <Text>Cập nhật</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => handleDelete(item)}>
                        <Text>Xóa sản phẩm</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => handleDetail(item)}>
                        <Text>Thông tin</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );

    const handleUpdate = async (service) => {
        try {
            navigation.navigate("ServiceUpdate", { service });
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
        }
    }

    const handleDelete = (service) => {
        Alert.alert(
            "Cảnh báo",
            "Bạn có chắc chắn muốn xóa? Hành động này sẽ không được hoàn tác",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: () => {
                        firestore()
                            .collection('Services')
                            .doc(service.id)
                            .delete()
                            .then(() => {
                                Alert.alert("Sản phẩm đã được xóa thành công!");
                                navigation.navigate("Services");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa sản phẩm:", error);
                            });
                    },
                    style: "default"
                }
            ]
        )
    }

    const handleDetail = (service) => {
        navigation.navigate("ServiceDetail", { service });
    }

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

    return (
        <View style={{ flex: 1 }}>
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
                <TouchableOpacity onPress={() => navigation.navigate("AddNewService")}>
                    <Image source={require('../assets/add.png')} style={styles.addButton} />
                </TouchableOpacity>
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
        height: 50,
        marginBottom:10,
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
    addButton: {
        width: 30,
        height: 30,
        margin: 20,
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
        justifyContent: 'center'
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

export default Services;
