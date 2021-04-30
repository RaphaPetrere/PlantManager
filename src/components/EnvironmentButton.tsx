import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentButtonProps extends RectButtonProps{
    title: string;
    active?: boolean;
}

export function EnvironmentButton({title, active = false, ...rest} : EnvironmentButtonProps) {
    return (
        <RectButton style={[styles.container, active && styles.containerActive]} {...rest}>
            <Text style={[styles.text, active && styles.textActive]}>
                {title}
            </Text>
        </RectButton>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.shape,
        height: 40,
        width: 76,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },

    text: {
        color: colors.heading,
        fontFamily: fonts.text,
    },

    containerActive: {
        backgroundColor: colors.green_light,
    },

    textActive: {
        fontFamily: fonts.heading,
        color: colors.green_dark,
    }
});