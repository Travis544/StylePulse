import { View, Text, StyleSheet, ScrollView, Image, FlatList, } from 'react-native';
export default function ColorSquare({ colorData }) {
    return (
        <View style={{
            backgroundColor: colorData.hexValue,
            flex: 1,
            width: 100,
            height: 100,
        }}>
            <Text style={styles.colorText}>
                {colorData.color}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    colorText: {
        textAlign: "center",
        fontSize: 20,
        margin: "auto",
        fontWeight: "bold"
    }
});