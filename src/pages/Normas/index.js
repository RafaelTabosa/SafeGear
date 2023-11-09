
import { FlatList, Text, TouchableHighlight, Linking, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext  } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';

const data = [
  { key: 'NR 01', url: 'https://drive.google.com/file/d/1Ctytm9pTcUbcxExHN3Ct0INAHgL-N6M1/view?usp=sharing', text: 'DISPOSIÇÕES GERAIS E GERENCIAMENTO DE RISCOS OCUPACIONAIS' },
  { key: 'NR 02', url: 'https://drive.google.com/file/d/1FgO3X2QhPn_TYb9WzOU6bSjhfRMJk-Re/view?usp=sharing', text: 'REVOGADA - INSPEÇÃO PRÉVIA' },
  { key: 'NR 03', url: 'https://drive.google.com/file/d/1yYq2kENgmKrV7sspsm8i_rmXKoTscMo-/view?usp=sharing', text: 'EMBARGO OU INTERDIÇÃO' },  
  { key: 'NR 04', url: 'https://drive.google.com/file/d/1xY1_tspatMpelLRiLW_X9ZkOR0BOUW5S/view?usp=sharing', text: 'SERVIÇOS ESPECIALIZADOS EM SEGURANÇA E EM MEDICINA DO TRABALHO' },
  { key: 'NR 05', url: 'https://drive.google.com/file/d/16tc_aDns4ug3EXeODIbgN3YcQx_K3Olt/view?usp=sharing', text: 'COMISSÃO INTERNA DE PREVENÇÃO DE ACIDENTES' },
  { key: 'NR 06', url: 'https://drive.google.com/file/d/1mEedSkFB-6Z5ApXBaYMyqwL3Y0b9C12J/view?usp=sharing', text: 'EQUIPAMENTOS DE PROTEÇÃO INDIVIDUAL - EPI' },
  { key: 'NR 07', url: 'https://drive.google.com/file/d/1PdgSCVM0Ceb6lqbyKtZ_zWegmPm0Ppxk/view?usp=sharing', text: 'PROGRAMA DE CONTROLE MÉDICO DE SAÚDE OCUPACIONAL - PCMSO' },
  { key: 'NR 08', url: 'https://drive.google.com/file/d/1ZuQj_WjLrdMzTqhfxqVx_fKhMJgOqY1U/view?usp=sharing', text: 'EDIFICAÇÕES' },
  { key: 'NR 09', url: 'https://drive.google.com/file/d/1YoK5SGeKQV5aQEAof5k8Kle0nmQz84lc/view?usp=sharing', text: 'AVALIAÇÃO E CONTROLE DAS EXPOSIÇÕES OCUPACIONAIS A AGENTES FÍSICOS, QUÍMICOS E BIOLÓGICOS' },
  { key: 'NR 10', url: 'https://drive.google.com/file/d/1QEw9Wf_rASNQ7cft95cNFXBIJQdUa5c2/view?usp=sharing', text: 'SEGURANÇA EM INSTALAÇÕES E SERVIÇOS EM ELETRICIDADE' },
  { key: 'NR 11', url: 'https://drive.google.com/file/d/1oHBv9O-eRcSKbzKcrP7Vo3UQp7UChNld/view?usp=sharing', text: 'TRANSPORTE, MOVIMENTAÇÃO, ARMAZENAGEM E MANUSEIO DE MATERIAIS' },
  { key: 'NR 12', url: 'https://drive.google.com/file/d/16PyepQMP_iiFVtDhXXBxvZtB2PgQ0lVC/view?usp=sharing', text: 'SEGURANÇA NO TRABALHO EM MÁQUINAS E EQUIPAMENTOS' },
  { key: 'NR 13', url: 'https://drive.google.com/file/d/13BFUFCGECPogN2q6Bj-OdnQdafLWpHrt/view?usp=sharing', text: 'CALDEIRAS, VASOS DE PRESSÃO, TUBULAÇÕES E TANQUES METÁLICOS DE ARMAZENAMENTO' },
  { key: 'NR 14', url: 'https://drive.google.com/file/d/1S99ZRIYqCmxDcFE8g7OvO5LiUmccrFul/view?usp=sharing', text: 'FORNOS' },
  { key: 'NR 15', url: 'https://drive.google.com/file/d/1I80yyZjASCvp8PBSabBCS8g3psN7RvME/view?usp=sharing', text: 'ATIVIDADES E OPERAÇÕES INSALUBRES' },
  { key: 'NR 16', url: 'https://drive.google.com/file/d/1d1VCk5ymQ1cTUUAMn3ymo14jlrgwvQvn/view?usp=sharing', text: 'ATIVIDADES E OPERAÇÕES PERIGOSAS' },
  { key: 'NR 17', url: 'https://drive.google.com/file/d/1uzqtIOsJijXiXi75WN3N7Of8uX-9mYoO/view?usp=sharing', text: 'ERGONOMIA' },
  { key: 'NR 18', url: 'https://drive.google.com/file/d/1HLGQ0znhkIprwDaCOBCyDjKUXpFxx9nz/view?usp=sharing', text: 'SEGURANÇA E SAÚDE NO TRABALHO NA INDÚSTRIA DA CONSTRUÇÃO' },
  { key: 'NR 19', url: 'https://drive.google.com/file/d/1BFQzYSrEL-kLeZaxLDbqDZhowzSRz9Ji/view?usp=sharing', text: 'EXPLOSIVOS' },
  { key: 'NR 20', url: 'https://drive.google.com/file/d/1getSIvFU0Pv0fs6jcLW-PYoiGVdyxXZF/view?usp=sharing', text: 'SEGURANÇA E SAÚDE NO TRABALHO COM INFLAMÁVEIS E COMBUSTÍVEIS' },
  { key: 'NR 21', url: 'https://drive.google.com/file/d/1IHwTjkOO6Fde6k5vjpUI4cvheSxviuxc/view?usp=sharing', text: 'TRABALHAO A CÉU ABERTO' },
  { key: 'NR 22', url: 'https://drive.google.com/file/d/1f44ZGZEOZ-UWH4isH1-CmhH4RwmKJTj2/view?usp=sharing', text: 'SEGURANÇA E SAÚDE OCUPACIONAL NA MINERAÇÃO' },
  { key: 'NR 23', url: 'https://drive.google.com/file/d/1g6V--7pufliNfZMIxdM7KW__SfaEufVo/view?usp=sharing', text: 'PROTEÇÃO CONTRA INCÊNDIOS' },
  { key: 'NR 24', url: 'https://drive.google.com/file/d/1wDS4HkK1EEGEvOQeT_l_V0mMcMuyN8Fe/view?usp=sharing', text: 'CONDIÇÕES SANITÁRIAS E DE CONFORTO NOS LOCAIS DE TRABALHO' },
  { key: 'NR 25', url: 'https://drive.google.com/file/d/1bO5MqtML-MwRh14MCwgdK5Yu0woAdj4r/view?usp=sharing', text: 'RESÍDUOS INDUSTRIAIS' },
  { key: 'NR 26', url: 'https://drive.google.com/file/d/1U1vRe2RuHMu_PFvSzgFGi1-B6Lx1zIVQ/view?usp=sharing', text: 'SINALIZAÇÃO DE SEGURANÇA' },
  { key: 'NR 27', url: 'https://drive.google.com/file/d/1zUkfdvzHdw6SK-P55XKPe3-5ru1zqkPd/view?usp=sharing', text: 'REVOGADA - REGISTRO PROFISSIONAL DO TÉCNICO DE SEGURANÇA DO TRABALHO' },
  { key: 'NR 28', url: 'https://drive.google.com/file/d/16nj6N12W26A8qASsBWVctuQyPvIFDP0s/view?usp=sharing', text: 'FISCALIZAÇÃO E PENALIDADES' },
  { key: 'NR 29', url: 'https://drive.google.com/file/d/1v9NfzNHL4jHOlnvpC-Ir299hDTK21oL-/view?usp=sharing', text: 'SEGURANÇA E SAÚDE NO TRABALHO PORTUÁRIO' },
  { key: 'NR 30', url: 'https://drive.google.com/file/d/13Gb2gNgxLoBld4qwKqgN60K73pJG_1TX/view?usp=sharing', text: 'SEGURANÇA E SAÚDE NO TRABALHO AQUAVIÁRIO' },
  { key: 'NR 31', url: 'https://drive.google.com/file/d/1JYSrX7fkv8vloldvU21DUaen1hrazHdb/view?usp=sharing', text: 'SEGURANÇA E SAÚDE NO TRABALHO NA AGRICULTURA, PECUÁRIA, SILVICULTURA, EXPLORAÇÃO FLORESTAL E AQUICULTURA' },
  { key: 'NR 32', url: 'https://drive.google.com/file/d/1fOerYBuJttsW6-bQLMR88mF-VQWbZL4f/view?usp=sharing', text: 'SEGURANÇA E SAÚDE NO TRABALHO EM SERVIÇOS DE SAÚDE' },
  { key: 'NR 33', url: 'https://drive.google.com/file/d/1vf6wh0jgHBR2KDNTPNwUpaWBtVfJhpZE/view?usp=sharing', text: 'SEGURANÇA E SAÚDE NOS TRABALHOS EM ESPAÇOS CONFINADOS' },
  { key: 'NR 34', url: 'https://drive.google.com/file/d/1EjYaRwP7znwp8f26m6aE9ywzMF7X7ocg/view?usp=sharing', text: 'CONDIÇÕES E MEIO AMBIENTE DE TRABALHO NA INDÚSTRIA DA CONSTRUÇÃO, REPARAÇÃO E DESMONTE NAVAL' },
  { key: 'NR 35', url: 'https://drive.google.com/file/d/12t36_hy0g6xds-W88eb40-5yx0upYjBj/view?usp=sharing', text: 'TRABALHO EM ALTURA' },
  { key: 'NR 36', url: 'https://drive.google.com/file/d/122OQV2w_lvI6MXESUKrq1d-tfttRArcm/view?usp=sharing', text: 'SEGURANÇA E SAÚDE NO TRABALHO EM EMPRESAS DE ABATE E PROCESSAMENTO DE CARNES E DERIVADOS' },
  { key: 'NR 37', url: 'https://drive.google.com/file/d/1z5zf12bbC6IjU28MQT51DR9UMK8sv-bz/view?usp=sharing', text: 'SEGURANÇA E SAÚDE EM PLATAFORMAS DE PETRÓLEO' },
  { key: 'NR 38', url: 'https://drive.google.com/file/d/1jXeHd1fjTcKEPGeFR0EVCsmHYOjcPzYe/view?usp=sharing', text: 'SEGURANÇA E SAÚDE NO TRABALHO NAS ATIVIDADES DE LIMPEZA URBANA E MANEJO DE RESÍDUOS SÓLIDOS' },

];

