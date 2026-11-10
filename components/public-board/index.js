import {View, Text, StyleSheet, Modal} from "react-native"
import { useState } from "react"
import { Button, BUTTON_TYPE_PRIMARY } from "../button"
import FindlyModal from "../modal"

export function PublicBoard({custodyItems}){

    const [selectedItem, setSelectedItem] = useState(null)
    const [isModalVisible, setModalVisible] = useState(false)

    function openDetails(item){
        setSelectedItem(item)
        setModalVisible(true)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mural Público de Achados</Text>
            <Text style={styles.subtitle}>
                Itens encontrados e sob guarda no Setor de Achados e Perdidos
            </Text>

            <View style={styles.list}>
                {custodyItems.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.itemName}>{item.nome}</Text>
                            <Text style={[
                                styles.badge,
                                item.status === "Devolvido" ? styles.badgeReturned : styles.badgeCustody
                            ]}>
                                {item.status}
                            </Text>
                        </View>

                        <Text style={styles.itemCategory}>Categoria: {item.categoria}</Text>
                        <Text style={styles.itemDescription}>{item.descricao}</Text>

                        <View style={styles.guardBox}>
                            <Text style={styles.guardTitle}>Dados da Guarda:</Text>
                            <Text style={styles.guardText}>Entrada: {item.data_entrada}</Text>
                            <Text style={styles.guardText}>Estado: {item.descricao_estado}</Text>
                            {item.receptor ? (
                                <Text style={styles.guardText}>
                                    Retirado por: {item.receptor} ({item.data_saida})
                                </Text>
                            ) : null}
                        </View>

                        <Button
                            type={BUTTON_TYPE_PRIMARY}
                            text="Ver Detalhes de Custódia"
                            onClick={() => openDetails(item)}
                        />
                    </View>
                ))}
            </View>

            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <FindlyModal
                    title={selectedItem ? selectedItem.nome : "Detalhes da Custódia"}
                    highlight={selectedItem ? `Status: ${selectedItem.status}` : ""}
                    description={
                        selectedItem
                            ? `Categoria: ${selectedItem.categoria}\nDescrição: ${selectedItem.descricao}\nData de Entrada: ${selectedItem.data_entrada}\nEstado do Item: ${selectedItem.descricao_estado}\n\nInstruções para Retirada:\nCompareça ao Setor Físico de Achados e Perdidos (Bloco Central - Sala 102) apresentando documento oficial com foto ou matrícula universitária para identificação do receptor.`
                            : ""
                    }
                    onClose={() => setModalVisible(false)}
                />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        gap: 12
    },
    title:{
        fontSize: 22,
        fontWeight: "700",
        color: "#2d2d2d",
        textAlign: "center"
    },
    subtitle:{
        fontSize: 14,
        color: "#666666",
        textAlign: "center"
    },
    list:{
        gap: 12
    },
    card:{
        backgroundColor: "#f7f9fc",
        borderRadius: 10,
        padding: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: "#e1e8f0"
    },
    cardHeader:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 6
    },
    itemName:{
        fontSize: 18,
        fontWeight: "700",
        color: "#2d2d2d"
    },
    badge:{
        fontSize: 12,
        fontWeight: "700",
        color: "#fff",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6
    },
    badgeCustody:{
        backgroundColor: "#00aeff"
    },
    badgeReturned:{
        backgroundColor: "#2a9362"
    },
    itemCategory:{
        fontSize: 14,
        fontWeight: "600",
        color: "#555555"
    },
    itemDescription:{
        fontSize: 14,
        color: "#3e3e3e"
    },
    guardBox:{
        backgroundColor: "#eef3f8",
        padding: 8,
        borderRadius: 8,
        gap: 2
    },
    guardTitle:{
        fontSize: 13,
        fontWeight: "700",
        color: "#2d2d2d"
    },
    guardText:{
        fontSize: 13,
        color: "#4f4f4f"
    }
})

