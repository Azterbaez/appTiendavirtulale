import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";

export default function Login({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  const rechazarAcceso = async (titulo, mensaje) => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error cerrando una sesión sin rol válido:", error);
      Alert.alert(
        "Error de sesión",
        "No fue posible cerrar la sesión. Intenta nuevamente.",
      );
      return;
    }

    Alert.alert(titulo, mensaje);
  };

  const iniciarSesion = async () => {
    const correoIngresado = correo.trim().toLowerCase();
    if (!correoIngresado || !contrasena) {
      Alert.alert("Datos incompletos", "Ingresa tu correo y contraseña.");
      return;
    }

    setCargando(true);
    let credencial;

    try {
      credencial = await signInWithEmailAndPassword(
        auth,
        correoIngresado,
        contrasena,
      );
    } catch (error) {
      console.error("Error iniciando sesión:", error);
      const credencialesInvalidas = [
        "auth/invalid-credential",
        "auth/user-not-found",
        "auth/wrong-password",
        "auth/invalid-email",
      ].includes(error.code);

      Alert.alert(
        "No se pudo iniciar sesión",
        credencialesInvalidas
          ? "Correo o contraseña incorrectos."
          : "Ocurrió un error al iniciar sesión. Intenta nuevamente.",
      );
      setCargando(false);
      return;
    }

    try {
      const usuarioSnapshot = await getDoc(
        doc(db, "Usuarios", credencial.user.uid),
      );
      if (!usuarioSnapshot.exists()) {
        await rechazarAcceso(
          "Acceso denegado",
          "Tu cuenta no tiene un perfil registrado en Usuarios.",
        );
        return;
      }

      const datosUsuario = usuarioSnapshot.data();
      const rol = String(datosUsuario.rol ?? datosUsuario.role ?? "")
        .trim()
        .toLowerCase();
      const rutaPorRol = {
        cliente: "ClienteTabs",
        client: "ClienteTabs",
        administrador: "AdminTabs",
        admin: "AdminTabs",
      };
      const ruta = Object.prototype.hasOwnProperty.call(rutaPorRol, rol)
        ? rutaPorRol[rol]
        : null;

      if (!ruta) {
        await rechazarAcceso(
          "Acceso denegado",
          "El perfil de tu cuenta no tiene un rol válido.",
        );
        return;
      }

      navigation.replace(ruta);
    } catch (error) {
      console.error("Error validando el rol del usuario:", error);
      try {
        await signOut(auth);
      } catch (errorCierre) {
        console.error(
          "Error cerrando sesión tras fallar la validación:",
          errorCierre,
        );
        Alert.alert(
          "Error de sesión",
          "No se pudo validar tu rol ni cerrar la sesión. Intenta nuevamente.",
        );
        return;
      }
      Alert.alert(
        "No se pudo validar el acceso",
        "Ocurrió un error al consultar tu perfil. Intenta nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formulario}>
          <Text style={styles.titulo}>IKY</Text>
          <Text style={styles.subtitulo}>Iniciar sesión</Text>

          <TextInput
            accessibilityLabel="Correo electrónico"
            style={styles.input}
            placeholder="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            editable={!cargando}
            returnKeyType="next"
          />

          <TextInput
            accessibilityLabel="Contraseña"
            style={styles.input}
            placeholder="Contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            editable={!cargando}
            onSubmitEditing={iniciarSesion}
            returnKeyType="go"
          />

          <TouchableOpacity
            accessibilityRole="button"
            disabled={cargando}
            style={[styles.boton, cargando && styles.botonDeshabilitado]}
            onPress={iniciarSesion}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBoton}>Ingresar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f7f7ff",
  },
  contenido: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  formulario: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },
  titulo: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#7C7CFF",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
  },
  boton: {
    backgroundColor: "#7C7CFF",
    minHeight: 52,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
