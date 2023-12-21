import { View, Button, StyleSheet, Image, Pressable, Text } from 'react-native';
import PhotoButton from '../components/PhotoButton'
import { useState } from 'react';
import { globalStyles } from '../globalStyles';

export default function TakePictureScreen() {
    const [selectedImageURI, setSelectedImage] = useState("")
    const [isSelecting, setIsSelecting] = useState(true)

    const goToNextStep = () => {

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
            {
                isSelecting &&
                <View>
                    <View style={styles.buttonContainer}>
                        <PhotoButton imageSelectedCallback={(imageURI) => {
                            setSelectedImage(imageURI)
                            setIsSelecting(false)
                        }} />
                    </View>
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
        margin: "auto",
        height: "80%",
        width: "80%"
    },

    buttonContainer: {
        flex: 1,
    },

    image: {
        flex: 4,
        marginBottom: "1%"
    }
})