const PermitViewer = () => {
  const [searchText, setSearchText] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { isDarkTheme, setIsDarkTheme } = useContext(AppContext);

  const openPDFWebsite = (url) => {
    Linking.openURL(url)
      .catch(error => {
        console.error(`Não foi possível abrir a URL: ${error}`);
      });
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    if (!searchVisible) {
      setSearchText('');
      setSelectedItem(null); // Limpa a seleção ao fechar a pesquisa
    }
  };

  const filteredData = data.filter(item => item.key.toLowerCase().includes(searchText.toLowerCase()));

  const renderItem = ({ item, index }) => {
    const isSelected = index === selectedItem;
    return (
      <TouchableHighlight
        onPress={() => {
          openPDFWebsite(item.url);
          setSelectedItem(index);
        }}
        
      >
        <View style={[styles.item, { backgroundColor: isSelected ?'WHITE' : 'white' }]}>
          <Text style={styles.key}>{item.key}</Text>
          <Text style={styles.text1}>{item.text}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => toggleSearch()}>
            <Icon name={searchVisible ? 'close' : 'search'} size={24} style={styles.iconsearch} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, searchVisible]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {searchVisible ? (
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Pesquisar NR"
            value={searchText}
            onChangeText={setSearchText}
          />
        ) : null}
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  key: {
    fontSize: 18,
  },
  text1: {
    fontSize: 13,
    color: 'gray',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  searchIconContainer: {
    alignItems: 'flex-end',
    marginTop: -10
  },
  headerIcons: {
    flexDirection: 'row',
    marginRight: 16,
  },
  iconsearch: {
    marginRight: 16,
    color: 'black',
  },
});

export default PermitViewer;