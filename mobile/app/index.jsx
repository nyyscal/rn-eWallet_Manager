import { COLORS } from "@/constants/colors";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{color:COLORS.primary}}>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
