import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import PromptScreen from './screens/PromptScreen';
import StyleMatchRecommendationScreen from './screens/StyleMatchRecommendationScreen';
import ColorMatchRecommendationScreen from './screens/ColorMatchRecommendationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Prompt Screen"
          component={PromptScreen}
        />
        <Stack.Screen
          name="Recommendations"
          component={StyleMatchRecommendationScreen}

        />
        <Stack.Screen
          name="Color Match Recommendation"
          component={ColorMatchRecommendationScreen}

        />

      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
