import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import RouterServiceCustomer from "../routers/RouterServiceCustomer";
import Setting from "./Setting";
import Appointments from "./Appointments";
import ProfileCustomer from "./User/ProfileCustomer";
import { Image } from "react-native";

const Tab = createMaterialBottomTabNavigator();

const Customer = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="RouterServiceCustomer"
        component={RouterServiceCustomer}
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/home.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Appointments}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/cart.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileCustomer"
        component={ProfileCustomer}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/customer.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/setting.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Customer;
