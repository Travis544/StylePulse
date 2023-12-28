import { View, StyleSheet, Image, Pressable, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PhotoButton from '../components/PhotoButton'
import { useState } from 'react';
import { globalStyles } from '../globalStyles';
import { encodeImage, uploadImageRequest, fetchImageURLs } from '../VisionAPi';
import { COLOR_MATCH, COMPLETE_OUTFIT } from "../constants"

export default function PromptScreen({ navigation }) {
    const [selectedImageURI, setSelectedImage] = useState("img") //State variable to hold the selected Image string
    const [isSelecting, setIsSelecting] = useState(true)
    const [promptText, setText] = useState("")
    const [jSONResponse, setJSONResponse] = useState("")
    const [recommendationType, setRecommendationType] = useState(COLOR_MATCH)

    //sets the promptText variable
    const onChangeText = (text) => {
        setText(text)
    }

    //MIght need to use Expo filesystem to get this working out well, Check with Travus
    const convertImageToBase64 = (imageURL) => {
        return imageURL.toString('base64');
    }

    //convert recommendation style text from OpenAI to clothing data including the style text and image url.
    async function transformRecommendationTextToClothingData(styleMatchRecommendations) {
        const clothingTypeToImageUrls = {

        }

        for (const clothingType in styleMatchRecommendations) {
            console.log(clothingType)
            const styles = styleMatchRecommendations[clothingType]
            clothingTypeToImageUrls[clothingType] = []

            for (let style of styles) {
                try {
                    const imageUrls = await fetchImageURLs(style, 1)
                    console.log(imageUrls)
                    let clothingData = {
                        style: style,
                        imageUrl: imageUrls[0]
                    }
                    clothingTypeToImageUrls[clothingType].push(clothingData)

                } catch (e) {
                    console.log(e)
                }
            }
        }

        return clothingTypeToImageUrls
    }

    //call function to retrieve recomendations based on recommendation type.
    const createRecommendations = async () => {
        console.log(selectedImageURI)
        console.log(promptText)
        const base64_URL = await encodeImage(selectedImageURI)
        const response = await uploadImageRequest(base64_URL, promptText, recommendationType)
        setJSONResponse(JSON.parse(response))
        console.log(jSONResponse)
        const res = await transformRecommendationTextToClothingData(jSONResponse)
        console.log(res)
        navigation.navigate("Recommendation Screen", { recommendations: res })
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                            Style Match
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
        </TouchableWithoutFeedback>
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