import {View, Text, StyleSheet} from "react-native"
import { Button, BUTTON_TYPE_SECONDARY, BUTTON_TYPE_SUCCESS } from "../button"

export default function FindlyModal({title, highlight, description, actionText, onAction, onClose}){
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {highlight ? <Text style={styles.highlight}>{highlight}</Text> : null}
                {description ? <Text style={styles.description}>{description}</Text> : null}
                {actionText && onAction ? (
                    <Button type={BUTTON_TYPE_SUCCESS} text={actionText} onClick={onAction}/>
                ) : null}
                <Button type={BUTTON_TYPE_SECONDARY} text="Voltar" onClick={onClose}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        width: "85%",
        gap: 12
    },
    title:{
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        color: "#3e3e3e"
    },
    highlight: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        color: "#00aeff",
        backgroundColor: "#f0f8ff",
        padding: 10,
        borderRadius: 8
    },
    description: {
        fontSize: 15,
        textAlign: "center",
        color: "#555555",
        lineHeight: 22
    }
})
