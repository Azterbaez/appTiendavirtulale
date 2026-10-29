import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export default function OtraScreenAdmin({ navigation }) {
  const cerrarSesion = () => {
    Alert.alert("Cerrar sesión", "¿Deseas salir de tu cuenta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          const rootNavigation = navigation.getParent();
          if (!rootNavigation) {
            console.error("No se encontró el navegador raíz al cerrar sesión.");
            Alert.alert(
              "Error de navegación",
              "No fue posible regresar al inicio de sesión.",
            );
            return;
          }

          try {
            await signOut(auth);
            rootNavigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Error cerrando sesión:", error);
            Alert.alert(
              "No se pudo cerrar sesión",
              "Ocurrió un error al salir de tu cuenta. Intenta nuevamente.",
            );
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Panel del cliente</Text>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.boton}
        onPress={cerrarSesion}
      >
        <Text style={styles.textoBoton}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7ff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
  },
  boton: {
    backgroundColor: "#7C7CFF",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
