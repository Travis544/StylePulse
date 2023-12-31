import { View, Text, StyleSheet, ScrollView, Image, FlatList, } from 'react-native';

import RecommendationCard from "../components/RecommendationCard"

export default function StyleMatchRecommendationScreen({ route, navigation }) {

    const { recommendations } = route.params
    console.log(recommendations)
    // {
    //     clothingStyles.map((elem, i) => <RecommendationCard recommendationData={elem} />)
    // }
    return (
        <ScrollView>
            {
                Object.entries(recommendations).map(
                    ([clothingType, clothingDataArray], i) => {
                        return (

                            <View key={i} style={styles.sectionContainer}>
                                <Text style={styles.sectionHeader}>
                                    {clothingType}
                                </Text>
                                {/* <FlatList
                                    style={{ flex: 1 }}
                                    horizontal
                                    data={clothingData}
                                    keyExtractor={(e) => e}
                                    renderItem={({ item }) => (
                                        <RecommendationCard recommendationData={item} />
                                    )}
                                >
                                </FlatList > */}
                                <ScrollView horizontal>
                                    {
                                        clothingDataArray.map((clothingData) => <RecommendationCard key={clothingData.style} recommendationData={clothingData} />)
                                    }
                                </ScrollView>
                            </View>)
                    }
                )
            }

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    sectionHeader: {
        fontWeight: "bold",
        fontSize: 40,
        textAlign: "center"
    },

    sectionContainer: {
        // width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        flexDirection: "column",
        flex: 1
    }
})