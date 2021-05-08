import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, FlatList, Platform } from 'react-native';
import { Header } from '../components/Header';
import { loadPlant, PlantProps } from '../libs/storage';
import { formatDistance } from 'date-fns/esm';
import { ptBR } from 'date-fns/locale';
import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

export function MyPlants() {
    const [ myPlants, setMyPlants ] = useState<PlantProps[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ nextWater, setNextWater ] = useState('');

    useEffect(() => {
        async function loadStoragedData() {
            const storagedPlants = await loadPlant();

            const nextTime = formatDistance(
                new Date(storagedPlants[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale:  ptBR }
            );

            setNextWater(
                `Não esqueça de regar a ${storagedPlants[0].name} à ${nextTime} horas.`
            )

            setMyPlants(storagedPlants);
            setLoading(false);
        }

        loadStoragedData();
    }, [])

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image source={waterdrop} style={styles.spotlightImage} />
                <Text style={styles.spotlightText}>
                    {nextWater}
                </Text>
            </View>
            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                </Text>

                <FlatList 
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({item}) => (
                        <PlantCardSecondary data={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={ Platform.OS === 'ios' && {flex: 1}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background,
    },

    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    spotlightImage: {
        width: 60,
        height: 60,
    },

    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },

    plants: {
        flex: 1,
        width: '100%',
    },

    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20,
    },
});