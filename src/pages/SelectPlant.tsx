import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    FlatList,
    ActivityIndicator, 
} from 'react-native';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentProps {
    key: string;
    title: string;
}

interface PlantProps {
        id: number;
        name: string;
        about: string;
        water_tips: string;
        photo: string;
        environments: [string];
        frequency: {
          times: number;
          repeat_every: string;
        }
}

export function SelectPlant() {
    const [ environments, setEnvironments ] = useState<EnvironmentProps[]>([]);
    const [ plants, setPlants ] = useState<PlantProps[]>([]);
    const [ filteredPlants, setFilteredPlants ] = useState<PlantProps[]>([]); //Estado auxiliar pra aplicar os filtros.
    const [ environmentSelected,  setEnvironmentSelected ] = useState('all');

    const [ loading, setLoading ] = useState(true);

    const [ page, setPage ] = useState(1);
    const [ loadingMore, setLoadingMore ] = useState(false);
    const [ loadedAll, setLoadedAll ] = useState(false);

    function handleEnvironmentSelect(environment: string) {
        setEnvironmentSelected(environment);

        if(environment == 'all')
            return setFilteredPlants(plants);

        const filtered = plants.filter(plant => plant.environments.includes(environment))

        setFilteredPlants(filtered);
    }

    function handleFetchMore(distance: number) {
        if(distance < 1)
            return; //significa q ele ta rodando pra cima

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchPlants();
    }

    async function fetchPlants(){
        const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if(!data)
            return setLoading(true);

        if(page > 1)
        {
            setPlants(oldValue => [...oldValue, ...data])
            setFilteredPlants(oldValue => [...oldValue, ...data])
        }
        else
        {
            setPlants(data);
            setFilteredPlants(data);
        }
        setLoading(false);
        setLoadingMore(false);
    }

    useEffect(() => {
        async function fetchEnvironment(){
            const { data } = await api.get('plants_environments?_sort=title&_order=asc');
            setEnvironments([
                {
                    key: 'all',
                    title: 'Todos',
                },
                ...data
            ]);
        }

        fetchEnvironment();
    }, [])

    useEffect(() => {
        fetchPlants();
    }, [])

    if(loading)
        return <Load />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>Em qual ambiente</Text>
                <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
            </View>

            <View>
                <FlatList 
                    data={environments} 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.environmentList}
                    renderItem={({item}) => (
                        <EnvironmentButton title={item.title} active={item.key === environmentSelected} onPress={() => handleEnvironmentSelect(item.key)} key={item.key}/>
                    )} 
                />
                
            </View>

            <View style={styles.plants}>
                <FlatList 
                    data={filteredPlants}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({distanceFromEnd}) => handleFetchMore(distanceFromEnd)}
                    ListFooterComponent={
                        loadingMore ?
                        <ActivityIndicator color={colors.green} />
                        : <></>
                    }
                    renderItem={({item}) => (
                        <PlantCardPrimary data={item} key={item.id}/>
                    )} 
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        paddingHorizontal: 30,
    },

    title: {
        fontSize: 17,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 20,
        marginTop: 15,
    },

    subtitle: {
        fontSize: 17,
        fontFamily: fonts.text,
        lineHeight: 20,
        color: colors.heading,
    },

    environmentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32,
    },

    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center',
    }
})