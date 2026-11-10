import {View, Text, TextInput, StyleSheet, Modal} from "react-native"
import { useState } from "react"
import { Button, BUTTON_TYPE_PRIMARY, BUTTON_TYPE_SECONDARY, BUTTON_TYPE_SUCCESS } from "../button"
import FindlyModal from "../modal"

export function FinderScan({myItems, isAnonymous, onNotifyOwner}){

    const [codigoBusca, setCodigoBusca] = useState("")
    const [shareLocation, setShareLocation] = useState(true)
    const [foundItem, setFoundItem] = useState(null)
    const [isModalVisible, setModalVisible] = useState(false)
    const [modalData, setModalData] = useState({
        title: "",
        highlight: "",
        description: ""
    })

    const locationData = {
        latitude: shareLocation ? "-7.115320" : "Não compartilhada",
        longitude: shareLocation ? "-34.861050" : "Não compartilhada",
        status_localizacao: shareLocation ? "Compartilhamento Autorizado pelo Finder" : "Recusado pelo Finder (Privacidade Ativa)",
        data_hora: "09/11/2026 23:25"
    }

    function buscarQrCode(){
        const codigo = codigoBusca.trim().toUpperCase()
        const item = myItems.find((entry) => entry.codigo_hash.toUpperCase() === codigo)

        if(!item){
            setFoundItem(null)
            setModalData({
                title: "QR Code Não Encontrado",
                highlight: codigo || "VAZIO",
                description: "Nenhum item vinculado a este código hash foi localizado. Encaminhe o item avulso ao Setor de Achados e Perdidos."
            })
            setModalVisible(true)
            return
        }

        setFoundItem(item)
    }

    function notificarProprietario(){
        if(!foundItem){
            return
        }

        onNotifyOwner(foundItem.id, locationData)

        const ownerInfo = isAnonymous
            ? "Proprietário em Modo Anônimo (Identidade preservada até devolução)"
            : "Proprietário: Aluno Universitário (aluno@universidade.edu.br)"

        setModalData({
            title: "Proprietário Notificado!",
            highlight: `QR Code: ${foundItem.codigo_hash}`,
            description: `Item: ${foundItem.nome}\n${ownerInfo}\n\nGeolocalização:\nStatus: ${locationData.status_localizacao}\nLatitude: ${locationData.latitude}\nLongitude: ${locationData.longitude}\nData/Hora: ${locationData.data_hora}\n\nOrientação:\nEncaminhe o item ao Setor de Achados e Perdidos (Bloco Central - Sala 102) para guarda segura e ganhe +50 pontos Findly!`
        })
        setModalVisible(true)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fluxo do Finder (Encontrei um Item)</Text>
            <Text style={styles.subtitle}>
                Escaneie ou digite o código hash do QR Code colado no item encontrado
            </Text>

            <View style={styles.quickCodesBox}>
                <Text style={styles.sectionTitle}>Códigos Disponíveis para Simulação:</Text>
                {myItems.map((item) => (
                    <Text key={item.id} style={styles.quickCodeText}>
                        • {item.codigo_hash} ({item.nome})
                    </Text>
                ))}
            </View>

            <View style={styles.formBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o codigo_hash (ex: FND-8A92B1)"
                    value={codigoBusca}
                    onChangeText={setCodigoBusca}
                    autoCapitalize="characters"
                />

                <Button
                    type={BUTTON_TYPE_PRIMARY}
                    text="Simular Leitura do QR Code"
                    onClick={buscarQrCode}
                />
            </View>

            <View style={styles.locationBox}>
                <Text style={styles.sectionTitle}>Permissão de Geolocalização do Finder</Text>
                <Text style={styles.metaText}>Status: {locationData.status_localizacao}</Text>
                <Text style={styles.metaText}>Latitude: {locationData.latitude}</Text>
                <Text style={styles.metaText}>Longitude: {locationData.longitude}</Text>
                <Text style={styles.metaText}>Data/Hora: {locationData.data_hora}</Text>

                <Button
                    type={shareLocation ? BUTTON_TYPE_SECONDARY : BUTTON_TYPE_SUCCESS}
                    text={shareLocation ? "Não Compartilhar Minha Localização" : "Autorizar Compartilhamento de Localização"}
                    onClick={() => setShareLocation(!shareLocation)}
                />
            </View>

            {foundItem ? (
                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>Item Identificado pelo QR Code</Text>
                    <Text style={styles.metaText}>Nome: {foundItem.nome}</Text>
                    <Text style={styles.metaText}>Categoria: {foundItem.categoria}</Text>
                    <Text style={styles.metaText}>Descrição: {foundItem.descricao}</Text>
                    <Text style={styles.metaText}>
                        Proprietário: {isAnonymous ? "Anônimo até a devolução" : "Aluno Universitário (aluno@universidade.edu.br)"}
                    </Text>

                    <Button
                        type={BUTTON_TYPE_SUCCESS}
                        text="Notificar Proprietário e Ver Instruções"
                        onClick={notificarProprietario}
                    />
                </View>
            ) : null}

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
    sectionTitle:{
        fontSize: 16,
        fontWeight: "700",
        color: "#2d2d2d"
    },
    quickCodesBox:{
        backgroundColor: "#f0f8ff",
        padding: 10,
        borderRadius: 8,
        gap: 4
    },
    quickCodeText:{
        fontSize: 14,
        fontWeight: "600",
        color: "#0077b6"
    },
    formBox:{
        backgroundColor: "#f7f9fc",
        padding: 12,
        borderRadius: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: "#e1e8f0"
    },
    input:{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#cccccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 15,
        color: "#2d2d2d"
    },
    locationBox:{
        backgroundColor: "#eef3f8",
        padding: 12,
        borderRadius: 10,
        gap: 6
    },
    metaText:{
        fontSize: 14,
        color: "#3e3e3e"
    },
    resultCard:{
        backgroundColor: "#e8f5e9",
        padding: 12,
        borderRadius: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: "#a5d6a7"
    },
    resultTitle:{
        fontSize: 17,
        fontWeight: "700",
        color: "#2a9362"
    }
})

