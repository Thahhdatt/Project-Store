import React, { useState } from "react";
import { View, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Text, TextInput, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";
import { Picker } from '@react-native-picker/picker';

const ServiceUpdate = ({ route, navigation }) => {
    const { service } = route.params;
    const [title, setTitle] = useState(service.title);
    const [price, setPrice] = useState(service.price);
    const [state, setState] = useState(service.state);
    const [info, setInfo] = useState(service.info);
    const [brand, setBrand] = useState(service.brand);
    const [imagePath, setImagePath] = useState(service.image);
    const [selectedState, setSelectedState] = useState(service.state === "Còn hàng" ? "Còn hàng" : "Hết hàng" ? "Hết hàng" : "Hàng chưa về");

    const handleUpdateService = async () => {
        try {
            const updateData = {
                title: title,
                price: price,
                state: selectedState,
                brand: brand,
                info: info
            };

            if (selectedState === "Trống") {
                updateData.orderBy = firestore.FieldValue.delete();
                updateData.orderInfo = firestore.FieldValue.delete();
                updateData.datetime = firestore.FieldValue.delete();
                updateData.note = firestore.FieldValue.delete();
                updateData.foods = firestore.FieldValue.delete();
            }

            await firestore()
                .collection('Services')
                .doc(service.id)
                .update(updateData);

            if (imagePath !== service.image) {
                const refImage = storage().ref(`/services/${service.id}.png`);
                await refImage.putFile(imagePath);
                const imageLink = await refImage.getDownloadURL();
                await firestore()
                    .collection('Services')
                    .doc(service.id)
                    .update({
                        image: imageLink
                    });
            }

            if (selectedState === "Trống") {
                const appointmentQuerySnapshot = await firestore()
                    .collection('Appointments')
                    .where('serviceId', '==', service.id)
                    .get();

                const batch = firestore().batch();
                appointmentQuerySnapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });

                await batch.commit();
            }

            navigation.goBack();
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
        }
    }

    const handleUploadImage = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 400,
            height: 300
        })
        .then(image =>
            setImagePath(image.path)
        )
        .catch(e => console.log(e.message));
    }

    return (
        <KeyboardAvoidingView
      style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={{ padding: 10 }}>
                {imagePath !== "" &&
                    <Image source={{ uri: imagePath }} style={{ height: 200 }} />
                }
                <Button style={{ margin: 20 }} buttonColor="pink" textColor="black" mode="contained" onPress={handleUploadImage}>
                    Thay đổi hình ảnh
                </Button>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên sản phẩm: </Text>
                <TextInput
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Input a service name"
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá sản phẩm: </Text>
                <TextInput
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0"
                    keyboardType="numeric"
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin sản phẩm: </Text>
                <TextInput
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                    value={info}
                    onChangeText={setInfo}
                    placeholder=""
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thương hiệu: </Text>
                <TextInput
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                    value={brand}
                    onChangeText={setBrand}
                    placeholder=""
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tình trạng: </Text>
                <Picker
                    selectedValue={selectedState}
                    onValueChange={(itemValue) => setSelectedState(itemValue)}
                >
                    <Picker.Item color="#FF8C00" label="Còn hàng" value="Còn hàng" />
                    <Picker.Item color="#FF8C00" label="Hết hàng" value="Hết hàng" />
                    <Picker.Item color="#FF8C00" label="Hàng chưa về" value="Hàng chưa về" />
                </Picker>
                <Button buttonColor="pink" textColor="black" mode="contained" onPress={handleUpdateService}>
                    Cập nhật
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default ServiceUpdate;
