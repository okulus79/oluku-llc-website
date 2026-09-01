import React, {useState} from "react";
import {SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StyleSheet, Linking} from "react-native";

const GOLD="#C89B45", NAVY="#0B2344", CREAM="#F7F1E5";

export default function App(){
  const [tracking,setTracking]=useState("");
  const [result,setResult]=useState("");
  const services=["Ground Transport","Ocean Freight","Air Freight","Warehousing & Fulfillment","Express Courier","Packaging & Crating","Cold Chain Logistics","Global Freight Forwarding"];

  return <SafeAreaView style={s.safe}><ScrollView>
    <View style={s.hero}>
      <Text style={s.logo}>OLUKU</Text><Text style={s.sub}>GLOBAL LOGISTICS</Text>
      <Text style={s.eyebrow}>MOVING POSSIBILITIES. DELIVERING EXCELLENCE.</Text>
      <Text style={s.h1}>Global logistics at your scale.</Text>
      <Text style={s.p}>Freight forwarding, courier, packaging, cold chain, warehousing and fulfillment.</Text>
      <Pressable style={s.goldBtn} onPress={()=>Linking.openURL("mailto:Lukeman.ibrahim@live.com")}><Text style={s.darkText}>REQUEST A QUOTE</Text></Pressable>
    </View>

    <View style={s.section}><Text style={s.title}>Our Services</Text>
      {services.map(x=><View style={s.card} key={x}><Text style={s.cardTitle}>{x}</Text><Text style={s.cardText}>Professional logistics support tailored to your shipment.</Text></View>)}
    </View>

    <View style={[s.section,{backgroundColor:CREAM}]}><Text style={s.title}>Track Shipment</Text>
      <TextInput value={tracking} onChangeText={setTracking} placeholder="OLU-2026-00125" style={s.input}/>
      <Pressable style={s.navyBtn} onPress={()=>setResult(`Demo status for ${tracking || "shipment"}: Shipment received.`)}><Text style={s.whiteText}>TRACK</Text></Pressable>
      {!!result && <Text style={s.result}>{result}</Text>}
    </View>

    <View style={s.section}><Text style={s.title}>Contact Oluku LLC</Text><Text style={s.contact}>📞 (240) 978-3987</Text><Text style={s.contact}>✉️ Lukeman.ibrahim@live.com</Text><Text style={s.contact}>🌎 Baltimore • Virginia • North Carolina • Washington, D.C. • Philadelphia • Delaware</Text>
      <Pressable onPress={()=>Linking.openURL("tel:+12409783987")}><Text style={s.link}>Call now</Text></Pressable>
    </View>
  </ScrollView></SafeAreaView>
}
const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:"#fff"},hero:{backgroundColor:NAVY,padding:28,paddingTop:45,paddingBottom:50},logo:{fontSize:36,fontWeight:"900",letterSpacing:4,color:"#fff"},sub:{color:GOLD,fontWeight:"800",letterSpacing:2},eyebrow:{color:GOLD,fontWeight:"800",fontSize:11,marginTop:45},h1:{color:"#fff",fontSize:42,fontWeight:"900",marginTop:12},p:{color:"#D8DFEB",fontSize:16,lineHeight:24,marginVertical:20},goldBtn:{backgroundColor:GOLD,padding:15,borderRadius:8,alignItems:"center"},darkText:{color:NAVY,fontWeight:"900"},section:{padding:28},title:{fontSize:30,fontWeight:"900",color:NAVY,marginBottom:20},card:{borderWidth:1,borderColor:"#E7DFD0",padding:18,borderRadius:12,marginBottom:12},cardTitle:{fontSize:17,fontWeight:"800",color:NAVY},cardText:{color:"#667085",marginTop:6,lineHeight:20},input:{backgroundColor:"#fff",borderWidth:1,borderColor:"#D9DDE4",padding:14,borderRadius:8},navyBtn:{backgroundColor:NAVY,padding:15,borderRadius:8,alignItems:"center",marginTop:12},whiteText:{color:"#fff",fontWeight:"900"},result:{backgroundColor:"#fff",padding:16,borderLeftWidth:4,borderLeftColor:GOLD,marginTop:14},contact:{color:"#4B5563",fontSize:16,lineHeight:26,marginBottom:10},link:{color:NAVY,fontWeight:"900",marginTop:10}
});
