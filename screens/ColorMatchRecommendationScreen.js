import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import ColorSquare from '../components/ColorSquare';
export default function ColorMatchRecommendationScreen({ route, navigation }) {
    const { recommendations } = route.params
    console.log("Recommendations")
    console.log(recommendations)

    const renderItem = ({ item }) => {
        return (<ColorSquare colorData={item[1]} />)
    }

    return (
        <TouchableOpacity style={{ flex: 1 }}>
            <Text>
                Colors that match your clothes are...
            </Text>
            <FlatList
                data={Object.entries(recommendations)}
                renderItem={renderItem}
                keyExtractor={item => item}
                numColumns={2}
            />
        </TouchableOpacity >
    )
}