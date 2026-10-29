import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import Categoria from "../components/Categoria";
import Producto from "../components/Producto";

const Catalogo = ({ navigation, route }) => {

  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    route.params?.categoriaId || "todos",
  );
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);

  const manejarCategoria = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    setCargandoProductos(true);
    navigation.setParams({ categoriaId });
  };

  useEffect(() => {
    let activo = true;
    getDocs(collection(db, "categorias"))
      .then((querySnapshot) => {
        if (!activo) return;
        setCategorias(
          querySnapshot.docs.map((documento) => ({
            id: documento.id,
            ...documento.data(),
          })),
        );
      })
      .catch((error) => {
        console.error("Error obteniendo categorías: ", error);
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    let activo = true;
    const categoriaId = route.params?.categoriaId || "todos";

    const cargarProductos = async () => {
      try {
        const productosRef = collection(db, "Productos");
        const consulta =
          categoriaId === "todos"
            ? productosRef
            : query(productosRef, where("categoriaId", "==", categoriaId));
        const querySnapshot = await getDocs(consulta);
        const datos = querySnapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        if (activo) {
          setProductos(datos);
          setCategoriaSeleccionada(categoriaId);
        }
      } catch (error) {
        console.error("Error obteniendo productos: ", error);
      } finally {
        if (activo) setCargandoProductos(false);
      }
    };

    cargarProductos();
    return () => {
      activo = false;
    };
  }, [route.params?.categoriaId]);

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria =
      categoriaSeleccionada === "todos" || producto.categoriaId === categoriaSeleccionada;
    const coincideBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenedorContenido}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.buscador}>
        <Ionicons name="search-outline" size={18} color="#7C7CFF" />
        <TextInput
          placeholder="Buscar producto"
          placeholderTextColor="#B5B5D5"
          style={styles.input}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categorias}
        contentContainerStyle={styles.categoriasContenido}
      >
        {[
          { id: "todos", nombre: "Todos", icono: "apps-outline" },
          ...categorias,
        ].map((categoria) => (
          <Categoria
            key={categoria.id}
            nombre={categoria.nombre}
            icono={categoria.icono}
            onPress={() => manejarCategoria(categoria.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.linea} />
      <Text style={styles.titulo}>News</Text>

      {cargandoProductos ? (
        <ActivityIndicator
          accessibilityLabel="Cargando productos"
          color="#7C7CFF"
          size="large"
          style={styles.cargando}
        />
      ) : (
        <View style={styles.productos}>
          {productosFiltrados.map((producto) => (
            <Producto
              key={producto.id}
              nombre={producto.nombre}
              precio={producto.precio}
              imagen={producto.imagen}
              color={producto.color || "#F4F4F4"}
              tiempo={producto.tiempo || "Hoy"}
              onPress={() =>
                navigation.navigate("DetalleProducto", {
                  nombre: producto.nombre,
                  precio: producto.precio,
                  categoria:
                    categorias.find(
                      (categoria) => categoria.id === producto.categoriaId,
                    )?.nombre || "Sin categoría",
                  color: producto.color || "#F4F4F4",
                  imagen: producto.imagen,
                  descripcion: producto.descripcion,
                })
              }
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    marginTop: 50,
  },
  contenedorContenido: {
    paddingBottom: 24,
  },
  buscador: {
    height: 52,
    backgroundColor: "#F5F4FC",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: "#1F1F1F",
  },
  categorias: {
    marginBottom: 10,
  },
  categoriasContenido: {
    paddingRight: 12,
  },
  linea: {
    height: 2,
    backgroundColor: "#E7E7E7",
    marginHorizontal: -10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 15,
    marginBottom: 10,
  },
  productos: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  cargando: {
    paddingVertical: 48,
  },
});

export default Catalogo;