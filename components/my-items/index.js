import {View, Text, TextInput, StyleSheet, Modal} from "react-native"
import { useState } from "react"
import { Button, BUTTON_TYPE_PRIMARY, BUTTON_TYPE_DANGER, BUTTON_TYPE_SECONDARY, BUTTON_TYPE_SUCCESS } from "../button"
import FindlyModal from "../modal"

const hashCharset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function MyItems({myItems, onAddItem, onDeclareLost, isAnonymous, onTogglePrivacy}){

    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [categoria, setCategoria] = useState("")
    const [fotoUrl, setFotoUrl] = useState("")
    const [localEstimado, setLocalEstimado] = useState("")

    const [isModalVisible, setModalVisible] = useState(false)
    const [modalData, setModalData] = useState({
        title: "",
        highlight: "",
        description: ""
    })

    function generateHash(){
        let code = "FND-"
        for(let i = 0; i < 6; i++){
            let randomIndex = Math.floor(Math.random() * hashCharset.length)
            code += hashCharset.charAt(randomIndex)
        }
        return code
    }

    function cadastrarItem(){
        if(!nome.trim() || !descricao.trim() || !categoria.trim()){
            setModalData({
                title: "Campos Obrigatórios",
                highlight: "Atenção",
                description: "Informe nome, descrição e categoria para cadastrar o item e gerar seu QR Code."
            })
            setModalVisible(true)
            return
        }

        const codigoHash = generateHash()
        const novoItem = {
            id: Date.now(),
            nome: nome.trim(),
            descricao: descricao.trim(),
            categoria: categoria.trim(),
            foto_url: fotoUrl.trim() || "sem-foto.png",
            codigo_hash: codigoHash,
            status: "Registrado",
            ocorrencia: null
        }

        onAddItem(novoItem)
        setNome("")
        setDescricao("")
        setCategoria("")
        setFotoUrl("")

        setModalData({
            title: "QR Code Gerado",
            highlight: codigoHash,
            description: `Item "${novoItem.nome}" cadastrado com sucesso!\nCole a etiqueta com o código ${codigoHash} no seu pertence.`
        })
        setModalVisible(true)
    }

    function verQrCode(item){
        setModalData({
            title: `QR Code: ${item.nome}`,
            highlight: item.codigo_hash,
            description: `Categoria: ${item.categoria}\nFoto URL: ${item.foto_url}\nPrivacidade: ${isAnonymous ? "Anônimo até a devolução" : "Exibindo Nome e E-mail"}\n\nQualquer pessoa que escanear este código poderá notificar você pelo Findly.`
        })
        setModalVisible(true)
    }

    function declararPerdido(item){
        const local = localEstimado.trim() || "Campus Universitário - Bloco Didático"
        const dataDeclaracao = "09/11/2026 23:20"
        const ocorrencia = {
            data_declaracao: dataDeclaracao,
            local_estimado: local,
            status_ocorrencia: "Aberta - Aguardando Localização"
        }

        onDeclareLost(item.id, ocorrencia)
        setLocalEstimado("")

        setModalData({
            title: "Ocorrência de Perda Criada",
            highlight: `Código: ${item.codigo_hash}`,
            description: `Item: ${item.nome}\nData da Declaração: ${ocorrencia.data_declaracao}\nLocal Estimado: ${ocorrencia.local_estimado}\nStatus: ${ocorrencia.status_ocorrencia}`
        })
        setModalVisible(true)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus Itens e QR Code</Text>

            <View style={styles.privacyBox}>
                <Text style={styles.sectionTitle}>Privacidade do Perfil</Text>
                <Text style={styles.privacyStatus}>
                    Modo atual: {isAnonymous ? "Anônimo até a devolução" : "Público (Exibir Nome e E-mail)"}
                </Text>
                <Button
                    type={isAnonymous ? BUTTON_TYPE_SECONDARY : BUTTON_TYPE_SUCCESS}
                    text={isAnonymous ? "Ativar Exibição de Nome/E-mail" : "Manter Anonimato até Devolução"}
                    onClick={onTogglePrivacy}
                />
            </View>

            <View style={styles.formBox}>
                <Text style={styles.sectionTitle}>Cadastrar Novo Pertence</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome do item (ex: Garrafa Térmica)"
                    value={nome}
                    onChangeText={setNome}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descrição (cor, marca, detalhes)"
                    value={descricao}
                    onChangeText={setDescricao}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Categoria (ex: Eletrônicos, Material, Pessoal)"
                    value={categoria}
                    onChangeText={setCategoria}
                />
                <TextInput
                    style={styles.input}
                    placeholder="URL da Foto (opcional)"
                    value={fotoUrl}
                    onChangeText={setFotoUrl}
                />

                <Button
                    type={BUTTON_TYPE_PRIMARY}
                    text="Cadastrar e Gerar QR Code"
                    onClick={cadastrarItem}
                />
            </View>

            <View style={styles.formBox}>
                <Text style={styles.sectionTitle}>Local Estimado (Para Declaração de Perda)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Informe o local estimado caso tenha perdido um item"
                    value={localEstimado}
                    onChangeText={setLocalEstimado}
                />
            </View>

            <View style={styles.list}>
                <Text style={styles.sectionTitle}>Itens Cadastrados ({myItems.length})</Text>

                {myItems.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.itemName}>{item.nome}</Text>
                            <Text style={[
                                styles.badge,
                                item.status === "Perdido" ? styles.badgeLost : styles.badgeNormal
                            ]}>
                                {item.status}
                            </Text>
                        </View>

                        <Text style={styles.hashText}>QR Code (Hash): {item.codigo_hash}</Text>
                        <Text style={styles.itemMeta}>Categoria: {item.categoria}</Text>
                        <Text style={styles.itemMeta}>Descrição: {item.descricao}</Text>
                        <Text style={styles.itemMeta}>Foto: {item.foto_url}</Text>

                        {item.ocorrencia ? (
                            <View style={styles.occurrenceBox}>
                                <Text style={styles.occurrenceTitle}>Ocorrência de Perda Ativa:</Text>
                                <Text style={styles.occurrenceText}>Data: {item.ocorrencia.data_declaracao}</Text>
                                <Text style={styles.occurrenceText}>Local Estimado: {item.ocorrencia.local_estimado}</Text>
                                <Text style={styles.occurrenceText}>Status: {item.ocorrencia.status_ocorrencia}</Text>
                            </View>
                        ) : null}

                        <View style={styles.actions}>
                            <Button
                                type={BUTTON_TYPE_PRIMARY}
                                text="Visualizar QR Code"
                                onClick={() => verQrCode(item)}
                            />
                            <Button
                                type={BUTTON_TYPE_DANGER}
                                text="Declarar como Perdido"
                                onClick={() => declararPerdido(item)}
                            />
                        </View>
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
    sectionTitle:{
        fontSize: 16,
        fontWeight: "700",
        color: "#3e3e3e"
    },
    privacyBox:{
        backgroundColor: "#f0f8ff",
        padding: 12,
        borderRadius: 10,
        gap: 8
    },
    privacyStatus:{
        fontSize: 14,
        color: "#3e3e3e"
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
    list:{
        gap: 12
    },
    card:{
        backgroundColor: "#f7f9fc",
        borderRadius: 10,
        padding: 12,
        gap: 6,
        borderWidth: 1,
        borderColor: "#e1e8f0"
    },
    cardHeader:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
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
    badgeNormal:{
        backgroundColor: "#2a9362"
    },
    badgeLost:{
        backgroundColor: "#9c2934"
    },
    hashText:{
        fontSize: 15,
        fontWeight: "700",
        color: "#00aeff"
    },
    itemMeta:{
        fontSize: 14,
        color: "#4f4f4f"
    },
    occurrenceBox:{
        backgroundColor: "#fdecea",
        padding: 8,
        borderRadius: 8,
        gap: 2,
        marginTop: 4
    },
    occurrenceTitle:{
        fontSize: 13,
        fontWeight: "700",
        color: "#9c2934"
    },
    occurrenceText:{
        fontSize: 13,
        color: "#5f2120"
    },
    actions:{
        gap: 8,
        marginTop: 6
    }
})

