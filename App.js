import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { Button, BUTTON_TYPE_PRIMARY, BUTTON_TYPE_SECONDARY } from './components/button';
import { PublicBoard } from './components/public-board';
import { MyItems } from './components/my-items';
import { FinderScan } from './components/finder-scan';
import { SectorCustody } from './components/sector-custody';
import { Rewards } from './components/rewards';

export default function App() {

  const [activeTab, setActiveTab] = useState("mural")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [saldoPontos, setSaldoPontos] = useState(350)

  const [custodyItems, setCustodyItems] = useState([
    {
      id: 1,
      nome: "Calculadora Científica Casio fx-82MS",
      descricao: "Encontrada na bancada do Laboratório de Física II",
      categoria: "Material Acadêmico",
      status: "Em Custódia",
      data_entrada: "08/11/2026 14:20",
      descricao_estado: "Bom estado, com tampa protetora original",
      receptor: "",
      data_saida: ""
    },
    {
      id: 2,
      nome: "Garrafa Térmica Preta 500ml",
      descricao: "Deixada na quadra poliesportiva após o treino",
      categoria: "Uso Pessoal",
      status: "Em Custódia",
      data_entrada: "09/11/2026 09:15",
      descricao_estado: "Pequeno amassado na base, limpa e fechada",
      receptor: "",
      data_saida: ""
    },
    {
      id: 3,
      nome: "Chaveiro com 2 Chaves e Tag Azul",
      descricao: "Encontrado próximo à catraca da Biblioteca Central",
      categoria: "Chaves e Acessórios",
      status: "Devolvido",
      data_entrada: "07/11/2026 18:40",
      descricao_estado: "Íntegro, argola metálica sem avarias",
      receptor: "Mariana Costa - Matrícula 20241045",
      data_saida: "08/11/2026 11:10"
    }
  ])

  const [myItems, setMyItems] = useState([
    {
      id: 101,
      nome: "Notebook Dell Inspiron 15",
      descricao: "Cinza chumbo com adesivo do curso de Computação",
      categoria: "Eletrônicos",
      foto_url: "https://findly.edu.br/fotos/notebook-dell.jpg",
      codigo_hash: "FND-8A92B1",
      status: "Registrado",
      ocorrencia: null
    },
    {
      id: 102,
      nome: "Fone Bluetooth JBL Tune",
      descricao: "Cor azul marinho com estojo de carregamento",
      categoria: "Eletrônicos",
      foto_url: "https://findly.edu.br/fotos/fone-jbl.jpg",
      codigo_hash: "FND-3C74E9",
      status: "Perdido",
      ocorrencia: {
        data_declaracao: "09/11/2026 10:30",
        local_estimado: "Auditório Central - Bloco B",
        status_ocorrencia: "Aberta - Aguardando Localização"
      }
    }
  ])

  const [rewardsList, setRewardsList] = useState([
    {
      id: 201,
      titulo: "Desconto de 50% em Exames Laboratoriais",
      descricao: "Válido no Laboratório Escola de Análises Clínicas da Universidade.",
      custo_pontos: 150,
      status: "Disponível",
      codigo_cupom: "",
      data_resgate: ""
    },
    {
      id: 202,
      titulo: "Consulta de Psicologia Universitária",
      descricao: "Sessão de acolhimento na Clínica Escola de Psicologia.",
      custo_pontos: 200,
      status: "Disponível",
      codigo_cupom: "",
      data_resgate: ""
    },
    {
      id: 203,
      titulo: "Avaliação Odontológica Preventiva",
      descricao: "Atendimento completo na Clínica Escola de Odontologia.",
      custo_pontos: 250,
      status: "Disponível",
      codigo_cupom: "",
      data_resgate: ""
    }
  ])

  function handleAddMyItem(novoItem){
    setMyItems([novoItem, ...myItems])
  }

  function handleDeclareLost(itemId, ocorrencia){
    const updated = myItems.map((item) => {
      if(item.id === itemId){
        return {
          ...item,
          status: "Perdido",
          ocorrencia: ocorrencia
        }
      }
      return item
    })
    setMyItems(updated)
  }

  function handleNotifyOwner(itemId, locationData){
    const updated = myItems.map((item) => {
      if(item.id === itemId){
        return {
          ...item,
          status: "Encontrado",
          ocorrencia: {
            data_declaracao: locationData.data_hora,
            local_estimado: `Lat: ${locationData.latitude} | Lng: ${locationData.longitude}`,
            status_ocorrencia: `Notificado pelo Finder (${locationData.status_localizacao})`
          }
        }
      }
      return item
    })
    setMyItems(updated)
    setSaldoPontos(saldoPontos + 50)
  }

  function handleAddWalkInItem(novoItemGuarda){
    setCustodyItems([novoItemGuarda, ...custodyItems])
  }

  function handleDeliverItem(itemId, receptor, dataSaida){
    const updated = custodyItems.map((item) => {
      if(item.id === itemId){
        return {
          ...item,
          status: "Devolvido",
          receptor: receptor,
          data_saida: dataSaida
        }
      }
      return item
    })
    setCustodyItems(updated)
  }

  function handleRedeemReward(rewardId, custoPontos, codigoCupom, dataResgate){
    setSaldoPontos(saldoPontos - custoPontos)
    const updated = rewardsList.map((reward) => {
      if(reward.id === rewardId){
        return {
          ...reward,
          status: "Resgatado",
          codigo_cupom: codigoCupom,
          data_resgate: dataResgate
        }
      }
      return reward
    })
    setRewardsList(updated)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("./assets/logo.png")}
          />
          <Text style={styles.appTitle}>Findly Mobile</Text>
          <Text style={styles.appSubtitle}>
            Achados e Perdidos Universitário • Saldo: {saldoPontos} pts
          </Text>
        </View>

        <View style={styles.navMenu}>
          <Button
            type={activeTab === "mural" ? BUTTON_TYPE_PRIMARY : BUTTON_TYPE_SECONDARY}
            text="1. Mural Público"
            onClick={() => setActiveTab("mural")}
          />
          <Button
            type={activeTab === "meus-itens" ? BUTTON_TYPE_PRIMARY : BUTTON_TYPE_SECONDARY}
            text="2. Meus Itens e QR Code"
            onClick={() => setActiveTab("meus-itens")}
          />
          <Button
            type={activeTab === "finder" ? BUTTON_TYPE_PRIMARY : BUTTON_TYPE_SECONDARY}
            text="3. Fluxo do Finder (Scan QR)"
            onClick={() => setActiveTab("finder")}
          />
          <Button
            type={activeTab === "setor" ? BUTTON_TYPE_PRIMARY : BUTTON_TYPE_SECONDARY}
            text="4. Custódia do Setor"
            onClick={() => setActiveTab("setor")}
          />
          <Button
            type={activeTab === "recompensas" ? BUTTON_TYPE_PRIMARY : BUTTON_TYPE_SECONDARY}
            text="5. Recompensas"
            onClick={() => setActiveTab("recompensas")}
          />
        </View>

        {activeTab === "mural" ? (
          <PublicBoard custodyItems={custodyItems} />
        ) : null}

        {activeTab === "meus-itens" ? (
          <MyItems
            myItems={myItems}
            onAddItem={handleAddMyItem}
            onDeclareLost={handleDeclareLost}
            isAnonymous={isAnonymous}
            onTogglePrivacy={() => setIsAnonymous(!isAnonymous)}
          />
        ) : null}

        {activeTab === "finder" ? (
          <FinderScan
            myItems={myItems}
            isAnonymous={isAnonymous}
            onNotifyOwner={handleNotifyOwner}
          />
        ) : null}

        {activeTab === "setor" ? (
          <SectorCustody
            custodyItems={custodyItems}
            onAddWalkInItem={handleAddWalkInItem}
            onDeliverItem={handleDeliverItem}
          />
        ) : null}

        {activeTab === "recompensas" ? (
          <Rewards
            saldoPontos={saldoPontos}
            rewardsList={rewardsList}
            onRedeemReward={handleRedeemReward}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#a5a4a4"
  },
  scrollContent:{
    padding: 16,
    paddingTop: 40,
    gap: 16,
    alignItems: "center"
  },
  header:{
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 6
  },
  logo:{
    width: 96,
    height: 96
  },
  appTitle:{
    fontSize: 28,
    fontWeight: "700",
    color: "#2d2d2d",
    textAlign: "center"
  },
  appSubtitle:{
    fontSize: 14,
    fontWeight: "600",
    color: "#555555",
    textAlign: "center"
  },
  navMenu:{
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 8
  }
})
