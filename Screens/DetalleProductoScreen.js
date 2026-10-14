import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DetalleProductoScreen({ route }) {
  const {
    nombre = "Producto",
    precio,
    categoria = "Sin categoría",
    color = "#F4F4F4",
    imagen,
    descripcion,
  } = route.params || {};

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.contenedorImagen, { backgroundColor: color }]}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.imagen} />
        ) : (
          <Text style={styles.sinImagen}>Imagen no disponible</Text>
        )}
      </View>
      <View style={styles.detalles}>
        <Text style={styles.categoria}>{categoria}</Text>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.precio}>
          {precio == null ? "Precio no disponible" : `$ ${precio}`}
        </Text>
        <Text style={styles.etiquetaDescripcion}>Descripción</Text>
        <Text style={styles.descripcion}>
          {descripcion || "No hay descripción disponible para este producto."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contenido: {
    paddingBottom: 28,
  },
  contenedorImagen: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  imagen: {
    width: "88%",
    height: 280,
    resizeMode: "contain",
  },
  sinImagen: {
    color: "#77768F",
  },
  detalles: {
    padding: 22,
  },
  categoria: {
    color: "#7C7CFF",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  nombre: {
    color: "#242337",
    fontSize: 25,
    fontWeight: "700",
    marginTop: 8,
  },
  precio: {
    color: "#242337",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 12,
  },
  etiquetaDescripcion: {
    color: "#242337",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
  },
  descripcion: {
    color: "#66657A",
    fontSize: 15,
    lineHeight: 22,
  },
});
