// import { launchImageLibrary } from 'react-native-image-picker';

import { View, Pressable, Text } from 'react-native';
import { globalStyles } from '../globalStyles'

import * as ImagePicker from 'expo-image-picker';

export default function PhotoButton({ imageSelectedCallback }) {

    const [cameraPermissionStatus, requestPermission] = ImagePicker.useCameraPermissions();

    const openImagePicker = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            console.log(result.assets[0].uri)
            imageSelectedCallback(result.assets[0].uri)
        }
    };

    const handleCameraLaunch = async () => {

        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        };
        if (cameraPermissionStatus.status == "denied" || cameraPermissionStatus.status == "undetermined") {
            const permissionRes = await requestPermission()
            console.log("PERMISSION RES")
            console.log(permissionRes)
            if (permissionRes.granted == false) {
                return
            }
        }

        const result = await ImagePicker.launchCameraAsync(options)
        if (result.canceled) {
            return
        } else {
            console.log(result.assets[0].uri)
            imageSelectedCallback(result.assets[0].uri)
        }
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
                    Choose from Camera
                </Text>
            </Pressable>
        </View>
    )
}


