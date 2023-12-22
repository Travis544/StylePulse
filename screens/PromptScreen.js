import { View, ScrollView, StyleSheet, Image, Pressable, Text, TextInput } from 'react-native';
import PhotoButton from '../components/PhotoButton'
import { useState } from 'react';
import { globalStyles } from '../globalStyles';


export default function PromptScreen() {
    const [selectedImageURI, setSelectedImage] = useState("")
    const [isSelecting, setIsSelecting] = useState(true)
    const [promptText, setText] = useState("")

    const onChangeText = (text) => {
        setText(text)
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


            <View>
                <Text style={styles.exampleText}>
                    Example:  Recommend a shirt that goes well with this pant..
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

                    <Pressable style={globalStyles.button} >
                        <Text style={globalStyles.text}>
                            Next Step
                        </Text>
                    </Pressable>
                </View>
            }
        </View >
    )
}


const styles = StyleSheet.create({

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
        ...Platform.select({
            ios: {
                shadowColor: '#364F49',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
            },
            android: {
                elevation: 4,
            },
        }),
    },

    buttonContainer: {
        flex: 2,
    },

    image: {
        flex: 4,
    }
})