// import { launchImageLibrary } from 'react-native-image-picker';

import { View, Pressable, Text } from 'react-native';
import { globalStyles } from '../globalStyles';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
export default function PhotoButton({ imageSelectedCallback }) {
    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                console.log(imageUri)
                imageSelectedCallback(imageUri)
            }
        });
    };

    const handleCameraLaunch = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchCamera(options, response => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                imageSelectedCallback(imageUri)
                console.log(imageUri);
            }
        });
    }

    return (
        <View>
            <Pressable style={[globalStyles.button, { marginBottom: "1%" }]} title="Choose from Device" onPress={openImagePicker}>
                <Text style={globalStyles.text}>
                    Choose from Device
                </Text>
            </Pressable>
            <Pressable style={globalStyles.button} onPress={handleCameraLaunch}>
                <Text style={globalStyles.text}>
                    Open Camera
                </Text>
            </Pressable>
        </View>
    )
}


