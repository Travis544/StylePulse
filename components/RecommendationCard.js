
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Card } from '@rneui/themed';

export default function RecommendationCard({ recommendationData }) {
    console.log(recommendationData)
    console.log(recommendationData.imageUrl)
    return (<Card>
        <Card.Title>
            {recommendationData.style.toUpperCase()}
        </Card.Title>
        <Card.Divider />
        <Image
            style={{
                aspectRatio: 1,
                width: 200,
                height: 200
            }}
            source={{ uri: recommendationData.imageUrl }}
            PlaceholderContent={<ActivityIndicator />}
        />
    </Card>)
}