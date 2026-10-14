import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OtraScreenCliente() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mi perfil</Text>
      <Text>Bienvenido al área del cliente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7ff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7C7CFF",
    marginBottom: 10,
  },
});
