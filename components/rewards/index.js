import {View, Text, StyleSheet, Modal} from "react-native"
import { useState } from "react"
import { Button, BUTTON_TYPE_SUCCESS, BUTTON_TYPE_SECONDARY } from "../button"
import FindlyModal from "../modal"

const couponCharset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function Rewards({saldoPontos, rewardsList, onRedeemReward}){

    const [isModalVisible, setModalVisible] = useState(false)
    const [modalData, setModalData] = useState({
        title: "",
        highlight: "",
        description: ""
    })

    function gerarCodigoCupom(){
        let cupom = "CUPOM-"
        for(let i = 0; i < 6; i++){
            let randomIndex = Math.floor(Math.random() * couponCharset.length)
            cupom += couponCharset.charAt(randomIndex)
        }
        return cupom
    }

    function resgatarBeneficio(reward){
        if(reward.status !== "Disponível"){
            setModalData({
                title: "Benefício Indisponível",
                highlight: reward.status,
                description: "Este benefício já foi resgatado nesta sessão."
            })
            setModalVisible(true)
            return
        }

        if(saldoPontos < reward.custo_pontos){
            setModalData({
                title: "Saldo Insuficiente",
                highlight: `${saldoPontos} pts / ${reward.custo_pontos} pts`,
                description: "Você ainda não possui pontos suficientes. Continue ajudando a comunidade universitária devolvendo itens perdidos!"
            })
            setModalVisible(true)
            return
        }

        const codigoCupom = gerarCodigoCupom()
        const dataResgate = "09/11/2026 23:40"

        onRedeemReward(reward.id, reward.custo_pontos, codigoCupom, dataResgate)

        setModalData({
            title: "Benefício Resgatado!",
            highlight: codigoCupom,
            description: `Recompensa: ${reward.titulo}\nPontos Deduzidos: ${reward.custo_pontos} pts\nData do Resgate: ${dataResgate}\n\nApresente este código de cupom na clínica/setor parceiro da universidade.`
        })
        setModalVisible(true)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sistema de Recompensas Findly</Text>

            <View style={styles.balanceBox}>
                <Text style={styles.balanceLabel}>Seu Saldo Atual (saldo_pontos)</Text>
                <Text style={styles.balanceValue}>{saldoPontos} pontos</Text>
            </View>

            <View style={styles.list}>
                <Text style={styles.sectionTitle}>Catálogo de Benefícios Universitários</Text>

                {rewardsList.map((reward) => (
                    <View key={reward.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.rewardTitle}>{reward.titulo}</Text>
                            <Text style={styles.costBadge}>{reward.custo_pontos} pts</Text>
                        </View>

                        <Text style={styles.rewardDescription}>{reward.descricao}</Text>
                        <Text style={styles.rewardStatus}>Status: {reward.status}</Text>

                        {reward.codigo_cupom ? (
                            <Text style={styles.couponInfo}>
                                Cupom: {reward.codigo_cupom} | Resgatado em: {reward.data_resgate}
                            </Text>
                        ) : null}

                        <Button
                            type={reward.status === "Disponível" && saldoPontos >= reward.custo_pontos ? BUTTON_TYPE_SUCCESS : BUTTON_TYPE_SECONDARY}
                            text={reward.status === "Disponível" ? "Resgatar Benefício" : "Benefício Já Resgatado"}
                            onClick={() => resgatarBeneficio(reward)}
                        />
                    </View>
                ))}
            </View>

            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <FindlyModal
                    title={modalData.title}
                    highlight={modalData.highlight}
                    description={modalData.description}
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
        gap: 14
    },
    title:{
        fontSize: 22,
        fontWeight: "700",
        color: "#2d2d2d",
        textAlign: "center"
    },
    balanceBox:{
        backgroundColor: "#00aeff",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        gap: 4
    },
    balanceLabel:{
        fontSize: 14,
        color: "#ffffff",
        fontWeight: "600"
    },
    balanceValue:{
        fontSize: 30,
        color: "#ffffff",
        fontWeight: "700"
    },
    sectionTitle:{
        fontSize: 16,
        fontWeight: "700",
        color: "#2d2d2d"
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
        gap: 8
    },
    rewardTitle:{
        fontSize: 17,
        fontWeight: "700",
        color: "#2d2d2d",
        flex: 1
    },
    costBadge:{
        backgroundColor: "#2a9362",
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6
    },
    rewardDescription:{
        fontSize: 14,
        color: "#4f4f4f"
    },
    rewardStatus:{
        fontSize: 13,
        fontWeight: "600",
        color: "#555555"
    },
    couponInfo:{
        fontSize: 13,
        fontWeight: "700",
        color: "#00aeff"
    }
})

