import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase/config";

const CategoriasScreen = ({ navigation }) => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activa = true;

    const cargarCategorias = async () => {
      try {
        const resultado = await getDocs(collection(db, "categorias"));
        if (activa) {
          setCategorias(
            resultado.docs.map((documento) => ({
              id: documento.id,
              ...documento.data(),
            })),
          );
        }
      } catch (e) {
        console.error("Error obteniendo categorías:", e);
        if (activa) {
          setError("No fue posible cargar las categorías. Intenta nuevamente.");
        }
      } finally {
        if (activa) setCargando(false);
      }
    };

    cargarCategorias();
    return () => {
      activa = false;
    };
  }, []);

  const abrirCatalogo = (categoriaId = "todos") => {
    navigation.navigate("CatalogoTab", {
      screen: "Catalogo",
      params: { categoriaId },
    });
  };

  const renderCategoria = ({ item }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver productos de ${item.nombre || "esta categoría"}`}
      onPress={() => abrirCatalogo(item.id)}
      style={styles.tarjeta}
    >
      <View style={styles.icono}>
        <Ionicons
          name={item.icono || "pricetag-outline"}
          size={26}
          color="#7C7CFF"
        />
      </View>
      <Text numberOfLines={2} style={styles.nombre}>
        {item.nombre || "Categoría"}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#9998B0" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.contenedor} edges={["top"]}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Categorías</Text>
        <Text style={styles.subtitulo}>
          Explora los productos por categoría.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => abrirCatalogo()}
        style={styles.verTodos}
      >
        <Ionicons name="apps-outline" size={22} color="#FFFFFF" />
        <Text style={styles.textoVerTodos}>Ver todos los productos</Text>
        <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
      </Pressable>

      {cargando ? (
        <ActivityIndicator
          accessibilityLabel="Cargando categorías"
          color="#7C7CFF"
          size="large"
          style={styles.cargando}
        />
      ) : error ? (
        <Text accessibilityRole="alert" style={styles.mensaje}>
          {error}
        </Text>
      ) : categorias.length === 0 ? (
        <Text style={styles.mensaje}>Aún no hay categorías disponibles.</Text>
      ) : (
        <FlatList
          contentContainerStyle={styles.lista}
          columnWrapperStyle={styles.fila}
          data={categorias}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderCategoria}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  encabezado: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  titulo: {
    color: "#22213A",
    fontSize: 28,
    fontWeight: "700",
  },
  subtitulo: {
    color: "#77768F",
    fontSize: 14,
    marginTop: 6,
  },
  verTodos: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#7C7CFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  textoVerTodos: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  lista: {
    paddingBottom: 24,
  },
  fila: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tarjeta: {
    flex: 1,
    minHeight: 116,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F6FC",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 4,
  },
  icono: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECEBFF",
    borderRadius: 12,
    marginRight: 8,
  },
  nombre: {
    flex: 1,
    color: "#33324A",
    fontSize: 13,
    fontWeight: "600",
  },
  cargando: {
    paddingVertical: 48,
  },
  mensaje: {
    color: "#77768F",
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 32,
  },
});

export default CategoriasScreen;
