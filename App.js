import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, TextInput, View, SafeAreaView} from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export default function App() {

  const [showDisplayPage, setShowDisplayPage] = useState(false)

  return (
    <View>

    <StatusBar hidden />

      <NavigationBar 
        setShowDisplayPage={setShowDisplayPage}
        />

      <View>
        {!showDisplayPage && <InputPage />}
        {showDisplayPage && <DisplayPage />}        
      </View>


    </View>      

  );
};

const InputPage = () => {
  return (
    <Text>Input Page</Text>
  )
}

const DisplayPage = () => {
  return (
    <Text>Display Page</Text>
  )
}

const NavigationBar = ({ setShowDisplayPage }) => {

  const handlePressInputPage = () => {
    setShowDisplayPage(false)
  }
  const handlePressDisplayPage = () => {
    setShowDisplayPage(true)
  }

  return (
      <View>
        <Pressable onPress={handlePressInputPage}>
          <Text>Input Page</Text>
        </Pressable>
        <Pressable onPress={handlePressDisplayPage}>
          <Text>Display Page</Text>
        </Pressable>
      </View>
  )
}