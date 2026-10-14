import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Login from "../Screens/Login";
import Catalogo from "../Screens/CatalogoScreen";
import DetalleProducto from "../Screens/DetalleProductoScreen";
import AdminProductos from "../Screens/AdminProductosScreen";
import FormularioProducto from "../Screens/FormularioProductoScreen";
import OtraScreenCliente from "../Screens/OtraScreenCliente";
import OtraScreenAdmin from "../Screens/OtraScreenAdmin";

const RootStack = createNativeStackNavigator();
const CatalogoStackNavigator = createNativeStackNavigator();
const AdminStackNavigator = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CatalogoStack() {
  return (
    <CatalogoStackNavigator.Navigator>
      <CatalogoStackNavigator.Screen
        name="Catalogo"
        component={Catalogo}
        options={{ title: "Catálogo" }}
      />
      <CatalogoStackNavigator.Screen
        name="DetalleProducto"
        component={DetalleProducto}
        options={{ title: "Detalle del producto", headerShown: false }}
      />
    </CatalogoStackNavigator.Navigator>
  );
}

function AdminStack() {
  return (
    <AdminStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <AdminStackNavigator.Screen
        name="AdminProductos"
        component={AdminProductos}
      />
      <AdminStackNavigator.Screen
        name="FormularioProducto"
        component={FormularioProducto}
      />
    </AdminStackNavigator.Navigator>
  );
}

function ClienteTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7C7CFF",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="CatalogoTab"
        component={CatalogoStack}
        options={{
          title: "Catálogo",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="OtraScreenCliente"
        component={OtraScreenCliente}
        options={{
          title: "Mi perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7C7CFF",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="ProductosTab"
        component={AdminStack}
        options={{
          title: "Productos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="OtraScreenAdmin"
        component={OtraScreenAdmin}
        options={{
          title: "Mi perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navegacion() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="ClienteTabs" component={ClienteTabs} />
        <RootStack.Screen name="AdminTabs" component={AdminTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
