import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Text, TextInput } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import firestore from "@react-native-firebase/firestore";
import { useMyContextProvider } from "../index";

const Appointment = ({ navigation, route }) => {
    const { service } = route.params || {};
    const [datetime, setDatetime] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [note, setNote] = useState('');
    const [title, setTitle] = useState('');
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const [disableButton, setDisableButton] = useState(false);
    const [disableTextInput, setDisableTextInput] = useState(false);
    const [error, setError] = useState('');
    const APPOINTMENTs = firestore().collection("Appointments");
    const SERVICES = firestore().collection("Services");
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (service && service.state === "Đã đặt") {
            setDisableButton(true);
            setDisableTextInput(true);
        } else {
            setDisableButton(false);
            setDisableTextInput(false);
        }
    }, [service]);

    const handleSubmit = () => {
        const currentTime = new Date();
        const timePlus10Minutes = new Date(currentTime.getTime() + 30 * 60000);
        const noteValue = note.trim() === '' ? 'Không' : note;

        APPOINTMENTs.add({
            title: service.title,
            price: service.price,
            serviceId: service.id,
            category: service.category,
            datetime,
            state: 'Đã đặt',
            orderBy: `${userLogin.email}`,
            orderInfo: `${userLogin.fullName} - ${userLogin.phone}`,
            note: noteValue
        })
        .then(r => {
            APPOINTMENTs.doc(r.id).update({ id: r.id });
            SERVICES.doc(service.id).update({ 
                state: 'Đã đặt',
                datetime,
                orderBy: `${userLogin.email}`,
                orderInfo: `${userLogin.fullName} - ${userLogin.phone}`,
                note: noteValue
            });
            navigation.navigate("Appointments");
        })
        .catch(error => {
            console.error("Lỗi khi đặt hàng: ", error);
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={{ padding: 10}}>
                {service && service.image !== "" && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}></Text>
                        <Image
                            source={{ uri: service && service.image }}
                            style={{ height: 300, width: '100%' }}
                            resizeMode="contain"
                        />
                    </View>
                )}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên sản phẩm: </Text>
                    <Text style={{ fontSize: 20 }}>{service && service.title}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Loại sản phẩm: </Text>
                    <Text style={{ fontSize: 20 }}>{service && service.category}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá: </Text>
                    <Text style={{ fontSize: 20, color: "red" }}>{parseFloat(service && service.price).toLocaleString()} ₫</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tình trạng: </Text>
                    <Text style={{ fontSize: 20 }}>{service && service.state}</Text>
                </View>
                <DatePicker
                    modal
                    open={open}
                    date={datetime}
                    onConfirm={(date) => {
                        setOpen(false);
                        setDatetime(date);
                        setError('');
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
                <TouchableOpacity
                    onPress={() => setOpen(true)}
                    style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ngày đặt hàng: </Text>
                    <Text style={{ fontSize: 20 }}>{datetime.toDateString()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setOpen(true)}
                    style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Dự kiến giao tới:  </Text>
                    <Text style={{ fontSize: 20 }}>{selectedDate.toLocaleString()}</Text>
                </TouchableOpacity>
                <DatePicker
                    date={selectedDate}
                    onDateChange={(newDate) => setSelectedDate(newDate)}
                />
                {error !== '' && (
                    <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>
                )}
                <TextInput
                    style={{ borderColor: 'gray', borderWidth: 1, marginTop: 10, padding: 5 }}
                    placeholder="Ghi chú thêm"
                    onChangeText={text => setNote(text)}
                    value={note}
                    editable={!disableTextInput}
                />
                <Button style={{ margin: 10 }} textColor="black" buttonColor="pink" mode="contained" onPress={handleSubmit} disabled={disableButton}>
                    {service && service.state === "Đã đặt" ? "Đã có người đặt" : "Đặt hàng"}
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Appointment;
