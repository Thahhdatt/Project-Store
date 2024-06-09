import React, { useState } from "react"
import { View, Image, ScrollView, KeyboardAvoidingView } from "react-native"
import { Text, TextInput, Button } from "react-native-paper"
import firestore from '@react-native-firebase/firestore'
import storage from "@react-native-firebase/storage"
import ImagePicker from "react-native-image-crop-picker"
import { useMyContextProvider } from "../../index"
import { Picker } from '@react-native-picker/picker'

const AddNewService = ({ navigation }) => {
    const [controller, dispatch] = useMyContextProvider()
    const { userLogin } = controller
    const [imagePath, setImagePath] = useState('')
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const [state, setState] = useState('')
    const [info, setInfo] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('Trang điểm')
    const SERVICES = firestore().collection("Services")

    const handleAddNewService = () => {
        SERVICES.add({
            title,
            price,
            create: userLogin.email,
            state: 'Trống',
            category,
            info,
            brand
        })
        .then(response => {
            const refImage = storage().ref("/services/" + response.id + ".png");
            refImage.putFile(imagePath)
            .then(() =>
                refImage.getDownloadURL()
                .then(link => {
                    SERVICES.doc(response.id).update({
                        id: response.id, 
                        image: link
                    });
                    navigation.navigate("Services");
                })
            )
            .catch(e => console.log(e.message));
        });
    }

    const handleUploadImage = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 400,
            height: 300
        })
        .then(image => setImagePath(image.path))
        .catch(e => console.log(e.message))
    }

    return (
        <KeyboardAvoidingView
      style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={{ padding: 10 }}>
                <Button textColor="black" buttonColor="pink" style={{ margin: 10 }} mode="contained" onPress={handleUploadImage}>
                    Thêm hình ảnh
                </Button>
                {imagePath !== "" && (
                    <Image
                        source={{ uri: imagePath }}
                        style={{ height: 200 }}
                    />
                )}
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên sản phẩm:</Text>
                <TextInput
                    placeholder=""
                    value={title}
                    onChangeText={setTitle}
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá sản phẩm:</Text>
                <TextInput
                    placeholder="Giá cả"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Loại sản phẩm:</Text>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                    style={{ marginBottom: 10, borderWidth: 5, borderColor: '#ccc', borderRadius:2}}
                >
                    <Picker.Item color="#FF8C00" label="Trang điểm" value="Trang điểm" />
                    <Picker.Item color="#FF8C00" label="Chăm sóc da mặt" value="Chăm sóc da mặt" />
                    <Picker.Item color="#FF8C00" label="Chăm sóc cơ thể" value="Chăm sóc cơ thể" />
                    <Picker.Item color="#FF8C00" label="Nước hoa" value="Nước hoa" />
                    <Picker.Item color="#FF8C00" label="Dụng cụ trang điểm" value="Dụng cụ trang điểm" />
                </Picker>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin sản phẩm:</Text>
                <TextInput
                    placeholder=""
                    value={info}
                    onChangeText={setInfo}
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thương hiệu:</Text>
                <TextInput
                    placeholder=""
                    value={brand}
                    onChangeText={setBrand}
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}
                />
                <Button buttonColor="pink" textColor="black" mode="contained" onPress={handleAddNewService}>Thêm sản phẩm</Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddNewService;
