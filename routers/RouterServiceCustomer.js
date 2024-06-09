import { createStackNavigator } from "@react-navigation/stack";
import ServicesCustomer from '../screens/Service/ServicesCustomer';
import { useMyContextProvider } from "../index";
import Appointment from "../screens/Appointment";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Image } from "react-native";
import ServiceDetailCustomer from "../screens/Service/ServiceDetailCustomer";
import ProfileUpdate from "../screens/User/ProfileUpdate";
import ChangePassword from "../screens/User/ChangePassword";

const Stack = createStackNavigator();

const RouterServiceCustomer = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="ServicesCustomer"
            screenOptions={{
                headerTitleAlign: "left",
                headerStyle: {
                    backgroundColor: "pink"
                },
                headerRight: (props) => (
                    <TouchableOpacity onPress={() => navigation.navigate("ProfileCustomer")}>
                      <Image source={require('../assets/account.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                  ),
            }}>
            

            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) && "Khách hàng: " + (userLogin.fullName)}} name="ServicesCustomer" component={ServicesCustomer} />
            <Stack.Screen name="Appointment" component={Appointment} options={{headerLeft: null, title: "Mua hàng"}} />
            <Stack.Screen name="ServiceDetailCustomer" component={ServiceDetailCustomer} options={{headerLeft: null, title: "Thông tin sản phẩm"
        , headerRight: (props) => (
            <TouchableOpacity onPress={() => navigation.navigate("Appointments")}>
              <Image source={require('../assets/cart.png')} style={{ width: 30, height: 30, margin: 20 }} />
            </TouchableOpacity>
          ),
        }}/>
        </Stack.Navigator>
    )
}

export default RouterServiceCustomer;
