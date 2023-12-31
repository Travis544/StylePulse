import { View, StyleSheet, Image, Pressable, Text, TextInput, TouchableWithoutFeedback, Keyboard, Platform, ActivityIndicator } from 'react-native';
import PhotoButton from '../components/PhotoButton'
import { useState } from 'react';
import { globalStyles } from '../globalStyles';
import { encodeImage, uploadImageRequest, fetchImageURLs } from '../VisionAPi';
import { COLOR_MATCH, COMPLETE_OUTFIT } from "../constants"
import { Overlay } from '@rneui/themed';



export default function PromptScreen({ navigation }) {
    const [selectedImageURI, setSelectedImage] = useState("img") //State variable to hold the selected Image string
    const [isSelecting, setIsSelecting] = useState(true)
    const [promptText, setText] = useState("")
    const [showSpinner, setShowSpinner] = useState(false)
    // const [jSONResponse, setJSONResponse] = useState("")
    const [recommendationType, setRecommendationType] = useState("")

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
            const styles = styleMatchRecommendations[clothingType] //this is getting 
            clothingTypeToImageUrls[clothingType] = [] //setting value of key clothing type to be an array

            for (let style of styles) {
                try {
                    const imageUrls = await fetchImageURLs(style, 1)

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
        if (recommendationType == "") {
            alert("Please select recommendation type")
            return
        }

        if (promptText == "") {
            alert("Please select a prompt text")
            return
        }

        setShowSpinner(true)
        console.log("Creating recommendtings...")
        let base64_image = selectedImageURI
        //on the phone, the image uri is the file path so we have to read the file.
        if (Platform.OS != "web") {
            base64_image = await encodeImage(selectedImageURI)
        }

        const response = await uploadImageRequest(base64_image, promptText, recommendationType)

        if (recommendationType === COMPLETE_OUTFIT) {
            let res = {}
            console.log("JSON RESPONSE")
            const JSONResponse = JSON.parse(response)
            console.log(JSONResponse)
            res = await transformRecommendationTextToClothingData(JSONResponse)
            console.log(res)
            setShowSpinner(false)

            navigation.navigate("Style Match Recommendation", { recommendations: res })
        } else {
            //TODO handle color match
            let res = {}
            //parse JSOn
            const JSONResponse = JSON.parse(response) //
            console.log(JSONResponse)
            setShowSpinner(false)
            navigation.navigate("Color Match Recommendation", {
                recommendations: JSONResponse
            })
        }
    }

    const colorRecommendations = () => {

        //here loop through json, then make an arry of really the keys, only? (CHeck the style parameter first.)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style={[styles.screenContainer, { opacity: showSpinner ? 0.5 : 1 }]}>

                <Overlay overlayStyle={{ opacity: 0.8 }} isVisible={showSpinner}>
                    <ActivityIndicator style={styles.spinnerStyle} size="large" />
                </Overlay>

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
                    <Text style={styles.choiceText}>
                        {
                            recommendationType == COLOR_MATCH ?
                                "Get recommendations on colors that match the clothes you want to wear" :
                                "Discover styles that go with the clothes you have"
                        }
                    </Text>
                    <Text style={styles.exampleText}>
                        {
                            recommendationType == COLOR_MATCH ?
                                "Example:  What colors go well with the pants in the picture..\n\n Example: What colors matches this..." :
                                "Example: Show me shoes that matches the style of these pants..\n\n Example: Show me styles of hats that match this dress"
                        }
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={onChangeText}
                        value={promptText}
                        multiline={true}
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

    spinnerStyle: {

        opacity: 1
    },

    overlayStyle: {
        opacity: 0.5,
        width: 50,
        height: 50
    },

    recommendationTypeButton: {
        backgroundColor: "#FF835C",
        paddingVertical: 12, //controls both top and bottom badding
        paddingHorizontal: 12,
        marginVertical: 20,
        borderRadius: 10,
        marginTop: 20
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
        fontSize: 15,
        marginBottom: 10,
    },

    choiceText: {
        marginVertical: 10,
        color: "black",
        fontWeight: "bold",
        fontSize: 15,
        marginBottom:10
    },

    textInput: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#303030",
        padding: 10,
        borderRadius: 10,

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
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 20
    }
})