import { View, StyleSheet, Image, Pressable, Text, TextInput } from 'react-native';
import PhotoButton from '../components/PhotoButton'
import { useState } from 'react';
import { globalStyles } from '../globalStyles';
import { encodeImage, uploadImageRequest } from '../VisionAPi';

const COLOR_MATCH = "Color match"
const COMPLETE_OUTFIT = "Complete Outfit"

export default function PromptScreen({ navigation }) {
    const [selectedImageURI, setSelectedImage] = useState("")
    const [isSelecting, setIsSelecting] = useState(true)
    const [promptText, setText] = useState("")
    const [recommendationType, setRecommendationType] = useState(COLOR_MATCH)


    const onChangeText = (text) => {
        setText(text)
    }

    //call function to retrieve recomendations based on recommendation type.
    const createRecommendations = async () => {
        const response = await expo.DocumentPicker.getDocumentAsync({
            base64: true,
            copyToCacheDirectory: false,
            type: '*/*',
        });
        // const response = await uploadImageRequest(selectedImageURI, promptText, recommendationType)
        // console.log(response)
        //navigation.navigate("Recommendation Screen", {})
    }

    return (
        <View style={styles.screenContainer}>
            <Image
                style={styles.image}
                resizeMode='contain'
                source={{
                    uri: selectedImageURI
                }}
            />

            <View style={styles.recommendationTypeContainer}>
                <Pressable onPress={() => { setRecommendationType(COLOR_MATCH) }} style={[styles.recommendationTypeButton,
                { opacity: recommendationType === COLOR_MATCH ? '1' : "0.5" }]} >
                    <Text style={globalStyles.text}>
                        Color Match
                    </Text>
                </Pressable>

                <Pressable onPress={() => { setRecommendationType(COMPLETE_OUTFIT) }} style={[styles.recommendationTypeButton, { opacity: recommendationType === COMPLETE_OUTFIT ? '1' : "0.5" }]} >
                    <Text style={globalStyles.text}>
                        Complete Outfit
                    </Text>
                </Pressable>
            </View>

            <View>
                <Text style={styles.exampleText}>
                    {
                        recommendationType == COLOR_MATCH ?
                            "Example:  Recommend me a shirt with colors that goes well with the pants in the picture.." :
                            "Example: Recommend me a shoe that matches the style of the pants in the picture.."
                    }
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={onChangeText}
                    value={promptText}
                />
            </View>
            {
                isSelecting &&
                <View style={styles.buttonContainer}>
                    <PhotoButton imageSelectedCallback={(imageURI) => {
                        setSelectedImage(imageURI)
                        setIsSelecting(false)
                    }} />
                </View>
            }
            {
                !isSelecting &&
                <View>
                    <Pressable onPress={() => { setIsSelecting(true) }} style={[globalStyles.button, { marginBottom: "1%" }]} >
                        <Text style={globalStyles.text}>
                            Reselect Image
                        </Text>
                    </Pressable>

                    <Pressable onPress={async () => { await createRecommendations() }} style={globalStyles.button}>
                        <Text style={globalStyles.text}>
                            Create Recommendations
                        </Text>
                    </Pressable>
                </View>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    recommendationTypeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5
    },

    recommendationTypeButton: {
        backgroundColor: "#FF835C",
        paddingVertical: 12,
        paddingHorizontal: 12,
    },

    screenContainer: {
        flexDirection: "column",
        alignContent: "center",
        marginLeft: 'auto',
        marginRight: "auto",
        height: "70%",
        width: "80%"
    },

    exampleText: {
        marginTop: 1,
        color: "grey",
        marginBottom: 5,
    },

    textInput: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#303030",
        padding: 10,
        // ...Platform.select({
        //     ios: {
        //         shadowColor: '#364F49',
        //         shadowOffset: { width: 0, height: 2 },
        //         shadowOpacity: 0.5,
        //         shadowRadius: 2,
        //     },
        //     android: {
        //         elevation: 4,
        //     },
        // }),
    },

    buttonContainer: {
        flex: 2,
    },

    image: {
        flex: 4,
    }
})