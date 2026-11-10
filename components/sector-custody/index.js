import {View, Text, TextInput, StyleSheet, Modal} from "react-native"
import { useState } from "react"
import { Button, BUTTON_TYPE_PRIMARY, BUTTON_TYPE_SUCCESS } from "../button"
import FindlyModal from "../modal"

export function SectorCustody({custodyItems, onAddWalkInItem, onDeliverItem}){

    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [categoria, setCategoria] = useState("")
    const [descricaoEstado, setDescricaoEstado] = useState("")
    const [receptor, setReceptor] = useState("")

    const [isModalVisible, setModalVisible] = useState(false)
    const [modalData, setModalData] = useState({
        title: "",
        highlight: "",
        description: ""
    })

    function registrarEntradaAvulsa(){
        if(!nome.trim() || !descricao.trim() || !categoria.trim() || !descricaoEstado.trim()){
            setModalData({
                title: "Dados Incompletos",
                highlight: "Atenção Operador",
                description: "Preencha nome, descrição, categoria e estado de conservação para registrar a guarda do item avulso."
            })
            setModalVisible(true)
            return
        }

        const novoItemGuarda = {
            id: Date.now(),
            nome: nome.trim(),
            descricao: descricao.trim(),
            categoria: categoria.trim(),
            status: "Em Custódia",
            data_entrada: "09/11/2026 23:30",
            descricao_estado: descricaoEstado.trim(),
            receptor: "",
            data_saida: ""
        }

        onAddWalkInItem(novoItemGuarda)
        setNome("")
        setDescricao("")
        setCategoria("")
        setDescricaoEstado("")

        setModalData({
            title: "Guarda Registrada",
            highlight: novoItemGuarda.nome,
            description: `Item avulso cadastrado no Setor de Achados e Perdidos.\nData de Entrada: ${novoItemGuarda.data_entrada}\nEstado: ${novoItemGuarda.descricao_estado}`
        })
        setModalVisible(true)
    }

    function registrarRetirada(item){
        if(!receptor.trim()){
            setModalData({
                title: "Identificação Obrigatória",
                highlight: "Informe o Receptor",
                description: "Para registrar a entrega definitiva (baixa/retirada), informe o nome e matrícula/documento do receptor no campo indicado."
            })
            setModalVisible(true)
            return
        }

        const dataSaida = "09/11/2026 23:35"
        onDeliverItem(item.id, receptor.trim(), dataSaida)
        setReceptor("")

        setModalData({
            title: "Entrega Definitiva Registrada",
            highlight: "Status: Devolvido",
            description: `Item: ${item.nome}\nReceptor: ${receptor.trim()}\nData de Saída: ${dataSaida}\n\nBaixa de custódia concluída com sucesso.`
        })
        setModalVisible(true)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Setor de Achados e Perdidos (Operador)</Text>

            <View style={styles.formBox}>
                <Text style={styles.sectionTitle}>Cadastrar Item Avulso (Sem QR Code)</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome do item entregue"
                    value={nome}
                    onChangeText={setNome}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descrição geral do item"
                    value={descricao}
                    onChangeText={setDescricao}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Categoria (ex: Documentos, Chaves, Acessórios)"
                    value={categoria}
                    onChangeText={setCategoria}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descrição do estado de conservação (ex: Íntegro, Arranhado)"
                    value={descricaoEstado}
                    onChangeText={setDescricaoEstado}
                />

                <Button
                    type={BUTTON_TYPE_PRIMARY}
                    text="Registrar Entrada no Setor"
                    onClick={registrarEntradaAvulsa}
                />
            </View>

            <View style={styles.formBox}>
                <Text style={styles.sectionTitle}>Identificação do Receptor (Para Retirada/Baixa)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome completo e Matrícula/CPF do receptor"
                    value={receptor}
                    onChangeText={setReceptor}
                />
            </View>

            <View style={styles.list}>
                <Text style={styles.sectionTitle}>Controle de Custódia do Setor</Text>

                {custodyItems.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Text style={styles.itemName}>{item.nome} ({item.status})</Text>
                        <Text style={styles.itemMeta}>Categoria: {item.categoria}</Text>
                        <Text style={styles.itemMeta}>Entrada: {item.data_entrada}</Text>
                        <Text style={styles.itemMeta}>Estado: {item.descricao_estado}</Text>

                        {item.status === "Devolvido" ? (
                            <View style={styles.deliveredBox}>
                                <Text style={styles.deliveredText}>Receptor: {item.receptor}</Text>
                                <Text style={styles.deliveredText}>Data de Saída: {item.data_saida}</Text>
                            </View>
                        ) : (
                            <Button
                                type={BUTTON_TYPE_SUCCESS}
                                text="Registrar Entrega Definitiva (Baixa)"
                                onClick={() => registrarRetirada(item)}
                            />
                        )}
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
        color: "#2d2d2d"
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
    itemName:{
        fontSize: 17,
        fontWeight: "700",
        color: "#2d2d2d"
    },
    itemMeta:{
        fontSize: 14,
        color: "#4f4f4f"
    },
    deliveredBox:{
        backgroundColor: "#e8f5e9",
        padding: 8,
        borderRadius: 8,
        gap: 2
    },
    deliveredText:{
        fontSize: 13,
        fontWeight: "600",
        color: "#2a9362"
    }
})

